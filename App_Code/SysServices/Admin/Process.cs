// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.4.1.0
// Release Ferdos.BPMS
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Data;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using iTextSharp.text.pdf;
using System.Diagnostics;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class Process : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public string EditDesign()
    {
        ProcessModel design = null;
        string acccessCriteria = null;
        int id = Convert.ToInt32(HttpContext.Current.Request.Form["id"]);
        string responseToken = HttpContext.Current.Request.Form["responseToken"];
        int lstVariabledID = 0;

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is" + id);

            return "Session is invalid.";
        }

        LicenseProvider.ValidateActivityLicense(id);

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Activity WebService Request is invalid.", id);

            return "Activity WebService Request is invalid.";
        }

        try
        {
            acccessCriteria = SecurityProvider.ValidateProcessAccess(id);
        }
        catch
        {
            return "Access is denied.";
        }

        #endregion

        #region Design Json File Parsing

        try
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            design = js.Deserialize<IProcess>(HttpContext.Current.Request.Form["design"]).ProcessModel;
            StreamWriter sw = File.CreateText(Server.MapPath("/App_Data") + "/Processes/" + id + ".fdm");
            sw.Write(HttpContext.Current.Request.Form["design"]);
            sw.Close();
        }
        catch (Exception exp)
        {
            return "An error occurred during file parsing\n\r" + exp.Message;
        }

        #endregion

        ClearOldDesign(id);

        #region Clear Forms

        foreach (int ID in design.DeletedIDs.DeletedFormIDs)
        {
            ClearForm(ID);
        }
        #endregion

        #region Clear Docs

        foreach (int ID in design.DeletedIDs.DeletedDocIDs)
        {
            ClearDocument(ID);
        }

        #endregion

        #region Edit Process

        design.Description = "BPMS";

        foreach (FlowElement flowElement in design.FlowElements)
        {
            int aid = flowElement.ElementID + ((500 + design.ProcessID) * 10000);
            int eid = flowElement.ElementID + design.ProcessID * 1000;

            CreateFlowElement(eid, design.ProcessID, flowElement.Name, flowElement.Label, flowElement.Type, flowElement.OutgoingEIDs.Length > 0 ? flowElement.OutgoingEIDs[0] + (design.ProcessID * 1000) : 0, true, design.Version, design.Description, Convert.ToInt32(flowElement.StateID), flowElement.IsFirstTask, flowElement.IncomingEIDs.Length > 0 ? flowElement.IncomingEIDs[0] + (design.ProcessID * 1000) : 0);

            if (flowElement.Type == "UserTask")
            {
                CreateProcessActivity(aid, design.ProcessID, flowElement.Assignment.Cartable.AssignedCartabeleID, eid, flowElement.Name + "_" + design.ProcessID, flowElement.Label, flowElement.Assignment.SLA.BOption0,
                    flowElement.Assignment.Settings.BOption1, flowElement.Assignment.Settings.BOption2, flowElement.Assignment.Settings.BOption3, flowElement.Assignment.Settings.BOption4, flowElement.Assignment.Settings.BOption5,
                    flowElement.Assignment.SLA.BOption6, false, false, flowElement.Assignment.SLA.ResolutionTimes, flowElement.Assignment.SLA.ResolutionType, 0, "", true, true, design.Version, design.Description);

                CreateActivitiyAssignees(aid, aid, flowElement.Assignment.Type, "", 1, 1, flowElement.Assignment.AssignedUserID, flowElement.Assignment.AssignedTeamID
                   , flowElement.Assignment.AssignedPositionID, flowElement.Assignment.DefaultTeamID, flowElement.Assignment.DefaultUserID, flowElement.Assignment.DefaultPositionID, flowElement.Assignment.AssignmentProcedureID, flowElement.Assignment.AssignedVariableID, flowElement.Assignment.AssignedDepartmentID, flowElement.Assignment.AssignedSiteID, flowElement.Assignment.AssignedContractID, flowElement.Assignment.AssignedBuildingID, "NULL"
                   , true, true, design.Version, design.Description);

                // Check if AccessTiming is null or empty
                if (flowElement.Schedule.AccessTiming == null || flowElement.Schedule.AccessTiming.Length == 0)
                {
                    // Skip to the next iteration if AccessTiming is null or empty
                    continue;
                }
                else
                {
                    // Call the CreateActivitySchedule method if AccessTiming is not null or empty
                    CreateActivitySchedule(flowElement.Schedule, true, design.Version, design.Description, aid, design.ProcessID);
                }



            }

            if (flowElement.Type == "Inclusive Gateway" || flowElement.Type == "Exclusive Gateway")
            {
                int i = 0;
                foreach (RoutingRules routingRule in flowElement.GatewayOption.RoutingRules)
                {
                    CreateRoutingRule(i + flowElement.ElementID * 10 + design.ProcessID * 10000, routingRule.Name, routingRule.Label, eid, routingRule.OutgoingEID + design.ProcessID * 1000, routingRule.StateID, routingRule.Conditions, true, design.Version, design.Description);

                    i++;
                }

            }
        }

        foreach (Variables flowVariable in design.Variables)
        {
            CreateFlowVariable((design.ProcessID * 1000) + flowVariable.VariableID, design.ProcessID, flowVariable.Name, flowVariable.Label, flowVariable.DataType, flowVariable.InputType, flowVariable.Nullable, flowVariable.IsDefault, flowVariable.EnumTypeID, flowVariable.EntityTypeID, flowVariable.Formula, flowVariable.DefaultValue, true, design.Version, design.Description, flowVariable.RowKey, flowVariable.InputCount, false);

            lstVariabledID = flowVariable.VariableID;

        }

        lstVariabledID++;
        lstVariabledID = 300;

        foreach (Documents document in design.Documents)
        {
            var ViewAccessID = "";
            var DownloadAccessID = "";

            CreateDocumentView(document.DocumentID, design.ProcessID, document.RowKey, document.Label, document.ImgSrc, document.ImgName, document.ImgSize, document.ActivityID, ViewAccessID, DownloadAccessID);
            CreateFlowVariable((design.ProcessID * 1000) + lstVariabledID, design.ProcessID, document.Name, document.Label, "Document", "FileBrowse", true, false, 0, 0, "", "", true, design.Version, design.Description, document.RowKey, "Single", true);

            lstVariabledID++;
        }

        #endregion

        return SessionProvider.GenRequestToken();
    }

    [WebMethod(EnableSession = true)]
    public string GetDesign(int id, int objKey, string responseToken)
    {
        string acccessCriteria = null;

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is" + id);

            return "Session is invalid.";
        }

        LicenseProvider.ValidateActivityLicense(id);

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Activity WebService Request is invalid.", id);

            return "Activity WebService Request is invalid.";
        }

        try
        {
            acccessCriteria = SecurityProvider.ValidateProcessAccess(id);
        }
        catch
        {
            return "Access is denied.";
        }

        #endregion

        int dProcessId = objKey;

        #region Get ProcessInfo From Database

        string dName = null;
        string dLabel = null;

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

            string query = "select * from Sys_Prc_Processes where ProcessID = " + objKey;

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        dName = reader["ELabel"].ToString();

                        dLabel = reader["Label"].ToString();
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query, id);

                    return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                }
            }
        }

        #endregion

        string designJson = null;

        if (File.Exists(Server.MapPath("/App_Data") + "/Processes/" + dProcessId + ".fdm"))
        {
            #region Process Design Already Exsited

            using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Processes/" + dProcessId + ".fdm"))
            {
                designJson = reader.ReadToEnd();
                designJson = designJson.Remove(designJson.Length - 2, 2);
                designJson = designJson + ",\"Label\":\"@@Label\",";
                designJson = designJson + "\"Name\":\"@@Name\",";
                designJson = designJson + "\"RefRoles\":@@RefRoles,";
                designJson = designJson + "\"RefGroups\":@@RefGroups,";
                designJson = designJson + "\"RefPositions\":@@RefPositions,";
                designJson = designJson + "\"RefUsers\":@@RefUsers,";
                designJson = designJson + "\"RefTeams\":@@RefTeams,";
                designJson = designJson + "\"DefVariables\":@@DefVariables,";
                designJson = designJson + "\"RuleProcedures\":@@RuleProcedures,";
                designJson = designJson + "\"FlowStates\":@@FlowStates,";
                designJson = designJson + "\"EntityTypes\":@@EntityTypes,";
                designJson = designJson + "\"EnumTypes\":@@EnumTypes,";
                designJson = designJson + "\"SysCartables\":@@SysCartables,";
                designJson = designJson + "\"SysDepartment\":@@SysDepartment,";
                designJson = designJson + "\"SysBuildings\":@@SysBuildings,";
                designJson = designJson + "\"SysSties\":@@SysSites}}";


                designJson = designJson.Replace("@@Name", dName.ToString());
                designJson = designJson.Replace("@@Label", dLabel.ToString());
                designJson = designJson.Replace("@@RefRoles", GetRoles());
                designJson = designJson.Replace("@@RefGroups", GetGroups());
                designJson = designJson.Replace("@@RefPositions", GetPositions());
                designJson = designJson.Replace("@@RefUsers", GetUsers());
                designJson = designJson.Replace("@@RefTeams", GetTeams());
                designJson = designJson.Replace("@@DefVariables", GetDefVariables(dProcessId));
                designJson = designJson.Replace("@@RuleProcedures", GetRuleProcedures());
                designJson = designJson.Replace("@@FlowStates", GetFlowStates());
                designJson = designJson.Replace("@@EntityTypes", GetSysEntities());
                designJson = designJson.Replace("@@EnumTypes", GetEnumTypes());
                designJson = designJson.Replace("@@SysCartables", GetSysCartables());
                designJson = designJson.Replace("@@SysDepartment", GetDepartments());
                designJson = designJson.Replace("@@SysBuildings", GetBuildings());
                designJson = designJson.Replace("@@SysSites", GetSties());
            }

            #endregion
        }
        else
        {
            if (File.Exists(Server.MapPath("/App_Data") + "/Processes/Default.fdm"))
            {
                #region Process Design not Already Exsited, Create Default Design

                using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Processes/Default.fdm"))
                {
                    designJson = reader.ReadToEnd();
                }

                designJson = designJson.Replace("@@ProcessID", dProcessId.ToString());
                designJson = designJson.Replace("@@Name", dName.ToString());
                designJson = designJson.Replace("@@Label", dLabel.ToString());
                designJson = designJson.Replace("@@RefRoles", GetRoles());
                designJson = designJson.Replace("@@RefGroups", GetGroups());
                designJson = designJson.Replace("@@RefPositions", GetPositions());
                designJson = designJson.Replace("@@RefUsers", GetUsers());
                designJson = designJson.Replace("@@RefTeams", GetTeams());
                designJson = designJson.Replace("@@DefVariables", GetDefVariables(dProcessId));
                designJson = designJson.Replace("@@RuleProcedures", GetRuleProcedures());
                designJson = designJson.Replace("@@FlowStates", GetFlowStates());
                designJson = designJson.Replace("@@EntityTypes", GetSysEntities());
                designJson = designJson.Replace("@@EnumTypes", GetEnumTypes());
                designJson = designJson.Replace("@@SysCartables", GetSysCartables());
                designJson = designJson.Replace("@@SysDepartment", GetDepartments());
                designJson = designJson.Replace("@@SysBuildings", GetBuildings());
                designJson = designJson.Replace("@@SysSites", GetSties());

                #endregion
            }
            else
            {
                return LogProvider.PrepareLogResultStr(0, "Default.fdm was not found", 0);
            }
        }

        designJson = designJson.Replace("@@requestToken", SessionProvider.GenRequestToken());

        JavaScriptSerializer js = new JavaScriptSerializer();
        designJson = js.Serialize(designJson);

        return designJson;
    }

   [WebMethod(EnableSession = true)]
    public string GetEntityColumns(int entityID)
    {
        string query = "SELECT se.Name as Name , se.Label as Label , sa.Label as Type , se.Nullable as Nullable , se.EnumTypeID as EnumTypeId , se.RefEntityID as RefEntityID FROM Sys_EntityAttributes se join Sys_AttributeTypes sa on sa.AttributeTypeID = se.AttributeTypeID  WHERE EntityID = @EntityID";

        List<EntityColumn> entityColumnList = new List<EntityColumn>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.Add(new SqlParameter("@EntityID", SqlDbType.Int) { Value = entityID });

                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        entityColumnList.Add(new EntityColumn(
                            reader["Name"].ToString(),
                            reader["Label"].ToString(),
                            reader["Type"].ToString(),
                            reader["Nullable"].ToString(),
                            reader["EnumTypeID"].ToString(),
                            reader["RefEntityID"].ToString()

                        ));
                    }
                }
            }
        }

        JavaScriptSerializer js = new JavaScriptSerializer();
        return js.Serialize(entityColumnList);
    }

    #region Remove Old Process Design in Database

    private static void ClearOldDesign(int ProcessId)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format(
            "DELETE FROM Sys_Prc_RoutingRules WHERE GatewayEID IN (SELECT FlowElementID FROM Sys_Prc_FlowElements WHERE ProcessID = {0});" +
            "DELETE FROM Sys_Prc_ActivitiyAssignees WHERE ProcessActivityID IN (SELECT ProcessActivityID FROM Sys_Prc_ProcessActivities WHERE ProcessID = {0});" +
            "DELETE FROM Sys_Prc_ProcessActivities WHERE ProcessID = {0};" +
            "DELETE FROM Sys_Prc_FlowVariables WHERE ProcessID = {0};" +
            "DELETE FROM Sys_Prc_FlowElements WHERE ProcessID = {0};" +
            "DELETE FROM Sys_Prc_DocumentViews WHERE ProcessID = {0};" +
            "DELETE FROM Sys_Prc_ActivitySchedules WHERE ProcessID = {0};"
            , ProcessId));

    }

    private string ClearForm(int id)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format(
        "DELETE FROM Sys_Prc_FormViews WHERE FormID = {0};" +
        "DELETE FROM Sys_Prc_FormItems WHERE FormID = {0};" +
        "DELETE FROM Sys_Prc_FormGroupBoxs WHERE FormID = {0};"
        , id));
        try
        {
            if (File.Exists(Server.MapPath("/App_Data") + "/Forms/" + id + ".fdm"))
            {
                File.Delete((Server.MapPath("/App_Data") + "/Forms/" + id + ".fdm"));
            }
        }
        catch (IOException ioExp)
        {
            Console.WriteLine(ioExp.Message);
        }

        return id.ToString();
    }

    private string ClearDocument(int id)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format(
        "DELETE FROM Sys_Prc_DocumentViews WHERE DocumentID = {0};" +
        "DELETE FROM Sys_Prc_DocumentItems WHERE DocumentID = {0};"
        , id));

        try
        {
            if (File.Exists(Server.MapPath("/App_Data") + "/Documents/" + id + ".fdm"))
            {
                File.Delete((Server.MapPath("/App_Data") + "/Documents/" + id + ".fdm"));
            }

            if (File.Exists(Server.MapPath("/App_Data") + "/Documents/Images/" + id + ".fdmt"))
            {
                File.Delete((Server.MapPath("/App_Data") + "/Documents/Images/" + id + ".fdmt"));
            }
        }
        catch (IOException ioExp)
        {
            Console.WriteLine(ioExp.Message);
        }

        return id.ToString();
    }

    #endregion

    #region Create New Process Design in Database

    private static void CreateFlowElement(int flowElementID, int processID, string name, string label, string type, int outgoingEID, bool enabled, string version, string description, int flowStateID, bool isFirstTask, int incomingEID)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_FlowElements(FlowElementID, ProcessID, Name,Label,Type,FlowStateID, OutgoingEID, Enabled, Version, Description, IsFirstTask, IncomingEID) " +
            "                                                                     VALUES({0},{1},N'{2}',N'{3}',N'{4}',{5},{6},{7},N'{8}',N'{9}',{10},{11})",
                                                                                         flowElementID, processID, name, label, type, (flowStateID == 0 ? 1 : flowStateID), outgoingEID, 1, version, description, (isFirstTask ? 1 : 0), incomingEID));

    }

    private static void CreateProcessActivity(int processActivityID, int processID, int processCartableID, int flowElementID, string name, string label, bool bOption0, bool bOption1, bool bOption2, bool bOption3, bool bOption4,
        bool bOption5, bool bOption6, bool bOption7, bool bption8, int sLA_ResolutionTimes, string sLA_ResolutionType, int sLA_ResponseTimes, string sLA_ResponseType, bool isDefault, bool enabled, string version, string description)
    {

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_ProcessActivities(ProcessActivityID, ProcessID, ProcessCartableID, Name, Label, BOption0,BOption1, BOption2, BOption3, BOption4,BOption5,BOption6,BOption7,BOption8,SLA_ResolutionTimes,SLA_ResolutionType,SLA_ResponseTimes,SLA_ResponseType,IsDefault,Enabled,FlowElementID,Version,Description)" +
            "VALUES({0}, {1}, {2}, N'{3}', N'{4}', {5}, {6}, {7}, {8}, {9},{10},{11},{12},{13},{14},N'{15}',{16},N'{17}',{18},{19},{20}, N'{21}', N'{22}')",
            processActivityID, processID, (processCartableID == 0 ? 1 : processCartableID), name, label, bOption0 ? 1 : 0, bOption1 ? 1 : 0, bOption2 ? 1 : 0, bOption3 ? 1 : 0, bOption4 ? 1 : 0, bOption5 ? 1 : 0, bOption6 ? 1 : 0, bOption7 ? 1 : 0, bption8 ? 1 : 0, sLA_ResolutionTimes, sLA_ResolutionType, sLA_ResponseTimes, "", isDefault ? 1 : 0, enabled ? 1 : 0, flowElementID, version, description));
    }

    private static void CreateRoutingRule(int routingRuleID, string name, string label, int gatewayEID, int outgoingEID, int flowStateID, string conditions, bool enabled, string version, string description)
    {

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_RoutingRules(RoutingRuleID, Name, Label, GatewayEID, OutgoingEID, FlowStateID, Conditions, Enabled, Version,Description) VALUES({0}, N'{1}', N'{2}', {3}, {4}, {5}, N'{6}', {7}, '{8}', N'{9}')",
            routingRuleID, name, label, gatewayEID, outgoingEID, flowStateID, conditions.Replace("'", "''"), enabled ? 1 : 0, version, description));

    }

    private static void CreateFlowVariable(int flowVariableID, int processID, string name, string label, string dataType, string inputType, bool nullable, bool isDefault, int enumTypeID,
      int referEntityID, string formula, string defaultValue, bool enabled, string version, string description, int rowkey, string inputCount, bool isDocument)
    {

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_FlowVariables(FlowVariableID, ProcessID, Name, Label, DataType, InputType, Nullable, " +
            "IsDefault, EnumTypeID,ReferEntityID,Formula, DefaultValue,Enabled,Version,Description,RowKey,InputCount,IsDocument , TableEntityID)" +
            " VALUES({0}, {1}, N'{2}', N'{3}', N'{4}', N'{5}', {6}, {7}, {8}, {9}, N'{10}', N'{11}', {12}, N'{13}', N'{14}', {15}, N'{16}', N'{17}' , {18})", 
            flowVariableID, processID, name, label, (dataType == "Time" ? "ShortTime" : dataType),
            (dataType == "Image" ? "FileBrowse" : (inputType == "TimeBox" ? "TextBox" : inputType)), nullable ? 1 : 0, isDefault ? 1 : 0, enumTypeID,
            (dataType == "Table" || dataType == "SelectiveTable") && referEntityID != 0 ? 0 : referEntityID,
            formula, defaultValue, enabled ? 1 : 0, version, description, rowkey, inputCount, isDocument ? 1 : 0,
            (dataType == "Table" || dataType == "SelectiveTable") && referEntityID != 0 ? referEntityID : 0));
    }

    private static void CreateActivitiyAssignees(int activitiyAssigneeID, int processActivityID, string assignmentType, string activitiyType, int userGroupID, int userRoleID, int userID, int teamID, int positionID, int defaultTeamID,
       int defaultUserID, int defaultPositionID, int assignmentProcedureID, int assignmentVariableID, string assignedDepartmentIDs, string AssignedSiteIDs, string AssignedContractTypes, string AssignedBuildingIDs, string AssignedProfileIDs,
        bool isDefault, bool enabled, string version, string description)
    {
        string assignedDepartmentIdList = ExtractIds(assignedDepartmentIDs);
        string assignedSiteIdList = ExtractIds(AssignedSiteIDs);
        string assignedBuildingIdList = ExtractIds(AssignedBuildingIDs);

        if (userID == 0 && teamID == 0 && positionID == 0 && assignmentVariableID == 0)
            userID = 1;

        if (userID == 1 && ApplicationProvider.PackageName == "McAP Professional Extensions")
            userID = 2;

        if (userID == 1 && ApplicationProvider.PackageName == "افزونه های میز کار امن پرداز")
            userID = 2;

        // Execute the insert query
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_ActivitiyAssignees(ActivitiyAssigneeID, ProcessActivityID, AssignmentType, ActivitiyType, UserGroupID, UserRoleID, UserID, TeamID, PositionID," +
            "DefaultTeamID,defaultUserID,defaultPositionID,assignmentProcedureID,assignmentVariableID,AssignmentDepartmentIDs,AssignmentSitesIDs,AssignmentContractTypes , AssignmentBuildingIDs ,AssignmentProfileIDs,IsDefault,Enabled,Version,Description) VALUES({0}, {1}, N'{2}', N'{3}', {4}, {5}, {6}, {7}, {8}, {9}, {10}, {11}, {12}, {13},N'{14}',N'{15}',N'{16}',N'{17}',N'{18}', {19}, {20}, N'{21}', N'{22}')",
            activitiyAssigneeID, processActivityID, assignmentType, activitiyType, userGroupID, userRoleID, userID, teamID, positionID, defaultTeamID, defaultUserID, defaultPositionID, assignmentProcedureID, assignmentVariableID,
            assignedDepartmentIdList, assignedSiteIdList, AssignedContractTypes, assignedBuildingIdList, AssignedProfileIDs, isDefault ? 1 : 0, enabled ? 1 : 0, version, description));
    }
    private static void CreateActivitySchedule(ActivitySchedule schedule, bool enabled, string version, string description, int processActivityID, int processID)
    {
        // Validate that AccessTiming has items
        if (schedule.AccessTiming == null || schedule.AccessTiming.Length == 0)
        {
            throw new ArgumentException("AccessTiming must contain at least one ScheduleItem.");
        }

        // Iterate through each ScheduleItem
        foreach (ScheduleItem item in schedule.AccessTiming)
        {
            // Build the SQL command using string.Format
            string sqlCommand = string.Format(
                "INSERT INTO Sys_Prc_ActivitySchedules(ScheduleType, StartDate, StartTime, EndDate, EndTime, Enabled, Version, Description, ProcessActivityID , ProcessID) " +
                "VALUES (N'{0}', N'{1}', N'{2}', N'{3}', N'{4}', {5}, N'{6}', N'{7}', {8} , {9})",
                "Access",
                item.StartDate,
                item.StartHour,
                item.FinishDate,
                item.FinishHour,
                enabled ? 1 : 0,
                version,
                description,
                processActivityID,
                processID);

            try
            {
                // Execute the SQL command
                SqlDataProvider.ExecuteNoneQuery(sqlCommand);
            }
            catch (SqlException ex)
            {
                throw new ApplicationException("Database error occurred while creating activity schedule for a schedule item.", ex);
            }
        }
    }

    private static string ExtractIds(string jsonString)
    {
        if (string.IsNullOrWhiteSpace(jsonString) || jsonString == "0")
        {
            return "0"; // Return "0" if the input is empty or equals to "0"
        }

        // Remove curly braces and split by commas
        jsonString = jsonString.Trim('{', '}');
        var idPairs = jsonString.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
        var ids = new List<string>();

        // Loop through the pairs and extract IDs
        foreach (var pair in idPairs)
        {
            var parts = pair.Split(':');
            if (parts.Length == 2)
            {
                int id; // Declare the variable here
                if (int.TryParse(parts[1].Trim('"', ' '), out id))
                {
                    ids.Add(id.ToString()); // Add only the ID part
                }
            }
        }

        // Join the IDs into a comma-separated string
        return string.Join(",", ids);
    }

    private static void CreateDocumentView(int documentID, int processID, int rowKey, string label, string imgSrc, string imgName, string imgSize, int ActivityID, string viewAccessIDs, string downloadAccessIDs)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_DocumentViews(DocumentID,ProcessID,RowKey,Name,Label,ImgSrc,ImgName,ImgSize,ActivityID," +
            "ViewAccessIDs,DownloadAccessIDs)VALUES({0},{1},{2},N'{3}',N'{4}',N'{5}',N'{6}',N'{7}',{8},N'{9}',N'{10}')", documentID, processID, rowKey, label, label, imgSrc, imgName, imgSize, ActivityID, viewAccessIDs, downloadAccessIDs));
    }

    #endregion

    #region Prepare Json  Data for Process Design

    [WebMethod(EnableSession = true)]
    public string GetEnumTypes()
    {
        return GetDataList("SELECT EnumTypeID AS ID,Label FROM Sys_EnumTypes  WHERE EnumTypeID>=11000 AND EnumTypeID < 20000");
    }

    [WebMethod(EnableSession = true)]
    public string GetFlowVariables(int rowkey, int processid)
    {
        return GetDataList("SELECT EnumTypeID AS ID,Label FROM Sys_Prc_FlowVariables WHERE RowKey=" + rowkey + " AND ProcessID=" + processid);
    }

    [WebMethod(EnableSession = true)]
    public string EditEnumType()
    {
        IEnum design = null;

        try
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            design = js.Deserialize<IEnum>(HttpContext.Current.Request.Form["design"]);

            AddEnumType(design.ELabel, design.Label);
        }
        catch (Exception exp)
        {
            return "An error occurred during file parsing\n\r" + exp.Message;
        }

        return GetDataList("SELECT TOP 1 EnumTypeID as ID,Label FROM Sys_EnumTypes WHERE EnumTypeID >= 11000 AND EnumTypeID < 20000 ORDER BY EnumTypeID DESC;");
    }

    [WebMethod(EnableSession = true)]
    public string FdmtGenerator(int ID, string Value)
    {
        ClearDocument(ID);
        try
        {
            string directoryPath = Server.MapPath("/App_Data") + "/Documents/Images/";
            string fileName = ID + ".fdmt";
            string filePath = Path.Combine(directoryPath, fileName);

            File.WriteAllText(filePath, Value);

            return "File saved successfully at: " + filePath;
        }
        catch (Exception ex)
        {
            return "Error saving file: " + ex.Message;
        }
    }

    [WebMethod(EnableSession = true)]
    public string GetItemVisibility(int processID, int rowKey)
    {
        List<ListItemVisibility> listItemVisibilities = new List<ListItemVisibility>();

        string query = @"SELECT fi.Rowkey, fi.FormID, fi.Visibility, pa.Label 
                     FROM Sys_Prc_FormItems fi 
                     JOIN Sys_Prc_ProcessActivities pa ON fi.FormID = pa.ProcessActivityID
                     WHERE pa.ProcessID = @ProcessID AND fi.Rowkey = @Rowkey";

        using (var connection = SqlDataProvider.DbConnection)
        {
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.Add(new SqlParameter("@ProcessID", SqlDbType.Int) { Value = processID });
                command.Parameters.Add(new SqlParameter("@Rowkey", SqlDbType.Int) { Value = rowKey });

                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        listItemVisibilities.Add(new ListItemVisibility(
                            reader["Rowkey"].ToString(),
                            reader["FormID"].ToString(),
                            reader["Visibility"].ToString(),
                            reader["Label"].ToString()
                        ));
                    }
                }
            }
        }

        JavaScriptSerializer js = new JavaScriptSerializer();
        return js.Serialize(listItemVisibilities);
    }

    [WebMethod(EnableSession = true)]
    public string GetUsedVariables(int processID)
    {
        List<ListItemUsed> usedVariable = new List<ListItemUsed>();

        string query =
            @"SELECT fi.Rowkey, fv.Label,fi.FormID As ID,'Form' as Type
            FROM Sys_Prc_FormItems fi
            JOIN Sys_Prc_ProcessActivities pa ON fi.FormID = pa.ProcessActivityID
            JOIN Sys_Prc_FormViews fv ON fv.FormID = pa.ProcessActivityID
            WHERE pa.ProcessID = @ProcessID
            UNION All
            SELECT di.Rowkey,dv.Label,di.DocumentID As ID,'Doc' as Type
            FROM Sys_Prc_DocumentItems di
            JOIN Sys_Prc_DocumentViews dv ON di.DocumentID = dv.DocumentID
            WHERE dv.ProcessID = @ProcessID";

        using (var connection = SqlDataProvider.DbConnection)
        {
            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@ProcessID", processID);

                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        usedVariable.Add(new ListItemUsed(reader["Rowkey"].ToString(), reader["Label"].ToString(), reader["ID"].ToString(), reader["Type"].ToString()));
                    }
                }
            }
        }
        JavaScriptSerializer js = new JavaScriptSerializer();

        return js.Serialize(usedVariable);

    }

    [WebMethod(EnableSession = true)]
    public string GetAllSysEntities()
    {
        return GetDataList("select EntityID as ID, Label from Sys_Entities where Enabled = 1");
    }

    [WebMethod(EnableSession = true)]
    public string GetEnums(int enumTypeId)
    {
        //if (enumTypeId == 11039)
        //    return GetDataList("SELECT EmployeeID AS ID ,  CONCAT(FirstName, ' ', LastName) AS Label  FROM Hrs_Employees WHERE (ContractImage3 IS NOT NULL) AND (Hrs_Employees._IsDeleted = 0) AND dbo.GetDeputy(EmployeeID) IN (170,173)");

        //if (enumTypeId == 11043)
        //    return GetDataList(@" SELECT  e.EmployeeID AS ID, CONCAT(e.FirstName, ' ', e.LastName) AS Label FROM  Hrs_Employees e WHERE   e.ContractImage3 IS NOT NULL 
        //   AND e._IsDeleted = 0 AND e.WorkingProfileID  NOT IN (27,39,29,38,34,35,36,37,30,31,32,33) AND e.EmployeeID != " + SessionProvider.UserID + " AND " +
        //  " (SELECT COUNT(*) FROM Hrs_AmentityTimes WHERE Hrs_AmentityTimes.UserID = e.EmployeeID AND " +
        //  " FORMAT(Hrs_AmentityTimes.Date, 'MM', 'fa-IR') = FORMAT(GETDATE(), 'MM', 'fa-IR') " +
        //    " AND FORMAT(Hrs_AmentityTimes.Date, 'yyyy', 'fa-IR') = FORMAT(GETDATE(), 'yyyy', 'fa-IR') AND (Hrs_AmentityTimes.AmentityStatus = N'انجام شد'  OR Hrs_AmentityTimes.AmentityStatus = N'رزرو شده'  OR Hrs_AmentityTimes.AmentityStatus = N'ثبت شده')) < 9 " +
        //    " AND ( SELECT COUNT(*) FROM Hrs_AmentityTimes  WHERE Hrs_AmentityTimes.UserID = e.EmployeeID  AND CAST(Date AS DATE) = CAST(GETDATE() AS DATE) AND (Hrs_AmentityTimes.AmentityStatus = N'انجام شد'  OR Hrs_AmentityTimes.AmentityStatus = N'رزرو شده'  OR Hrs_AmentityTimes.AmentityStatus = N'ثبت شده')) = 0 " +
        //      " AND(SELECT TOP(1) BuildingID FROM Org_Positions WHERE UserID = e.EmployeeID) = " + SessionProvider.BuildingIDs + "  AND Gender = N'" + SessionProvider.UserGendar + "'");

        return GetDataList("SELECT EnumID AS ID,Label FROM Sys_EnumValues WHERE EnumTypeID=" + enumTypeId);
    }


    private static string GetRoles()
    {
        return GetDataList("select UserRoleID as ID, Label from Sys_UserRoles where not UserRoleID in (50,52,53,54,1,1000) and Enabled = 1 and _IsDeleted = 0");

    }

    private static string GetGroups()
    {
        return GetDataList("select UserGroupID as ID, Label from Sys_UserGroups where Enabled = 1 and _IsDeleted = 0");
    }

    private static string GetPositions()
    {
        return GetDataList("select UserRoleID as ID, Label from Sys_UserRoles where not UserRoleID in (50,52,53,1,1000) and Enabled = 1 and _IsDeleted = 0");
    }

    private static string GetUsers()
    {
        return GetDataList("select UserID as ID, Label from Sys_Users where Enabled = 1 and _IsDeleted = 0 AND HasProcessRole = 1");
    }

    private static string GetTeams()
    {
        return GetDataList("select WorkTeamID as ID, Label from Sys_WorkTeams where Enabled = 1");

    }

    private static string GetDefVariables(int processId)
    {
        return GetDataList("select DefVariableID as ID, Label from Sys_Prc_DefVariables where Enabled = 1 union all " +
            "select FlowVariableID as ID,Label from Sys_Prc_FlowVariables where ReferEntityID in (10101, 10103) and ProcessID =" + processId);
    }

    private static string GetRuleProcedures()
    {
        return GetDataList("select ProcedureID as ID, Label from Sys_Prc_Procedures where Enabled = 1");
    }

    private static string GetFlowStates()
    {
        return GetDataList("select FlowStateID as ID, Label from Sys_Prc_FlowStates where Enabled = 1 and _IsDeleted = 0");
    }

    private static string GetSysEntities()
    {
        return GetDataList("select EntityID as ID, Label from Sys_Entities where Enabled = 1 AND (EntityID IN (10101, 10103, 10306,10400) OR (EntityID > 50000))");
    }

    private static void AddEnumType(string elabel, string label)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Prc_EnumTypes(ELabel, Label, IsDefault, Enabled, Version, Description, _IsDeleted," +
            "_LastModifyDate) VALUES(N'{0}', N'{1}', {2}, {3},  N'{4}', N'{5}', {6}, {7})", elabel, label, 0, 1, "custom", "", 0, "getdate()"));
    }

    private static string GetSysCartables()
    {
        return GetDataList("select ActivityCartableID as ID, Label from Sys_Prc_ActivityCartables where Enabled = 1 and _IsDeleted = 0");
    }

    public static string GetDepartments()
    {
        return GetTreeDataList("select DepartmentID AS ID , Label , Parent_DepartmentID AS ParentID  from Org_Departments where _IsDeleted = 0");
    }

    private static string GetBuildings()
    {
        return GetTreeDataList("select BuildingID AS ID , Label , SiteID AS ParentID from Org_Buildings");
    }

    private static string GetSties()
    {
        return GetTreeDataList("select SiteID AS ID , Label , '' AS ParentID from Org_Sites");
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

    private static string GetTreeDataList(string query)
    {
        List<DepartmentList> items = new List<DepartmentList>();

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
                            items.Add(new DepartmentList(reader["ID"].ToString(), reader["Label"].ToString(), reader["ParentID"].ToString()));
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

    private string ConvertDataTableToJson(DataTable table)
    {
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
        Dictionary<string, object> row;

        foreach (DataRow dr in table.Rows)
        {
            row = new Dictionary<string, object>();
            foreach (DataColumn col in table.Columns)
            {
                row.Add(col.ColumnName, dr[col]);
            }
            rows.Add(row);
        }

        return serializer.Serialize(rows);
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

    public class DepartmentList
    {
        public string ID;
        public string Label;
        public string ParentId;
        public DepartmentList(string id, string label, string parentid)
        {
            this.ID = id;
            this.Label = label;
            this.ParentId = parentid;
        }
    }

    public class ListItemUsed
    {
        public string Rowkey;

        public string Label;

        public string ID;

        public string Type;

        public ListItemUsed(string rowKey, string label, string id, string type)
        {
            this.Rowkey = rowKey;
            this.Label = label;
            this.ID = id;
            this.Type = type;
        }
    }

    public class ListItemVisibility
    {
        public string Rowkey;

        public string Label;

        public string ID;

        public string Visibility;

        public ListItemVisibility(string rowKey, string id, string visibility, string label)
        {
            this.Rowkey = rowKey;
            this.Label = label;
            this.ID = id;
            this.Visibility = visibility;
        }
    }

public class EntityColumn
 {
     public string Name;
     public string Label;
     public string Type;
     public string Nullable;
     public string EnumTypeId;
     public string RefEntityID;


     public EntityColumn(string name , string label , string type , string nullable , string enumTypeID , string refEntitiyid)
     {
         this.Name = name;
         this.Label = label;
         this.Type = type;
         this.Nullable = nullable;
         this.EnumTypeId = enumTypeID;
         this.RefEntityID = refEntitiyid;
     }
 }

    #endregion

    #region Custom Activities

    [WebMethod(EnableSession = true)]
    public string GetEntityDetails(int entityAttributeId)
    {
        string queryEntityID = "SELECT EntityID FROM Sys_EntityAttributes WHERE EntityAttributeID = @EntityAttributeID";
        string entityId;
        DataTable entityIdTable = new DataTable();

        using (SqlConnection connection = SqlDataProvider.DbConnection)
        {
            SqlCommand command = new SqlCommand(queryEntityID, connection);
            command.Parameters.AddWithValue("@EntityAttributeID", entityAttributeId);
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command);
            dataAdapter.Fill(entityIdTable);

            // Get the EntityID from the first row if it exists
            if (entityIdTable.Rows.Count > 0)
            {
                entityId = entityIdTable.Rows[0]["EntityID"].ToString();
            }
            else
            {
                return ConvertDataTableToJson(new DataTable()); // Return empty JSON if no EntityID found
            }
        }

        // Now fetch entity data
        string queryEntityData = "SELECT * FROM Sys_Entities WHERE EntityID = @EntityID";
        DataTable entityDataTable = new DataTable();

        using (SqlConnection connection = SqlDataProvider.DbConnection)
        {
            SqlCommand command = new SqlCommand(queryEntityData, connection);
            command.Parameters.AddWithValue("@EntityID", entityId);
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command);
            dataAdapter.Fill(entityDataTable);
        }

        // Now fetch process table data
        string titleExpression = entityDataTable.Rows.Count > 0 ? entityDataTable.Rows[0]["TitleExpression"].ToString() : string.Empty;
        string idExpression = entityDataTable.Rows.Count > 0 ? entityDataTable.Rows[0]["IDExpression"].ToString() : string.Empty;

        string queryProcessTableData = "SELECT " + titleExpression + " FROM Sys_Pex_Process_" + idExpression;
        DataTable processTableData = new DataTable();

        using (SqlConnection connection = SqlDataProvider.DbConnection)
        {
            SqlCommand command = new SqlCommand(queryProcessTableData, connection);
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command);
            dataAdapter.Fill(processTableData);
        }

        // Combine results into a single object
        var result = new
        {
            EntityID = entityId,
            EntityData = ConvertDataTableToJson(entityDataTable),
            ProcessTableData = ConvertDataTableToJson(processTableData)
        };

        return new JavaScriptSerializer().Serialize(result);
    }

    #endregion
}
