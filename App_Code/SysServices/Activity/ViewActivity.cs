// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0
using System;
using System.Web.Script.Services;
using System.Web.Services;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Text;
using System.Linq;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class ViewActivity : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public string GetDataList(int id, int draw, int start, int length, object[] columns, object[] order, object search, ActivityParam[] advancedSearch, int objKey, string responseToken)
    {
        string acccessCriteria;

        string commandText;

        string commandType;

        string orderClause = null;

        string jsonResult;

        bool dataIsExist = false;

        bool showHistoryValue = false;

        SqlDataProvider dataProvider;

        ViewActivityParams viewActivityParams;

        string columnVal;

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is" + id);

            return LogProvider.PrepareLogResultStr(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateActivityLicense(id);

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Activity WebService Request is invalid.", id);

            return LogProvider.PrepareLogResultStr(logID, "Activity WebService Request is invalid.", 10101);
        }

        try
        {
            acccessCriteria = SecurityProvider.ValidateUserAccess(id);
        }
        catch (AppException exp)
        {
            return LogProvider.PrepareLogResultStr(exp.ErrorLogID, exp.ErrorMessage, exp.ErrorCode);
        }

        #endregion

        #region Get ViewActivityInfo From Database

        if (advancedSearch != null)
        {
            var showHistoryParam = advancedSearch.FirstOrDefault(x =>
                x != null &&
                string.Equals(x.ParamName, "ShowHistory", StringComparison.OrdinalIgnoreCase)
            );

            if (showHistoryParam != null)
            {
                showHistoryValue = true; 
            }

            advancedSearch = advancedSearch
                .Where(x => x != null &&
                       !string.Equals(x.ParamName, "ShowHistory", StringComparison.OrdinalIgnoreCase))
                .ToArray();
        }
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
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        actReader.Read();

                        commandText = actReader["CommandText"].ToString();

                        commandType = actReader["CommandType"].ToString();

                        commandText = commandText.Replace("'@SessionUserID'", SessionProvider.UserID.ToString());

                        commandText = commandText.Replace("'@SessionAgentID'", SessionProvider.GetValue("AgentID"));

                        commandText = commandText.Replace("@SessionGroupID", SessionProvider.GetValue("GroupID"));

                        commandText = commandText.Replace("'@SessionCustomerID'", SessionProvider.GetValue("CustomerID"));

                        commandText = commandText.Replace("'@SessionToken'", SessionProvider.GetValue("Token"));

                        commandText = commandText.Replace("'@SessionAPL'", SessionProvider.GetValue("APL"));

                        commandText = commandText.Replace("@WorkingMonth", SessionProvider.GetValue("$WorkingMonth"));

                        commandText = commandText.Replace("@FirstDayOfMonth", SessionProvider.FirstDayOfMonth);

                        commandText = commandText.Replace("@FirstDayOfWeek", SessionProvider.FirstDayOfWeek);

                        commandText = commandText.Replace("@FirstDayOfYear", SessionProvider.FirstDayOfYear);

                        commandText = commandText.Replace("'@RedirectObjectID'", SessionProvider.GetValue("RedirectObjectID"));

                        if (showHistoryValue)
                        {
                            commandText = commandText.Replace("@showAll", "6");
                        }
                        else
                        {
                            commandText = commandText.Replace("@showAll", "1");
                        }

                        dataProvider = new SqlDataProvider(commandText, commandType);
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.StackTrace, command.CommandText, id);

                    return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                }
            }
        }

        #endregion

        #region Validation ViewActivity Parameters

        viewActivityParams = new ViewActivityParams(columns, order, search, dataProvider.PreparedQuery.FieldNames);

        string validateError = viewActivityParams.Validate();

        if (validateError != null)
        {
            int logID = LogProvider.LogException(10021, "Column or order objects is invalid.", validateError, id);

            return LogProvider.PrepareLogResultStr(logID, "Column or order objects is invalid.", 10021);
        }

        if (viewActivityParams.Order != null)
        {
            if (viewActivityParams.Order.ColumnIndex != 0)
            {
                orderClause = dataProvider.PreparedQuery.FieldNames[viewActivityParams.Columns[viewActivityParams.Order.ColumnIndex].Data] + " " + viewActivityParams.Order.OrderDir;
            }
        }

        #endregion

        try
        {
            dataProvider.ExecuteQuery(start, length, viewActivityParams.SearchClause, advancedSearch, objKey, acccessCriteria, orderClause);

            jsonResult = "{\"draw\": " + (draw + 1) + ",\"recordsTotal\": " + dataProvider.TotalRecords + ",\"recordsFiltered\": " + dataProvider.FilterdRecords + ",\"data\": [";

            foreach (var resultItem in dataProvider.Results)
            {
                jsonResult += "{";

                foreach (string columnName in resultItem.Keys)
                {
                    columnVal = Convert.ToString(resultItem[columnName]);

                    foreach (string searchKey in viewActivityParams.SearchKeywords)
                    {
                        if (!string.IsNullOrEmpty(columnVal))
                        {
                            columnVal = columnVal.Replace(searchKey, "<mark>" + searchKey + "</mark>");
                        }
                    }

                    jsonResult += "\"" + columnName + "\": \"" + columnVal + "\",";
                }

                jsonResult = jsonResult.Substring(0, jsonResult.Length - 1);

                jsonResult += "},";

                dataIsExist = true;
            }
        }
        catch (Exception exp)
        {
            int logID = LogProvider.LogException(10060, exp.StackTrace, dataProvider.FinalQueryText, objKey, id);

            return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
        }

        if (dataIsExist)
        {
            jsonResult = jsonResult.Substring(0, jsonResult.Length - 1);
        }

        jsonResult += "],\"requestToken\":" + SessionProvider.GenRequestToken() + "}";

        dataProvider.Dispose();

        dataProvider = null;

        viewActivityParams = null;

        return jsonResult;
    }

    [WebMethod(EnableSession = true)]
    public Dictionary<string, object> GetDataObject(int id, int objKey, string responseToken)
    {
        string acccessCriteria = "";

        string commandText;

        string commandType;

        string columnName;

        string query;

        SqlDataProvider dataProvider;

        var dataItem = new Dictionary<string, object>();

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is" + id);

            return LogProvider.PrepareLogResult(logID, "Session is invalid.", 10010)[0];
        }

        LicenseProvider.ValidateActivityLicense(id);

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Activity WebService Request is invalid.", id);

            return LogProvider.PrepareLogResult(logID, "Activity WebService Request is invalid.", 10101)[0];
        }

        //acccessCriteria = SecurityProvider.ValidateUserAccess(id);

        #endregion

        #region Get ViewActivityInfo From Database

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResult(exp.Message, 10050)[0];
            }

            using (var command = new SqlCommand("select * from Sys_Dev_Activities where ActivityID = " + id, connection))
            {
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        actReader.Read();

                        commandText = actReader["CommandText"].ToString();

                        commandType = actReader["CommandType"].ToString();

                        commandText = commandText.Replace("'@SessionUserID'", SessionProvider.UserID.ToString());

                        commandText = commandText.Replace("'@SessionAgentID'", SessionProvider.GetValue("AgentID"));

                        commandText = commandText.Replace("@SessionGroupID", SessionProvider.GetValue("GroupID"));

                        commandText = commandText.Replace("'@SessionCustomerID'", SessionProvider.GetValue("CustomerID"));

                        commandText = commandText.Replace("'@SessionToken'", SessionProvider.GetValue("Token"));

                        commandText = commandText.Replace("'@SessionAPL'", SessionProvider.GetValue("APL"));

                        commandText = commandText.Replace("@FirstDayOfMonth", SessionProvider.FirstDayOfMonth);

                        commandText = commandText.Replace("@FirstDayOfWeek", SessionProvider.FirstDayOfWeek);

                        commandText = commandText.Replace("@FirstDayOfYear", SessionProvider.FirstDayOfYear);

                        commandText = commandText.Replace("'@RedirectObjectID'", SessionProvider.GetValue("RedirectObjectID"));

                        dataProvider = new SqlDataProvider(commandText, commandType);
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, id);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060)[0];
                }
            }
        }

        #endregion

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResult(exp.Message, 10050)[0];
            }

            query = dataProvider.PrepareQuery(objKey, acccessCriteria);

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            if (reader.GetName(0) != "SettingName")
                            {
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    columnName = reader.GetName(i);

                                    if (columnName != "ObjKey")
                                    {
                                        if (reader.GetDataTypeName(i) == "money")
                                        {
                                            dataProvider.PreparedQuery.FieldFormats[columnName] = "LocalMoney";

                                            dataProvider.PreparedQuery.FieldUnits[columnName] = ApplicationProvider.AppCurrency;
                                        }

                                        dataItem.Add(columnName, FormatValue(reader.GetValue(i), dataProvider.PreparedQuery.FieldFormats[columnName], dataProvider.PreparedQuery.FieldUnits[columnName]));
                                    }
                                    else
                                    {
                                        dataItem.Add(columnName, reader.GetValue(i));
                                    }
                                }
                            }
                            else
                            {
                                do
                                {
                                    dataItem.Add(reader.GetValue(0).ToString(), reader.GetValue(1));

                                } while (reader.Read());
                            }

                            dataItem.Add("requestToken", SessionProvider.GenRequestToken());
                        }
                        else
                        {
                            int logID = LogProvider.LogException(10020, "Access is Denied.", query, objKey, id);

                            return LogProvider.PrepareLogResult(logID, "Access is Denied.", 10020)[0];
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                int logID = LogProvider.LogException(10060, exp.Message, exp.StackTrace, objKey, id);

                return LogProvider.PrepareLogResult(logID, exp.Message, 10060)[0];
            }

            dataProvider.Dispose();

            dataProvider = null;

            return dataItem;
        }
    }

    [WebMethod(EnableSession = true)]
    public Dictionary<string, object> GetHDataObject(int id, int objKey, string responseToken)
    {
        string acccessCriteria;

        string commandText;

        string commandType;

        string columnName;

        string query;

        SqlDataProvider dataProvider;

        var dataItem = new Dictionary<string, object>();

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is" + id);

            return LogProvider.PrepareLogResult(logID, "Session is invalid.", 10010)[0];
        }

        LicenseProvider.ValidateActivityLicense(id);

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Activity WebService Request is invalid.", id);

            return LogProvider.PrepareLogResult(logID, "Activity WebService Request is invalid.", 10101)[0];
        }

        acccessCriteria = SecurityProvider.ValidateUserAccess(id);

        #endregion

        #region Get ViewActivityInfo From Database

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResult(exp.Message, 10050)[0];
            }

            using (var command = new SqlCommand("select * from Sys_Dev_Activities where ActivityID = " + id, connection))
            {
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        actReader.Read();

                        commandText = actReader["HeaderCommandText"].ToString();

                        commandType = actReader["CommandType"].ToString();

                        commandText = commandText.Replace("'@SessionUserID'", SessionProvider.UserID.ToString());

                        commandText = commandText.Replace("'@RedirectObjectID'", SessionProvider.GetValue("RedirectObjectID"));

                        dataProvider = new SqlDataProvider(commandText, commandType);
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, id);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060)[0];
                }
            }
        }

        #endregion

        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                return LogProvider.PrepareLogResult(exp.Message, 10050)[0];
            }

            if (commandText.Contains("INSERT")) {

                query = commandText.Replace("@ObjectID", objKey.ToString());
            }
            else
            {
                query = dataProvider.PrepareQuery(objKey, acccessCriteria);
            }

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                columnName = reader.GetName(i);

                                dataItem.Add(columnName, reader.GetValue(i));
                            }
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                int logID = LogProvider.LogException(10060, exp.Message, query, objKey, id);

                return LogProvider.PrepareLogResult(logID, exp.Message, 10060)[0];
            }

            dataProvider.Dispose();

            dataProvider = null;

            return dataItem;
        }
    }

    [WebMethod(EnableSession = true)]
    public List<Dictionary<string, object>> GetDataObjects(int id, int parentObjKey, string requestDate, string responseToken)
    {
        string acccessCriteria;

        string commandText;

        string commandType;

        string columnName=null;

        string query;

        SqlDataProvider dataProvider;

        var dataItem = new Dictionary<string, object>();

        var dataList = new List<Dictionary<string, object>>();

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is" + id);

            return LogProvider.PrepareLogResult(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateActivityLicense(id);

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Activity WebService Request is invalid.", id);

            return LogProvider.PrepareLogResult(logID, "Activity WebService Request is invalid.", 10101);
        }

        acccessCriteria = SecurityProvider.ValidateUserAccess(id);

        #endregion

        #region Get ViewActivityInfo From Database

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

            using (var command = new SqlCommand("select * from Sys_Dev_Activities where ActivityID = " + id, connection))
            {
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        actReader.Read();

                        commandText = actReader["CommandText"].ToString();

                        commandType = actReader["CommandType"].ToString();

                        commandText = commandText.Replace("'@SessionUserID'", SessionProvider.UserID.ToString());

                        commandText = commandText.Replace("'@SessionAgentID'", SessionProvider.GetValue("AgentID"));

                        commandText = commandText.Replace("@SessionGroupID", SessionProvider.GetValue("GroupID"));

                        commandText = commandText.Replace("'@SessionCustomerID'", SessionProvider.GetValue("CustomerID"));

                        commandText = commandText.Replace("'@SessionToken'", SessionProvider.GetValue("Token"));

                        commandText = commandText.Replace("'@SessionAPL'", SessionProvider.GetValue("APL"));

                        commandText = commandText.Replace("@FirstDayOfMonth", SessionProvider.FirstDayOfMonth);

                        commandText = commandText.Replace("@FirstDayOfWeek", SessionProvider.FirstDayOfWeek);

                        commandText = commandText.Replace("@FirstDayOfYear", SessionProvider.FirstDayOfYear);

                        commandText = commandText.Replace("'@RedirectObjectID'", SessionProvider.GetValue("RedirectObjectID"));

                        if (requestDate != null && requestDate != "")
                        {
                            commandText = commandText.Replace("@RequestDate", Convert.ToDateTime(requestDate).ToString());
                        }

                        dataProvider = new SqlDataProvider(commandText, commandType);
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, exp.StackTrace, id);

                    return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
                }
            }
        }

        #endregion

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

            query = dataProvider.PrepareQuery(parentObjKey, acccessCriteria);

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dataItem = new Dictionary<string, object>();

                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                columnName = reader.GetName(i);

                                if (columnName != "ObjKey")
                                {
                                    if (reader.GetDataTypeName(i) == "money")
                                    {
                                        dataProvider.PreparedQuery.FieldFormats[columnName] = "LocalMoney";

                                        dataProvider.PreparedQuery.FieldUnits[columnName] = ApplicationProvider.AppCurrency;
                                    }

                                    dataItem.Add(columnName, FormatValue(reader.GetValue(i), dataProvider.PreparedQuery.FieldFormats[columnName], dataProvider.PreparedQuery.FieldUnits[columnName], columnName));
                                }
                                else
                                {
                                    dataItem.Add(columnName, reader.GetValue(i));
                                }
                            }

                            dataList.Add(dataItem);
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                int logID = LogProvider.LogException(10060, exp.Message + "[" + columnName + "]", query, parentObjKey, id);

                return LogProvider.PrepareLogResult(logID, exp.Message, 10060);
            }

            if (dataList.Count > 0)
            {
                dataList[0].Add("requestToken", SessionProvider.GenRequestToken());

                dataList[0].Add("requestDate", DateTime.Now.ToString());
            }
            else
            {
                dataList.Add(new Dictionary<string, object>());

                dataList[0].Add("requestToken", SessionProvider.GenRequestToken());

                dataList[0].Add("requestDate", DateTime.Now.ToString());
            }

            dataProvider.Dispose();

            dataProvider = null;

            return dataList;
        }
    }

    [WebMethod(EnableSession = true)]
    public string GetDataVisualization(int id, SeriesOption seriesOptions, string categoryExp, string[] seriesExps, ActivityParam[] advancedSearch, int objKey, string responseToken)
    {
        string acccessCriteria;

        string queryText;

        string queryType;

        string nValue = null;

        string catValue;

        int i = 0;

        string[] categories = new string[0];

        categoryExp = SecurityProvider.ValidateInput(categoryExp);

        categoryExp = categoryExp.Replace("&#95;", "_");

        StringBuilder jsonResult;

        SqlDataProvider dataProvider;

        List<double[]> series = new List<double[]>();

        Dictionary<string,Dictionary<string, double>> dSeries = new Dictionary<string, Dictionary<string, double>>();

        List<string> seriLables = new List<string>();

        List<string> dCategories = new List<string>();
        List<string> dGroups = new List<string>();

        List<Dictionary<string, object>> results;

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ActivityID is" + id);

            return LogProvider.PrepareLogResultStr(logID, "Session is invalid.", 10010);
        }

        LicenseProvider.ValidateActivityLicense(id);

        bool validateToken = SessionProvider.ValidateToken(responseToken);

        if (!validateToken)
        {
            int logID = LogProvider.LogException(10101, "Activity WebService Request is invalid.", id);

            return LogProvider.PrepareLogResultStr(logID, "Activity WebService Request is invalid.", 10101);
        }

        try
        {
            acccessCriteria = SecurityProvider.ValidateUserAccess(id);
        }
        catch (AppException exp)
        {
            return LogProvider.PrepareLogResultStr(exp.ErrorLogID, exp.ErrorMessage, exp.ErrorCode);
        }

        #endregion

        #region Get ViewActivityInfo From Database

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
                try
                {
                    using (var actReader = command.ExecuteReader())
                    {
                        actReader.Read();

                        queryText = actReader["CommandText"].ToString();

                        queryType = actReader["CommandType"].ToString();

                        queryText = queryText.Replace("'@SessionUserID'", SessionProvider.UserID.ToString());

                        queryText = queryText.Replace("'@SessionAgentID'", SessionProvider.GetValue("AgentID"));

                        queryText = queryText.Replace("@SessionGroupID", SessionProvider.GetValue("GroupID"));

                        queryText = queryText.Replace("'@SessionCustomerID'", SessionProvider.GetValue("CustomerID"));

                        queryText = queryText.Replace("'@SessionToken'", SessionProvider.GetValue("Token"));

                        queryText = queryText.Replace("'@SessionAPL'", SessionProvider.GetValue("APL"));

                        queryText = queryText.Replace("@FirstDayOfMonth", SessionProvider.FirstDayOfMonth);

                        queryText = queryText.Replace("@FirstDayOfWeek", SessionProvider.FirstDayOfWeek);

                        queryText = queryText.Replace("@FirstDayOfYear", SessionProvider.FirstDayOfYear);

                        queryText = queryText.Replace("'@RedirectObjectID'", SessionProvider.GetValue("RedirectObjectID"));

                        queryText = queryText.Replace("@FromDate", SessionProvider.GetValue("DF$FromDate"));

                        queryText = queryText.Replace("@ToDate", SessionProvider.GetValue("DF$ToDate"));

                        dataProvider = new SqlDataProvider(queryText, queryType);
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, command.CommandText, id);

                    return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                }
            }
        }

        #endregion

        try
        {
            #region seriesOptions Type is "Simple" or "Composite"

            if (seriesOptions.Type == "Simple" || seriesOptions.Type == "Composite" || seriesOptions.Type == "Stack")
            {
                dataProvider.ExecuteQuery(advancedSearch, objKey, acccessCriteria, null);//categoryExp

                results = dataProvider.Results;
                
                categories = new string[results.Count];

                for (int j = 0; j < seriesExps.Length; j++)
                {
                    series.Add(new double[results.Count]);

                    seriLables.Add(seriesExps[j]);
                }

                i = 0;

                foreach (var resultItem in dataProvider.Results)
                {
                    
                    categories[i] = resultItem[categoryExp].ToString();

                    for (int j = 0; j < seriesExps.Length; j++)
                    {
                        series[j][i] = Convert.ToDouble(resultItem[seriesExps[j]]);
                    }

                    i++;
                }
            }

            #endregion

            #region seriesOptions Type is "ColumnGroup" or "TimePrioied"

            if (seriesOptions.Type == "ColumnGroup" || seriesOptions.Type == "TimePrioied")
            {
                dataProvider.ExecuteQuery(advancedSearch, objKey, acccessCriteria, categoryExp + "," + seriesOptions.GroupingExpression);

                results = dataProvider.Results;

                i = -1;

                foreach (var resultItem in dataProvider.Results)
                {
                    nValue = Convert.ToString(resultItem[seriesOptions.GroupingExpression]);

                    catValue = resultItem[categoryExp].ToString();

                    if (!dCategories.Contains(catValue))
                    {
                        dCategories.Add(catValue);
                    }

                    if (!dGroups.Contains(nValue))
                    {
                        dSeries.Add(nValue, new Dictionary<string, double>());
                   
                        seriLables.Add(nValue);
                        dGroups.Add(nValue);

                        dSeries[nValue].Add(resultItem[categoryExp].ToString(), Convert.ToDouble(resultItem[seriesExps[0]]));
                    }
                    else
                    {
                        dSeries[nValue].Add(resultItem[categoryExp].ToString(), Convert.ToDouble(resultItem[seriesExps[0]]));
                    }
                }

                #region TimePrioiedType Type is  Yearly

                if (seriesOptions.TimePrioiedType == "Yearly")
                {
                    for (int k = 1; k < 13; k++)
                    {
                        if (!dCategories.Contains(k.ToString()))
                        {
                            dCategories.Add(k.ToString());
                        }
                    }
                }

                #endregion

                #region TimePrioiedType Type is  Monthly, RangeOfDay

                if (seriesOptions.TimePrioiedType == "Monthly" || seriesOptions.TimePrioiedType == "RangeOfDay")
                {
                    for (int k = 1; k < 32; k++)
                    {
                        if (!dCategories.Contains(k.ToString()))
                        {
                            dCategories.Add(k.ToString());
                        }
                    }
                }

                #endregion

                i = 0;

                foreach (Dictionary<string, double> dSeri in dSeries.Values)
                {
                    series.Add(new double[dCategories.Count]);

                    int j = 0;

                    foreach (string dCategory in dCategories)
                    {
                        if (dSeri.ContainsKey(dCategory))
                        {
                            series[i][j] = dSeri[dCategory];
                        }
                        else
                        {
                            series[i][j] = 0;
                        }

                        j++;
                    }

                    i++;
                }

                i = 0;

                categories = new string[dCategories.Count];

                foreach (string dCategory in dCategories)
                {
                    categories[i] = dCategory;

                    i++;
                }
            }

            #endregion

        }
        catch (Exception exp)
        {
            int logID = LogProvider.LogException(10060, exp.Message, exp.StackTrace + "[" + dataProvider.PreparedQuery + "]", id);

            return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
        }

        jsonResult = new StringBuilder("");

        jsonResult.Append("{\"data\": {");

        {
            jsonResult.Append("\"categories\":[");

            foreach (string category in categories)
            {
                jsonResult.Append("\"" + category + "\",");
            }

            jsonResult.Append("],\"series\":[");

            i = 0;

            foreach (double[] seri in series)
            {
                jsonResult.Append("{\"name\":\"" + seriLables[i] + "\",\"data\":[");

                int j = 0;

                foreach (double val in seri)
                {
                    jsonResult.Append("{\"name\":\"" + categories[j] + "\",\"y\":" + val + "},");

                    j++;
                }

                jsonResult.Append("]},");

                i++;
            }

            jsonResult.Append("]");
        }

        jsonResult.Append("},\"requestToken\":" + SessionProvider.GenRequestToken() + "}");

        categories = null;

        dataProvider.Dispose();

        dataProvider = null;

        series = null;

        dSeries = null;

        seriLables = null;

        dCategories = null;

        results = null;

        return jsonResult.Replace("},]", "}]").Replace(",]", "]").ToString();
    }

    private string FormatValue(object value, string format, string unit)
    {
        //DateTime datetime;

        //if (DateTime.TryParse(Convert.ToString(value), out datetime))
        //{
        //    return LocalizationProvider.GetLocalDateTime(datetime);
        //}

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

            return (time / 60 < 100 ? "0" + (time / 60 < 10 ? "0" + (time / 60).ToString() : (time / 60).ToString()) : (time / 60).ToString()) + ":" + (time % 60 < 10 ? "0" + (time % 60).ToString() : (time % 60).ToString());
        }

        if (format == "LocalMoney")
        {
            return LocalizationProvider.GetLocalMoney(value) + " " + unit;
        }

        if (format == "Hidden")
        {
            return "************";
        }

        if (format == "File" || format == "Image")
        {
            if (value.ToString().Contains("base64"))
            {
                return "<img style='object-fit:contain; width: 100 %; height: 100 %' src='" + value + "' />";
            }
            else
            {
                return "<span class='btn-download-grid fa fa-download' data-file-attach-code='" + value.ToString() + "' title='" + Localize("دانلود فایل") + "'>&nbsp;&nbsp;<a class='btn-download-grid-link'>" + Localize("دانلود فایل") + "</a></span>";
            }
        }

        if (format == "Image2")
        {
            if (value.ToString().Contains("base64"))
            {
                return "<img style='object-fit:contain; width: 100 %; height: 100 %' src='" + value + "' />";
            }
            else
            {
                return "<img class='btn-download-grid fa fa-download'  data-file-attach-code='" + value.ToString() + "' title='" + Localize("دانلود فایل") + "' src='./App_Res/Upload/Process/" + value.ToString() + "' />";
            }
        }

        return value.ToString() + " " + unit;
    }

    private string FormatValue(object value, string format, string unit, string name)
    {
        //DateTime datetime;

        //if (DateTime.TryParse(Convert.ToString(value), out datetime))
        //{
        //    return LocalizationProvider.GetLocalDateTime(datetime);
        //}

        //Special Name
        if (name == "DurationTime")
        {
            if (Convert.ToString(value) == null || Convert.ToString(value) == "" || value == DBNull.Value)
            {
                return Convert.ToString(value);
            }

            int time = Convert.ToInt32(value);

            if (time == 0)
            {
                return "";
            }

            if (time < 60)
            {
                return time + Localize(" دقیقه");
            }

            if (time % 60 == 0)
            {
                return (time / 60) + Localize(" ساعت");
            }

            return (time / 60) + Localize(" ساعت و ") + (time % 60) + Localize(" دقیقه");

        }

        if (name == "CreateDate")
        {
            return LocalizationProvider.GetLocalDateTime(value);
        }

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

        if (format == "Hidden")
        {
            return "************";
        }

        if (format == "File")
        {
            return "<span class='btn-download-grid fa fa-download' data-file-attach-code='" + value.ToString() + "' title='" + Localize("دانلود فایل") + "'>&nbsp;&nbsp;<a class='btn-download-grid-link'>" + Localize("دانلود فایل") + "</a></span>";
        }

        if (format == "Image")
        {
            string path = "./App_Res/Upload/Process/";
            path = Convert.ToString(SqlDataProvider.ExecuteScalarQuery("select LocationPath from Sys_AttachFiles where AttachCode='" + value + "'"));
            path = path.Replace("../../App_Res", "./App_Res");

            return "<img class='btn-download-grid fa fa-download'  data-file-attach-code='" + value.ToString() + "' title='" + Localize("دانلود فایل") + "' style='object-fit: cover;width: 70px;height: 70px; ' src='" + path + value.ToString() + "' />";
        }

        return value.ToString() + " " + unit;
    }

    private string Localize(string value)
    {
        if (SessionProvider.UserLanguage == "Ar")
        {
            switch (value)
            {
                case "دانلود فایل": return "قم بتنزيل ملف";
                case " دقیقه": return " دقيقة";
                case " ساعت": return " ساعة";
                case " ساعت و ": return " ساعة و ";
            }
        }

        if (SessionProvider.UserLanguage != "Fa")
        {
            switch (value)
            {
                case "دانلود فایل": return "Download File";
                case " دقیقه": return " minutes";
                case " ساعت": return " hours";
                case " ساعت و ": return " hours and ";
            }
        }

        return value;
    }

    private class ViewActivityParams
    {
        public List<ColumnParam> Columns = new List<ColumnParam>();

        public string QuickSearchValue;

        public OrderParam Order = null;

        public Dictionary<string, string> Fields;

        public ViewActivityParams(object[] columns, object[] order, object search, object fields)
        {
            for (int i = 0; i < columns.Length; i++)
            {
                Dictionary<string, object> colObj = (Dictionary<string, object>)columns[i];

                this.Columns.Add(new ColumnParam(colObj["data"], colObj["name"], colObj["orderable"], colObj["searchable"]));
            }

            if (order.Length > 0)
            {
                Dictionary<string, object> orderObj = (Dictionary<string, object>)order[0];

                this.Order = new OrderParam(orderObj["column"], orderObj["dir"]);
            }

            Dictionary<string, object> searchObj = (Dictionary<string, object>)search;

            this.QuickSearchValue = SecurityProvider.ValidateInput(searchObj["value"].ToString());

            this.Fields = (Dictionary<string, string>)fields;
        }

        internal string Validate()
        {
            int result = 0;

            foreach (ColumnParam col in this.Columns)
            {
                if (!int.TryParse(col.Data, out result))
                {
                    if (!this.Fields.ContainsKey(col.Data) && col.Data != "RowNum")
                    {
                        return col.Data;
                    }
                }
            }

            if (this.Order != null)
            {
                if (this.Columns.Count < this.Order.ColumnIndex + 1)
                {
                    return this.Order.ColumnIndex.ToString();
                }

                if (this.Order.OrderDir != "asc" && this.Order.OrderDir != "desc" && this.Order.OrderDir != "")
                {
                    return this.Order.OrderDir;
                }
            }

            return null;
        }

        public string SearchClause
        {
            get
            {
                string searchClause = "   ";

                int result = 0;

                if (this.QuickSearchValue.Trim() == "")
                {
                    return "";
                }

                this.QuickSearchValue = NormalizeValue(this.QuickSearchValue).Trim().Replace(" ", "%");

                foreach (ColumnParam col in this.Columns)
                {
                    if (col.Searchable && !int.TryParse(col.Data, out result))
                    {
                        if (this.QuickSearchValue.Contains("@"))
                        {
                            searchClause += " (";

                            foreach (string searchKey in this.QuickSearchValue.Split('@'))
                            {
                                if (!string.IsNullOrEmpty(searchKey))
                                {
                                    searchClause += this.Fields[col.Data] + " LIKE N'%" + (searchKey.Length > 50 ? searchKey.Substring(0, 50) : searchKey) + "%' AND ";

                                    SearchKeywords.Add(searchKey);
                                }
                            }

                            searchClause += " 1=1) OR ";
                        }
                        else
                        {
                            searchClause += " (" + this.Fields[col.Data] + " LIKE N'%" + (this.QuickSearchValue.Length > 100 ? this.QuickSearchValue.Substring(0, 100) : this.QuickSearchValue) + "%') OR ";
                        }
                    }
                }

                return searchClause.Substring(0, searchClause.Length - 3);
            }
        }

        public List<string> SearchKeywords = new List<string>();

        public string SelectClause
        {
            get
            {
                string selectClause = "";

                int result = 0;

                foreach (ColumnParam col in this.Columns)
                {
                    if (!int.TryParse(col.Data, out result))
                    {
                        selectClause += this.Fields[col.Data] + " AS " + col.Data + ",";
                    }
                }

                return selectClause;
            }
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
    }

    private class ColumnParam
    {
        public string Data;

        public string Name;

        public bool Orderable;

        public bool Searchable;

        public ColumnParam(object data, object name, object orderable, object searchable)
        {
            this.Data = data.ToString();

            this.Name = name.ToString();

            this.Orderable = Convert.ToBoolean(orderable);

            this.Searchable = Convert.ToBoolean(searchable);
        }
    }
}
