// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

public class SqlDataProvider
{
    private string queryText;

    private string subQueryText = null;

    private string queryType;

    private string totalRecordsQuery;

    private string filterdRecordsQuery;

    private List<QueryInfo> preparedQueries = new List<QueryInfo>();

    private Dictionary<string, Dictionary<string, object>> results = new Dictionary<string, Dictionary<string, object>>();

    private Dictionary<string, AttributeInfo> attributeInfos = new Dictionary<string, AttributeInfo>();

    public int TotalRecords;

    public int FilterdRecords;

    public string FinalQueryText;

    public string ObjKeyName;

    public static SqlConnection DbConnection
    {
        get
        {
            return new SqlConnection(@"Data Source=" + ConfigurationManager.AppSettings["DatabaseServer"] + ";Initial Catalog=" + ConfigurationManager.AppSettings["DatabaseName"] + ";User ID=apuser;Password=pbTkWsUnPq1Vhh9RcjDw!57zsUQ2ioDBRLCJZrqH0@9ZSZQ62vBd0NKxFsBjDP#;MultipleActiveResultSets=true;Connection Timeout=0");
        }
    }

    public QueryInfo PreparedQuery
    {
        get
        {
            return this.preparedQueries[0];
        }
    }

    public List<Dictionary<string, object>> Results = new List<Dictionary<string, object>>();

    public DataTable ResultTable = new DataTable();

    #region Contractors

    public SqlDataProvider(string queryText, string queryType)
    {
        this.queryText = queryText;

        this.queryType = queryType;

        this.ParsQuery();
    }

    public SqlDataProvider(string subQueryText, string queryText, string queryType)
    {
        this.queryText = queryText;

        this.subQueryText = subQueryText;

        this.queryType = queryType;

        this.ParsQuery();
    }

    #endregion
     
    #region Static Methods

    public static object ExecuteScalarQuery(string query)
    {
        object result = null;

        using (var connection = DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new Exception(exp.Message);
            }

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    result = Convert.ToString(command.ExecuteScalar());
                }
            }
            catch (Exception exp)
            {
                LogProvider.LogException(10060, exp.Message, query);

                throw new Exception(exp.Message);
            }

            return result;
        }
    }

    public static int ExecuteScalarQuery2(string query)
    {
        int result = 0;

        int i = 0;

        using (var connection = DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new Exception(exp.Message);
            }

            try
            {
                query = query.Replace("@FirstDayOfMonth", SessionProvider.FirstDayOfMonth);

                query = query.Replace("@FirstDayOfWeek", SessionProvider.FirstDayOfWeek);

                query = query.Replace("@FirstDayOfYear", SessionProvider.FirstDayOfYear);

                query = query.Replace("'@SessionUserID'", SessionProvider.UserID.ToString());

                query = query.Replace("'@SessionAgentID'", SessionProvider.GetValue("AgentID"));

                query = query.Replace("@SessionGroupID", SessionProvider.GetValue("GroupID"));

                query = query.Replace("'@SessionCustomerID'", SessionProvider.GetValue("CustomerID"));

                query = query.Replace("'@SessionAPL'", SessionProvider.GetValue("APL"));

                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result = reader.GetInt32(0);

                            i++;
                        }

                        if (i != 1)
                            result = i;

                    }
                }
            }
            catch (Exception exp)
            {
                LogProvider.LogException(10060, exp.Message, query);

                throw new Exception(exp.Message);
            }

            return result;
        }
    }

    public static void ExecuteNoneQuery(string query)
    {
        using (var connection = DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new Exception(exp.Message);
            }

            try
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception exp)
            {
                LogProvider.LogException(10060, exp.Message, query);

                throw new Exception(exp.Message);
            }
        }
    }

    public static List<object> ExecuteRowQuery(string query)
    {
        List<object> rowData = new List<object>();

        using (var connection = DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new Exception(exp.Message);
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
                                rowData.Add(reader.GetValue(i));
                            }
                        }
                        else
                        {
                            LogProvider.LogException(10062, "Query is not returning any rows.", command.CommandText);

                            throw new Exception("Query is not returning any rows.");
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                LogProvider.LogException(10060, exp.Message, query);

                throw new Exception(exp.Message);
            }
        }

        return rowData;
    }

    public static List<object> ExecuteStoredProcedure(string spName, string[] paramNames, object[] paramValues)
    {
        List<object> rowData = new List<object>();

        using (var connection = DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new Exception(exp.Message);
            }

            try
            {
                using (var command = new SqlCommand(spName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    int j = 0;

                    foreach (string param in paramNames)
                    {
                        command.Parameters.AddWithValue(param, paramValues[j]);

                        j++;
                    }

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                rowData.Add(reader.GetValue(i));
                            }
                        }
                        else
                        {
                            LogProvider.LogException(10062, "Query is not returning any rows.", command.CommandText);

                            throw new Exception("Query is not returning any rows.");
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                LogProvider.LogException(10060, exp.Message, spName);

                throw new Exception(exp.Message);
            }
        }

        return rowData;
    }

    public static List<Dictionary<string, object>> ExecuteRowsQuery(string query)
    {
        var dataItem = new Dictionary<string, object>();

        string columnName;

        List<Dictionary<string, object>> Results = new List<Dictionary<string, object>>();

        using (var connection = DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);

                throw new Exception(exp.Message);
            }

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

                                dataItem.Add(columnName, reader.GetValue(i));
                            }

                            Results.Add(dataItem);
                        }
                    }

                }
            }
            catch (Exception exp)
            {
                LogProvider.LogException(10060, exp.Message, query);

                throw new Exception(exp.Message);
            }
        }

        return Results;
    }

    #endregion

    #region Public Methods

    public string PrepareQuery(int objKey, string acccessCriteria)
    {
        //GetDataObject or GetDataObjects View Activity or GetDataList Action
        this.PrepareQuery(0, -1, null, null, objKey, acccessCriteria, null);

        return this.FinalQueryText;
    }

    public void ExecuteQuery(ActivityParam[] advancedSearch, int objKey, string acccessCriteria, string order)
    {
        if (this.queryType != "SelectSP")
        {
            this.PrepareQuery(0, -1, null, advancedSearch, objKey, acccessCriteria, order);

            this.ExecuteQuery(true);
        }
        else
        {
            this.ExecutePreparedQuery(this.queryText);
        }
    }

    public void ExecuteQuery(int start, int length, string filter, ActivityParam[] advancedSearch, int objKey, string acccessCriteria, string order)
    {
        if (this.queryType != "SelectSP")
        {
            this.PrepareQuery(start, length, filter, advancedSearch, objKey, acccessCriteria, order);

            this.ExecuteQuery(true);
        }
        else
        {
            this.ExecutePreparedQuery(this.queryText);
        }
    }

    public void ExecuteQuery(int start, int length, ActivityParam[] advancedSearch, int objKey, string acccessCriteria, OrderParam[] order)
    {
        string orderClouse = "";

        foreach (OrderParam orderItem in order)
        {
            orderClouse += " " + (orderItem.ColumnName != null ? this.preparedQueries[0].FieldNames[orderItem.ColumnName] : orderItem.ColumnIndex.ToString()) + " " + orderItem.OrderDir + ",";
        }

        if (orderClouse != "")
        {
            orderClouse = orderClouse.Substring(0, orderClouse.Length - 1);
        }

        this.ExecuteQuery(start, length, null, advancedSearch, objKey, acccessCriteria, orderClouse);
    }

    public void ExecuteQueryAsTable(ActivityParam[] advancedSearch, int objKey, string acccessCriteria, OrderParam[] order)
    {
        this.ExecuteQueryAsTable("", advancedSearch, objKey, acccessCriteria, order);
    }

    public void ExecuteQueryAsTable(string filter, ActivityParam[] advancedSearch, int objKey, string acccessCriteria, OrderParam[] order)
    {
        string orderClouse = "";

        foreach (OrderParam orderItem in order)
        {
            orderClouse += " " + (orderItem.ColumnName != null ? this.preparedQueries[0].FieldNames[orderItem.ColumnName] : orderItem.ColumnIndex.ToString()) + " " + orderItem.OrderDir + ",";

        }

        if (orderClouse != "")
        {
            orderClouse = orderClouse.Substring(0, orderClouse.Length - 1);
        }

        if (this.queryType != "SelectSP")
        {
            this.PrepareQuery(0, -1, filter, advancedSearch, objKey, acccessCriteria, orderClouse);

            this.ExecuteQuery(true);
        }
        else
        {
            this.ExecutePreparedQuery(this.queryText);
        }

        ResultTable = new DataTable();

        if (this.Results.Count > 0)
        {
            foreach (string columnName in this.Results[0].Keys)
            {
                if (columnName.Contains("Total") || columnName == "Average" || columnName == "Maximum" || columnName == "Count")
                {
                    this.ResultTable.Columns.Add(columnName, typeof(Int64));
                }
                else
                {
                    this.ResultTable.Columns.Add(columnName, typeof(Int64));
                }
            }
        }

        foreach (var tuple in this.Results)
        {
            DataRow dataRow = this.ResultTable.NewRow();

            long value = 0;

            foreach (var tupleCell in tuple)
            {
                if (Convert.ToString(tupleCell.Value).Contains("ریال"))

                    dataRow[tupleCell.Key] = Convert.ToInt64(Convert.ToString(tupleCell.Value).Replace("ریال", "").Replace(",", ""));

                else
                {
                    bool success = long.TryParse(Convert.ToString(tupleCell.Value), out value);
                    if (success)
                    {
                        dataRow[tupleCell.Key] = value;
                    }
                    else
                    {
                        dataRow[tupleCell.Key] = 0;
                    }
                }
            }

            this.ResultTable.Rows.Add(dataRow);
        }
    }

    public void ExecutePreparedQuery(string query)
    {
        var dataItem = new Dictionary<string, object>();

        string columnName;

        this.FinalQueryText = query;

        this.Results = new List<Dictionary<string, object>>();

        using (var connection = DbConnection)
        {
            connection.Open();

            using (var command = new SqlCommand(query, connection))
            {
                command.CommandTimeout = 120;

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        dataItem = new Dictionary<string, object>();

                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            columnName = reader.GetName(i);

                            dataItem.Add(columnName, reader.GetValue(i));
                        }

                        this.Results.Add(dataItem);
                    }
                }

            }
        }
    }

    public void Dispose()
    {
        this.preparedQueries = null;

        this.results = null;

        this.attributeInfos = null;

        this.Results = null;

        this.ResultTable.Dispose();
    }

    #endregion

    #region Private: Query Parsing

    private void ParsQuery()
    {
        string[] multiQueryTexts = new string[1];

        if (queryType == "MultiSelectQuery")
        {
            multiQueryTexts = queryText.Split(';');
        }
        else //SelectQuery or SelectSP
        {
            multiQueryTexts[0] = queryText;
        }

        if (this.queryType != "SelectSP") //SelectQuery or MultiSelectQuery
        {
            if (this.subQueryText != null && this.queryType == "SelectQuery")  //GetDataRegion or [Simple or Grouped or TimePrioied] GetDataVisualization Report Activity
            {
                ExtractQueryDetail(subQueryText, queryText);
            }
            else //[any] GetDataList or GetDataObject or GetDataObjects or [any] GetDataVisualization View Activity or [Composite] GetDataVisualization Report Activity
            {
                foreach (string query in multiQueryTexts)
                {
                    ExtractQueryDetail(query);
                }
            }
        }
    }

    private void ExtractQueryDetail(string query)
    {
        QueryInfo queryInfo = new QueryInfo();

        string topClause = string.Empty;

        if (query.Contains("TOP(5)"))
        {
            query = query.Replace("TOP(5)", "");

            topClause = " TOP(5) ";
        }

        if (query.Contains("TOP(10)"))
        {
            query = query.Replace("TOP(10)", "");

            topClause = " TOP(10) ";
        }

        if (query.Contains("TOP(20)"))
        {
            query = query.Replace("TOP(20)", "");

            topClause = " TOP(20) ";
        }

        if (query.Contains("TOP(30)"))
        {
            query = query.Replace("TOP(30)", "");

            topClause = " TOP(30) ";
        }

        string selectClause = "";

        string[] spliter = { "SELECT", "FROM" };

        string[] queryPair = query.Trim().Split(spliter, 2, StringSplitOptions.RemoveEmptyEntries);

        string[] queryFields = ReplaceFuncCama(queryPair[0]).Trim().Split(',');

        string[] _spliter = { " AS " };

        string[] _spliter2 = { "." };

        string[] queryFieldPair;

        string tableName;

        string attributeName;

        string alias;

        foreach (string queryField in queryFields)
        {
            if (queryField.Contains(" AS "))
            {
                queryFieldPair = queryField.Trim().Replace(Environment.NewLine, "").Split(_spliter, StringSplitOptions.RemoveEmptyEntries);

                queryInfo.FieldNames.Add(queryFieldPair[1], queryFieldPair[0].Replace("#", ","));

                queryInfo.FieldFormats.Add(queryFieldPair[1], "");

                queryInfo.FieldUnits.Add(queryFieldPair[1], "");

                queryInfo.FieldSearchStyles.Add(queryFieldPair[1], "LIKE");
            }
            else  //EntityTable.EntityAttribute
            {
                queryFieldPair = queryField.Trim().Replace(Environment.NewLine, "").Split(_spliter2, StringSplitOptions.RemoveEmptyEntries);

                tableName = queryFieldPair[0].Trim();

                attributeName = queryFieldPair[1].Trim();

                alias = tableName + "_" + attributeName;

                queryInfo.FieldNames.Add(alias, queryField);

                queryInfo.FieldFormats.Add(alias, GetAttributeFormat(tableName, attributeName));

                queryInfo.FieldUnits.Add(alias, GetAttributeUnit(tableName, attributeName));

                queryInfo.FieldSearchStyles.Add(alias, GetAttributeSearchStyles(tableName, attributeName));
            }
        }

        foreach (string fieldAlias in queryInfo.FieldNames.Keys)
        {
            selectClause += queryInfo.FieldNames[fieldAlias] + " AS " + fieldAlias + ",";
        }

        queryInfo.SelectClause = topClause + selectClause;

        queryInfo.FromClause = queryPair[1].Trim();

        this.preparedQueries.Add(queryInfo);
    }

    private void ExtractQueryDetail(string subQuery, string query)
    {
        QueryInfo queryInfo = new QueryInfo();

        string topClause = string.Empty;

        if (subQuery.Contains("TOP(5)"))
        {
            subQuery = subQuery.Replace("TOP(5)", "");

            topClause = " TOP(5) ";
        }

        if (subQuery.Contains("TOP(10)"))
        {
            subQuery = subQuery.Replace("TOP(10)", "");

            topClause = " TOP(10) ";
        }

        if (subQuery.Contains("TOP(20)"))
        {
            subQuery = subQuery.Replace("TOP(20)", "");

            topClause = " TOP(20) ";
        }

        if (query.Contains("TOP(30)"))
        {
            query = query.Replace("TOP(30)", "");

            topClause = " TOP(30) ";
        }

        if (subQuery.Contains("TOP(200)"))
        {
            subQuery = subQuery.Replace("TOP(200)", "");

            topClause = " TOP(200) ";
        }

        string selectClause = "";

        string[] spliter = { "SELECT", "FROM" };

        //Normalize
        query = query.Replace("\t", " ");
        while (query.IndexOf("  ") > 0)
        {
            query = query.Replace("  ", " ");
        }

        query = query.Trim().Replace(Environment.NewLine, "");

        string[] queryPair = query.Split(spliter, 2, StringSplitOptions.RemoveEmptyEntries);

        string[] queryFields = ReplaceFuncCama(queryPair[0]).Split(',');

        string[] _spliter = { " AS " };

        string[] _spliter2 = { "." };

        string[] queryFieldPair;

        string tableName;

        string attributeName;

        string alias;

        foreach (string queryField in queryFields)
        {
            if (!queryField.Contains(" AS "))
            {
                queryFieldPair = queryField.Trim().Replace(Environment.NewLine, "").Split(_spliter2, StringSplitOptions.RemoveEmptyEntries);

                tableName = queryFieldPair[0].Trim();

                attributeName = queryFieldPair[1].Trim();

                alias = tableName + "_" + attributeName;

                try
                {
                    queryInfo.FieldNames.Add(alias, queryField);
                }
                catch
                {
                    LogProvider.LogTraceData(alias, queryField);
                }

                queryInfo.FieldFormats.Add(alias, GetAttributeFormat(tableName, attributeName));

                queryInfo.FieldUnits.Add(alias, GetAttributeUnit(tableName, attributeName));

                queryInfo.FieldSearchStyles.Add(alias, GetAttributeSearchStyles(tableName, attributeName));
            }
        }

        //Normalize
        subQuery = subQuery.Replace("\t", " ");
        while (subQuery.IndexOf("  ") > 0)
        {
            subQuery = subQuery.Replace("  ", " ");
        }

        subQuery = subQuery.Trim().Replace(Environment.NewLine, "");

        queryPair = subQuery.Split(spliter, 2, StringSplitOptions.RemoveEmptyEntries);

        queryFields = ReplaceFuncCama(queryPair[0]).Split(',');

        foreach (string queryField in queryFields)
        {
            if (queryField.Contains(" AS "))
            {
                queryFieldPair = queryField.Trim().Replace(Environment.NewLine, "").Split(_spliter, StringSplitOptions.RemoveEmptyEntries);

                if (!queryInfo.FieldNames.ContainsKey(queryFieldPair[1]))
                {
                    queryInfo.FieldNames.Add(queryFieldPair[1], queryFieldPair[0].Replace("#", ","));
                }
                else
                {
                    queryInfo.FieldNames[queryFieldPair[1]] = queryFieldPair[0].Replace("#", ",");
                }

                if (queryFieldPair[1] == "ID")
                {
                    ObjKeyName = queryFieldPair[0];
                }

                if (!queryInfo.FieldFormats.ContainsKey(queryFieldPair[1]))
                {
                    queryInfo.FieldFormats.Add(queryFieldPair[1], "");

                    queryInfo.FieldUnits.Add(queryFieldPair[1], "");

                    queryInfo.FieldSearchStyles.Add(queryFieldPair[1], "LIKE");
                }

                selectClause += queryField.Replace("#", ",") + ",";
            }
            else  //EntityTable.EntityAttribute
            {
                queryFieldPair = queryField.Trim().Replace(Environment.NewLine, "").Split(_spliter2, StringSplitOptions.RemoveEmptyEntries);

                tableName = queryFieldPair[0].Trim();

                attributeName = queryFieldPair[1].Trim();

                alias = tableName + "_" + attributeName;

                try
                {
                    selectClause += queryInfo.FieldNames[alias] + " AS " + alias + ",";
                }
                catch
                {
                    LogProvider.LogTraceData(alias, alias);
                }
            }
        }

        queryInfo.SelectClause = topClause + selectClause;

        queryInfo.FromClause = queryPair[1];

        this.preparedQueries.Add(queryInfo);
    }

    private string GetAttributeSearchStyles(string tableName, string attributeName)
    {
        string alias = tableName + "_" + attributeName;

        return this.attributeInfos[alias].SearchStyle;
    }

    private string GetAttributeUnit(string tableName, string attributeName)
    {
        string alias = tableName + "_" + attributeName;

        return this.attributeInfos[alias].Unit;
    }

    private string GetAttributeFormat(string tableName, string attributeName)
    {
        string alias = tableName + "_" + attributeName;

        string newAlias;

        if (!this.attributeInfos.ContainsKey(alias))
        {
            string sql = "select Sys_EntityAttributes.EntityID, Sys_EntityAttributes.Name, Sys_AttributeTypes.UnitToDisplay, Sys_AttributeTypes.FormatToDisplay, ISNULL(Sys_EntityAttributes.SearchStyle,(CASE WHEN (Sys_AttributeTypes.AttributeTypeID=10 OR Sys_AttributeTypes.AttributeTypeID=0 OR EnumTypeID IS NOT NULL) THEN 'CONTAIN' WHEN (Sys_AttributeTypes.AttributeTypeID=11 OR Sys_AttributeTypes.AttributeTypeID=31) THEN 'RANGE' WHEN (Sys_AttributeTypes.AttributeTypeID=5 OR Sys_AttributeTypes.AttributeTypeID=6 OR Sys_AttributeTypes.AttributeTypeID=8 OR Sys_AttributeTypes.AttributeTypeID=9) THEN 'RANGE' WHEN (Sys_AttributeTypes.AttributeTypeID=10) THEN 'EQUAL' ELSE 'LIKE' END)) AS SearchStyle, Sys_Entities.Name as EntityName from Sys_EntityAttributes inner join Sys_AttributeTypes on Sys_EntityAttributes.AttributeTypeID = Sys_AttributeTypes.AttributeTypeID inner join Sys_Entities on Sys_EntityAttributes.EntityID = Sys_Entities.EntityID where (Sys_Entities.TableName ='" + tableName + "')";

            using (var connection = DbConnection)
            {
                connection.Open();

                using (var command = new SqlCommand(sql, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            newAlias = tableName.Trim() + "_" + reader["Name"].ToString().Trim();

                            if (!this.attributeInfos.ContainsKey(newAlias))
                            {
                                this.attributeInfos.Add(newAlias, new AttributeInfo(reader["FormatToDisplay"].ToString(), reader["UnitToDisplay"].ToString(), reader["SearchStyle"].ToString()));
                            }
                        }
                    }
                }
            }
        }

        try
        {
            return this.attributeInfos[alias].Format;
        }
        catch
        {
            LogProvider.LogTraceData(alias, alias);
        }

        return this.attributeInfos[alias].Format;

    }

    private string ReplaceFuncCama(string query)
    {
        char[] chars = query.ToCharArray();

        bool openArg = false;

        for (int i = 0; i < chars.Length; i++)
        {
            if (chars[i] == '(')
                openArg = true;

            if (chars[i] == ')')
                openArg = false;

            if (openArg && chars[i] == ',')
                chars[i] = '#';
        }

        return new string(chars);
    }

    private class AttributeInfo
    {
        public string Format;

        public string Unit;

        public string SearchStyle;

        public AttributeInfo(string format, string unit, string searchStyle)
        {
            this.Format = format;

            this.Unit = unit; ;

            this.SearchStyle = searchStyle;
        }
    }

    public class QueryInfo
    {
        public string SelectClause;

        public string FromClause;

        public string Orderlause;

        public Dictionary<string, string> FieldNames = new Dictionary<string, string>();

        public Dictionary<string, string> FieldFormats = new Dictionary<string, string>();

        public Dictionary<string, string> FieldUnits = new Dictionary<string, string>();

        public Dictionary<string, string> FieldSearchStyles = new Dictionary<string, string>();

        public string Text;
    }

    #endregion

    #region Private: Query Executing

    private void PrepareQuery(int start, int length, string filter, ActivityParam[] advancedSearch, int objKey, string acccessCriteria, string order)
    {
        string whereClause;

        string orderClause;

        string groupClause;

        int whereIndex = -1;

        int orderIndex = -1;

        int groupIndex = -1;

        string searchClause = "";

        string fromClause;

        string searchStyle;

        string[] containValues;

        string[] rangeValues;

        string searchContainValue = "";

        string preparedQuery;

        string tupleKeyField;

        for (int i = 0; i < this.preparedQueries.Count; i++)
        {
            QueryInfo query = this.preparedQueries[i];

            string s = string.Join(";", query.FieldNames.Select(x => x.Key + "=" + x.Value).ToArray());

            #region Generate SearchClause

            if (i == 0)
            {
                if (!string.IsNullOrEmpty(filter))
                {
                    searchClause = "( " + filter + " ) AND ";
                }
            }

            if (advancedSearch != null)
            {
                foreach (ActivityParam searchParam in advancedSearch)
                {
                  
                    if (query.FieldNames.ContainsKey(searchParam.ParamName))
                    {
                        searchStyle = query.FieldSearchStyles[searchParam.ParamName];//ParamName is Ambigutiy

                        if (searchParam.ParamName == "StartDate") searchStyle = "RANGE";
                        //MDR Custom Search Fields
                        if (searchParam.FileAttachCode == "SystemGeneratedFilterField") searchStyle = "LIKE";
                        if (searchParam.ParamName == "Sys_Pex_Process_120_Val046") searchStyle = "EQUAL";
                        if (searchParam.ParamName == "AlertCount") searchStyle = "EQUAL";
                        //------------------------

                        if (!(searchParam.ParamValue == null || searchParam.ParamValue == "" || searchParam.ParamValue == "[]" || searchParam.ParamValue == "[\"\"]" || searchParam.ParamValue == "$"))
                        {
                            if (searchStyle == "LIKE")
                            {
                                searchClause += "( " + query.FieldNames[searchParam.ParamName] + " LIKE N'%" + SecurityProvider.ValidateInput(searchParam.ParamValue.Replace(" ", "%")) + "%' ) AND ";
                            }

                            if (searchStyle == "EQUAL" || searchStyle == null || searchStyle == "")
                            {
                                searchClause += "( " + query.FieldNames[searchParam.ParamName] + " = N'" + SecurityProvider.ValidateInput(searchParam.ParamValue) + "' ) AND ";
                            }

                            if (searchStyle == "CONTAIN")
                            {
                                containValues = searchParam.ParamValue.Substring(1, searchParam.ParamValue.Length - 2).Replace("\"", "").Split(',');

                                searchContainValue = string.Empty;

                                foreach (string value in containValues)
                                {
                                    searchContainValue += "N'" + SecurityProvider.ValidateInput(value) + "',";
                                }

                                searchContainValue = searchContainValue.Substring(0, searchContainValue.Length - 1);

                                if (searchContainValue != "N'0'")
                                {
                                    searchClause += "( " + query.FieldNames[searchParam.ParamName] + " IN (" + searchContainValue + ") ) AND ";
                                }
                            }

                            if (searchStyle == "RANGE")
                            {
                                rangeValues = searchParam.ParamValue.Split('$');

                                if (query.FieldFormats[searchParam.ParamName] == "Numeric" || query.FieldFormats[searchParam.ParamName] == "LocalMoney" || query.FieldFormats[searchParam.ParamName] == "Money" || query.FieldFormats[searchParam.ParamName] == "ShortTime" || query.FieldFormats[searchParam.ParamName] == "LongTime")
                                {
                                    if (string.IsNullOrEmpty(rangeValues[0]))
                                    {
                                        rangeValues[0] = "-2147483648";
                                    }

                                    if (string.IsNullOrEmpty(rangeValues[1]))
                                    {
                                        rangeValues[1] = "2147483647";
                                    }

                                    searchClause += "( " + query.FieldNames[searchParam.ParamName] + " BETWEEN " + Convert.ToInt64(rangeValues[0]) + " AND " + Convert.ToInt64(rangeValues[1]) + " ) AND ";
                                }

                                if (query.FieldFormats[searchParam.ParamName] == "LocalDateTime" || query.FieldFormats[searchParam.ParamName] == "LocalDate" || query.FieldFormats[searchParam.ParamName] == "DateTime" || query.FieldFormats[searchParam.ParamName] == "Date" || searchParam.ParamName == "StartDate")
                                {
                                    bool isStartDate = false;
                                    if (searchParam.ParamName == "StartDate") isStartDate = true;
                                    if (string.IsNullOrEmpty(rangeValues[0]))
                                    {
                                        rangeValues[0] = query.FieldFormats[searchParam.ParamName].Contains("Local") ? "1378/10/11" : "1/1/2000";
                                    }

                                    if (string.IsNullOrEmpty(rangeValues[1]))
                                    {
                                        rangeValues[1] = query.FieldFormats[searchParam.ParamName].Contains("Local") ? "1478/10/12" : "1/1/2100";
                                    }

                                    if (query.FieldFormats[searchParam.ParamName] == "LocalDateTime" || searchParam.ParamName == "StartDate")
                                    {
                                
                                        rangeValues[0] = LocalizationProvider.GetDateTime(rangeValues[0] , isStartDate).ToString();

                                        rangeValues[1] = LocalizationProvider.GetDateTime(rangeValues[1] , isStartDate).ToString();
                                    }

                                    if (query.FieldFormats[searchParam.ParamName] == "LocalDate")
                                    {
                                        rangeValues[0] = LocalizationProvider.GetDate(rangeValues[0] , isStartDate).ToString();

                                        rangeValues[1] = LocalizationProvider.GetDate(rangeValues[1], isStartDate).ToString();
                                    }

                                    searchClause += "( " + query.FieldNames[searchParam.ParamName] + " BETWEEN '" + rangeValues[0] + "' AND '" + rangeValues[1] + "' ) AND ";
                                    

                                }
                            }
                        }
                    }
                }
            }

            if (searchClause != "")
            {
                searchClause = searchClause.Substring(0, searchClause.Length - 4);
            }

            #endregion

            #region Preparing Query

            fromClause = query.FromClause;

            fromClause = fromClause.Replace("@ObjectID", objKey.ToString());

            whereClause = "";

            whereIndex = -1;

            orderIndex = -1;

            groupIndex = -1;

            orderIndex = fromClause.LastIndexOf(" ORDER BY ");

            whereIndex = fromClause.IndexOf(" WHERE ");

            groupIndex = fromClause.LastIndexOf(" GROUP BY ");

            if (whereIndex > 0)
            {
                if (orderIndex > 0 && groupIndex == -1)
                {
                    whereClause = fromClause.Substring(whereIndex + 7, orderIndex - whereIndex - 7);
                }

                if (groupIndex > 0)
                {
                    whereClause = fromClause.Substring(whereIndex + 7, groupIndex - whereIndex - 7);
                }

                if (orderIndex == -1 && groupIndex == -1)
                {
                    whereClause = fromClause.Substring(whereIndex + 7);
                }
            }

            orderClause = (ObjKeyName != null ? ObjKeyName : query.FieldNames.First().Value) + " ASC ";

            if (orderIndex > 0)
            {
                orderClause = fromClause.Substring(orderIndex + 9);

                fromClause = fromClause.Substring(0, orderIndex);
            }

            if (order != null && order != " 1 Asc")
            {
                orderClause = order;
            }

            if (orderClause.Contains("'") && length == -1)
            {
                orderClause = " 1 Asc";
            }

            if (acccessCriteria != "")
            {
                if (whereIndex > 0)
                {
                    fromClause = fromClause.Replace(whereClause, " ( " + whereClause + " ) AND ( " + acccessCriteria + " ) ");
                }
                else
                {
                    if (groupIndex > 0)
                    {
                        fromClause = fromClause.Insert(groupIndex, " WHERE ( " + acccessCriteria + " ) ");
                    }
                    if (orderIndex > 0 && groupIndex == -1)
                    {
                        fromClause = fromClause.Insert(orderIndex, " WHERE ( " + acccessCriteria + " ) ");
                    }
                    if (orderIndex == -1 && groupIndex == -1)
                    {
                        fromClause = fromClause + " WHERE ( " + acccessCriteria + " ) ";
                    }
                }

            }

            orderIndex = fromClause.LastIndexOf(" ORDER BY ");

            whereIndex = fromClause.IndexOf(" WHERE ");

            groupIndex = fromClause.LastIndexOf(" GROUP BY ");

            //GUID
            tupleKeyField = ObjKeyName != null ? ObjKeyName : query.FieldNames.First().Value;

            if (groupIndex > 0)
            {
                if (orderIndex > 0)
                {
                    groupClause = fromClause.Substring(groupIndex + 9, orderIndex - groupIndex - 9);
                }
                else
                {
                    groupClause = fromClause.Substring(groupIndex + 9);
                }

                string _groupClause = ReplaceFuncCama(groupClause);

                int groupCount = _groupClause.Length - _groupClause.Replace(",", "").Length;

                if (groupCount == 1) //two level
                {
                    tupleKeyField = "dbo.GUID2(" + groupClause + ")";
                    orderClause = groupClause;
                }

                if (groupCount == 2) //three level
                {
                    tupleKeyField = "dbo.GUID3(" + groupClause + ")";
                    orderClause = groupClause;
                }
            }

            if (i == 0)
            {
                totalRecordsQuery = "SELECT COUNT(DISTINCT " + tupleKeyField + ") FROM " + fromClause;
            }

            if (searchClause != "")
            {
                if (whereIndex > 0)
                {
                    if (whereClause != "")
                    {
                        fromClause = fromClause.Replace(whereClause, " ( " + whereClause + " ) AND ( " + searchClause + " ) ");
                    }
                    else
                    {
                        fromClause = fromClause.Replace(acccessCriteria, " ( " + acccessCriteria + " ) AND ( " + searchClause + " ) ");
                    }
                }
                else
                {
                    if (groupIndex > 0)
                    {
                        fromClause = fromClause.Insert(groupIndex, " WHERE ( " + searchClause + " ) ");
                    }
                    if (orderIndex > 0 && groupIndex == -1)
                    {
                        fromClause = fromClause.Insert(orderIndex, " WHERE ( " + searchClause + " ) ");
                    }
                    if (orderIndex == -1 && groupIndex == -1)
                    {
                        fromClause = fromClause + " WHERE ( " + searchClause + " ) ";
                    }
                }
            }

            if (i == 0)
            {
                filterdRecordsQuery = "SELECT COUNT(DISTINCT " + tupleKeyField + ") FROM " + fromClause;
            }

            //if Query Contain MultiKeys such as Year, Month,.... then Should be Concat Keys as Single String

            //this.preparedQueries[i].FromClause = fromClause;

            if (length > 0)
            {

                preparedQuery = "WITH MyQuery AS(SELECT ROW_NUMBER() OVER (ORDER BY " + orderClause + ") AS RowNum," + query.SelectClause + tupleKeyField + " AS ObjKey FROM " + fromClause + " ) SELECT * FROM MyQuery WHERE RowNum BETWEEN " + (start + 1) + " AND " + (start + length) + " ORDER BY RowNum";
            }
            else
            {
                if (!fromClause.Contains("UNION ALL"))
                {
                    preparedQuery = "SELECT " + query.SelectClause + tupleKeyField + " AS ObjKey FROM " + fromClause + " ORDER BY " + orderClause;
                }
                else
                {
                    preparedQuery = "SELECT " + query.SelectClause.Substring(0, query.SelectClause.Length - 1) + " FROM " + fromClause + " ORDER BY " + orderClause;
                }

            }
           
            this.preparedQueries[i].Text = preparedQuery;

            this.FinalQueryText = preparedQuery + ";";

            #endregion
        }
    }

    private void ExecuteQuery(bool forceKey)
    {
        string tupleKey;

        string columnName;

        string format;

        string unit;

        this.results = new Dictionary<string, Dictionary<string, object>>();

        using (var connection = DbConnection)
        {
            connection.Open();

            using (var command = new SqlCommand("", connection))
            {
                foreach (QueryInfo query in this.preparedQueries)
                {
                    command.CommandText = query.Text;

                    command.CommandTimeout = 120;

                    command.CommandText = command.CommandText.Replace("@FirstDayOfMonth", SessionProvider.FirstDayOfMonth);

                    command.CommandText = command.CommandText.Replace("@FirstDayOfWeek", SessionProvider.FirstDayOfWeek);

                    command.CommandText = command.CommandText.Replace("@FirstDayOfYear", SessionProvider.FirstDayOfYear);

                    command.CommandText = command.CommandText.Replace("'@SessionUserID'", SessionProvider.UserID.ToString());

                    command.CommandText = command.CommandText.Replace("'@SessionAgentID'", SessionProvider.GetValue("AgentID"));

                    command.CommandText = command.CommandText.Replace("@SessionGroupID", SessionProvider.GetValue("GroupID"));

                    command.CommandText = command.CommandText.Replace("'@SessionCustomerID'", SessionProvider.GetValue("CustomerID"));

                    command.CommandText = command.CommandText.Replace("'@SessionAPL'", SessionProvider.GetValue("APL"));
                    
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            if (forceKey)
                            {
                                try
                                {
                                    tupleKey = Convert.ToString(reader["ObjKey"]);
                                }
                                catch
                                {
                                    tupleKey = Convert.ToString(reader.GetString(0));
                                }

                                if (!this.results.ContainsKey(tupleKey))
                                {
                                    this.results.Add(tupleKey, new Dictionary<string, object>());
                                }
                            }
                            else
                            {
                                tupleKey = "key" + Convert.ToString(new Random().Next());

                                if (!this.results.ContainsKey(tupleKey))
                                {
                                    this.results.Add(tupleKey, new Dictionary<string, object>());
                                }
                            }

                            for (int j = 0; j < reader.FieldCount; j++)
                            {
                                columnName = reader.GetName(j);

                                if (!this.results[tupleKey].ContainsKey(columnName))
                                {
                                    if (columnName != "RowNum" && columnName != "ObjKey")
                                    {
                                        if (reader.GetDataTypeName(j) == "money")
                                        {
                                            query.FieldFormats[columnName] = "LocalMoney";

                                            query.FieldUnits[columnName] = ApplicationProvider.AppCurrency;
                                        }

                                        if (reader.GetDataTypeName(j) == "datetime")
                                        {
                                            query.FieldFormats[columnName] = "LocalDateTime";
                                        }

                                        this.results[tupleKey].Add(columnName, FormatValue(reader.GetValue(j), query.FieldFormats[columnName], query.FieldUnits[columnName]));
                                    }
                                    else
                                    {
                                        format = string.Empty;

                                        unit = string.Empty;

                                        if (reader.GetDataTypeName(j) == "money")
                                        {
                                            format = "LocalMoney";

                                            unit = query.FieldUnits[columnName] = ApplicationProvider.AppCurrency;
                                        }

                                        this.results[tupleKey].Add(columnName, FormatValue(reader.GetValue(j), format, unit));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        this.Results = new List<Dictionary<string, object>>();

        foreach (string key in this.results.Keys)
        {
            this.Results.Add(this.results[key]);
        }

        int totalRecords = 0;

        if (!this.totalRecordsQuery.Contains("UNION ALL"))
            totalRecords = ExecuteScalarQuery2(this.totalRecordsQuery);

        this.TotalRecords = totalRecords;

        int filterdRecords = 0;

        if (!this.filterdRecordsQuery.Contains("UNION ALL"))
            filterdRecords = ExecuteScalarQuery2(this.filterdRecordsQuery);

        this.FilterdRecords = filterdRecords;
    }

    private string FormatValue(object value, string format, string unit)
    {
        if (string.IsNullOrEmpty(format) || Convert.ToString(value) == null || Convert.ToString(value) == "" || value == DBNull.Value)
        {
            return Convert.ToString(value);
        }

        if (format == "LocalDate")
        {
            return LocalizationProvider.GetLocalDate(value);
        }

        if (format == "LocalDateTime")
        {
            return LocalizationProvider.GetLocalDateTime2(value);
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

        if (format == "Float")
        {
            return Convert.ToDouble(value).ToString("0.00");
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
            
            return "<img class='btn-download-grid fa fa-download'  data-file-attach-code='" + value.ToString() + "' title='" + Localize("دانلود فایل") + "' style='object-fit: cover;width: 40px;height: 40px; ' src='" + path + value.ToString() + "' />";
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

    #endregion
}