// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.2.0
// Release Ferdos.BPMS
using System;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.IO;
using System.Collections.Generic;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class Report : System.Web.Services.WebService
{
    [WebMethod(EnableSession = true)]
    public string EditDesign()
    {
        ReportModel designReport = null;
        string acccessCriteria = null;
        int id = Convert.ToInt32(HttpContext.Current.Request.Form["id"]);
        string responseToken = HttpContext.Current.Request.Form["responseToken"];

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
            acccessCriteria = SecurityProvider.ValidateReportAccess(id);
        }
        catch
        {
            return "Access is denied.";
        }

        #endregion

        int itemIndex = 0;

        #region Design Json File Parsing

        try
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            designReport = js.Deserialize<ReportModel>(HttpContext.Current.Request.Form["design"]);
            StreamWriter sw = File.CreateText(Server.MapPath("/App_Data") + "/Reports/" + id + ".fdm");
            sw.Write(HttpContext.Current.Request.Form["design"]);
            sw.Close();
        }
        catch (Exception exp)
        {
            LogProvider.LogExceptionInFile(0, exp.Message + " [ " + exp.StackTrace + " ]");

            return "An error occurred during file parsing\n\r" + exp.Message;
        }

        #endregion

        try
        {
            ClearOldDesign(Convert.ToInt32(designReport.ReportID));

            #region Edit Report  

            int tmpReportId = UpdateReport(Convert.ToInt32(designReport.ReportID), BuildQuery(designReport.SelectClause, designReport.WhereClause), designReport.Label, designReport.Description, designReport.DatasetID);
            int tmpElementID = CreateTabularReportLayout(tmpReportId, "custom", "RMS");
            CreateFormView(tmpReportId);
            CreateDataRegion(tmpElementID, designReport.Label, designReport.Label, "List", true, "custom", "RMS");
            CreateReportItem(tmpElementID, tmpElementID, tmpElementID, 0, designReport.Label, designReport.Label, "DataRegion", true, "custom", "RMS");
            CreateDataList(tmpElementID);
            if (itemIndex != 0) itemIndex = 0;
            foreach (var item in designReport.Columns)
            {
                if (item.SortType != "filteronly")
                {
                    CreateReportListColumn(tmpElementID, itemIndex, item.Label, item.Name, "", (item.GroupBy == "ExpressionGroupBy" ? item.TextExpression : item.GroupBy.ToUpper() + "_" + item.TextExpression), "", "custom", "RMS", "");
                    itemIndex++;
                }
            }
            if (itemIndex != 0) itemIndex = 0;
            foreach (var item in designReport.Columns)
            {
                item.EntityAttributeID = (item.EntityAttributeID == "") ? "0" : item.EntityAttributeID;
                item.RefEntityID = (item.RefEntityID == "") ? "0" : item.RefEntityID;
                item.EnumTypeID = (item.EnumTypeID == "") ? "0" : item.EnumTypeID;
                if (item.Type == "Boolean")
                {
                    item.EnumTypeID = "70";
                }
                CreateReportParam(Convert.ToInt32(designReport.ReportID), item.Name, item.Label, item.Type, itemIndex, false, true, 0, 0, "NULL", "NULL", Convert.ToInt32(item.EntityAttributeID), Convert.ToInt32(item.RefEntityID), false, false, Convert.ToInt32(item.EnumTypeID), "custom", "RMS");
                itemIndex++;
            }

            #endregion
        }
        catch (Exception exp)
        {
            LogProvider.LogExceptionInFile(0, exp.Message + " [ " + exp.StackTrace + " ]");

            return "An error occurred during save\n\r" + exp.Message;
        }

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
            acccessCriteria = SecurityProvider.ValidateReportAccess(id);
        }
        catch
        {
            return "Access is denied.";
        }

        #endregion

        string datasetId;
        int dReportId = objKey;

        #region Get ReportInfo From Database

        string dName = null;
        string dLabel = null;
        string dsName = null;

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
            string query = "select Sys_Rpt_Reports.*, Sys_Rpt_Datasets.ELabel AS DatasetName from Sys_Rpt_Reports inner join Sys_Rpt_Datasets on Sys_Rpt_Reports.DatasetID = Sys_Rpt_Datasets.DatasetID where ReportID = " + objKey;

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();

                        dName = reader["ELabel"].ToString();

                        dLabel = reader["Label"].ToString();

                        dsName = reader["DatasetName"].ToString();

                        datasetId = reader["DatasetID"].ToString();
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

        if (File.Exists(Server.MapPath("/App_Data") + "/Reports/" + dReportId + ".fdm"))
        {
            #region Report Design Already Exsited

            using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Reports/" + dReportId + ".fdm"))
            {
                designJson = reader.ReadToEnd();
                designJson = designJson.Remove(designJson.Length - 1, 1) + ",";

                designJson = designJson + "\"Label\":\"@@Label\",";
                designJson = designJson + "\"Header\":\"@@Header\",";
                designJson = designJson + "\"RefRoles\":[@@RefRoles],";
                designJson = designJson + "\"RefGroups\":[@@RefGroups],";
                designJson = designJson + "\"RefColumns\":[@@RefColumns],";
                designJson = designJson + "\"RefDatasets\":[@@RefDatasets] }";

                designJson = designJson.Replace("@@Label", dLabel.ToString());
                designJson = designJson.Replace("@@RefRoles", GetRoles());
                designJson = designJson.Replace("@@RefGroups", GetGroups());
                designJson = designJson.Replace("@@RefColumns", GetJsonColumns());
                designJson = designJson.Replace("@@RefDatasets", GetJsonDatasets());
            }

            #endregion
        }
        else
        {
            if (File.Exists(Server.MapPath("/App_Data") + "/Reports/Default.fdm"))
            {
                #region Report Design not Already Exsited, Create Default Design

                using (TextReader reader = File.OpenText(Server.MapPath("/App_Data") + "/Reports/Default.fdm"))
                {
                    designJson = reader.ReadToEnd();
                }
                designJson = designJson.Replace("@@ReportID", dReportId.ToString());
                designJson = designJson.Replace("@@ModuleID", "0");
                designJson = designJson.Replace("@@Name", dName.ToString());
                designJson = designJson.Replace("@@Label", dLabel.ToString());
                designJson = designJson.Replace("@@Footer", " تهیه شده در" + ApplicationProvider.PackageName);
                designJson = designJson.Replace("@@DatasetName", dsName);
                designJson = designJson.Replace("@@DatasetID", datasetId);
                designJson = designJson.Replace("@@RefRoles", GetRoles());
                designJson = designJson.Replace("@@RefGroups", GetGroups());
                designJson = designJson.Replace("@@RefColumns", GetJsonColumns());
                designJson = designJson.Replace("@@RefDatasets", GetJsonDatasets());

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

    #region Remove Old Report Design in Database
    
    private static void ClearOldDesign(int ID)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format(
            "DELETE FROM Sys_Gui_FormItems WHERE FormID ={0};" +
            "DELETE FROM Sys_Gui_FormViews WHERE FormID ={0};" +
            "DELETE FROM Sys_Rpt_ReportParams WHERE ReportID ={0};" +
            "DELETE FROM Sys_Rpt_ListDesigns WHERE ListID ={0}05;" +            
            "DELETE FROM Sys_Rpt_Lists WHERE ListID ={0}05;" +
            "DELETE FROM Sys_Rpt_ReportItems WHERE ReportItemID ={0}05;" +
            "DELETE FROM Sys_Rpt_DataRegions WHERE DataRegionID ={0}05;" +
            "DELETE FROM Sys_Rpt_ReportLayouts WHERE ReportID ={0};" 
            , ID));
    }

    #endregion

    #region Create New Report Design in Database

    public static int UpdateReport(int reportId, string queryText, string label, string desc, string dsId)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("UPDATE dbo.Sys_Rpt_Reports SET QueryText=N'{1}', Label=N'{2}', Description=N'{3}', DatasetID=N'{4}' WHERE ReportID={0}; ", reportId, queryText, label, desc, dsId));
        return reportId;
    }

    public static int CreateTabularReportLayout(int reportId, string version, string desc)
    {
        var tmpTest = string.Format("INSERT INTO dbo.Sys_Rpt_ReportLayouts(ElementID, ReportID, ParentElementID, Type, StyleHeight, PrintOnFirstPage, PrintOnLastPage, Enabled, Version, Description) VALUES({0}00, {0}, NULL, 'ReportHeader', '50px;', 0, 0, 1, N'{1}', N'{2}')", reportId, version, desc);

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_ReportLayouts(ElementID, ReportID, ParentElementID, Type, StyleHeight, PrintOnFirstPage, PrintOnLastPage, Enabled, Version, Description) VALUES({0}00, {0}, NULL, 'ReportHeader', '50px;', 0, 0, 1, N'{1}', N'{2}')", reportId, version, desc));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_ReportLayouts(ElementID, ReportID, ParentElementID, Type, StyleHeight, PrintOnFirstPage, PrintOnLastPage, Enabled, Version, Description) VALUES({0}01, {0}, NULL, 'ReportBody', '', 0, 0, 1, N'{1}', N'{2}')", reportId, version, desc));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_ReportLayouts(ElementID, ReportID, ParentElementID, Type, StyleHeight, PrintOnFirstPage, PrintOnLastPage, Enabled, Version, Description) VALUES({0}02, {0}, NULL, 'ReportFooter', '50px;', 0, 0, 1, N'{1}', N'{2}')", reportId, version, desc));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_ReportLayouts(ElementID, ReportID, ParentElementID, Type, StyleHeight, PrintOnFirstPage, PrintOnLastPage, Enabled, Version, Description) VALUES({0}03, {0}, {0}01, 'Row', '', 0, 0, 1, N'{1}', N'{2}')", reportId, version, desc));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_ReportLayouts(ElementID, ReportID, ParentElementID, Type, StyleHeight, PrintOnFirstPage, PrintOnLastPage, Enabled, Version, Description) VALUES({0}04, {0}, {0}03, 'Cell', '', 0, 0, 1, N'{1}', N'{2}')", reportId, version, desc));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_ReportLayouts(ElementID, ReportID, ParentElementID, Type, StyleHeight, PrintOnFirstPage, PrintOnLastPage, Enabled, Version, Description) VALUES({0}05, {0}, {0}04, 'ReportPart', '', 0, 0, 1, N'{1}', N'{2}')", reportId, version, desc));

        return Convert.ToInt32(reportId + "05");
    }

    public static int CreateDataRegion(int dataRegionId, string name, string label, string type, bool enabled, string version, string desc)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_DataRegions(DataRegionID, Name, Label, Type, Enabled, Version, Description) VALUES({0}, N'{1}', N'{2}', N'{3}', 1, N'{4}', N'{5}')", dataRegionId, name, label, type, version, desc));
        return dataRegionId;
    }

    public static int CreateDataTable(int dataRegionId)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_Tables(TableID, DataRegionID) VALUES({0}, {1})", dataRegionId, dataRegionId));

        return dataRegionId;
    }

    public static int CreateDataList(int dataRegionId)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_Lists(ListID, DataRegionID) VALUES({0}, {1})", dataRegionId, dataRegionId));

        return dataRegionId;
    }

    public static void CreateReportColumn(int dataRegionId, int columnIndex, string label, string name, string header, string data, string summery, string version, string desc, string style)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_TableDesigns(ElementID, TableID, ParentElementID, Label, Name, Type, TextExpression, Category, GroupLevel, ColumnPosition, Enabled, Version, Description, StyleContent) VALUES({0}{1}0, {0}, NULL, N'{2}', N'{3}', 'DetailColumn', NULL, 'DetailColumns', 0, {1}, 1, N'{4}', N'{5}', N'{6}')", dataRegionId, columnIndex, label, name, version, desc, style));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_TableDesigns(ElementID, TableID, ParentElementID, Label, Name, Label, Type, TextExpression, Category, GroupLevel, ColumnPosition, Enabled, Version, Description, StyleContent) VALUES({0}{1}1, {0}, {0}{1}0, N'{2}', N'{3}', 'DetailHeader', N'{2}', 'DetailColumns', 0, {1}, 1, N'{4}', N'{5}', N'{6}')", dataRegionId, columnIndex, label, name, version, desc, style));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_TableDesigns(ElementID, TableID, ParentElementID, Label, Name, Label, Type, TextExpression, Category, GroupLevel, ColumnPosition, Enabled, Version, Description, StyleContent) VALUES({0}{1}2, {0}, {0}{1}0, N'{2}', N'{3}', 'DetailData', N'{6}', 'DetailColumns', 0, {1}, 1, N'{4}', N'{5}', N'{7}')", dataRegionId, columnIndex, label, name, version, desc, data, style));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_TableDesigns(ElementID, TableID, ParentElementID, Label, Name, Label, Type, TextExpression, Category, GroupLevel, ColumnPosition, Enabled, Version, Description, StyleContent) VALUES({0}{1}3, {0}, {0}{1}0, N'{2}', N'{3}', 'DetailSummery', N'{6}', 'DetailColumns', 0, {1}, 1, N'{4}', N'{5}', N'{7}')", dataRegionId, columnIndex, label, name, version, desc, summery, style));
    }

    public static void CreateReportListColumn(int dataRegionId, int columnIndex, string label, string name, string header, string data, string summery, string version, string desc, string style)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_ListDesigns(ElementID, ListID, ParentElementID, Label, Name, Type, TextExpression, Category, ColumnPosition, Enabled, Version, Description, StyleContent) VALUES({0}{1}0, {0}, NULL,    N'{2}', N'{3}', 'DetailColumn', NULL, 'DetailColumns', {1}, 1, N'{4}', N'{5}', N'{6}')", dataRegionId, columnIndex, label, name, version, desc, style));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_ListDesigns(ElementID, ListID, ParentElementID, Label, Name, Type, TextExpression, Category, ColumnPosition, Enabled, Version, Description, StyleContent) VALUES({0}{1}1, {0}, {0}{1}0, N'{2}', N'{3}', 'DetailHeader', N'{2}', 'DetailColumns', {1}, 1, N'{4}', N'{5}', N'{6}')", dataRegionId, columnIndex, label, name, version, desc, style));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_ListDesigns(ElementID, ListID, ParentElementID, Label, Name, Type, TextExpression, Category, ColumnPosition, Enabled, Version, Description, StyleContent) VALUES({0}{1}2, {0}, {0}{1}0, N'{2}', N'{3}', 'DetailData', N'{6}', 'DetailColumns', {1}, 1, N'{4}', N'{5}', N'{7}')", dataRegionId, columnIndex, label, name, version, desc, data, style));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_ListDesigns(ElementID, ListID, ParentElementID, Label, Name, Type, TextExpression, Category, ColumnPosition, Enabled, Version, Description, StyleContent) VALUES({0}{1}3, {0}, {0}{1}0, N'{2}', N'{3}', 'DetailSummery', N'{6}', 'DetailColumns', {1}, 1, N'{4}', N'{5}', N'{7}')", dataRegionId, columnIndex, label, name, version, desc, summery, style));
    }

    public static void CreateReportRowGrouping(int dataRegionId, int columnIndex, int groupIndex, string label, string name, string header, string data, string version, string desc)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_TableDesigns(ElementID, TableID, ParentElementID, Label, Name, Type, TextExpression, Category, GroupLevel, ColumnPosition, Enabled, Version, Description) VALUES({0}{1}4, {0}, NULL, N'{2}', N'{3}', 'GroupRow', NULL, 'RowGrouping', {6}, {1}, 1, N'{4}', N'{5}')", dataRegionId, columnIndex, label, name, version, desc, groupIndex));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_TableDesigns(ElementID, TableID, ParentElementID, Label, Name, Type, TextExpression, Category, GroupLevel, ColumnPosition, Enabled, Version, Description) VALUES({0}{1}5, {0}, {0}{1}4, N'{2}', N'{3}', 'GroupHeader', N'{2}', 'RowGrouping', {6}, {1}, 1, N'{4}', N'{5}')", dataRegionId, columnIndex, label, name, version, desc, groupIndex));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_TableDesigns(ElementID, TableID, ParentElementID, Label, Name, Type, TextExpression, Category, GroupLevel, ColumnPosition, Enabled, Version, Description) VALUES({0}{1}6, {0}, {0}{1}4, N'{2}', N'{3}', 'GroupData', N'{7}', 'RowGrouping', {6}, {1}, 1, N'{4}', N'{5}')", dataRegionId, columnIndex, label, name, version, desc, groupIndex, data));
    }

    public static void CreateReportItem(int reportItemId, int reportPartId, int dataRegionId, int dataVisualizationId, string name, string label, string type, bool enabled, string version, string desc)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO dbo.Sys_Rpt_ReportItems(ReportItemID, ReportPartID, DataRegionID, DataVisualizationID, Name, Label, Type, StyleHeight, StyleWidth, StyleTop, StyleLeft, ZIndex, Enabled, Version, Description) VALUES({0}, {1}, {2}, {3}, N'{4}', N'{5}', N'{6}','' ,'' ,'' ,'' ,0, 1, N'{7}', N'{8}')", reportItemId, reportPartId, dataRegionId, (dataVisualizationId == 0 ? "NULL" : dataVisualizationId.ToString()), name, label, type, version, desc));
    }

    public static void CreateReportParam(int reportId, string name, string label, string type, int paramIndex, bool isRequired, bool nullIfEmpty, int minValueLenght, int maxValueLenght, string minValue, string maxValue, int entityAttributeId, int referEntityId, bool referEntityDisableAllow, bool referEntityMultipleAllow, int enumTypeID, string version, string desc)
    {
        string reportParamId = reportId.ToString();

        if (paramIndex.ToString().Length == 1)
        {
            reportParamId = reportParamId + "0" + paramIndex;
        }
        else // 2
        {
            reportParamId = reportParamId + paramIndex;
        }
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Rpt_ReportParams(ReportParamID, ReportID, Name, Label, ParamIndex, IsRequired, NullIfEmpty, MinValueLenght, MaxValueLenght, MinValue, MaxValue, EntityAttributeID, ReferEntityID, ReferEntityDisableAllow, ReferEntityMultipleAllow, EnumTypeID, Enabled, Version, Description) VALUES({0}, {1}, N'{2}', N'{3}', {4}, N'{5}', N'{6}', {7}, {8}, {9}, {10}, {11}, {12}, N'{13}', N'{14}', {15}, 1, N'{16}', N'{17}')",
            reportParamId, reportId, name, label, paramIndex, isRequired, nullIfEmpty, (minValueLenght == 0 ? "NULL" : minValueLenght.ToString()), (maxValueLenght == 0 ? "NULL" : maxValueLenght.ToString()), (minValue == null ? "NULL" : minValue.ToString()), (maxValue == null ? "NULL" : maxValue.ToString()), (entityAttributeId == 0 ? "NULL" : entityAttributeId.ToString()), (referEntityId == 0 ? "NULL" : referEntityId.ToString()), referEntityDisableAllow, referEntityMultipleAllow, (enumTypeID == 0 ? "NULL" : enumTypeID.ToString()), version, desc));

        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT INTO Sys_Gui_FormItems(" +
            "FormItemID, FormID, ReportParamID, ActionControlID, Name, Label, IsReadOnly, InputType, RowIndex, ColumnIndex, DisplayMode, SubTextVisible, HasAddon, Enabled, Version, Description)" +
            " VALUES(" +
            "{0},{1},{2},{3},N'{4}',N'{5}',{6},N'{7}',{8},{9},N'{10}',{11},{12},{13},N'{14}',N'{15}')",
            reportParamId, reportId, reportParamId, (referEntityId == 0 ? "NULL" : Convert.ToString(referEntityId * 10)), name, label, 0, (referEntityId == 0 && enumTypeID == 0 ? GetInputType(type) : "SelectList"), paramIndex, 0, "Vertical", 0, 0, 1, "custom", "RMS"));
    }

    public static void CreateFormView(int formId)
    {
        SqlDataProvider.ExecuteNoneQuery(string.Format("INSERT Sys_Gui_FormViews(FormID, ActivityContextID, DataContextID, ReportID, MultiObjHandled, ConfirmMessage, ColumnLayout, ColumnWidth, ActionOnSuccess, ActionOnError, ResetAfterSuccess, ReactAfterSuccess, ItemsGrouping) VALUES ({0}, NULL, NULL, {0}, 0, N'', N'OnceColumn', N'default', N'[[\"reloadReportData\"]]', N'[[]]', 0, 0, 0)", formId));
    }

    private static string BuildQuery(string selectClause, string whereClause)
    {
        string masterTable = null;

        selectClause = selectClause.Replace(" AS Count_", " AS COUNT_")
                                   .Replace(" AS Avg_", " AS AVG_")
                                   .Replace(" AS Sum_", " AS SUM_")
                                   .Replace(" AS Min_", " AS MIN_")
                                   .Replace(" AS Max_", " AS MAX_");

        int start = selectClause.LastIndexOf(" FROM ", StringComparison.OrdinalIgnoreCase) + 6;
        if (start < 6) 
        {
            return selectClause;
        }

        if (selectClause.IndexOf(" LEFT OUTER JOIN ", StringComparison.OrdinalIgnoreCase) > 0)
        {
            masterTable = selectClause.Substring(start,
                selectClause.IndexOf(" LEFT OUTER JOIN ", StringComparison.OrdinalIgnoreCase) - start);
        }
        else
        {
            masterTable = selectClause.Substring(start);
        }

        int firstSpaceAfterTable = masterTable.IndexOf(' ');
        if (firstSpaceAfterTable > 0)
        {
            masterTable = masterTable.Substring(0, firstSpaceAfterTable);
        }

        if (masterTable != "User_Roles" &&
            masterTable != "User_Groups" &&
            masterTable != "UserRole_Access" &&
            masterTable != "UserGroup_Access")
        {
            whereClause = string.IsNullOrWhiteSpace(whereClause)
                ? string.Format("({0}._IsDeleted = 0)", masterTable)
                : string.Format("({0}._IsDeleted = 0) AND ({1})", masterTable, whereClause);
        }

        int groupIndex = selectClause.IndexOf(" GROUP BY ", StringComparison.OrdinalIgnoreCase);
        int orderIndex = selectClause.IndexOf(" ORDER BY ", StringComparison.OrdinalIgnoreCase);

        string baseQuery;
        string groupByClause = "";
        string orderByClause = "";

        if (groupIndex > 0 && (orderIndex == -1 || groupIndex < orderIndex))
        {
            baseQuery = selectClause.Substring(0, groupIndex);
            groupByClause = selectClause.Substring(groupIndex);

            if (orderIndex > groupIndex)
            {
                groupByClause = selectClause.Substring(groupIndex, orderIndex - groupIndex);
                orderByClause = selectClause.Substring(orderIndex);
            }
        }
        else if (orderIndex > 0)
        {
            baseQuery = selectClause.Substring(0, orderIndex);
            orderByClause = selectClause.Substring(orderIndex);
        }
        else
        {
            baseQuery = selectClause;
        }

        string wherePart = string.IsNullOrWhiteSpace(whereClause)
            ? ""
            : " WHERE " + whereClause.Replace("'", "''");

        return baseQuery + wherePart + groupByClause + orderByClause;
    }

    #endregion

    #region Prepare Json  Data for Report Design

    private static string GetRoles()
    {
        string JsonRoles = null;
        JsonRoles = GetDataList("select UserRoleID as Id, Label from Sys_UserRoles where not UserRoleID in (50,52,53,1,1000) and Enabled = 1 and _IsDeleted = 0");
        JsonRoles = JsonRoles.Remove(JsonRoles.Length - 1, 1);
        JsonRoles = JsonRoles.Remove(0, 1);
        return JsonRoles;
    }

    private static string GetGroups()
    {
        string JsonGroups = null;
        JsonGroups = GetDataList("select UserGroupID as ID, Label from Sys_UserGroups where Enabled = 1 and _IsDeleted = 0");
        JsonGroups = JsonGroups.Remove(JsonGroups.Length - 1, 1);
        JsonGroups = JsonGroups.Remove(0, 1);
        return JsonGroups;
    }    

    private static string GetJsonColumns()
    {
        string RefdataJson = null;
        RefdataJson = GetColumns("SELECT Sys_Rpt_DatasetDesigns.ElementID, Sys_Rpt_DatasetDesigns.Type, Sys_Rpt_DatasetDesigns.TextExpression, Sys_Rpt_DatasetDesigns.ColumnPosition, Sys_Rpt_DatasetDesigns.Enabled, Sys_Rpt_DatasetDesigns.Version, Sys_Rpt_DatasetDesigns.Description, Sys_Rpt_DatasetDesigns.DatasetID, Sys_Rpt_Datasets.QueryType, Sys_Rpt_Datasets.ELabel AS DatasetName, Sys_Rpt_DatasetDesigns.Label, Sys_Rpt_DatasetDesigns.Name, Sys_Rpt_DatasetDesigns.EnumTypeID, Sys_Rpt_DatasetDesigns.RefEntityID, Sys_Rpt_DatasetDesigns.EntityAttributeID FROM  Sys_Rpt_DatasetDesigns INNER JOIN Sys_Rpt_Datasets ON Sys_Rpt_DatasetDesigns.DatasetID = Sys_Rpt_Datasets.DatasetID");
        RefdataJson = RefdataJson.Remove(RefdataJson.Length - 1, 1);
        RefdataJson = RefdataJson.Remove(0, 1);
        return RefdataJson;
    }

    private static string GetJsonDatasets()
    {
        var designJson = GetDataset("SELECT  DatasetID, ELabel, Label, QueryText, QueryType, Enabled, Description FROM  Sys_Rpt_Datasets");
        designJson = designJson.Remove(designJson.Length - 1, 1);
        designJson = designJson.Remove(0, 1);
        return designJson;
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
                            items.Add(new ListItem(reader["Id"].ToString(), reader["Label"].ToString()));
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

    private static string GetDataset(string query)
    {
        List<Dataset> refDs = new List<Dataset>();
        JavaScriptSerializer js = new JavaScriptSerializer();
        var strQuery = "";
        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);
                LogProvider.PrepareLogResultStr(exp.Message, 10050);
                return js.Serialize(refDs);
            }
            using (var command = new SqlCommand(query, connection))
            {
                try
                {

                    using (var reader = command.ExecuteReader())
                    {

                        while (reader.Read())
                        {
                            strQuery = reader["QueryText"].ToString();
                            if(strQuery != "") strQuery = strQuery.Substring(strQuery.IndexOf("FROM")); 
                            refDs.Add(
                                new Dataset(Convert.ToInt32(reader["DatasetID"]),
                                reader["ELabel"].ToString(),
                                reader["Label"].ToString(),
                                strQuery
                            ));
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query, 0);
                    LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                    return js.Serialize(refDs);
                }
            }
        }
        return js.Serialize(refDs);
    }

    private static string GetColumns(string query)
    {
        List<Column> refCol = new List<Column>();
        List<Item> refItem = new List<Item>();
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
                            var tmpEnumTypeID = (reader.IsDBNull(reader.GetOrdinal("EnumTypeID"))) ? -1 : Convert.ToInt32(reader["EnumTypeID"]);
                            var tmpRefEntityID = (reader.IsDBNull(reader.GetOrdinal("RefEntityID"))) ? -1 : Convert.ToInt32(reader["RefEntityID"]);
                            if (tmpEnumTypeID == -1 && tmpRefEntityID == -1) {
                                refItem=new List<Item>();
                            }
                            else if (tmpRefEntityID != -1 && tmpEnumTypeID == -1)
                            {
                                // ورودی "جدول.ستون" است و من قسمت ستون را می خواهم
                                var tmpColumnNameID = reader["TextExpression"].ToString().Split('.')[1];
                                //از این اسم جدول یا همون تیبل نیم رو می کشم بیرون 
                                var tmpTableName = GetItemTable(tmpRefEntityID);
                                var tmpQuery = "";
                                if (tmpTableName !="" && tmpColumnNameID != "")
                                {
                                    tmpQuery = "SELECT " + tmpColumnNameID + " As Id ," + tmpColumnNameID + " As  Name, Label From " + tmpTableName;
                                    // ورودی کوئری و خروجی آیتم ها
                                    refItem = GetRefItems(tmpQuery);
                                }
                                else
                                {
                                    refItem = new List<Item>();
                                }                                
                            }
                            else if(tmpRefEntityID == -1 && tmpEnumTypeID != -1)
                            {
                                refItem = GetItems(tmpEnumTypeID);
                            }
                            else{
                                refItem = new List<Item>();
                            }
                            refCol.Add(
                                 new Column(Convert.ToInt32(reader["ElementID"]),
                                 reader["Name"].ToString(),
                                 reader["Label"].ToString(),
                                 reader["Type"].ToString(),
                                 reader["TextExpression"].ToString(),
                                 Convert.ToInt32(reader["DatasetID"]),
                                 reader["DatasetName"].ToString(),
                                 reader["EnumTypeID"].ToString(),
                                 reader["RefEntityID"].ToString(),
                                 reader["EntityAttributeID"].ToString(),
                                 refItem
                             ));
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

        return js.Serialize(refCol);
    }

    private static List<Item> GetItems(int enumTypeID)
    {
        List<Item> items = new List<Item>();
        var query = string.Format("SELECT EnumID, EnumTypeID, Label, Value FROM Sys_EnumValues WHERE EnumTypeID = {0}", enumTypeID);
        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);
                LogProvider.PrepareLogResultStr(exp.Message, 10050);
                return items;

            }
            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {

                            items.Add(
                                 new Item(Convert.ToInt32(reader["EnumID"]),
                                 reader["Value"].ToString(),
                                 reader["Label"].ToString()
                             ));
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query, 0);
                    string logID2 = LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                    return items;
                }
            }
        }
        return items;
    }

    private static string GetItemTable(int refEntityId)
    {
        var tmpTableName = "";
        var query = string.Format("SELECT EntityID, SoftwareID, Name, Label, TableName FROM Sys_Entities WHERE (EntityID = {0})", refEntityId);
        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);
                LogProvider.PrepareLogResultStr(exp.Message, 10050);
                return "";

            }
            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            tmpTableName = reader["TableName"].ToString();
                            return tmpTableName;
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query, 0);
                    string logID2 = LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                    return "";
                }
            }
        }
        return tmpTableName;
    }

    private static List<Item> GetRefItems(string query)
    {
        List<Item> items = new List<Item>();
        using (var connection = SqlDataProvider.DbConnection)
        {
            try
            {
                connection.Open();
            }
            catch (Exception exp)
            {
                LogProvider.LogExceptionInFile(10050, exp.Message);
                LogProvider.PrepareLogResultStr(exp.Message, 10050);
                return items;
            }

            using (var command = new SqlCommand(query, connection))
            {
                try
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {

                            items.Add(
                                 new Item(Convert.ToInt32(reader["Id"]),
                                 reader["Name"].ToString(),
                                 reader["Label"].ToString()
                             ));
                        }
                    }
                }
                catch (Exception exp)
                {
                    int logID = LogProvider.LogException(10060, exp.Message, query, 0);
                    string logID2 = LogProvider.PrepareLogResultStr(logID, exp.Message, 10060);
                    return items;
                }
            }
        }
        return items;
    }

    private static string GetInputType(string type)
    {
        switch (type)
        {
            case "String": return "TextBox"; 
            case "Text": return "TextArea";
            case "Date": return "DateRangeBox";
            case "Number": return "NumericRangeBox";
            case "DateTime": return "DateRangeBox";
            case "ShortTime": return "NumericRangeBox";
        }

        return "TextBox";
    }

    public class ListItem
    {
        public string Id;
        public string Label;

        public ListItem(string id, string label)
        {
            this.Id = id;
            this.Label = label;
        }
    }

    public class Item
    {
        public int Id;
        public string Name;
        public string Label;
        public Item(int id, string name, string label)
        {
            this.Id = id;
            this.Name = name;
            this.Label = label;
        }
    }

    public class Column
    {
        public int ID;
        public string Name;
        public string Label;
        public string Type;
        public string Exprssion;
        public int DatasetID;
        public string Dataset;
        public string EnumTypeID;
        public string RefEntityID;
        public string EntityAttributeID;
        public List<Item> Items;

        public Column(int id, string name, string label, string type, string exprssion, int datasetId, string dataset, string enumTypeId, string refEntityId, string entityAttributeId, List<Item> items)
        {
            this.ID = id;
            this.Name = name;
            this.Label = label;
            this.Type = type;
            this.Exprssion = exprssion;
            this.DatasetID = datasetId;
            this.Dataset = dataset;
            this.EnumTypeID = enumTypeId;
            this.RefEntityID = refEntityId;
            this.EntityAttributeID = entityAttributeId;
            this.Items = items;
        }
    }

    public class Dataset
    {
        public int ID;
        public string Name;
        public string Label;
        public string QueryText;
        public Dataset(int id, string name, string label, string queryText)
        {
            this.ID = id;
            this.Name = name;
            this.Label = label;
            this.QueryText = queryText;
        }
    }

    #endregion
}


    