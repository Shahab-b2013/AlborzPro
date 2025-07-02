// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.4.0
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class Interface : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public object GetCommonData(string responseToken)
    {
        #region Validation
        int userID = SessionProvider.UserID;
        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "GetCommonData");

            return LogProvider.PrepareLogResult(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateLicense();

        #endregion

        Dictionary<string, object> comData = new Dictionary<string, object>();

        comData.Add("formSelects", FetchListData("select SelectListID, ActionControlID, ClearOnEmpty, EmptyRequestEnabled, PreserveSelected, PreserveSelectedPosition, DisplayMode, DisplayFiledName, DividerEnable, IconEnable, GroupingEnable, SearchEnable, MaxSelectedOptions, MaxDisplayOptions, SearchStyle, ActionBoxEnabled, SelectedTextFormat, Width, GroupingFiledName, SubtextFiledName, CustomContent, IconFiledName, StyleClass, IconClassName from Sys_Gui_Ctl_SelectLists", false));

        comData.Add("formAddons", FetchListData("select * from Sys_Gui_FormAddons", false));

        comData.Add("formEnums", FetchListData("SELECT EnumTypeID, Label AS label, Value AS value, AccessCriteria AS AccessCriteria FROM  Sys_EnumValues WHERE  Enabled = 1 AND ( AccessCriteria IS NULL OR AccessCriteria = '' OR EXISTS (SELECT 1 FROM Org_Positions AS op CROSS APPLY STRING_SPLIT(REPLACE(Sys_EnumValues.AccessCriteria, '&sbquo;', ','), ',') AS ac WHERE op.UserID =" + userID + "AND op.DepartmentID = ac.value));", true));

        return comData;
    }

    [WebMethod(EnableSession = true)]
    public object GetCompData(string target, int id, string param, string param2, string responseToken)
    {
        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "Target is " + "$target" + " by ActivityContext : " + id);

            return LogProvider.PrepareLogResult(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateLicense();

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Interface WebService Request is invalid.", "Target is " + "$target" + " by ActivityContext : " + id);

            return LogProvider.PrepareLogResult(logID, "Interface WebService Request is invalid.", 10101);
        }

        #endregion

        Dictionary<string, object> comData = new Dictionary<string, object>();

        if (target == "page")
        {
            var options = FetchListData("e0835063-cf9f-4d98-83a4-6cdd809d8079", id)[0];

            comData.Add("options", options);

            if (options["PageTemplateID"].ToString() != "" && param == "null")
            {
                comData.Add("layouts", FetchListData("8a89fdb5-5bd9-40bd-a117-cbf5adeabeac", Convert.ToInt32(options["PageTemplateID"])));
            }
            else
            {
                comData.Add("layouts", FetchListData("8a89fdb5-5bd9-40bd-a117-cbf5adeabeac", id));
            }

            if (options["PageTemplateID"].ToString() != "" && param == "null" && id != 101000)
            {
                comData.Add("contextSettings", FetchListData("1089fdb5-56d9-37bd-9017-34f5adeabeac", id)[0]);

                comData.Add("activitySettings", FetchListData("9a89fdb5-3bd9-80bd-c117-dbf5adeabeac", id)[0]);
            }

            if (options["Type"].ToString() != "EntityProfile" && param == "null")
            {
                comData.Add("navigations", FetchListData("203a843b-1454-42f0-91db-768138aea7cc", id));

                comData.Add("menuItems", FetchListData("c6b4286e-d04c-4ff2-bc08-73b764781a63", id));

                comData.Add("shortcutItems", FetchListData("77927d76-abc9-ec01-19a1-a0c9c46c0175", id));

                comData.Add("reportItems", FetchListData("67943d70-cba0-4621-29a1-acc9c46c01ca", id));
            }
        }

        if (target == "gadget")
        {
            var options = FetchListData("45711f3c-3487-35b0-ee9c-c438e1c23f05", id)[0];

            comData.Add("options", options);

            comData.Add("items", FetchListData("ac37140e-dc70-473e-5715-bfaef1af4701", id));

            if (options["DataFieldName"].ToString() != "" && false)
            {
                comData.Add("data", new ViewActivity().GetDataObjects(id, Convert.ToInt32(param), responseToken, null));
            }
        }

        if (target == "grid")
        {
            comData.Add("options", FetchListData("1637abd7-5369-4fd8-bc92-b2859d691cac", id)[0]);

            comData.Add("columns", FetchListData("45454743-b4d3-4c2c-b175-e66d251811d6", id));

            comData.Add("buttons", FetchListData("d5b553ae-6aeb-4ebd-85e2-d35ec6521d19", id));

            comData.Add("filters", FetchListData("1d82f55b-805c-4971-ba84-6b4b8a20e2a0", id));
        }

        if (target == "chart")
        {
            comData.Add("options", FetchListData("50a5481e-d1b9-4d5b-a05b-83da9efece8d", id)[0]);

            comData.Add("series", FetchListData("50a5481e-eeb9-675b-985b-acda9efece8d", id));
        }

        if (target == "checkForm")
        {
            var formOptions = FetchListData("174f1c8e-4803-4dbe-bf3f-5e56f0f41bfb", id)[0];

            var listOptions = FetchListData("e7d344b0-ed14-42dc-955f-dd72ad6e7f71", Convert.ToInt32(formOptions["DataContextID"]))[0];

            comData.Add("formOptions", formOptions);

            comData.Add("listOptions", listOptions);

            comData.Add("columns", FetchListData("aad48ccd-ab93-4e22-9a11-8e1cce1c3574", Convert.ToInt32(listOptions["ListID"])));

            comData.Add("gridOptions", FetchListData("1637abd7-5369-4fd8-bc92-b2859d691cac", id)[0]);
        }

        if (target == "detailList")
        {
            var listOptions = FetchListData("e7d344b0-ed14-42dc-955f-dd72ad6e7f71", id)[0];

            comData.Add("listOptions", listOptions);

            comData.Add("columns", FetchListData("aad48ccd-ab93-4e22-9a11-8e1cce1c3574", Convert.ToInt32(listOptions["ListID"])));

            comData.Add("gridOptions", FetchListData("1637abd7-5369-4fd8-bc92-b2859d691cac", id)[0]);
        }

        if (target == "form")
        {
            var options = FetchListData("174f1c8e-4803-4dbe-bf3f-5e56f0f41bfb", id)[0];

            comData.Add("options", options);

            comData.Add("items", FetchListData("5756d842-1c5b-49a4-a4bf-3289a0d0dc98", id));

            if (Convert.ToBoolean(options["ItemsGrouping"]))
            {
                comData.Add("groups", FetchListData("7036e278-ede8-4c81-a4fe-ec8397d2fccd", id));
            }
        }

        if (target == "detail")
        {
            comData.Add("options", FetchListData("6e711f3c-6687-40b0-8a9c-d038e1c23f05", id)[0]);

            comData.Add("items", FetchListData("9737140e-4970-473e-bc15-d3aef1af4701", id));
        }

        if (target == "checkList")
        {
            var listOptions = FetchListData("e7d344b0-ed14-42dc-955f-dd72ad6e7f71", id)[0];

            comData.Add("listOptions", listOptions);

            comData.Add("columns", FetchListData("aad48ccd-ab93-4e22-9a11-8e1cce1c3574", Convert.ToInt32(listOptions["ListID"])));

            comData.Add("buttons", FetchListData("1b153aca-424a-4b10-b667-002eab08a17e", Convert.ToInt32(listOptions["ListID"])));

            comData.Add("gridOptions", FetchListData("1637abd7-5369-4fd8-bc92-b2859d691cac", id)[0]);
        }

        return comData;
    }

    [WebMethod(EnableSession = true)]
    public List<Dictionary<string, object>> GetData(string target, int id, string responseToken)
    {
        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "Target is " + "$target" + " by ActivityContext : " + id);

            return LogProvider.PrepareLogResult(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateLicense();

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Interface WebService Request is invalid.", "Target is " + "$target" + " by ActivityContext : " + id);

            return LogProvider.PrepareLogResult(logID, "Interface WebService Request is invalid.", 10101);
        }

        #endregion

        string query = "select top(1) QueryText from Sys_Gui_Queries where QueryID=@QueryID";

        bool dataIsSettings = false;

        List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();

        Dictionary<string, object> dataItem = new Dictionary<string, object>();

        Dictionary<string, object> dataItemS = new Dictionary<string, object>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResult(exp.Message, 10050);
            }

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    command.Parameters.AddWithValue("@QueryID", SecurityProvider.ValidateInputGUID(target));

                    query = command.ExecuteScalar().ToString();
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
                }

                command.CommandText = string.Format(query, id);

                if (command.CommandText.Contains("Get"))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add(new SqlParameter("@ActivityContextID", id));

                    if (command.CommandText.Contains("ByUser"))
                    {
                        command.Parameters.Add(new SqlParameter("@UserID", SessionProvider.UserID));
                    }
                }

                if (command.CommandText.Contains("@UserID"))
                {
                    command.CommandText = command.CommandText.Replace("@UserID", SessionProvider.UserID.ToString());

                }

                if (command.CommandText.Contains("CurrentValue"))
                {
                    dataIsSettings = true;
                }

                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        object val;

                        while (reader.Read())
                        {
                            if (dataIsSettings)
                            {
                                if (SessionProvider.UserLanguage != "Fa" && target == "1637abd7-5369-4fd8-bc92-b2859d691cac")
                                {

                                    if (Convert.ToInt32(reader["GridSettingID"]) < 50)
                                    {
                                        dataItemS.Add(reader["Label"].ToString(), reader["DefaultValue"]);
                                    }
                                    else
                                    {
                                        dataItemS.Add(reader["Label"].ToString(), reader["CurrentValue"]);
                                    }
                                }
                                else
                                {
                                    dataItemS.Add(reader["Label"].ToString(), reader["CurrentValue"]);
                                }
                            }
                            else
                            {
                                dataItem = new Dictionary<string, object>();

                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    val = reader.GetValue(i);

                                    if (val == DBNull.Value || val == null)
                                    {
                                        dataItem.Add(reader.GetName(i), "");
                                    }
                                    else
                                    {
                                        dataItem.Add(reader.GetName(i), val);
                                    }
                                }

                                dataList.Add(dataItem);
                            }
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
                }

                if (dataIsSettings)
                {
                    dataList.Add(dataItemS);
                }

                try
                {

                    if (SessionProvider.UserLanguage != "Fa")
                    {
                        query = string.Format("select top(1) QueryName from Sys_Gui_Queries where QueryID='{0}'", SecurityProvider.ValidateInputGUID(target));

                        string entryKey = SqlDataProvider.ExecuteScalarQuery(query).ToString() + "_" + id;

                        LangEntry curEntry = null;

                        bool hasEntry = LocalizationProvider.CurrentDictionary.TryGetValue(entryKey, out curEntry);

                        for (int i = 0; i < dataList.Count; i++)
                        {
                            Dictionary<string, object> item = dataList[i];

                            if (item.ContainsKey("Label") && item.ContainsKey("Name"))
                            {
                                if (hasEntry)
                                {
                                    dataList[i]["Label"] = curEntry.Items[item["Name"].ToString()];
                                }
                                else
                                {
                                    dataList[i]["Label"] = SplitCamelCase(item["Name"], target).ToString();
                                }
                            }

                            if (item.ContainsKey("label") && item.ContainsKey("Name"))
                            {
                                if (hasEntry)
                                {
                                    dataList[i]["label"] = curEntry.Items[item["Name"].ToString()];
                                }
                                else
                                {
                                    dataList[i]["label"] = SplitCamelCase(item["Name"], target).ToString();
                                }
                            }
                        }
                    }

                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10090, exp.Message, exp.StackTrace);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10090);
                }

                dataItem = new Dictionary<string, object>();

                dataItem.Add("requestToken", SessionProvider.GenRequestToken());

                dataList.Add(dataItem);
            }
        }

        return dataList;
    }

    [WebMethod(EnableSession = true)]
    public List<Dictionary<string, object>> GetObjectData(string target, int id)
    {
        List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();

        Dictionary<string, object> dataItem = new Dictionary<string, object>();

        string tableName;

        string objectLabel;

        string entity = SecurityProvider.ValidateInput(target);

        entity = entity.Substring(0, entity.Length - 2);

        string query = "SELECT TableName FROM Sys_Entities WHERE Name=@EntityName";

        query = string.Format(query, entity);

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResult(exp.Message, 10050);
            }

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    command.Parameters.AddWithValue("@EntityName", entity);

                    tableName = command.ExecuteScalar().ToString();
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
                }

                query = "SELECT Label FROM {0} WHERE @FieldName='{1}'";

                query = string.Format(query, tableName, id);

                query = query.Replace("@FieldName", SecurityProvider.ValidateInputEng(target));

                command.CommandText = query;

                try
                {
                    objectLabel = command.ExecuteScalar().ToString();
                }
                catch
                {
                    objectLabel = "";
                }
            }
        }

        dataItem.Add("Label", objectLabel);

        dataList.Add(dataItem);

        dataItem = new Dictionary<string, object>();

        dataItem.Add("requestToken", SessionProvider.GenRequestToken());

        dataList.Add(dataItem);

        return dataList;
    }

    private List<Dictionary<string, object>> FetchListData(string target, int id)
    {
        string query = string.Format("select top(1) QueryText from Sys_Gui_Queries where QueryID='{0}'", target);

        bool dataIsSettings = false;

        List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();

        Dictionary<string, object> dataItem = new Dictionary<string, object>();

        Dictionary<string, object> dataItemS = new Dictionary<string, object>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResult(exp.Message, 10050);
            }

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    query = command.ExecuteScalar().ToString();
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
                }

                command.CommandText = string.Format(query, id);

                if (command.CommandText.Contains("Get"))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add(new SqlParameter("@ActivityContextID", id));

                    if (command.CommandText.Contains("ByUser"))
                    {
                        command.Parameters.Add(new SqlParameter("@UserID", SessionProvider.UserID));
                    }
                }

                if (command.CommandText.Contains("@UserID"))
                {
                    command.CommandText = command.CommandText.Replace("@UserID", SessionProvider.UserID.ToString());

                }

                if (command.CommandText.Contains("CurrentValue"))
                {
                    dataIsSettings = true;
                }

                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        if (!reader.HasRows && !query.Contains("@UserID"))
                        {
                            //int logID = LogProvider.LogException(10062, "Query is not returning any rows.", command.CommandText);

                            return LogProvider.PrepareLogResult(0, "Query is not returning any rows.", 10062);
                        }

                        object val;

                        while (reader.Read())
                        {
                            if (dataIsSettings)
                            {
                                if (SessionProvider.UserLanguage != "Fa" && target == "1637abd7-5369-4fd8-bc92-b2859d691cac")
                                {

                                    if (Convert.ToInt32(reader["GridSettingID"]) < 50)
                                    {
                                        dataItemS.Add(reader["Label"].ToString(), reader["DefaultValue"]);
                                    }
                                    else
                                    {
                                        dataItemS.Add(reader["Label"].ToString(), reader["CurrentValue"]);
                                    }
                                }
                                else
                                {
                                    dataItemS.Add(reader["Label"].ToString(), reader["CurrentValue"]);
                                }
                            }
                            else
                            {
                                dataItem = new Dictionary<string, object>();

                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    val = reader.GetValue(i);

                                    if (val == DBNull.Value || val == null)
                                    {
                                        dataItem.Add(reader.GetName(i), "");
                                    }
                                    else
                                    {
                                        if (val.ToString() == "@Today")
                                        {
                                            val = LocalizationProvider.GetLocalDate(DateTime.Now);
                                        }

                                        dataItem.Add(reader.GetName(i), val);
                                    }
                                }

                                dataList.Add(dataItem);
                            }
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
                }

                if (dataIsSettings)
                {
                    dataList.Add(dataItemS);
                }

                try
                {

                    if (SessionProvider.UserLanguage != "Fa")
                    {
                        query = string.Format("select top(1) QueryName from Sys_Gui_Queries where QueryID='{0}'", SecurityProvider.ValidateInputGUID(target));

                        string entryKey = SqlDataProvider.ExecuteScalarQuery(query).ToString() + "_" + id;

                        LangEntry curEntry = null;

                        bool hasEntry = LocalizationProvider.CurrentDictionary.TryGetValue(entryKey, out curEntry);

                        for (int i = 0; i < dataList.Count; i++)
                        {
                            Dictionary<string, object> item = dataList[i];

                            if (item.ContainsKey("Label") && item.ContainsKey("Name"))
                            {
                                if (hasEntry)
                                {
                                    dataList[i]["Label"] = curEntry.Items[item["Name"].ToString()];
                                }
                                else
                                {
                                    dataList[i]["Label"] = SplitCamelCase(item["Name"], target);
                                }
                            }

                            if (item.ContainsKey("label") && item.ContainsKey("Name"))
                            {
                                if (hasEntry)
                                {
                                    dataList[i]["label"] = curEntry.Items[item["Name"].ToString()];
                                }
                                else
                                {
                                    dataList[i]["label"] = SplitCamelCase(item["Name"], target);
                                }
                            }
                        }
                    }

                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10090, exp.Message, exp.StackTrace);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10090);
                }
            }
        }

        return dataList;
    }

    private List<Dictionary<string, object>> FetchListData(string query, bool encrypt)
    {
        List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();

        Dictionary<string, object> dataItem = new Dictionary<string, object>();

        Dictionary<string, object> dataItemS = new Dictionary<string, object>();

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResult(exp.Message, 10050);
            }

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        object val;

                        while (reader.Read())
                        {

                            dataItem = new Dictionary<string, object>();

                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                val = reader.GetValue(i);

                                if (val == DBNull.Value || val == null)
                                {
                                    dataItem.Add(reader.GetName(i), "");
                                }
                                else
                                {
                                    if (encrypt && reader.GetName(i) != "EnumTypeID")
                                    {
                                        dataItem.Add(reader.GetName(i), SimpleEncrypt(val.ToString()));
                                    }
                                    else
                                    {
                                        dataItem.Add(reader.GetName(i), val);
                                    }
                                }
                            }

                            dataList.Add(dataItem);
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
                }

            }
        }

        return dataList;
    }

    private string SimpleEncrypt(string value)
    {
        return Reverse(Encrypt(value));
    }

    private string Reverse(string value)
    {
        char[] charArray = value.ToCharArray();
        Array.Reverse(charArray);
        return new string(charArray);
    }

    private string Encrypt(string value)
    {
        return value.Replace(" ", "!").Replace("ا", "%").Replace("P", "#").Replace("S", "&");
    }

    public static string SplitCamelCase(object value, string qid)
    {
        const string pattern = @"[A-Z][a-z]*|[a-z]+|\d+";
        var matches = Regex.Matches(value.ToString(), pattern);

        if (qid.ToUpper() == "5756D842-1C5B-49A4-A4BF-3289A0D0DC98" || qid.ToUpper() == "83927D76-9CC9-4801-99A1-D0C9C46C0175"
             || qid.ToUpper() == "9737140E-4970-473E-BC15-D3AEF1AF4701" || qid.ToUpper() == "AAD48CCD-AB93-4E22-9A11-8E1CCE1C3574"
             || qid.ToUpper() == "45454743-B4D3-4C2C-B175-E66D251811D6" || qid.ToUpper() == "AC37140E-DC70-473E-5715-BFAEF1AF4701"
             || qid.ToUpper() == "C6B4286E-D04C-4FF2-BC08-73B764781A63" || qid.ToUpper() == "45711F3C-3487-35B0-EE9C-C438E1C23F05")
        {
            string result = "";

            foreach (Match match in matches)
            {
                if (match.Value.Length > 1)
                    result = result + match.Value + " ";
                else
                    result = result + match.Value + "";
            }

            value = result;
        }

        value = value.ToString().Replace("Management", " Management");

        value = value.ToString().Replace("Reports", " Reports");

        return value.ToString();
    }
}
