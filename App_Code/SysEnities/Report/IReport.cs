// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.0.0
// Release Ferdos.BPMS

public class IReport
{
    private ReportModel reportModel;
    public ReportModel ReportModel { get { return reportModel; } set { reportModel = value; } }
}

public class ReportModel
{
    
    private string reportId;
    public string ReportID { get { return reportId; } set { reportId = value; } }

    private string moduleId;
    public string ModuleID { get { return moduleId; } set { moduleId = value; } }


    private string datasetId;
    public string DatasetID { get { return datasetId; } set { datasetId = value; } }


    private string datasetName;
    public string DatasetName { get { return datasetName; } set { datasetName = value; } }


    private string selectClause;
    public string SelectClause { get { return selectClause; } set { selectClause = value; } }

    private Column[] columns;
    public Column[] Columns { get { return columns; } set { columns = value; } }

    private string whereClause;
    public string WhereClause { get { return whereClause; } set { whereClause = value; } }

    private Filter filter;
    public Filter Filter { get { return filter; } set { filter = value; } }

    private string completeQuery;
    public string CompleteQuery { get { return completeQuery; } set { completeQuery = value; } }

    private AccessRole[] accessRoles;
    public AccessRole[] AccessRoles { get { return accessRoles; } set { accessRoles = value; } }

    private AccessGroup[] accessGroups;
    public AccessGroup[] AccessGroups { get { return accessGroups; } set { accessGroups = value; } }

    private string label;
    public string Label { get { return label; } set { label = value; } }

    private string header;
    public string Header { get { return header; } set { header = value; } }


    private string footer;
    public string Footer { get { return footer; } set { footer = value; } }


    private string description;
    public string Description { get { return description; } set { description = value; } }

    private string groupingLevel;
    public string GroupingLevel { get { return groupingLevel; } set { groupingLevel = value; } }

    private string requestoken;
    public string requestToken { get { return requestoken; } set { requestoken = value; } }

    private Schedule[] schedule;
    public Schedule[] Schedule { get { return schedule; } set { schedule = value; } }

}








