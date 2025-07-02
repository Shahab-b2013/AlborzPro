// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.2.2.0
using System;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Net;
using System.Collections.Specialized;
using System.Text;
using System.Linq;
using FerdosDocument;
using System.Collections.Generic;
using System.IO;
using System.Diagnostics;
using System.IdentityModel.Metadata;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class EditActivity : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public string GetUsers()
    {
        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is GetEmployees");

            return LogProvider.PrepareLogResultStr(logID, "Session is invalid.", 10010);
        }

        return GetDataList("select UserID AS ID , CONCAT(FirstName , ' ' , LastName) AS Label from Sys_Users WHERE UserID!=1");
    }

    [WebMethod(EnableSession = true)]
    public string GetFlowStates()
    {
        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is GetEmployees");

            return LogProvider.PrepareLogResultStr(logID, "Session is invalid.", 10010);
        }

        return GetDataList("SELECT ELabel AS ID, Label AS Label FROM Sys_Prc_FlowStates WHERE Enabled = 1");
    }

    [WebMethod(EnableSession = true)]
    public string GetColumnDataField(int gridId)
    {
        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is GetEmployees");

            return LogProvider.PrepareLogResultStr(logID, "Session is invalid.", 10010);
        }

        return GetDataListName("select GridColumnID AS [ID] , DataFieldName AS Label , Name AS Name from Sys_Gui_GridColumns where GridID = " + gridId.ToString());
    }
    private static string GetDataList(string query)
    {
        List<ListItem> items = new List<ListItem>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResultStr(exp.Message, 10050);
            }

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(new ListItem(reader["ID"].ToString(), reader["Label"].ToString()));
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query, 0);

                    return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                }
            }
        }

        JavaScriptSerializer js = new JavaScriptSerializer();

        return js.Serialize(items);
    }
    private static string GetDataListName(string query)
    {
        List<ListNameItem> items = new List<ListNameItem>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResultStr(exp.Message, 10050);
            }

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(new ListNameItem(reader["ID"].ToString(), reader["Label"].ToString() , reader["Name"].ToString()));
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query, 0);

                    return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                }
            }
        }

        JavaScriptSerializer js = new JavaScriptSerializer();

        return js.Serialize(items);
    }
    public class ListItem
    {
        public string ID;

        public string Label;

        public ListItem(string id, string label)
        {
            this.ID = id;
            this.Label = label;
        }
    }
    public class ListNameItem
    {
        public string ID;

        public string Label;
        public string Name;

        public ListNameItem(string id, string label, string name)
        {
            this.ID = id;
            this.Label = label;
            Name = name;
        }
    }

    [WebMethod(EnableSession = true)]
    public string SaveFile()
    {

        HttpPostedFile file = HttpContext.Current.Request.Files[0];
        //
        return FileProvider.SaveFile(file, "../../App_Res/Upload/Entity/Attachment/");
    }

    [WebMethod(EnableSession = true)]
    public string EditData()
    {
        int id = Convert.ToInt32(HttpContext.Current.Request.Form["id"]);

        string submitKey = HttpContext.Current.Request.Form["submitKey"];

        JavaScriptSerializer js = new JavaScriptSerializer();

        ActivityParam[] activiyParams = js.Deserialize<ActivityParam[]>(HttpContext.Current.Request.Form["activiyParams"]);

        int[] objectIDs = js.Deserialize<int[]>(HttpContext.Current.Request.Form["objectIDs"]);

        string responseToken = HttpContext.Current.Request.Form["responseToken"];

        string query = "select * from Sys_Dev_Activities where ActivityID = " + id;

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is " + id);

            return LogProvider.PrepareLogResultStr(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateActivityLicense(id);

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Activity WebService Request is invalid.", id);

            return LogProvider.PrepareLogResultStr(logID, "Activity WebService Request is invalid.", 10101);
        }

        #region Validate EditActivity Parameters

        query = "select Sys_Gui_FormItems.FormItemID, Sys_Gui_FormItems.ActivityParamID, Sys_Gui_FormItems.ActionControlID, Sys_Gui_FormItems.Name, Sys_Gui_FormItems.Label, Sys_Gui_FormItems.InputType, Sys_AttributeTypes.UnitToDisplay, Sys_AttributeTypes.FormatToDisplay, Sys_AttributeTypes.RegexFormat, Sys_AttributeTypes.Name as AttributeTypeName, Sys_AttributeTypes.BaseDataType, Sys_Dev_ActivityParams.ParamIndex, Sys_Dev_ActivityParams.NullIfEmpty, Sys_EntityAttributes.Nullable, Sys_Dev_ActivityParams.IsRequired, Sys_Dev_ActivityParams.ReferEntityID, Sys_Dev_ActivityParams.ReferEntityMultipleAllow, dbo.IsNull(Sys_Dev_ActivityParams.MinValueLenght, Sys_EntityAttributes.MinValueLenght, Sys_AttributeTypes.MinValueLenght) as MinValueLenght, dbo.IsNull(Sys_Dev_ActivityParams.MaxValueLenght, Sys_EntityAttributes.MaxValueLenght, Sys_AttributeTypes.MaxValueLenght) as MaxValueLenght, dbo.IsNull(Sys_Dev_ActivityParams.MinValue, Sys_EntityAttributes.MinValue, Sys_AttributeTypes.MinValue) as MinValue, dbo.IsNull(Sys_Dev_ActivityParams.MaxValue, Sys_EntityAttributes.MaxValue, Sys_AttributeTypes.MaxValue) as MaxValue, Sys_Gui_FormItems.Enabled, Sys_Gui_FormItems.IsReadOnly, Sys_Gui_FormItems.FormID, Sys_Dev_ActivityParams.Name as ParamName, Sys_Dev_ActivityParams.ActivityID, Sys_Dev_ActivityParams.EntityAttributeID, Sys_Dev_ActivityParams.ReferEntityDisableAllow, Sys_Dev_ActivityParams.ReferEntityMultipleAllow, Sys_AttributeTypes.Direction, Sys_AttributeTypes.Addon, Sys_AttributeTypes.MaskFormat, Sys_AttributeTypes.MaskAlias, Sys_Gui_FormItems.RowIndex, Sys_Gui_FormItems.ColumnIndex, Sys_Gui_FormItems.DisplayMode, Sys_Gui_FormItems.Width, Sys_Gui_FormItems.SubTextVisible, Sys_Gui_FormItems.FormGroupBoxID, Sys_Gui_FormItems.DefaultValue, Sys_EntityAttributes.EnumTypeID, Sys_EntityAttributes.LocationPath, Sys_Gui_FormItems.Version, Sys_Gui_FormItems.Description from  Sys_Gui_FormItems left outer join Sys_Dev_ActivityParams on Sys_Gui_FormItems.ActivityParamID = Sys_Dev_ActivityParams.ActivityParamID left outer join Sys_EntityAttributes on Sys_Dev_ActivityParams.EntityAttributeID = Sys_EntityAttributes.EntityAttributeID left outer join Sys_AttributeTypes on Sys_EntityAttributes.AttributeTypeID = Sys_AttributeTypes.AttributeTypeID where Sys_Gui_FormItems.Enabled = 1 and (Sys_Dev_ActivityParams.Enabled = 1 or Sys_Dev_ActivityParams.Enabled is null) and Sys_Dev_ActivityParams.ActivityID = " + id + " and (Sys_Gui_FormItems.IsReadOnly = 0 OR Sys_AttributeTypes.Name = 'File') order by Sys_Gui_FormItems.RowIndex,Sys_Gui_FormItems.ColumnIndex";

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResultStr(exp.Message, 10050);
            }

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    int i = 0;

                    using (var actParamReader = command.ExecuteReader())
                    {
                        while (actParamReader.Read())
                        {
                            activiyParams[i].ParamName = actParamReader["ParamName"].ToString();

                            if (actParamReader["BaseDataType"].ToString() != "VARBINARY(MAX)")
                            {
                                activiyParams[i].ParamValue = SecurityProvider.ValidateInput(id,
                                    activiyParams[i].ParamName,
                                    activiyParams[i].ParamValue,
                                    Convert.ToString(actParamReader["RegexFormat"]),
                                    Convert.ToBoolean(actParamReader["NullIfEmpty"]),
                                    !Convert.ToBoolean(actParamReader["Nullable"]),
                                    Convert.ToInt32(actParamReader["MinValueLenght"] == DBNull.Value ? 0 : actParamReader["MinValueLenght"]),
                                    Convert.ToInt32(actParamReader["MaxValueLenght"] == DBNull.Value ? 10000 : actParamReader["MaxValueLenght"]),
                                    Convert.ToString(actParamReader["MinValue"]),
                                    Convert.ToString(actParamReader["MaxValue"]),
                                    Convert.ToString(actParamReader["BaseDataType"]),
                                    actParamReader["ReferEntityID"], actParamReader["ReferEntityMultipleAllow"]);
                            }
                            else
                            {
                                activiyParams[i].ParamValue = FileProvider.ValidateAndSaveFile(id,
                                    activiyParams[i].ParamName,
                                    activiyParams[i].ParamValue,
                                    HttpContext.Current.Request.Files["file" + i],
                                    Convert.ToString(actParamReader["RegexFormat"]),
                                    Convert.ToBoolean(actParamReader["NullIfEmpty"]),
                                    !Convert.ToBoolean(actParamReader["Nullable"]),
                                    Convert.ToInt32(actParamReader["MinValueLenght"] == DBNull.Value ? 0 : actParamReader["MinValueLenght"]),
                                    Convert.ToInt32(actParamReader["MaxValueLenght"] == DBNull.Value ? 10000 : actParamReader["MaxValueLenght"]),
                                    Convert.ToString(actParamReader["MinValue"]),
                                    Convert.ToString(actParamReader["MaxValue"]),
                                    Convert.ToString(actParamReader["LocationPath"]),
                                    Convert.ToString(actParamReader["AttributeTypeName"]),
                                    activiyParams[i].FileIsExist, activiyParams[i].FileAttachCode);
                            }

                            i++;
                        }
                    }
                }
                catch (AppException exp)
                {
                    return LogProvider.PrepareLogResultStr(exp.ErrorLogID, exp.ErrorMessage, exp.ErrorCode);
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, exp.StackTrace + "[" + command.CommandText + "]", id);

                    return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                }
            }
        }

        #endregion

        try
        {
            SecurityProvider.ValidateUserAccess(id, activiyParams, objectIDs);
        }
        catch (AppException exp)
        {
            return LogProvider.PrepareLogResultStr(exp.ErrorLogID, exp.ErrorMessage, exp.ErrorCode);
        }

        #endregion

        string commandText;

        string commandType;

        string successedMessage;

        string failedMessage;

        string conditionText;

        string conditionType;

        string errorMessage;

        string executeMode;

        object scopeID = 0;

        object resultScalar = null;

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResultStr(exp.Message, 10050);
            }

            using (var command = new SqlCommand("select * from Sys_Dev_Activities where ActivityID = " + id, connection))
            {
                #region Get EditActivityInfo From Config. Database

                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        actReader.Read();

                        commandText = actReader["CommandText"].ToString();

                        if (submitKey == "Submit" || submitKey == "Save")
                        {

                            commandText = "DELETE FROM Sys_Pex_TaskLogs WHERE InstanceID = @ObjectID AND ProcessID = (SELECT TOP(1) ProcessID FROM Sys_Prc_ProcessActivities WHERE ProcessActivityID =" + id + ");" + commandText;

                            if (submitKey == "Save")
                            {
                                commandText = commandText.Replace("EXEC dbo.FollowmentProcess @ActivityID, @ProcessActionID, '@SessionUserID', @TaskID, @NewID,0;", "").ToString();
                                commandText = commandText.Replace("EXEC dbo.FollowmentProcess @ActivityID, @ProcessActionID, '@SessionUserID', @TaskID, @ObjectID;", "").ToString();


                            }
                        }
                        commandType = actReader["CommandType"].ToString();

                        successedMessage = actReader["SuccessedMessage"].ToString();

                        failedMessage = actReader["FailedMessage"].ToString();
                    }
                }

                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, id);

                    return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                }

                #endregion

                #region Execute EditActivity Rules

                if (submitKey == "Submit")
                {
                    command.CommandText = "select ConditionText, ConditionType, ErrorMessage, ExecuteMode from Sys_Dev_ActivityRules inner join Sys_Activity_Rules on Sys_Dev_ActivityRules.ActivityRuleID = Sys_Activity_Rules.ActivityRuleID inner join Sys_ActivityRules on Sys_Dev_ActivityRules.ActivityRuleID = Sys_ActivityRules.ActivityRuleID where Enabled = 1 and ActivityID = " + id;

                    try
                    {
                        using (var actRuleReader = command.ExecuteReader())
                        {
                            while (actRuleReader.Read())
                            {
                                conditionText = Convert.ToString(actRuleReader["ConditionText"]);

                                conditionType = Convert.ToString(actRuleReader["ConditionType"]);

                                errorMessage = Convert.ToString(actRuleReader["ErrorMessage"]);

                                executeMode = Convert.ToString(actRuleReader["ExecuteMode"]);

                                using (var _command = new SqlCommand("", connection))
                                {
                                    if (conditionType == "Text")
                                    {
                                        _command.CommandType = CommandType.Text;
                                    }

                                    if (conditionType == "StoredProcedure")
                                    {
                                        _command.CommandType = CommandType.StoredProcedure;
                                    }

                                    conditionText = conditionText.Replace("'@SessionUserID'", SessionProvider.UserID.ToString());

                                    conditionText = conditionText.Replace("'@SessionAgentID'", SessionProvider.GetValue("AgentID"));

                                    conditionText = conditionText.Replace("@SessionGroupID", SessionProvider.GetValue("GroupID"));

                                    conditionText = conditionText.Replace("'@SessionCustomerID'", SessionProvider.GetValue("CustomerID"));

                                    conditionText = conditionText.Replace("'@SessionAPL'", SessionProvider.GetValue("APL"));

                                    if (conditionText.Contains("@ObjectID"))
                                    {
                                        foreach (int objectID in objectIDs)
                                        {
                                            command.CommandText = conditionText.Replace("@ObjectID", objectID.ToString());

                                            _command.CommandText = command.CommandText;

                                            foreach (ActivityParam param in activiyParams)
                                            {
                                                _command.Parameters.AddWithValue("@" + param.ParamName, NormalizeValue(param.ParamValue));
                                            }

                                            resultScalar = _command.ExecuteScalar();

                                            if (resultScalar != null && resultScalar != DBNull.Value && resultScalar.ToString() != "0")
                                            {
                                                int logID = LogProvider.LogException(10070, errorMessage, _command.CommandText, objectID, id);

                                                return LogProvider.PrepareLogResultStr(logID, errorMessage, 10070);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        command.CommandText = conditionText;

                                        _command.CommandText = command.CommandText;

                                        foreach (ActivityParam param in activiyParams)
                                        {
                                            _command.Parameters.AddWithValue("@" + param.ParamName, NormalizeValue(param.ParamValue));
                                        }

                                        resultScalar = _command.ExecuteScalar();

                                        if (resultScalar != null && resultScalar != DBNull.Value && resultScalar.ToString() != "0")
                                        {
                                            int logID = LogProvider.LogException(10070, errorMessage, _command.CommandText, id);

                                            return LogProvider.PrepareLogResultStr(logID, errorMessage, 10070);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    catch (Exception exp)
                    {
                        int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, id);

                        return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                    }
                }
                #endregion

                #region Build EditActivity SQL Query

                if (commandType.Contains("SP"))
                {
                    if (objectIDs.Length > 0)
                    {
                        commandText = commandText.Replace("@ObjectID", objectIDs[0].ToString());
                    }
                }
                else
                {
                    commandText = commandText.Replace("= @ObjectID", " IN (@ObjectID) ");

                    //or
                    commandText = commandText.Replace("=@ObjectID", " IN (@ObjectID) ");

                    foreach (int objectID in objectIDs)
                    {
                        commandText = commandText.Replace("@ObjectID", objectID.ToString() + ",@ObjectID");
                    }

                    commandText = commandText.Replace("@ObjectID", "0");
                }

                #endregion

                bool useExternalServer = commandText.Contains("OPEN QUERY");

                try
                {
                    foreach (ActivityParam param in activiyParams)
                    {
                        if (param.ParamValue != null)
                        {
                            //??
                            commandText = commandText.Replace("'@" + param.ParamName + "'", "'" + NormalizeValue(param.ParamValue) + "'");
                        }
                        else
                        {
                            commandText = commandText.Replace("N'@" + param.ParamName + "'", "NULL");

                            //or
                            commandText = commandText.Replace("'@" + param.ParamName + "'", "NULL");
                        }
                    }

                    commandText = commandText.Replace("'@SessionUserID'", SessionProvider.UserID.ToString());

                    commandText = commandText.Replace("'@SessionAgentID'", SessionProvider.GetValue("AgentID"));

                    commandText = commandText.Replace("@SessionGroupID", SessionProvider.GetValue("GroupID"));

                    commandText = commandText.Replace("'@SessionCustomerID'", SessionProvider.GetValue("CustomerID"));

                    commandText = commandText.Replace("'@SessionAPL'", SessionProvider.GetValue("APL"));

                    command.CommandText = commandText;

                    if (!useExternalServer)
                    {
                        ;
                    }

                    foreach (ActivityParam param in activiyParams)
                    {
                        if (param.ParamName == "ProcessActionID")
                            LogProvider.LogTraceData("@ProcessActionID", Convert.ToString(NormalizeValue(param.ParamValue)));
                        command.Parameters.AddWithValue("@" + param.ParamName, NormalizeValue(param.ParamValue));
                    }

                    #region FollowmentProcess

                    if (id > 6000000)
                    {
                        if (!command.Parameters.Contains("@ProcessActionID"))
                            command.Parameters.AddWithValue("@ProcessActionID", -1);

                        command.Parameters.AddWithValue("@ActivityID", id);

                        if (!command.Parameters.Contains("@TaskID"))
                            command.Parameters.AddWithValue("@TaskID", -1);
                    }

                    #endregion

                    scopeID = command.ExecuteScalar();

                    #region FollowmentProcess

                    if (id > 6000000)
                    {
                        ProcessDocument pdfFactory = new ProcessDocument();

                        try
                        {
                            pdfFactory.GeneratePdf((objectIDs[0] == 0 ? scopeID : objectIDs[0]), id, HttpContext.Current.Server.MapPath("~") + @"\");
                        }
                        catch { }
                    }

                    #endregion

                    #region Copying UserTrack Uploaded file

                    if (id == 5051200)
                    {
                        string fileName = null;
                        int userTrackFileID = Convert.ToInt32(scopeID);
                        string trackStartDate = null;
                        string trackEndDate = null;

                        try
                        {
                            foreach (ActivityParam param in activiyParams)
                            {
                                if (param.ParamName == "TrackFile")
                                    fileName = param.ParamValue;
                                if (param.ParamName == "TrackStartDate")
                                    trackStartDate = LocalizationProvider.GetLocalDate(param.ParamValue);
                                if (param.ParamName == "TrackEndDate")
                                    trackEndDate = LocalizationProvider.GetLocalDate(param.ParamValue);
                            }

                            // Define file paths
                            string sourceDirectory = @"C:\Amnpardaz\SedraErp\Web\WebApp\4.4.1\App_Res\Upload\UserTrack";
                            string targetDirectory = @"C:\Amnpardaz\SedraErp\Servers\AMS\Services\UserTrackFiles";

                            // Ensure the target directory exists
                            if (!Directory.Exists(targetDirectory))
                            {
                                Directory.CreateDirectory(targetDirectory);
                            }

                            string sourceFilePath = Path.Combine(sourceDirectory, fileName);

                            // Create the new file name with the combination of the date and ID
                            string newFileName = string.Format("{0}_{1}_{2}{3}",
                                DateTime.Today.ToString("yyyy_MM_dd"),
                                "ID",
                                userTrackFileID,
                                ".xls",
                                Path.GetExtension(fileName));

                            string targetFilePath = Path.Combine(targetDirectory, newFileName);

                            if (File.Exists(sourceFilePath))
                            {
                                File.Copy(sourceFilePath, targetFilePath, true);
                            }
                            else
                            {
                                throw new FileNotFoundException("Source file not found: " + sourceFilePath);
                            }

                            string targetDirectory2 = @"C:\Amnpardaz\SedraErp\Servers\AMS\Services\";

                            // Path to the BAT file
                            string batFilePath = Path.Combine(targetDirectory2, "UserTrackAuditor_" + userTrackFileID + ".bat");

                            // Path to the executable
                            string exeFilePath = @"C:\Amnpardaz\SedraErp\Servers\AMS\Services\UserTrackAuditor.exe"; // Adjust this path as needed

                            // Define your arguments
                            string[] arguments = new string[]
                            {
                              "InsertTrack",
                             trackStartDate,    // Start Date
                             trackEndDate,    // End Date
                              "0",             // Argument 1
                              "0",             // Argument 2
                              "1",             // Argument 3
                              "1",             // Argument 4
                              "0",             // Argument 5
                              "1",             // Argument 6
                              newFileName,     // File name
                              "1000",           // Numeric argument
                              userTrackFileID.ToString()
                                            };


                            using (StreamWriter writer = new StreamWriter(batFilePath))
                            {
                                writer.WriteLine("@echo off");
                                writer.WriteLine("cd " + targetDirectory2);
                                writer.WriteLine("echo Current directory: %cd%");
                                writer.WriteLine("\"" + exeFilePath + "\" " + string.Join(" ", arguments)); // Run the EXE with the arguments
                                writer.WriteLine("exit");
                            }


                            // Initialize the ProcessStartInfo for the BAT file
                            var processInfo = new ProcessStartInfo
                            {
                                FileName = batFilePath,
                                CreateNoWindow = true,
                                UseShellExecute = true // Use the shell to execute the process
                            };

                            // Start the process
                            var process = System.Diagnostics.Process.Start(processInfo);
                            if (process != null)
                            {
                                process.Dispose();
                            }
                            else
                            {
                                throw new Exception("Process could not be started.");
                            }
                        }
                        catch (Exception exp)
                        {
                            // Log the exception and prepare the result string
                            int logID = LogProvider.LogException(10060, exp.Message, fileName, id);
                            return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                        }
                    }

                    #endregion

                    if (!useExternalServer)
                    {
                        ;
                    }
                }
                catch (Exception exp)
                {
                    try
                    {
                        if (!useExternalServer)
                        {
                            ;
                        }
                    }
                    catch (Exception _exp)
                    {
                        int _logID = LogProvider.LogException(10060, _exp.Message, command.CommandText, objectIDs, id);

                        return LogProvider.PrepareLogResultStr(_logID, _exp.Message, 10060);
                    }

                    foreach (ActivityParam param in activiyParams)
                    {
                        if (param.ParamName.Contains("Image") || param.ParamName.Contains("File"))
                        {
                            FileProvider.DeleteFile(param.ParamValue);
                        }
                    }

                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, objectIDs, id);

                    return LogProvider.PrepareLogResultStr(logID, failedMessage, 10060);
                }
            }
        }

        js = null;

        #region Packages Compatibility

        //Sepad Compatibility
        if (ApplicationProvider.PackageName == "سامانه پشتیبانی پادویش")
        {
            //UserStatus
            if (id == 1005159)
            {
                SessionProvider.SetValue("UserStatus", activiyParams[0].ParamValue);
            }

            //OnLoginSettings
            if (id == 1005160)
            {
                SessionProvider.SetValue("UserStatus", activiyParams[0].ParamValue);

                SessionProvider.SetValue("LoginSettingLabel", activiyParams[0].ParamValue);

                SessionProvider.SetValue("LoginSettingDone", true);
            }

            //MissionPdf
            if (id == 1055060)
            {
                MissionPdfGenerator.GenerateReport(objectIDs[0], true);

                if (activiyParams[3].ParamValue == "بعد از تایید کارفرما ارسال شود")
                {
                    MissionEmailSender.SendReport(objectIDs[0], null, null);
                }
            }

            if (id == 1055351)
            {
                MissionPdfGenerator.GenerateReport(objectIDs[0], true);

                if (activiyParams[1].ParamValue == "بعد از تایید کارفرما و مدیر پشتیبانی ارسال شود")
                {
                    MissionEmailSender.SendReport(objectIDs[0], null, null);
                }
            }
        }

        #endregion

        #region PersonalSetting Compatibility

        //UserSettings
        if (id == 1005160)
        {
            Membership.LoadPersonnelSettings(SessionProvider.UserID);
        }

        #endregion

        activiyParams = null;

        return successedMessage + "#" + scopeID + "#" + SessionProvider.GenRequestToken();
    }
    [WebMethod(EnableSession = true)]
    public string GetEntityDetails(long formItemID)
    {
        string columnQuery = @"
               SELECT Name FROM Sys_EntityAttributes WHERE EntityID = ( SELECT TableEntityID FROM Sys_Prc_FormItems
               INNER JOIN Sys_Prc_FlowVariables
               ON Sys_Prc_FormItems.Rowkey = Sys_Prc_FlowVariables.Rowkey AND Sys_Prc_FormItems.IsReadOnly = 0
               WHERE FormItemID = @FormItemID
               AND ProcessID = (SELECT DISTINCT ProcessID FROM Sys_Gui_FormItemDetails WHERE FormItemID = @FormItemID))";

        string tableName = SqlDataProvider.ExecuteScalarQuery(@"
                SELECT TableName FROM Sys_Entities WHERE EntityID = (SELECT TableEntityID FROM Sys_Prc_FormItems
                INNER JOIN Sys_Prc_FlowVariables
                ON Sys_Prc_FormItems.Rowkey = Sys_Prc_FlowVariables.Rowkey AND Sys_Prc_FormItems.IsReadOnly = 0
                WHERE FormItemID = " + formItemID + @"
                AND ProcessID = (SELECT DISTINCT ProcessID FROM Sys_Gui_FormItemDetails WHERE FormItemID = " + formItemID + @"))
            ").ToString();

        using (SqlConnection conn = SqlDataProvider.DbConnection)
        {
            conn.Open();

            List<string> columns = new List<string>();

            using (SqlCommand colCmd = new SqlCommand(columnQuery, conn))
            {
                colCmd.Parameters.AddWithValue("@FormItemID", formItemID);
                using (SqlDataReader reader = colCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        columns.Add(reader.GetString(0).Trim());
                    }
                }
                string columnNames = string.Join(", ", columns);
                string dataQuery = "SELECT " + columnNames + " FROM [" + tableName + " ]";

                DataTable dt = new DataTable();
                using (SqlCommand dataCmd = new SqlCommand(dataQuery, conn))
                {
                    using (SqlDataAdapter adapter = new SqlDataAdapter(dataCmd))
                    {
                        adapter.Fill(dt);
                    }
                }

                var entityList = dt.AsEnumerable().Select(row =>
                {
                    var values = columns.Select(col => row[col.Trim()] == DBNull.Value ? "" : row[col.Trim()].ToString()).ToList();
                    return new
                    {
                        ProecssInstanceId = values[0],
                        FullData = string.Join("-", values)
                    };
                }).ToList();

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                return serializer.Serialize(entityList);
            }
        }
    }

    [WebMethod(EnableSession = true)]
    public string GetEntityDetailsForModal(long formItemID, long pexID)
    {
        string columnQuery = @"
               SELECT Name FROM Sys_EntityAttributes WHERE EntityID = ( SELECT TableEntityID FROM Sys_Prc_FormItems
               INNER JOIN Sys_Prc_FlowVariables
               ON Sys_Prc_FormItems.Rowkey = Sys_Prc_FlowVariables.Rowkey AND Sys_Prc_FormItems.IsReadOnly = 0
               WHERE FormItemID = @FormItemID
               AND ProcessID = (SELECT DISTINCT ProcessID FROM Sys_Gui_FormItemDetails WHERE FormItemID = @FormItemID))";

        string tableName = SqlDataProvider.ExecuteScalarQuery(@"
                SELECT TableName FROM Sys_Entities WHERE EntityID = (SELECT TableEntityID FROM Sys_Prc_FormItems
                INNER JOIN Sys_Prc_FlowVariables
                ON Sys_Prc_FormItems.Rowkey = Sys_Prc_FlowVariables.Rowkey AND Sys_Prc_FormItems.IsReadOnly = 0
                WHERE FormItemID = " + formItemID + @"
                AND ProcessID = (SELECT DISTINCT ProcessID FROM Sys_Gui_FormItemDetails WHERE FormItemID = " + formItemID + @"))
            ").ToString();

        using (SqlConnection conn = SqlDataProvider.DbConnection)
        {
            conn.Open();

            List<string> columns = new List<string>();

            using (SqlCommand colCmd = new SqlCommand(columnQuery, conn))
            {
                colCmd.Parameters.AddWithValue("@FormItemID", formItemID);
                using (SqlDataReader reader = colCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        columns.Add(reader.GetString(0).Trim());
                    }
                }

                if (columns.Count == 0)
                {
                    return "[]";
                }

                string columnNames = string.Join(", ", columns);
                string dataQuery = "SELECT " + columnNames + " FROM " + tableName;
                string firstColumn = columns[0];

                DataTable dt = new DataTable();
                using (SqlCommand dataCmd = new SqlCommand(dataQuery, conn))
                {
                    using (SqlDataAdapter adapter = new SqlDataAdapter(dataCmd))
                    {
                        adapter.Fill(dt);
                    }
                }

                var entityList = dt.AsEnumerable().Select(row =>
                {
                    var values = columns.Select(col => row[col.Trim()] == DBNull.Value ? "" : row[col.Trim()].ToString()).ToList();
                    return new
                    {
                        ProecssInstanceId = values[0],
                        FullData = string.Join("-", values)
                    };
                }).Where(item => item.FullData.Split('-')[0] == pexID.ToString())
                  .ToList();

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                return serializer.Serialize(entityList);
            }
        }
    }

    [WebMethod(EnableSession = true)]
    public string GetEntity_EnumName(string Id, string type)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(type) || string.IsNullOrWhiteSpace(Id))
        {
            return "-";
        }


        string tableName;
        string condition;

        if (type.Equals("Entity", StringComparison.OrdinalIgnoreCase))
        {
            tableName = "Sys_Entities";
            condition = "EntityID";
        }
        else if (type.Equals("Enum", StringComparison.OrdinalIgnoreCase))
        {
            tableName = "Sys_EnumTypes";
            condition = "EnumTypeID";
        }
        else
        {
            throw new ArgumentException("Invalid type specified", "type");
        }

        // Safely construct the query with quoted identifiers
        string query = string.Format("SELECT TOP(1) Label FROM {0} WHERE {1} = @Id",
            tableName,
            condition);

        try
        {
            using (SqlConnection conn = SqlDataProvider.DbConnection)
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", Id);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return reader.GetString(0).Trim();
                        }
                        return null; // or string.Empty if preferred
                    }
                }
            }
        }
        catch (SqlException ex)
        {
            // Log the exception details here
            throw new Exception(string.Format("Failed to retrieve name for {0} with ID {1}. See logs for details.",
                type, Id), ex);
        }
    }

    [WebMethod(EnableSession = true)]
    public string GetEntityValues(long EntityId, long Id)
    {
        string tableName = "";
        string idColumnName = "";
        string Label = "";

        string tabelNameQuery = "SELECT TableName FROM Sys_Entities WHERE EntityID = @EntityId";
        string idColumnNameQuery = "SELECT TOP(1) Name FROM Sys_EntityAttributes WHERE EntityID = @EntityId";

        using (SqlConnection conn = SqlDataProvider.DbConnection)
        {
            try
            {
                conn.Open();

                // Get the table name
                using (SqlCommand tblCmd = new SqlCommand(tabelNameQuery, conn))
                {
                    tblCmd.Parameters.AddWithValue("@EntityId", EntityId);
                    using (SqlDataReader reader = tblCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            tableName = reader.GetString(0).Trim();
                        }
                        else
                        {
                            throw new Exception("Table name not found for the given EntityId.");
                        }
                    }
                }

                // Get the column name
                using (SqlCommand colCmd = new SqlCommand(idColumnNameQuery, conn))
                {
                    colCmd.Parameters.AddWithValue("@EntityId", EntityId);
                    using (SqlDataReader reader = colCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            idColumnName = reader.GetString(0).Trim();
                        }
                        else
                        {
                            throw new Exception("Column name not found for the given EntityId.");
                        }
                    }
                }

                // Construct the label query dynamically (table and column names cannot be parameterized)
                string labelQuery = string.Format("SELECT Label FROM {0} WHERE {1} = @id", tableName, idColumnName);

                // Execute the label query
                using (SqlCommand valCmd = new SqlCommand(labelQuery, conn))
                {
                    valCmd.Parameters.AddWithValue("@id", Id);
                    using (SqlDataReader reader = valCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            if (!reader.IsDBNull(0))
                            {
                                Label = reader.GetString(0).Trim();
                            }
                            else
                            {
                                Label = string.Empty;
                            }
                        }
                        else
                        {
                            Label = string.Empty;
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception("Database error occurred.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving entity values.", ex);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                }
            }
        }

        return Label;
    }
    private object NormalizeValue(string str)
    {
        if (str == null)
        {
            return DBNull.Value;
        }

        str = str.Replace("ڪ", "ک");
        str = str.Replace("ك", "ک");
        str = str.Replace("ﻚ", "ک");

        str = str.Replace("ي", "ی");
        str = str.Replace("ﻲ", "ی");

        return str;
    }

}
