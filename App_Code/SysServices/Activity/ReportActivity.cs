// Code File(Amnpardaz Software Co. Copyright 2021 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.5.2.0
using System;
using System.Web.Script.Services;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Globalization;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class ReportActivity : System.Web.Services.WebService
{
    private DataTable _allData;

    [WebMethod(EnableSession = true)]
    public string GetDataVisualization(int id, int dataVisualizationID, SeriesOption seriesOptions, string categoryExp, string[] seriesExps, ActivityParam[] advancedSearch, int objKey, string responseToken)
    {
        string acccessCriteria;

        string query;

        string reportQueryText;

        string datasetQueryText;

        string datasetQueryType;

        string oValue = null;

        string nValue = null;

        string catValue;

        int i = 0;

        string[] categories = new string[0];

        StringBuilder jsonResult;

        SqlDataProvider dataProvider;

        List<long[]> series = new List<long[]>();

        List<Dictionary<string, long>> dSeries = new List<Dictionary<string, long>>();

        List<string> seriLables = new List<string>();

        List<string> dCategories = new List<string>();

        List<Dictionary<string, object>> results;

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ReportID is" + id);

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
            acccessCriteria = SecurityProvider.ValidateUserReportAccess(id);
        }
        catch (AppException exp)
        {
            return LogProvider.PrepareLogResultStr(exp.ErrorLogID, exp.ErrorMessage, exp.ErrorCode);
        }

        #endregion

        #region Get DataVisualizationInfo From Database

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

            query = "select Sys_Rpt_Reports.QueryText as ReportQueryText, Sys_Rpt_Datasets.QueryText, Sys_Rpt_Datasets.QueryType, Sys_Rpt_Datasets.DatasetID from Sys_Rpt_Reports inner join Sys_Rpt_Datasets on Sys_Rpt_Reports.DatasetID = Sys_Rpt_Datasets.DatasetID where Sys_Rpt_Reports.ReportID = " + id;

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        reportQueryText = reader["ReportQueryText"].ToString();

                        datasetQueryText = reader["QueryText"].ToString();

                        datasetQueryType = reader["QueryType"].ToString();

                        dataProvider = new SqlDataProvider(reportQueryText, datasetQueryText, datasetQueryType);
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

        try
        {
            #region seriesOptions Type is "Simple" or "Composite"

            if (seriesOptions.Type == "Simple" || seriesOptions.Type == "Composite" || seriesOptions.Type == "Stack")
            {
                dataProvider.ExecuteQuery(advancedSearch, objKey, acccessCriteria, categoryExp);

                results = dataProvider.Results;

                categories = new string[results.Count];

                for (int j = 0; j < seriesExps.Length; j++)
                {
                    series.Add(new long[results.Count]);

                    seriLables.Add(seriesExps[j]);
                }

                i = 0;

                foreach (var resultItem in dataProvider.Results)
                {
                    categories[i] = resultItem[categoryExp].ToString();

                    for (int j = 0; j < seriesExps.Length; j++)
                    {
                        series[j][i] = Convert.ToInt64(resultItem[seriesExps[j]]);
                    }

                    i++;
                }
            }

            #endregion

            #region seriesOptions Type is "ColumnGroup" or "TimePrioied"

            if (seriesOptions.Type == "ColumnGroup" || seriesOptions.Type == "TimePrioied")
            {
                dataProvider.ExecuteQuery(advancedSearch, objKey, acccessCriteria, seriesOptions.GroupingExpression + "," + categoryExp);

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

                    if (oValue != nValue)
                    {
                        dSeries.Add(new Dictionary<string, long>());

                        i++;

                        dSeries[i].Add(resultItem[categoryExp].ToString(), Convert.ToInt64(resultItem[seriesExps[0]]));

                        seriLables.Add(nValue);

                        oValue = nValue;
                    }
                    else
                    {
                        dSeries[i].Add(resultItem[categoryExp].ToString(), Convert.ToInt64(resultItem[seriesExps[0]]));
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

                foreach (Dictionary<string, long> dSeri in dSeries)
                {
                    series.Add(new long[dCategories.Count]);

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

            foreach (long[] seri in series)
            {
                jsonResult.Append("{\"name\":\"" + seriLables[i] + "\",\"data\":[");

                int j = 0;

                foreach (long val in seri)
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

    [WebMethod(EnableSession = true)]
    public string GetDataRegion(int id, int dataRegionID, int pageNumber, ActivityParam[] advancedSearch, int objKey, OrderParam[] order, string responseToken)
    {
        string acccessCriteria = "";

        string query;

        string reportQuery;

        string datasetQuery;

        string datasetQueryType;

        string regionType;

        string groupExpression;

        string groupedSequence = "";

        string pagingQuery = "select {0} from {1} group by {0} order by {0}";

        int colGroupLevel = 0;

        int rowGroupLevel = 0;

        int GroupPageSize = -1;

        int i = 0;

        int i1 = 0;

        int i2 = 0;

        int j = 0;

        int totalPages = 1;

        StringBuilder jsonResult;

        StringBuilder pageFilter;

        List<string> groupValues;

        List<Dictionary<string, object>> pagingData;

        SqlDataProvider dataProvider;

        Tablix tablix = new Tablix();

        MatrixHeader matrixHeader = new MatrixHeader();

        TableHeader tableHeader = new TableHeader();

        List<TablixElement> tablixDesgin = new List<TablixElement>();

        List<TablixElement> columnGroupHierarchy;

        List<TablixElement> rowGroupHierarchy;

        List<TablixElement> detailColumns;

        List<List<DetailItem>> details;

        DataRow[] subRawData;

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ReportID is" + id);

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
            acccessCriteria = SecurityProvider.ValidateUserReportAccess(id);
        }
        catch (AppException exp)
        {
            return LogProvider.PrepareLogResultStr(exp.ErrorLogID, exp.ErrorMessage, exp.ErrorCode);
        }

        #endregion

        #region Get TablixInfo From Database

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

            query = "select Sys_Rpt_Reports.QueryText as ReportQueryText, Sys_Rpt_Datasets.QueryText, Sys_Rpt_Datasets.QueryType, Sys_Rpt_Datasets.DatasetID from Sys_Rpt_Reports inner join Sys_Rpt_Datasets on Sys_Rpt_Reports.DatasetID = Sys_Rpt_Datasets.DatasetID where Sys_Rpt_Reports.ReportID = " + id;

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        reportQuery = reader["ReportQueryText"].ToString();

                        datasetQuery = reader["QueryText"].ToString();

                        datasetQueryType = reader["QueryType"].ToString();

                        dataProvider = new SqlDataProvider(reportQuery, datasetQuery, datasetQueryType);
                    }

                    query = "select Type from Sys_Rpt_DataRegions where Enabled = 1 and DataRegionID = " + dataRegionID;

                    command.CommandText = query;

                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        regionType = reader["Type"].ToString();

                        if (regionType == "Matrix")
                        {
                            query = "select Sys_Rpt_MatrixDesigns.* from Sys_Rpt_MatrixDesigns inner join Sys_Rpt_Matrixs on Sys_Rpt_MatrixDesigns.MatrixID = Sys_Rpt_Matrixs.MatrixID where Sys_Rpt_MatrixDesigns.Enabled = 1 and Sys_Rpt_Matrixs.DataRegionID = " + dataRegionID + " order by Category, GroupLevel, ColumnPosition, ElementID";
                        }

                        if (regionType == "Table")
                        {
                            query = "select Sys_Rpt_TableDesigns.* from Sys_Rpt_TableDesigns inner join Sys_Rpt_Tables on Sys_Rpt_TableDesigns.TableID = Sys_Rpt_Tables.TableID where Sys_Rpt_TableDesigns.Enabled = 1 and Sys_Rpt_Tables.DataRegionID = " + dataRegionID + " order by Category, GroupLevel, ColumnPosition, ElementID";
                        }
                    }

                    command.CommandText = query;

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            tablixDesgin.Add(new TablixElement(reader["Type"], reader["TextExpression"], reader["StyleContent"], reader["StyleClass"],
                                 reader["Category"], reader["OnGroupPageBreak"], reader["GroupPageSize"]));
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, exp.StackTrace + "[" + query + "]", id);

                    return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                }
            }
        }

        #endregion

        try
        {
            dataProvider.ExecuteQueryAsTable(advancedSearch, objKey, acccessCriteria, order);

            _allData = dataProvider.ResultTable;

            #region Preprocessing Query > Page Filter

            rowGroupHierarchy = tablixDesgin.Where(a => a.Category == "RowGrouping").ToList();

            if (rowGroupHierarchy.Count > 0)
            {
                if (rowGroupHierarchy[2].OnGroupPageBreak)
                {
                    groupedSequence += rowGroupHierarchy[2].TextExpression + ",";

                    GroupPageSize = rowGroupHierarchy[2].GroupPageSize;
                }
            }

            if (rowGroupHierarchy.Count > 3)
            {
                if (rowGroupHierarchy[2 + 3].OnGroupPageBreak)
                {
                    groupedSequence += rowGroupHierarchy[2 + 3].TextExpression + ",";

                    GroupPageSize = rowGroupHierarchy[2 + 3].GroupPageSize;
                }
            }

            if (rowGroupHierarchy.Count > 6)
            {
                if (rowGroupHierarchy[2 + 6].OnGroupPageBreak)
                {
                    groupedSequence += rowGroupHierarchy[2 + 6].TextExpression + ",";

                    GroupPageSize = rowGroupHierarchy[2 + 6].GroupPageSize;
                }
            }

            pageFilter = new StringBuilder("");

            if (GroupPageSize != -1)
            {
                pagingQuery = "SELECT " + groupedSequence + dataProvider.PreparedQuery.FromClause + " GROUP BY " + groupedSequence + " ORDER BY " + groupedSequence;

                dataProvider.ExecutePreparedQuery(pagingQuery);

                pagingData = dataProvider.Results.GetRange((pageNumber - 1) * GroupPageSize, GroupPageSize);

                totalPages = dataProvider.Results.Count;

                foreach (Dictionary<string, object> pagingTuple in pagingData)
                {
                    pageFilter.Append("(");

                    foreach (string pagingItem in pagingTuple.Keys)
                    {
                        pageFilter.Append("(" + pagingItem + "= N'" + Convert.ToString(pagingTuple[pagingItem]) + "') OR ");
                    }

                    pageFilter = pageFilter.Remove(pageFilter.Length - 4, 4);

                    pageFilter.Append(") AND ");
                }

                pageFilter = pageFilter.Remove(pageFilter.Length - 4, 4);
            }

            #endregion

            #region Generate TablixBody > GroupRows, Summery object

            if (rowGroupHierarchy.Count > 0)
            {
                groupExpression = rowGroupHierarchy[2].TextExpression;

                groupValues = SelectByGroup(groupExpression);

                i = 0;

                foreach (string groupValue in groupValues)
                {
                    tablix.GroupRows.Add(new GroupRow(groupExpression, groupValue, rowGroupHierarchy[2].StyleContent, rowGroupHierarchy[2].StyleClass));

                    if (regionType == "Matrix")
                    {
                        tablix.GroupRows[i].Summery = new Summery(rowGroupHierarchy[5].TextExpression, rowGroupHierarchy[5].StyleContent, rowGroupHierarchy[5].StyleClass, true);
                    }

                    i++;
                }

                if (regionType == "Matrix")
                {
                    tablix.Summery = new Summery(rowGroupHierarchy[4].TextExpression, rowGroupHierarchy[4].StyleContent, rowGroupHierarchy[4].StyleClass,
                        rowGroupHierarchy[5].TextExpression, rowGroupHierarchy[5].StyleContent, rowGroupHierarchy[5].StyleClass);
                }

                rowGroupLevel++;
            }

            #region Level1

            int _offset = 3;

            if (regionType == "Matrix")
            {
                _offset = 6;
            }

            if (rowGroupHierarchy.Count > _offset)
            {
                i1 = 0;

                foreach (GroupRow groupRow in tablix.GroupRows)
                {
                    groupExpression = rowGroupHierarchy[2 + _offset].TextExpression;

                    groupValues = SelectByGroup(groupExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue));

                    foreach (string groupValue in groupValues)
                    {
                        tablix.GroupRows[i1].InnerGroupRows.Add(new GroupRow(groupExpression, groupValue, rowGroupHierarchy[2 + _offset].StyleContent, rowGroupHierarchy[2 + _offset].StyleClass));
                    }

                    if (regionType == "Matrix")
                    {
                        tablix.GroupRows[i1].Summery = new Summery(rowGroupHierarchy[4 + _offset].TextExpression, rowGroupHierarchy[4 + _offset].StyleContent, rowGroupHierarchy[4 + _offset].StyleClass,
                        rowGroupHierarchy[5 + _offset].TextExpression, rowGroupHierarchy[5 + _offset].StyleContent, rowGroupHierarchy[5 + _offset].StyleClass);
                    }

                    i1++;
                }

                rowGroupLevel++;
            }

            #endregion

            #region Level2

            _offset = 6;

            if (regionType == "Matrix")
            {
                _offset = 12;
            }

            if (rowGroupHierarchy.Count > _offset)
            {
                i1 = 0;

                foreach (GroupRow groupRow in tablix.GroupRows)
                {
                    i2 = 0;

                    foreach (GroupRow innerGroupRow in groupRow.InnerGroupRows)
                    {
                        groupExpression = rowGroupHierarchy[2 + _offset].TextExpression;

                        groupValues = SelectByGroup(groupExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue));

                        foreach (string groupValue in groupValues)
                        {

                            tablix.GroupRows[i1].InnerGroupRows[i2].InnerGroupRows.Add(new GroupRow(groupExpression, groupValue, rowGroupHierarchy[2 + _offset].StyleContent, rowGroupHierarchy[2 + _offset].StyleClass));
                        }

                        if (regionType == "Matrix")
                        {
                            tablix.GroupRows[i1].InnerGroupRows[i2].Summery = new Summery(rowGroupHierarchy[4 + _offset].TextExpression, rowGroupHierarchy[4 + _offset].StyleContent, rowGroupHierarchy[4 + _offset].StyleClass,
                                rowGroupHierarchy[5 + _offset].TextExpression, rowGroupHierarchy[5 + _offset].StyleContent, rowGroupHierarchy[5 + _offset].StyleClass);
                        }

                        i2++;
                    }

                    i1++;
                }

                rowGroupLevel++;
            }

            #endregion

            #endregion

            #region Generate MatrixHeader > GroupColumns, Summery object

            if (regionType == "Matrix")
            {
                columnGroupHierarchy = tablixDesgin.Where(a => a.Category == "ColumnGrouping").ToList();

                groupExpression = columnGroupHierarchy[2].TextExpression;

                groupValues = SelectByGroup(groupExpression);

                i = 0;

                foreach (string groupValue in groupValues)
                {
                    matrixHeader.GroupColumns.Add(new GroupColumn(groupExpression, groupValue, columnGroupHierarchy[2].StyleContent, columnGroupHierarchy[2].StyleClass));

                    matrixHeader.GroupColumns[i].Summery = new Summery(columnGroupHierarchy[5].TextExpression, columnGroupHierarchy[5].StyleContent, columnGroupHierarchy[5].StyleClass, true);

                    i++;
                }

                matrixHeader.Summery = new Summery(columnGroupHierarchy[4].TextExpression, columnGroupHierarchy[4].StyleContent, columnGroupHierarchy[4].StyleClass,
                    columnGroupHierarchy[5].TextExpression, columnGroupHierarchy[5].StyleContent, columnGroupHierarchy[5].StyleClass);

                colGroupLevel++;

                #region Level1

                if (columnGroupHierarchy.Count > 6)
                {
                    i1 = 0;

                    foreach (GroupColumn groupColumn in matrixHeader.GroupColumns)
                    {
                        groupExpression = columnGroupHierarchy[2 + 6].TextExpression;

                        groupValues = SelectByGroup(groupExpression, GenerateFilterExpression(groupColumn.GroupExpression, groupColumn.GroupValue));

                        foreach (string groupValue in groupValues)
                        {
                            matrixHeader.GroupColumns[i1].InnerGroupColumns.Add(new GroupColumn(groupExpression, groupValue, columnGroupHierarchy[2 + 6].StyleContent, columnGroupHierarchy[2 + 6].StyleClass));

                            matrixHeader.GroupColumns[i1].Inner++;
                        }

                        matrixHeader.GroupColumns[i1].Summery = new Summery(columnGroupHierarchy[4 + 6].TextExpression, columnGroupHierarchy[4 + 6].StyleContent, columnGroupHierarchy[4 + 6].StyleClass,
                           columnGroupHierarchy[5 + 6].TextExpression, columnGroupHierarchy[5 + 6].StyleContent, columnGroupHierarchy[5 + 6].StyleClass);

                        matrixHeader.GroupColumns[i1].Inner++;

                        i1++;
                    }

                    colGroupLevel++;
                }

                #endregion

                #region Level2

                if (columnGroupHierarchy.Count > 12)
                {
                    i1 = 0;

                    i2 = 0;

                    foreach (GroupColumn GroupColumn in matrixHeader.GroupColumns)
                    {
                        foreach (GroupColumn innerGroupColumn in GroupColumn.InnerGroupColumns)
                        {
                            groupExpression = columnGroupHierarchy[2 + 12].TextExpression;

                            groupValues = SelectByGroup(groupExpression, GenerateFilterExpression(GroupColumn.GroupExpression, GroupColumn.GroupValue, innerGroupColumn.GroupExpression, innerGroupColumn.GroupValue));

                            foreach (string groupValue in groupValues)
                            {
                                matrixHeader.GroupColumns[i1].InnerGroupColumns[i2].InnerGroupColumns.Add(new GroupColumn(groupExpression, groupValue, columnGroupHierarchy[2 + 12].StyleContent, columnGroupHierarchy[2 + 12].StyleClass));

                                matrixHeader.GroupColumns[i1].InnerGroupColumns[i2].Inner++;

                                matrixHeader.GroupColumns[i1].Inner++;
                            }

                            matrixHeader.GroupColumns[i1].InnerGroupColumns[i2].Summery = new Summery(columnGroupHierarchy[4 + 12].TextExpression, columnGroupHierarchy[4 + 12].StyleContent, columnGroupHierarchy[4 + 12].StyleClass,
                                columnGroupHierarchy[5 + 12].TextExpression, columnGroupHierarchy[5 + 12].StyleContent, columnGroupHierarchy[5 + 12].StyleClass);

                            matrixHeader.GroupColumns[i1].InnerGroupColumns[i2].Inner++;

                            i2++;
                        }

                        i1++;
                    }

                    colGroupLevel++;
                }

                #endregion
            }

            #endregion

            #region Generate TableHeader > Columns, Summery object

            bool hasGrouping = false;

            if (regionType == "Table")
            {
                detailColumns = tablixDesgin.Where(a => a.Category == "DetailColumns").ToList();

                for (int k = 0; k < detailColumns.Count; k++)
                {
                    hasGrouping = tablixDesgin.Where(a => a.TextExpression == detailColumns[k + 1].TextExpression && a.Category == "RowGrouping").Any();

                    tableHeader.Columns.Add(new Column(detailColumns[k + 1].TextExpression, detailColumns[k + 1].StyleContent, detailColumns[k + 1].StyleClass,
                        detailColumns[k + 2].TextExpression, detailColumns[k + 2].StyleContent, detailColumns[k + 2].StyleClass, hasGrouping));

                    tableHeader.Columns[tableHeader.Columns.Count - 1].Summery = new Summery(detailColumns[k + 3].TextExpression, detailColumns[k + 3].StyleContent, detailColumns[k + 3].StyleClass, false);

                    k = k + 3;
                }
            }

            #endregion

            #region Generate TablixBody > Details, Summeries Value

            if (regionType == "Table")
            {
                i = 0;

                i1 = 0;

                i2 = 0;

                foreach (GroupRow groupRow in tablix.GroupRows)
                {
                    #region GroupRow Level1

                    i1 = 0;

                    foreach (GroupRow innerGroupRow in groupRow.InnerGroupRows)
                    {
                        #region GroupRow Level2

                        i2 = 0;

                        foreach (GroupRow innerGroupRow2 in innerGroupRow.InnerGroupRows)
                        {
                            tablix.GroupRows[i].InnerGroupRows[i1].Inner++; //add rowspan to parent'2

                            tablix.GroupRows[i].Inner++; //add rowspan to parent

                            if (rowGroupLevel == 3)
                            {
                                j = 0;

                                subRawData = Select(GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue, innerGroupRow2.GroupExpression, innerGroupRow2.GroupValue));

                                details = new List<List<DetailItem>>();

                                foreach (DataRow dataRow in subRawData)
                                {
                                    details.Add(new List<DetailItem>());

                                    foreach (Column column in tableHeader.Columns)
                                    {
                                        if (innerGroupRow2.GroupExpression != column.ColumnExpression && innerGroupRow.GroupExpression != column.ColumnExpression && groupRow.GroupExpression != column.ColumnExpression)
                                        {
                                            details[j].Add(new DetailItem(dataRow[column.ColumnExpression], column.StyleContent, column.StyleClass, column.ColumnExpression));
                                        }
                                    }

                                    tablix.GroupRows[i].InnerGroupRows[i1].InnerGroupRows[i2].Inner++; //add rowspan to parent

                                    tablix.GroupRows[i].InnerGroupRows[i1].Inner++; //add rowspan to parent'2

                                    tablix.GroupRows[i].Inner++; //add rowspan to parent

                                    j++;
                                }

                                if (j == 1)
                                {

                                    tablix.GroupRows[i].InnerGroupRows[i1].Inner++; //add rowspan to parent'2

                                    tablix.GroupRows[i].Inner++; //add rowspan to parent
                                }

                                tablix.GroupRows[i].InnerGroupRows[i1].InnerGroupRows[i2].Details = details;
                            }

                            if (tablix.GroupRows[i].InnerGroupRows[i1].InnerGroupRows[i2].Inner > 1)
                            {
                                foreach (Column column in tableHeader.Columns)
                                {
                                    if (innerGroupRow2.GroupExpression != column.ColumnExpression && innerGroupRow.GroupExpression != column.ColumnExpression && groupRow.GroupExpression != column.ColumnExpression)
                                    {
                                        tablix.GroupRows[i].InnerGroupRows[i1].InnerGroupRows[i2].ColumnSummeries.Add(new Summery(column.StyleClass, column.StyleContent,
                                            (column.HeaderExpression == tableHeader.Columns[3].HeaderExpression ||
                                             column.Summery.SummeryExpression.Contains("!")
                                            ? Aggregate(column.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue, innerGroupRow2.GroupExpression, innerGroupRow2.GroupValue)) : "")
                                             ));
                                    }
                                    else //add rowspan to parent and parent'2 and current
                                    {
                                        if (innerGroupRow2.GroupExpression == column.ColumnExpression)
                                        {
                                            tablix.GroupRows[i].InnerGroupRows[i1].InnerGroupRows[i2].Inner++;

                                            tablix.GroupRows[i].InnerGroupRows[i1].Inner++;

                                            tablix.GroupRows[i].Inner++;
                                        }
                                    }
                                }
                            }

                            i2++;
                        }

                        #endregion

                        tablix.GroupRows[i].Inner++; //add rowspan to parent

                        if (rowGroupLevel == 2)
                        {
                            j = 0;

                            subRawData = Select(GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue));

                            details = new List<List<DetailItem>>();

                            foreach (DataRow dataRow in subRawData)
                            {
                                details.Add(new List<DetailItem>());

                                foreach (Column column in tableHeader.Columns)
                                {
                                    if (innerGroupRow.GroupExpression != column.ColumnExpression && groupRow.GroupExpression != column.ColumnExpression)
                                    {
                                        details[j].Add(new DetailItem(dataRow[column.ColumnExpression], column.StyleContent, column.StyleClass, column.ColumnExpression));
                                    }
                                }

                                tablix.GroupRows[i].InnerGroupRows[i1].Inner++; //add rowspan to current

                                tablix.GroupRows[i].Inner++; //add rowspan to parent

                                j++;
                            }

                            tablix.GroupRows[i].InnerGroupRows[i1].Details = details;

                            if (j == 1)
                            {

                                tablix.GroupRows[i].Inner++; //add rowspan to parent
                            }
                        }

                        if (tablix.GroupRows[i].InnerGroupRows[i1].Inner > 1)
                        {
                            foreach (Column column in tableHeader.Columns)
                            {
                                if (innerGroupRow.GroupExpression != column.ColumnExpression && groupRow.GroupExpression != column.ColumnExpression)
                                {
                                    tablix.GroupRows[i].InnerGroupRows[i1].ColumnSummeries.Add(new Summery(column.StyleClass, column.StyleContent,
                                         (column.HeaderExpression == tableHeader.Columns[2].HeaderExpression ||
                                         column.Summery.SummeryExpression.Contains("!")
                                         ? Aggregate(column.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue)) : "")
                                         ));
                                }
                                else //add rowspan to parent and current
                                {
                                    if (innerGroupRow.GroupExpression == column.ColumnExpression)
                                    {
                                        tablix.GroupRows[i].InnerGroupRows[i1].Inner++;

                                        tablix.GroupRows[i].Inner++;
                                    }
                                }
                            }
                        }

                        i1++;
                    }

                    #endregion

                    if (rowGroupLevel == 1)
                    {
                        j = 0;

                        subRawData = Select(GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue));

                        details = new List<List<DetailItem>>();

                        foreach (DataRow dataRow in subRawData)
                        {
                            details.Add(new List<DetailItem>());

                            foreach (Column column in tableHeader.Columns)
                            {
                                if (groupRow.GroupExpression != column.ColumnExpression)
                                {
                                    details[j].Add(new DetailItem(dataRow[column.ColumnExpression], column.StyleContent, column.StyleClass, column.ColumnExpression));
                                }
                            }

                            tablix.GroupRows[i].Inner++; //add rowspan to current

                            j++;
                        }

                        tablix.GroupRows[i].Details = details;
                    }

                    if (tablix.GroupRows[i].Inner > 1)
                    {
                        foreach (Column column in tableHeader.Columns)
                        {
                            if (groupRow.GroupExpression != column.ColumnExpression)
                            {
                                tablix.GroupRows[i].ColumnSummeries.Add(new Summery(column.StyleClass, column.StyleContent,
                                     (column.HeaderExpression == tableHeader.Columns[1].HeaderExpression ||
                                     column.Summery.SummeryExpression.Contains("!")
                                     ? Aggregate(column.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue)) : "")
                                    ));
                            }
                            else
                            {
                                tablix.GroupRows[i].Inner++; //add rowspan to current or parent
                            }
                        }
                    }

                    i++;
                }

                foreach (Column column in tableHeader.Columns)
                {
                    tablix.ColumnSummeries.Add(new Summery(column.StyleClass, column.StyleContent,
                        (column.HeaderExpression == tableHeader.Columns[0].HeaderExpression ||
                        column.Summery.SummeryExpression.Contains("!")
                        ? Aggregate(column.Summery.SummeryExpression) : "")
                        ));
                }

                if (rowGroupLevel == 0)
                {
                    j = 0;

                    details = new List<List<DetailItem>>();

                    foreach (DataRow dataRow in _allData.Rows)
                    {
                        details.Add(new List<DetailItem>());

                        foreach (Column column in tableHeader.Columns)
                        {
                            details[j].Add(new DetailItem(dataRow[column.ColumnExpression], column.StyleContent, column.StyleClass, column.ColumnExpression));
                        }

                        j++;
                    }

                    tablix.Details = details;
                }
            }

            #endregion

            #region Generate TablixBody > Summeries Value

            if (regionType == "Matrix")
            {
                i = 0;

                i1 = 0;

                i2 = 0;

                foreach (GroupRow groupRow in tablix.GroupRows)
                {
                    #region GroupRow Level1

                    i1 = 0;

                    foreach (GroupRow innerGroupRow in groupRow.InnerGroupRows)
                    {
                        #region GroupRow Level2

                        i2 = 0;

                        foreach (GroupRow innerGroupRow2 in groupRow.InnerGroupRows)
                        {
                            foreach (GroupColumn groupColumn in matrixHeader.GroupColumns)
                            {
                                #region GroupColumn Level1

                                foreach (GroupColumn innerGroupColumn in groupColumn.InnerGroupColumns)
                                {
                                    #region GroupColumn Level2

                                    foreach (GroupColumn innerGroupColumn2 in groupColumn.InnerGroupColumns)
                                    {
                                        tablix.GroupRows[i].InnerGroupRows[i1].InnerGroupRows[i2].ColumnSummeries.Add(new Summery(innerGroupColumn2.StyleClass, innerGroupColumn2.StyleContent,
                                             Aggregate(innerGroupColumn2.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue, innerGroupRow2.GroupExpression, innerGroupRow2.GroupValue, innerGroupColumn2.GroupExpression, innerGroupColumn2.GroupValue, innerGroupColumn.GroupExpression, innerGroupColumn.GroupValue, groupColumn.GroupExpression, groupColumn.GroupValue))
                                             ));
                                    }

                                    #endregion

                                    tablix.GroupRows[i].InnerGroupRows[i1].InnerGroupRows[i2].ColumnSummeries.Add(new Summery(innerGroupColumn.StyleClass, innerGroupColumn.StyleContent,
                                         Aggregate(innerGroupColumn.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue, innerGroupRow2.GroupExpression, innerGroupRow2.GroupValue, innerGroupColumn.GroupExpression, innerGroupColumn.GroupValue, groupColumn.GroupExpression, groupColumn.GroupValue))
                                         ));
                                }

                                #endregion

                                tablix.GroupRows[i].InnerGroupRows[i1].InnerGroupRows[i2].ColumnSummeries.Add(new Summery(groupColumn.StyleClass, groupColumn.StyleContent,
                                     Aggregate(groupColumn.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue, innerGroupRow2.GroupExpression, innerGroupRow2.GroupValue, groupColumn.GroupExpression, groupColumn.GroupValue))
                                     ));
                            }

                            tablix.GroupRows[i].InnerGroupRows[i1].InnerGroupRows[i2].Summery.SummeryValue = Aggregate(tablix.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue, innerGroupRow2.GroupExpression, innerGroupRow2.GroupValue));

                            i2++;
                        }

                        #endregion

                        foreach (GroupColumn groupColumn in matrixHeader.GroupColumns)
                        {
                            #region GroupColumn Level1

                            foreach (GroupColumn innerGroupColumn in groupColumn.InnerGroupColumns)
                            {
                                #region GroupColumn Level2

                                foreach (GroupColumn innerGroupColumn2 in groupColumn.InnerGroupColumns)
                                {
                                    tablix.GroupRows[i].InnerGroupRows[i1].ColumnSummeries.Add(new Summery(innerGroupColumn2.StyleClass, innerGroupColumn2.StyleContent,
                                        Aggregate(innerGroupColumn2.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue, innerGroupColumn2.GroupExpression, innerGroupColumn2.GroupValue, innerGroupColumn.GroupExpression, innerGroupColumn.GroupValue, groupColumn.GroupExpression, groupColumn.GroupValue))
                                        ));
                                }

                                #endregion

                                tablix.GroupRows[i].InnerGroupRows[i1].ColumnSummeries.Add(new Summery(innerGroupColumn.StyleClass, innerGroupColumn.StyleContent,
                                    Aggregate(innerGroupColumn.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue, innerGroupColumn.GroupExpression, innerGroupColumn.GroupValue, groupColumn.GroupExpression, groupColumn.GroupValue))
                                    ));
                            }

                            #endregion

                            tablix.GroupRows[i].InnerGroupRows[i1].ColumnSummeries.Add(new Summery(groupColumn.StyleClass, groupColumn.StyleContent,
                                Aggregate(groupColumn.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue, groupColumn.GroupExpression, groupColumn.GroupValue))
                                ));
                        }

                        tablix.GroupRows[i].InnerGroupRows[i1].Summery.SummeryValue = Aggregate(innerGroupRow.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupRow.GroupExpression, innerGroupRow.GroupValue));

                        i1++;
                    }

                    #endregion

                    foreach (GroupColumn groupColumn in matrixHeader.GroupColumns)
                    {
                        #region GroupColumn Level1

                        foreach (GroupColumn innerGroupColumn in groupColumn.InnerGroupColumns)
                        {
                            #region GroupColumn Level2

                            foreach (GroupColumn innerGroupColumn2 in groupColumn.InnerGroupColumns)
                            {
                                tablix.GroupRows[i].ColumnSummeries.Add(new Summery(innerGroupColumn2.StyleClass, innerGroupColumn2.StyleContent,
                                    Aggregate(innerGroupColumn2.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupColumn2.GroupExpression, innerGroupColumn2.GroupValue, innerGroupColumn.GroupExpression, innerGroupColumn.GroupValue, groupColumn.GroupExpression, groupColumn.GroupValue))
                                    ));
                            }

                            #endregion

                            tablix.GroupRows[i].ColumnSummeries.Add(new Summery(innerGroupColumn.StyleClass, innerGroupColumn.StyleContent,
                                Aggregate(innerGroupColumn.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, innerGroupColumn.GroupExpression, innerGroupColumn.GroupValue, groupColumn.GroupExpression, groupColumn.GroupValue))
                                ));
                        }

                        #endregion

                        tablix.GroupRows[i].ColumnSummeries.Add(new Summery(groupColumn.StyleClass, groupColumn.StyleContent,
                            Aggregate(groupColumn.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue, groupColumn.GroupExpression, groupColumn.GroupValue))
                            ));
                    }

                    tablix.GroupRows[i].Summery.SummeryValue = Aggregate(groupRow.Summery.SummeryExpression, GenerateFilterExpression(groupRow.GroupExpression, groupRow.GroupValue));

                    i++;
                }

                foreach (GroupColumn groupColumn in matrixHeader.GroupColumns)
                {
                    #region GroupColumn Level1

                    foreach (GroupColumn innerGroupColumn in groupColumn.InnerGroupColumns)
                    {
                        #region GroupColumn Level2

                        foreach (GroupColumn innerGroupColumn2 in groupColumn.InnerGroupColumns)
                        {
                            tablix.ColumnSummeries.Add(new Summery(innerGroupColumn2.StyleClass, innerGroupColumn2.StyleContent,
                                Aggregate(innerGroupColumn2.Summery.SummeryExpression, GenerateFilterExpression(innerGroupColumn2.GroupExpression, innerGroupColumn2.GroupValue, innerGroupColumn.GroupExpression, innerGroupColumn.GroupValue, groupColumn.GroupExpression, groupColumn.GroupValue))
                                ));
                        }

                        #endregion

                        tablix.ColumnSummeries.Add(new Summery(innerGroupColumn.StyleClass, innerGroupColumn.StyleContent,
                            Aggregate(innerGroupColumn.Summery.SummeryExpression, GenerateFilterExpression(innerGroupColumn.GroupExpression, innerGroupColumn.GroupValue, groupColumn.GroupExpression, groupColumn.GroupValue))
                            ));
                    }

                    #endregion

                    tablix.ColumnSummeries.Add(new Summery(groupColumn.StyleClass, groupColumn.StyleContent,
                        Aggregate(groupColumn.Summery.SummeryExpression, GenerateFilterExpression(groupColumn.GroupExpression, groupColumn.GroupValue))
                        ));
                }

                tablix.Summery.SummeryValue = Aggregate(tablix.Summery.SummeryExpression);
            }

            #endregion
        }

        catch (Exception exp)
        {
            int logID = LogProvider.LogException(10060, exp.Message, exp.StackTrace + "[" + dataProvider.FinalQueryText + "]", objKey, id);

            return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
        }

        jsonResult = new StringBuilder("{\"TableID\": " + dataRegionID + ",\"colGroupLevel\": " + colGroupLevel + ",\"rowGroupLevel\": " + rowGroupLevel + ",\"totalRecords\": " + dataProvider.TotalRecords + ",\"filterdRecords\": " + dataProvider.FilterdRecords + ",\"totalPages\": " + totalPages + ",\"fromRecords\": null,\"data\": {");

        #region render json Results

        #region render header of Matrix

        if (regionType == "Matrix")
        {
            jsonResult.Append("\"header\":{\"colGroups\":[");

            foreach (GroupColumn colGroup in matrixHeader.GroupColumns)
            {
                jsonResult.Append("{\"groupValue\":\"" + colGroup.GroupValue + "\",\"styleClass\":\"" + colGroup.StyleClass + "\",\"styleContent\":\"" + colGroup.StyleContent + "\",\"inner\":\"" + colGroup.Inner + "\",\"level\":\"0\",\"colGroups\":[");

                #region Level1

                foreach (GroupColumn innerColGroup in colGroup.InnerGroupColumns)
                {
                    jsonResult.Append("{\"groupValue\":\"" + innerColGroup.GroupValue + "\",\"styleClass\":\"" + innerColGroup.StyleClass + "\",\"styleContent\":\"" + innerColGroup.StyleContent + "\",\"inner\":\"" + innerColGroup.Inner + "\",\"level\":\"1\",colGroups:[");

                    #region Level2

                    foreach (GroupColumn innerColGroup2 in innerColGroup.InnerGroupColumns)
                    {
                        jsonResult.Append("{\"groupValue\":\"" + innerColGroup2.GroupValue + "\",\"styleClass\":\"" + innerColGroup2.StyleClass + "\",\"styleContent\":\"" + innerColGroup2.StyleContent + "\",\"inner\":\"" + innerColGroup.Inner + "\",\"level\":\"2\",");

                        jsonResult.Append("\"summery\":{\"value\":\"" + innerColGroup2.Summery.HeaderExpression + "\",\"styleContent\":\"" + innerColGroup2.Summery.StyleContent + "\",\"styleClass\":\"" + innerColGroup2.Summery.StyleClass + "\"}");

                        jsonResult.Append("},");
                    }

                    #endregion

                    jsonResult.Append("],\"summery\":{\"value\":\"" + innerColGroup.Summery.HeaderExpression + "\",\"styleContent\":\"" + innerColGroup.Summery.StyleContent + "\",\"styleClass\":\"" + innerColGroup.Summery.StyleClass + "\"}");

                    jsonResult.Append("},");
                }

                #endregion

                jsonResult.Append("]");

                jsonResult.Append("},");
            }

            jsonResult.Append("],\"summery\":{\"value\":\"" + matrixHeader.Summery.HeaderExpression + "\",\"styleContent\":\"" + matrixHeader.Summery.StyleContent + "\",\"styleClass\":\"" + matrixHeader.Summery.StyleClass + "\"}");

            jsonResult.Append("}");
        }

        #endregion

        #region render header of Table

        if (regionType == "Table")
        {
            jsonResult.Append("\"header\":[");

            foreach (Column headerCell in tableHeader.Columns)
            {
                jsonResult.Append("{\"alias\":\"" + headerCell.ColumnExpression + "\",\"value\":\"" + headerCell.HeaderExpression + "\",\"styleClass\":\"" + headerCell.StyleClass + "\",\"styleContent\":\"" + headerCell.StyleContent + "\"},");
            }

            jsonResult.Append("]");
        }

        #endregion

        jsonResult.Append(",\"rowGroups\":[");

        foreach (GroupRow rowGroup in tablix.GroupRows)
        {
            jsonResult.Append("{\"groupValue\":\"" + rowGroup.GroupValue + "\",\"styleClass\":\"" + rowGroup.StyleClass + "\",\"styleContent\":\"" + rowGroup.StyleContent + "\",\"inner\":\"" + rowGroup.Inner + "\",\"level\":\"0\",\"rowGroups\":[");

            #region Level1

            foreach (GroupRow innerRowGroup in rowGroup.InnerGroupRows)
            {
                jsonResult.Append("{\"groupValue\":\"" + innerRowGroup.GroupValue + "\",\"styleClass\":\"" + innerRowGroup.StyleClass + "\",\"styleContent\":\"" + innerRowGroup.StyleContent + "\",\"inner\":\"" + innerRowGroup.Inner + "\",\"level\":\"1\",\"rowGroups\":[");

                #region Level2

                foreach (GroupRow innerRowGroup2 in innerRowGroup.InnerGroupRows)
                {
                    jsonResult.Append("{\"groupValue\":\"" + innerRowGroup2.GroupValue + "\",\"styleClass\":\"" + innerRowGroup2.StyleClass + "\",\"styleContent\":\"" + innerRowGroup2.StyleContent + "\",\"inner\":\"" + innerRowGroup2.Inner + "\",\"level\":\"2\",");

                    #region render details

                    if (innerRowGroup2.Details.Count > 0)
                    {
                        jsonResult.Append("\"details\":[");

                        foreach (List<DetailItem> detail in innerRowGroup2.Details)
                        {
                            jsonResult.Append("[");

                            foreach (DetailItem detailItem in detail)
                            {
                                jsonResult.Append("{\"value\":\"" + FormatValue(detailItem.Value, detailItem.Name) + "\",\"styleContent\":\"" + detailItem.StyleContent + "\",\"styleClass\":\"" + detailItem.StyleClass + "\"},");
                            }

                            jsonResult.Append("],");
                        }

                        jsonResult.Append("]");
                    }

                    #endregion

                    #region render summeries

                    jsonResult.Append(",\"summeries\":[");

                    foreach (Summery summery in innerRowGroup2.ColumnSummeries)
                    {
                        jsonResult.Append("{\"value\":\"" + summery.SummeryValue + "\",\"styleContent\":\"" + summery.StyleContent + "\",\"styleClass\":\"" + summery.StyleClass + "\"},");
                    }

                    if (innerRowGroup.Summery != null)
                    {
                        jsonResult.Append("{\"value\":\"" + innerRowGroup2.Summery.SummeryValue + "\",\"styleContent\":\"" + innerRowGroup2.Summery.StyleContent + "\",\"styleClass\":\"" + innerRowGroup2.Summery.StyleClass + "\"}");
                    }

                    jsonResult.Append("]");

                    #endregion

                    jsonResult.Append("},");
                }

                jsonResult.Append("]");

                #endregion

                #region render details

                if (innerRowGroup.Details.Count > 0)
                {
                    jsonResult.Append(",\"details\":[");

                    foreach (List<DetailItem> detail in innerRowGroup.Details)
                    {
                        jsonResult.Append("[");

                        foreach (DetailItem detailItem in detail)
                        {
                            jsonResult.Append("{\"value\":\"" + FormatValue(detailItem.Value, detailItem.Name) + "\",\"styleContent\":\"" + detailItem.StyleContent + "\",\"styleClass\":\"" + detailItem.StyleClass + "\"},");
                        }

                        jsonResult.Append("],");
                    }

                    jsonResult.Append("]");
                }

                #endregion

                #region render summeries

                jsonResult.Append(",\"summeries\":[");

                foreach (Summery summery in innerRowGroup.ColumnSummeries)
                {
                    jsonResult.Append("{\"value\":\"" + summery.SummeryValue + "\",\"styleContent\":\"" + summery.StyleContent + "\",\"styleClass\":\"" + summery.StyleClass + "\"},");
                }

                if (innerRowGroup.Summery != null)
                {
                    jsonResult.Append("{\"value\":\"" + innerRowGroup.Summery.SummeryValue + "\",\"styleContent\":\"" + innerRowGroup.Summery.StyleContent + "\",\"styleClass\":\"" + innerRowGroup.Summery.StyleClass + "\"}");
                }

                jsonResult.Append("]");

                #endregion

                jsonResult.Append("},");
            }

            #endregion

            jsonResult.Append("]");

            #region render details

            if (rowGroup.Details.Count > 0)
            {
                jsonResult.Append(",\"details\":[");

                foreach (List<DetailItem> detail in rowGroup.Details)
                {
                    jsonResult.Append("[");

                    foreach (DetailItem detailItem in detail)
                    {
                        jsonResult.Append("{\"value\":\"" + FormatValue(detailItem.Value, detailItem.Name) + "\",\"styleContent\":\"" + detailItem.StyleContent + "\",\"styleClass\":\"" + detailItem.StyleClass + "\"},");
                    }

                    jsonResult.Append("],");
                }

                jsonResult.Append("]");
            }

            #endregion

            #region render summeries

            jsonResult.Append(",\"summeries\":[");

            foreach (Summery summery in rowGroup.ColumnSummeries)
            {
                jsonResult.Append("{\"value\":\"" + summery.SummeryValue + "\",\"styleContent\":\"" + summery.StyleContent + "\",\"styleClass\":\"" + summery.StyleClass + "\"},");
            }

            if (rowGroup.Summery != null)
            {
                jsonResult.Append("{\"value\":\"" + rowGroup.Summery.SummeryValue + "\",\"styleContent\":\"" + rowGroup.Summery.StyleContent + "\",\"styleClass\":\"" + rowGroup.Summery.StyleClass + "\"}");
            }

            jsonResult.Append("]");

            #endregion

            jsonResult.Append("},");
        }

        jsonResult.Append("]");

        #region render details

        if (tablix.Details.Count > 0)
        {
            jsonResult.Append(",\"details\":[");

            foreach (List<DetailItem> detail in tablix.Details)
            {
                jsonResult.Append("[");

                foreach (DetailItem detailItem in detail)
                {
                    jsonResult.Append("{\"value\":\"" + FormatValue(detailItem.Value, detailItem.Name) + "\",\"styleContent\":\"" + detailItem.StyleContent + "\",\"styleClass\":\"" + detailItem.StyleClass + "\"},");
                }

                jsonResult.Append("],");
            }

            jsonResult.Append("]");
        }

        #endregion

        #region render summeries

        jsonResult.Append(",\"summeries\":[");

        if (tablix.Summery != null)
        {
            if (tablix.Summery.SummeryValue != null)
            {
                jsonResult.Append("{\"value\":\"" + tablix.Summery.HeaderExpression + "\",\"styleContent\":\"" + tablix.Summery.HeaderStyleContent + "\",\"styleClass\":\"" + tablix.Summery.HeaderStyleClass + "\"},");
            }
        }

        foreach (Summery summery in tablix.ColumnSummeries)
        {
            jsonResult.Append("{\"value\":\"" + summery.SummeryValue + "\",\"styleContent\":\"" + summery.StyleContent + "\",\"styleClass\":\"" + summery.StyleClass + "\"},");
        }

        if (tablix.Summery != null)
        {
            if (tablix.Summery.SummeryValue != null)
            {
                jsonResult.Append("{\"value\":\"" + tablix.Summery.SummeryValue + "\",\"styleContent\":\"" + tablix.Summery.StyleContent + "\",\"styleClass\":\"" + tablix.Summery.StyleClass + "\"}");
            }
        }

        jsonResult.Append("]");

        #endregion

        #endregion

        jsonResult.Append("},\"requestToken\":" + SessionProvider.GenRequestToken() + "}");

        #region Dispose WebService Resources

        _allData.Dispose();

        pageFilter = null;

        pagingData = null;

        dataProvider.Dispose();

        dataProvider = null;

        tablix = null;

        matrixHeader = null;

        tableHeader = null;

        tablixDesgin = null;

        columnGroupHierarchy = null;

        rowGroupHierarchy = null;

        detailColumns = null;

        details = null;

        subRawData = null;

        #endregion

        return jsonResult.Replace("},]", "}]").Replace("],]", "]]").ToString();
    }

    [WebMethod(EnableSession = true)]
    public string GetDataList(int id, int dataRegionID, int start, int length, ActivityParam[] advancedSearch, int objKey, OrderParam[] order, string responseToken)
    {
        string acccessCriteria;

        string query;

        string reportQuery;

        string datasetQuery;

        string datasetQueryType;

        string reportDefaultFilter;

        string regionType;

        int totalPages = 1;

        int fromRecords = start + 1;

        int toRecords = start + length;

        StringBuilder jsonResult;

        SqlDataProvider dataProvider;

        Tablix tablix = new Tablix();

        TableHeader listHeader = new TableHeader();

        List<ListElement> listDesgin = new List<ListElement>();

        List<ListElement> detailColumns;

        bool hasSummery = false;

        List<Dictionary<string, object>> results;

        #region Validation

        int sessionValidate = SessionProvider.ValidateSession("CurrentSession");

        if (sessionValidate == 2 || sessionValidate == 3)
        {
            int logID = LogProvider.LogException(10010, "Session is invalid.", "ReportID is" + id);

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
            acccessCriteria = SecurityProvider.ValidateUserReportAccess(id);
        }
        catch (AppException exp)
        {
            return LogProvider.PrepareLogResultStr(exp.ErrorLogID, exp.ErrorMessage, exp.ErrorCode);
        }

        #endregion

        #region Get ListInfo From Database

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

            query = "select Sys_Rpt_Reports.QueryText as ReportQueryText,'' as ReportDefaultFilter,  Sys_Rpt_Datasets.QueryText, Sys_Rpt_Datasets.QueryType, Sys_Rpt_Datasets.DatasetID from Sys_Rpt_Reports inner join Sys_Rpt_Datasets on Sys_Rpt_Reports.DatasetID = Sys_Rpt_Datasets.DatasetID where Sys_Rpt_Reports.ReportID = " + id;

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        reportQuery = reader["ReportQueryText"].ToString();

                        datasetQuery = reader["QueryText"].ToString();

                        datasetQueryType = reader["QueryType"].ToString();

                        reportDefaultFilter = reader["ReportDefaultFilter"].ToString();

                        dataProvider = new SqlDataProvider(reportQuery, datasetQuery, datasetQueryType);
                    }

                    command.CommandText = "select Type from Sys_Rpt_DataRegions where Enabled = 1 and DataRegionID = " + dataRegionID;

                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        regionType = reader["Type"].ToString();
                    }

                    if (regionType == "List")
                    {
                        command.CommandText = "select Sys_Rpt_ListDesigns.* from Sys_Rpt_ListDesigns inner join Sys_Rpt_Lists on Sys_Rpt_ListDesigns.ListID = Sys_Rpt_Lists.ListID where Sys_Rpt_ListDesigns.Enabled = 1 and Sys_Rpt_Lists.DataRegionID = " + dataRegionID + " order by Category, ColumnPosition, ElementID";
                    }

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            listDesgin.Add(new ListElement(reader["Type"], reader["TextExpression"], reader["StyleContent"], reader["StyleClass"],
                                 reader["Category"]));
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, exp.StackTrace + "[" + query + "]", id);

                    return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                }
            }
        }

        #endregion

        try
        {
            if (advancedSearch.Length == 1)
            {
                if (acccessCriteria != "")
                {
                    if (reportDefaultFilter != "")
                        acccessCriteria = acccessCriteria + " AND ( " + reportDefaultFilter + ")";
                }
                else
                {
                    acccessCriteria = reportDefaultFilter;
                }
            }

            dataProvider.ExecuteQuery(start, length, advancedSearch, objKey, acccessCriteria, order);

            results = dataProvider.Results;

            #region Generate ListHeader > Columns, Summery object

            if (regionType == "List")
            {
                detailColumns = listDesgin.Where(a => a.Category == "DetailColumns").ToList();
              
                for (int k = 0; k < detailColumns.Count; k++)
                {
                    listHeader.Columns.Add(new Column(detailColumns[k + 1].TextExpression, detailColumns[k + 1].StyleContent, detailColumns[k + 1].StyleClass,
                        detailColumns[k + 2].TextExpression, detailColumns[k + 2].StyleContent, detailColumns[k + 2].StyleClass, false));

                    if (!string.IsNullOrEmpty(detailColumns[k + 3].TextExpression))
                    {
                        hasSummery = true;
                    }

                    listHeader.Columns[listHeader.Columns.Count - 1].Summery = new Summery(detailColumns[k + 3].TextExpression, detailColumns[k + 3].StyleContent, detailColumns[k + 3].StyleClass, false);

                    k = k + 3;
                }
            }

            #endregion

        }

        catch (Exception exp)
        {
            int logID = LogProvider.LogException(10060, exp.Message, exp.StackTrace + "[" + dataProvider.FinalQueryText + "]", objKey, id);

            return LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
        }

        totalPages = (dataProvider.FilterdRecords / length);

        if (dataProvider.FilterdRecords % length > 0)
        {
            totalPages++;
        }

        //last page
        if (toRecords >= dataProvider.FilterdRecords || toRecords == -1)
        {
            toRecords = dataProvider.FilterdRecords;

            if (hasSummery)
            {
                #region Generate ListBody > Summeries Value

                dataProvider.ExecuteQueryAsTable(advancedSearch, objKey, acccessCriteria, order);

                _allData = dataProvider.ResultTable;

                foreach (Column column in listHeader.Columns)
                {
                    tablix.ColumnSummeries.Add(new Summery(column.StyleClass, column.StyleContent,
                        Aggregate(column.Summery.SummeryExpression)
                        ));
                }

                #endregion
            }
        }
        else
        {
            hasSummery = false;
        }

        if (dataProvider.FilterdRecords == 0)
        {
            fromRecords = 0;
        }

        if (toRecords == -1)
        {
            toRecords = dataProvider.FilterdRecords;
        }

        if (totalPages < 0)
        {
            totalPages = 1;
        }

        jsonResult = new StringBuilder("{\"TableID\": " + dataRegionID + ",\"totalRecords\": " + dataProvider.TotalRecords + ",\"filterdRecords\": " + dataProvider.FilterdRecords + ",\"totalPages\": " + totalPages + ",\"fromRecords\":  " + fromRecords + ",\"toRecords\":  " + toRecords + ",\"data\": {");

        #region render json Results

        #region render header of List

        jsonResult.Append("\"header\":[");

        jsonResult.Append("{\"alias\":\"" + "rownumber" + "\",\"value\":\"" + "ردیف" + "\",\"styleClass\":\"" + "" + "\",\"styleContent\":\"" + "width:30px" + "\"},");

        foreach (Column cell in listHeader.Columns)
        {
            jsonResult.Append("{\"alias\":\"" + cell.ColumnExpression + "\",\"value\":\"" + cell.HeaderExpression + "\",\"styleClass\":\"" + cell.HeaderStyleClass + "\",\"styleContent\":\"" + cell.HeaderStyleContent + "\"},");
        }

        jsonResult.Append("]");

        #endregion

        #region render details

        jsonResult.Append(",\"details\":[");

        int i = fromRecords;

        foreach (var resultItem in results)
        {
            jsonResult.Append("[");

            jsonResult.Append("{\"value\":\"" + i + "\",\"styleClass\":\"" + "" + "\",\"styleContent\":\"" + "" + "\"},");

            foreach (Column cell in listHeader.Columns)
            {
                try
                {
                    jsonResult.Append("{\"value\":\"" + FormatValue(resultItem[cell.ColumnExpression], cell.ColumnExpression) + "\",\"styleClass\":\"" + cell.StyleClass + "\",\"styleContent\":\"" + cell.StyleContent + "\"},");
                }
                catch
                {
                    LogProvider.LogTraceData("ColumnExpressionError", cell.ColumnExpression);

                    foreach (string val in resultItem.Keys)
                        LogProvider.LogTraceData("CEE_" + val, val);
                }
            }

            i++;

            jsonResult.Append("],");
        }

        jsonResult.Append("]");

        #endregion

        #region render summeries

        if (hasSummery)
        {
            jsonResult.Append(",\"summeries\":[");

            jsonResult.Append("{\"value\":\"\",\"styleClass\":\"" + "" + "\",\"styleContent\":\"" + "" + "\"},");

            foreach (Summery summery in tablix.ColumnSummeries)
            {
                jsonResult.Append("{\"value\":\"" + summery.SummeryValue + "\",\"styleContent\":\"" + summery.StyleContent + "\",\"styleClass\":\"" + summery.StyleClass + "\"},");
            }

            jsonResult.Append("]");
        }

        #endregion

        #endregion

        jsonResult.Append("},\"requestToken\":" + SessionProvider.GenRequestToken() + "}");

        #region Dispose WebService Resources

        dataProvider.Dispose();

        dataProvider = null;

        listHeader = null;

        detailColumns = null;

        #endregion

        return jsonResult.Replace("},]", "}]").Replace("],]", "]]").ToString();
    }

    private DataRow[] Select(string filterExpression)
    {
        return this._allData.Select(filterExpression);
    }

    private List<string> SelectByGroup(string groupExpression, string filterExpression)
    {
        DataRow[] subRawData = this._allData.Select(filterExpression);

        List<string> groupValues = new List<string>();

        Dictionary<string, string> _groupValues = new Dictionary<string, string>();

        string nVal = null;

        foreach (DataRow dataRow in subRawData)
        {
            nVal = Convert.ToString(dataRow[groupExpression]);

            if (!_groupValues.Keys.Contains(nVal))
            {
                groupValues.Add(nVal);

                _groupValues.Add(nVal, nVal);
            }
        }

        return groupValues;
    }

    private List<string> SelectByGroup(string groupExpression)
    {
        List<string> groupValues = new List<string>();

        Dictionary<string, string> _groupValues = new Dictionary<string, string>();

        string nVal = null;

        foreach (DataRow dataRow in this._allData.Rows)
        {
            nVal = Convert.ToString(dataRow[groupExpression]);

            if (!_groupValues.Keys.Contains(nVal))
            {
                groupValues.Add(nVal);

                _groupValues.Add(nVal, nVal);
            }
        }

        return groupValues;
    }

    private string Aggregate(string aggregateExpression)
    {
        if (string.IsNullOrEmpty(aggregateExpression))
        {
            return "";
        }

        if (!aggregateExpression.Contains("!"))
        {
            return aggregateExpression;
        }

        try
        {
            object value = this._allData.Compute(aggregateExpression.Replace("!", ""), "");

            return FormatValue(value, aggregateExpression);
        }
        catch(Exception exp)
        {
            LogProvider.LogTraceData("AggregateError", exp.Message);

            return "0";
        }
    }

    private string Aggregate(string aggregateExpression, string filterExpression)
    {
        if (string.IsNullOrEmpty(aggregateExpression))
        {
            return "";
        }

        if (!aggregateExpression.Contains("!"))
        {
            return aggregateExpression;
        }

        object value = this._allData.Compute(aggregateExpression.Replace("!", ""), filterExpression);

        return FormatValue(value, aggregateExpression);
    }

    private string GenerateFilterExpression(params string[] filterPairs)
    {
        string filterExpression = "";

        for (int i = 0; i < filterPairs.Length; i++)
        {
            filterExpression += "(" + filterPairs[i] + " = '" + filterPairs[i + 1] + "') AND ";

            i++;
        }

        if (filterExpression.Length > 0)
        {
            return filterExpression.Substring(0, filterExpression.Length - 5);
        }
        else
        {
            return "";
        }
    }

    private class Column
    {
        public string HeaderExpression;

        public string HeaderStyleContent;

        public string HeaderStyleClass;

        public string ColumnExpression;

        public string StyleContent;

        public string StyleClass;

        public Summery Summery;

        public bool HasGrouping;

        public Column(string headerExpression, string headerStyleContent, string headerStyleClass, string columnExpression, string styleContent, string styleClass, bool hasGrouping)
        {
            this.HeaderExpression = headerExpression;

            this.StyleClass = styleClass;

            this.StyleContent = styleContent;

            this.ColumnExpression = columnExpression;

            this.HeaderStyleContent = headerStyleContent;

            this.HeaderStyleClass = headerStyleClass;

            this.HasGrouping = hasGrouping;
        }
    }

    private class Summery
    {
        public Summery(string styleContent, string styleClass, string summeryValue)
        {
            this.SummeryValue = summeryValue;

            this.StyleClass = styleClass;

            this.StyleContent = styleContent;
        }

        public Summery(string headerExpression, string headerStyleContent, string headerStyleClass, string summeryExpression, string styleContent, string styleClass)
        {
            this.HeaderExpression = headerExpression;

            this.StyleClass = styleClass;

            this.StyleContent = styleContent;

            this.SummeryExpression = summeryExpression;

            this.HeaderStyleContent = headerStyleContent;

            this.HeaderStyleClass = headerStyleClass;
        }

        public Summery(string summeryExpression, string styleContent, string styleClass, bool withHeader)
        {
            this.StyleClass = styleClass;

            this.StyleContent = styleContent;

            this.SummeryExpression = summeryExpression;
        }

        public Summery()
        {

        }

        public string HeaderExpression;

        public string HeaderStyleContent;

        public string HeaderStyleClass;

        public string StyleContent;

        public string StyleClass;

        public string SummeryExpression;

        public string SummeryValue;
    }

    private struct DetailItem
    {
        public string Value;

        public string StyleContent;

        public string StyleClass;

        public string Name;

        public DetailItem(object value, string styleContent, string styleClass, string name)
        {
            this.Value = Convert.ToString(value);

            this.StyleClass = styleClass;

            this.StyleContent = styleContent;

            this.Name = name;
        }
    }

    private class GroupRow
    {
        public int Inner;

        public string GroupValue;

        public string GroupExpression;

        public string StyleContent;

        public string StyleClass;

        public List<GroupRow> InnerGroupRows = new List<GroupRow>();

        public List<List<DetailItem>> Details = new List<List<DetailItem>>();

        public List<Summery> ColumnSummeries = new List<Summery>();

        public Summery Summery;

        public GroupRow(string groupExpression, string groupValue, string styleContent, string styleClass)
        {
            this.GroupExpression = groupExpression;

            this.GroupValue = groupValue;

            this.StyleClass = styleClass;

            this.StyleContent = styleContent;
        }
    }

    private class GroupColumn
    {
        public int Inner;

        public string GroupValue;

        public string GroupExpression;

        public string StyleContent;

        public string StyleClass;

        public List<GroupColumn> InnerGroupColumns = new List<GroupColumn>();

        public Summery Summery;

        public GroupColumn(string groupExpression, string groupValue, string styleContent, string styleClass)
        {
            this.GroupExpression = groupExpression;

            this.GroupValue = groupValue;

            this.StyleClass = styleClass;

            this.StyleContent = styleContent;
        }
    }

    private class Tablix
    {
        public List<GroupRow> GroupRows = new List<GroupRow>();

        public List<List<DetailItem>> Details = new List<List<DetailItem>>();

        public Summery Summery;

        public List<Summery> ColumnSummeries = new List<Summery>();
    }

    private class MatrixHeader
    {
        public List<GroupColumn> GroupColumns = new List<GroupColumn>();

        public Summery Summery;
    }

    private class TableHeader
    {
        public List<Column> Columns = new List<Column>();
    }

    private class TablixElement
    {
        public string StyleContent;

        public string StyleClass;

        public string TextExpression;

        public string Type;

        public string Category;

        public bool OnGroupPageBreak;

        public int GroupPageSize;

        public TablixElement(object type, object textExpression, object styleContent, object styleClass, object category, object onGroupPageBreak, object groupPageSize)
        {
            this.Type = type.ToString();

            this.TextExpression = textExpression.ToString();

            this.StyleContent = styleContent.ToString();

            this.StyleClass = styleClass.ToString();

            this.OnGroupPageBreak = onGroupPageBreak == DBNull.Value ? false : Convert.ToBoolean(onGroupPageBreak);

            this.GroupPageSize = groupPageSize == DBNull.Value ? 0 : Convert.ToInt32(groupPageSize);

            this.Category = category.ToString();
        }
    }

    private class ListElement
    {
        public string StyleContent;

        public string StyleClass;

        public string TextExpression;

        public string Type;

        public string Category;

        public ListElement(object type, object textExpression, object styleContent, object styleClass, object category)
        {
            this.Type = type.ToString();

            this.TextExpression = textExpression.ToString();

            this.StyleContent = styleContent.ToString();

            this.StyleClass = styleClass.ToString();

            this.Category = category.ToString();
        }
    }

    private string FormatValue(object value, string name)
    {
        if (value != null && value != DBNull.Value)
        {
            value = value.ToString().Replace("\n", "<br/>");
            value = value.ToString().Replace("\t", " ");
        }

        if (name.Contains("Duration") && name.Contains("Total"))
        {
            int time = Convert.ToInt32(value);

            if (time < 6000)
            {
                return (time / 60 < 10 ? "0" + (time / 60).ToString() : (time / 60).ToString()) + "," + (time % 60 < 10 ? "0" + (time % 60).ToString() : (time % 60).ToString());
            }
            else
            {
                return (time / 60 < 100 ? "0" + (time / 60 < 10 ? "0" + (time / 60).ToString() : (time / 60).ToString()) : (time / 60).ToString()) + "," + (time % 60 < 10 ? "0" + (time % 60).ToString() : (time % 60).ToString());
            }
        }
        else
        {
            long _value = 0;
            bool success = long.TryParse(Convert.ToString(value), out _value);

            if (success)
            {
                return _value.ToString("N0", new NumberFormatInfo()
                {
                    NumberGroupSizes = new[] { 3 },
                    NumberGroupSeparator = ","
                });
            }
        }

        return Convert.ToString(value);
    }
}
