// Code File(Amnpardaz Software Co. Copyright 2021 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.6.0.0 
using System;
using System.Collections.Generic;
using System.Web.Script.Services;
using System.Web.Services;
using System.Data.SqlClient;
using System.Text.RegularExpressions;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class Action : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public List<Dictionary<string, object>> GetListData(int id, int activityID, object q, ActionParam[] filters, string responseToken)
    {
        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActionControlID is " + id + " by ActivityID : " + activityID);

            return LogProvider.PrepareLogResult(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateLicense();

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Action WebService Request is invalid.", "ActionControlID is " + id + " by ActivityID : " + activityID);

            return LogProvider.PrepareLogResult(logID, "Action WebService Request is invalid.", 10101);
        }

        try
        {
            SecurityProvider.ValidateUserAccess(activityID);
        }
        catch (AppException exp)
        {
            return LogProvider.PrepareLogResult(exp.ErrorLogID, exp.ErrorMessage, exp.ErrorCode);
        }

        #endregion

        string acccessCriteria;

        string activityParamName;

        string valueFieldName;

        string commandText;

        string commandType;

        string query;

        string searchValue;

        string displayFiledName = "";

        string displayMode = "";

        string groupingFiledName = "";

        string subtextFiledName = "";

        string customContent = "";

        string iconFiledName = "";

        string content = "";

        bool dividerEnable = false;

        bool iconEnable = false;

        bool groupingEnable = false;

        int actionID = 0;

        Regex regex = new Regex("{.*?}");

        MatchCollection matches = null;

        SqlDataProvider dataProvider;

        List<string> contentFieldNames = new List<string>();

        Dictionary<string, object> dataItem = new Dictionary<string, object>();

        List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();

        #region Get ViewActionInfo From Database

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

            query = "select Sys_Dev_ActivityParams.Name, Sys_Dev_Actions.ActionID, Sys_Dev_Actions.CommandText, Sys_Dev_Actions.CommandType, Sys_Gui_ActionContexts.ValueFieldName  from Sys_Dev_ActivityParams inner join Sys_Dev_Actions on Sys_Dev_ActivityParams.ReferEntityID = Sys_Dev_Actions.EntityID inner join Sys_Gui_ActionContexts on Sys_Dev_Actions.ActionID = Sys_Gui_ActionContexts.ActionID inner join Sys_Gui_ActionControls on Sys_Gui_ActionContexts.ActionContextID = Sys_Gui_ActionControls.ActionContextID where ActivityID = " + activityID + " and Sys_Gui_ActionControls.ActionControlID = " + id;

            if (activityID == 0)
            {
                query = @"SELECT 
                             Sys_Dev_ActivityParams.Name, 
                             Sys_Dev_Actions.ActionID, 
                             Sys_Dev_Actions.CommandText, 
                             Sys_Dev_Actions.CommandType, 
                             Sys_Gui_ActionContexts.ValueFieldName  
                         FROM 
                             Sys_Dev_Actions 
                         LEFT JOIN 
                             Sys_Dev_ActivityParams 
                             ON Sys_Dev_ActivityParams.ReferEntityID = Sys_Dev_Actions.EntityID 
                         INNER JOIN 
                             Sys_Gui_ActionContexts 
                             ON Sys_Dev_Actions.ActionID = Sys_Gui_ActionContexts.ActionID 
                         INNER JOIN 
                             Sys_Gui_ActionControls 
                             ON Sys_Gui_ActionContexts.ActionContextID = Sys_Gui_ActionControls.ActionContextID
                        	  where Sys_Gui_ActionControls.ActionControlID = " + id;
            }


            if (activityID >= 3000000 && activityID <= 5000000)
            {
                query = "select Sys_Rpt_ReportParams.Name, Sys_Dev_Actions.ActionID, Sys_Dev_Actions.CommandText, Sys_Dev_Actions.CommandType, Sys_Gui_ActionContexts.ValueFieldName  from Sys_Rpt_ReportParams inner join Sys_Dev_Actions on Sys_Rpt_ReportParams.ReferEntityID = Sys_Dev_Actions.EntityID inner join Sys_Gui_ActionContexts on Sys_Dev_Actions.ActionID = Sys_Gui_ActionContexts.ActionID inner join Sys_Gui_ActionControls on Sys_Gui_ActionContexts.ActionContextID = Sys_Gui_ActionControls.ActionContextID where ReportID = " + activityID + " and Sys_Gui_ActionControls.ActionControlID = " + id;
            }

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        activityParamName = "'" + Convert.ToString(reader["Name"]) + "'";

                        actionID = Convert.ToInt32(reader["ActionID"]);

                        valueFieldName = reader["ValueFieldName"].ToString();

                        commandText = reader["CommandText"].ToString();

                        commandType = reader["CommandType"].ToString();

                        searchValue = SecurityProvider.ValidateInput(q.ToString().Trim());

                        searchValue = searchValue.Replace(" ", "%");

                        searchValue = searchValue.Length > 100 ? searchValue.Substring(0, 100) : searchValue;

                        commandText = commandText.Replace("@SearchValue", NormalizeValue(searchValue));

                        foreach (ActionParam filter in filters)
                        {
                            commandText = commandText.Replace("@" + filter.Name, Convert.ToInt32(filter.Value).ToString());
                        }

                        dataProvider = new SqlDataProvider(commandText, commandType);
                    }

                    command.CommandText = "select * from Sys_Gui_Ctl_SelectLists where ActionControlID = " + id;

                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        displayFiledName = reader["DisplayFiledName"].ToString();

                        displayMode = Convert.ToString(reader["DisplayMode"]);

                        dividerEnable = Convert.ToBoolean(reader["DividerEnable"]);

                        iconEnable = Convert.ToBoolean(reader["IconEnable"]);

                        groupingEnable = Convert.ToBoolean(reader["GroupingEnable"]);

                        groupingFiledName = Convert.ToString(reader["GroupingFiledName"]);

                        subtextFiledName = Convert.ToString(reader["SubtextFiledName"]);

                        customContent = Convert.ToString(reader["CustomContent"]);

                        iconFiledName = Convert.ToString(reader["IconFiledName"]);

                        if (displayMode == "Content")
                        {
                            matches = regex.Matches(customContent);

                            foreach (var match in matches)
                            {
                                contentFieldNames.Add(match.ToString().Substring(1, match.ToString().Length - 2));
                            }
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText + "[" + exp.StackTrace + "]");

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
                }
            }
        }

        #endregion

        acccessCriteria = SecurityProvider.ValidateUserAccess(activityID, activityParamName);

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

            query = dataProvider.PrepareQuery(0, acccessCriteria);

            query = query.Replace("'@SessionUserID'", SessionProvider.UserID.ToString());

            query = query.Replace("'@SessionAgentID'", SessionProvider.GetValue("AgentID"));

            query = query.Replace("@SessionGroupID", SessionProvider.GetValue("GroupID"));

            query = query.Replace("'@SessionCustomerID'", SessionProvider.GetValue("CustomerID"));

            query = query.Replace("'@SessionAPL'", SessionProvider.GetValue("APL"));

            query = query.Replace("@WorkingMonth", SessionProvider.GetValue("$WorkingMonth"));

            query = query.Replace("@FirstDayOfMonth", SessionProvider.FirstDayOfMonth);

            query = query.Replace("@FirstDayOfWeek", SessionProvider.FirstDayOfWeek);

            query = query.Replace("@FirstDayOfYear", SessionProvider.FirstDayOfYear);

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dataItem = new Dictionary<string, object>();

                            dataItem.Add("value", NormalizeValue2(reader[valueFieldName].ToString()));

                            dataItem.Add("text", FormatValue(NormalizeValue2(reader[displayFiledName].ToString()), dataProvider.PreparedQuery.FieldFormats[displayFiledName], dataProvider.PreparedQuery.FieldUnits[displayFiledName]));

                            dataItem.Add("label", dataItem["text"]);

                            if (groupingEnable)
                            {
                                dataItem.Add("group", reader[groupingFiledName]);
                            }
                            else
                            {
                                dataItem.Add("group", "");
                            }

                            if (iconEnable)
                            {
                                dataItem.Add("icon", reader[iconFiledName]);
                            }
                            else
                            {
                                dataItem.Add("icon", "");
                            }

                            if (displayMode == "Subtext")
                            {
                                dataItem.Add("subtext", " [ " + reader[subtextFiledName] + " ]");
                            }
                            else
                            {
                                dataItem.Add("subtext", "");
                            }

                            if (displayMode == "Content")
                            {
                                content = customContent;

                                foreach (string fieldName in contentFieldNames)
                                {
                                    content = content.Replace("{" + fieldName + "}", Convert.ToString(reader[fieldName]));
                                }

                                dataItem.Add("content", content);
                            }
                            else
                            {
                                dataItem.Add("content", "");
                            }

                            dataItem.Add("breakline", false);

                            dataList.Add(dataItem);

                            if (dividerEnable)
                            {
                                dataItem = new Dictionary<string, object>();

                                dataItem.Add("value", "");

                                dataItem.Add("text", "");

                                dataItem.Add("group", "");

                                dataItem.Add("icon", "");

                                dataItem.Add("subtext", "");

                                dataItem.Add("content", "");

                                dataItem.Add("breakline", true);

                                dataList.Add(dataItem);
                            }
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
                }
            }
        }

        dataItem = new Dictionary<string, object>();

        dataItem.Add("requestToken", SessionProvider.GenRequestToken());

        dataList.Add(dataItem);

        dataProvider.Dispose();

        dataProvider = null;

        return dataList;
    }

    [WebMethod(EnableSession = true)]
    public List<Dictionary<string, object>> GetAutoCompleteData(int id, int activityID, object q, object p, object actionControlID, string responseToken)
    {
        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "EntityAttributeID is " + id + " by ActivityID : " + activityID);

            return LogProvider.PrepareLogResult(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateLicense();

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Action WebService Request is invalid.", "EntityAttributeID is " + id + " by ActivityID : " + activityID);

            return LogProvider.PrepareLogResult(logID, "Action WebService Request is invalid.", 10101);
        }

        try
        {
            SecurityProvider.ValidateUserAccess(activityID);
        }
        catch (AppException exp)
        {
            return LogProvider.PrepareLogResult(exp.ErrorLogID, exp.ErrorMessage, exp.ErrorCode);
        }

        #endregion

        string searchValue = SecurityProvider.ValidateInput(q.ToString().Trim()).Replace(" ", "%");

        searchValue = searchValue.Length > 100 ? searchValue.Substring(0, 100) : searchValue;

        string parentValue = SecurityProvider.ValidateInput(Convert.ToString(p));

        string query = "select N'select dbo.NString2(' + Name + N') as Value from ' + ( select TableName from Sys_Entities where EntityID=t.EntityID ) + N' where '+ Name +N' like N''%" + NormalizeValue(searchValue) + "%'' group by ' + Name as Query  from Sys_EntityAttributes as t where EntityAttributeID = " + id;

        List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();

        Dictionary<string, object> dataItem = new Dictionary<string, object>();

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
                if (actionControlID != null && Convert.ToString(actionControlID) != string.Empty && Convert.ToString(actionControlID) != "0")
                {
                    try
                    {
                        command.CommandText = "select CommandText from Sys_Dev_Actions where ActionID=" + Convert.ToInt32(actionControlID);

                        query = command.ExecuteScalar().ToString();
                    }
                    catch (Exception exp)
                    {
                        int logID = LogProvider.LogException(10060, exp.Message, query);

                        return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
                    }

                    query = query.Replace("@SearchValue", NormalizeValue(searchValue));

                    query = query.Replace("@ParentValue", Convert.ToInt32(parentValue).ToString());

                    command.CommandText = query;
                }
                else
                {
                    using (var reader = command.ExecuteReader())
                    {
                        if (!reader.HasRows)
                        {
                            int logID = LogProvider.LogException(10062, "Query is not returning any rows.", command.CommandText);

                            return LogProvider.PrepareLogResult(logID, "Query is not returning any rows.", 10062);
                        }
                        else
                        {
                            reader.Read();

                            query = reader["Query"].ToString();
                        }
                    }

                    command.CommandText = query;
                }

                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dataItem = new Dictionary<string, object>();

                            dataItem.Add("value", reader["Value"].ToString());

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

        dataItem = new Dictionary<string, object>();

        dataItem.Add("requestToken", SessionProvider.GenRequestToken());

        dataList.Add(dataItem);

        return dataList;
    }

    [WebMethod(EnableSession = true)]
    public List<Dictionary<string, object>> GetEnumData(int id, string responseToken)
    {
        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "EnumTypeID is " + id);

            return LogProvider.PrepareLogResult(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateLicense();

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Action WebService Request is invalid.", "EnumTypeID is " + id);

            return LogProvider.PrepareLogResult(logID, "Action WebService Request is invalid.", 10101);
        }

        #endregion

        object enumViewName = SqlDataProvider.ExecuteScalarQuery("select EnumViewName from Sys_EnumTypes where EnumTypeID = " + id);

        string query = string.Empty;

        if (enumViewName == DBNull.Value || string.IsNullOrEmpty(Convert.ToString(enumViewName)))
        {
            query = "select * from Sys_EnumValues where EnumTypeID = " + id + " and Enabled = 1";
        }
        else
        {
            query = "select 0 EnumTypeID, * from " + enumViewName + " where Enabled = 1 and _IsDeleted = 0 order by 1";
        }

        query = query.Replace("'@SessionUserID'", SessionProvider.UserID.ToString());

        query = query.Replace("'@SessionAgentID'", SessionProvider.GetValue("AgentID"));

        query = query.Replace("@SessionGroupID", SessionProvider.GetValue("GroupID"));

        query = query.Replace("'@SessionCustomerID'", SessionProvider.GetValue("CustomerID"));

        query = query.Replace("'@SessionAPL'", SessionProvider.GetValue("APL"));

        query = query.Replace("@FirstDayOfMonth", SessionProvider.FirstDayOfMonth);

        query = query.Replace("@FirstDayOfWeek", SessionProvider.FirstDayOfWeek);

        query = query.Replace("@FirstDayOfYear", SessionProvider.FirstDayOfYear);

        List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();

        Dictionary<string, object> dataItem = new Dictionary<string, object>();

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
                        while (reader.Read())
                        {
                            dataItem = new Dictionary<string, object>();

                            dataItem.Add("EnumTypeID", reader["EnumTypeID"].ToString());

                            dataItem.Add("value", reader["Value"].ToString());

                            dataItem.Add("label", reader["Label"].ToString());

                            dataList.Add(dataItem);
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
                }
            }
        }

        dataItem = new Dictionary<string, object>();

        dataItem.Add("requestToken", SessionProvider.GenRequestToken());

        dataList.Add(dataItem);

        return dataList;
    }

    private string FormatValue(object value, string format, string unit)
    {
        if (string.IsNullOrEmpty(format) || Convert.ToString(value) == null || Convert.ToString(value) == "" || value == DBNull.Value)
        {
            if (value != null && value != DBNull.Value)
            {
                value = value.ToString().Replace("\n", "<br/>");
            }

            return Convert.ToString(value);
        }

        if (format == "LocalDate")
        {
            return LocalizationProvider.GetLocalDate(value);
        }

        if (format == "LocalDateTime")
        {
            return LocalizationProvider.GetLocalDateTime(value);
        }

        if (format == "Time" || format == "ShortTime")
        {
            int time = Convert.ToInt32(value);

            return (time / 60 < 10 ? "0" + (time / 60).ToString() : (time / 60).ToString()) + ":" + (time % 60 < 10 ? "0" + (time % 60).ToString() : (time % 60).ToString());
        }

        if (format == "LongTime")
        {
            int time = Convert.ToInt32(value);

            return (time / 60 < 100 ? "0" + (time / 60).ToString() : (time / 60).ToString()) + ":" + (time % 60 < 10 ? "0" + (time % 60).ToString() : (time % 60).ToString());
        }

        if (format == "LocalMoney")
        {
            return LocalizationProvider.GetLocalMoney(value) + " " + unit;
        }

        return value.ToString() + " " + unit;
    }

    private string NormalizeValue(string str)
    {
        str = str.Replace("ڪ", "ک");
        str = str.Replace("ك", "ک");
        str = str.Replace("ﻚ", "ک");

        str = str.Replace("ي", "ی");
        str = str.Replace("ﻲ", "ی");

        return str;
    }

    private string NormalizeValue2(string str)
    {
        str = str.Replace("&#x23;", "#");
        str = str.Replace("&#x3B;", ";");
        str = str.Replace("&amp;", "&");
        str = str.Replace("&lt;", "<");
        str = str.Replace("&gt;", ">");
        str = str.Replace("&quot;", "\"");
        str = str.Replace("&#x27;", "\\");
        str = str.Replace("&#x2F;", "/");
        str = str.Replace("&#x3F;", "?");
        str = str.Replace("&iquest;", "¿");
        str = str.Replace("&#x7B;", "{");
        str = str.Replace("&#x7D;", "}");
        str = str.Replace("&#x5B;", "[");
        str = str.Replace("&#x5D;", "]");
        str = str.Replace("&ldquo;", "“");
        str = str.Replace("&rdquo;", "”");
        str = str.Replace("&#x91;", "‘");
        str = str.Replace("&#x92;", "’");
        str = str.Replace("&#x60;", "`");
        str = str.Replace("&acute;", "´");
        str = str.Replace("&#x25;", "%");
        str = str.Replace("&#x3D;", "=");
        str = str.Replace("&bdquo;", "„");
        str = str.Replace("&#x2B;", "+");
        str = str.Replace("&#40;", "(");
        str = str.Replace("&#x29;", ")");
        str = str.Replace("&#x24;", "$");
        str = str.Replace("&copy;", "@");
        str = str.Replace("&#x2A;", "*");
        str = str.Replace("&tilde;", "~");
        str = str.Replace("&sbquo;", ",");
        str = str.Replace("&#x5C;", "\\");
        str = str.Replace("&#x3A;", ":");
        str = str.Replace("&#124;", "|");
        str = str.Replace("&#33;", "!");
        str = str.Replace("&frac14;", "¼");
        str = str.Replace("&frac12;", "½");
        str = str.Replace("&frac34;", "¾");
        str = str.Replace("&ndash;", "-");
        str = str.Replace("&#95;", "_");

        return str;
    }

    public class ActionParam
    {
        public string Name;

        public string Value;

        public ActionParam()
        {
        }
    }
}


