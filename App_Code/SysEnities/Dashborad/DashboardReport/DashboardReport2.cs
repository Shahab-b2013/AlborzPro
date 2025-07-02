// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0 
// Release Ferdos.BPMS

public class IDashboardReport
{
    private DashboardReportModel reportModel;
    public DashboardReportModel ReportModel { get { return reportModel; } set { reportModel = value; } }
}

public class DashboardReportModel
{
    private int id;
    public int ID { get { return id; } set { id = value; } }

    private string name;
    public string Name { get { return name; } set { name = value; } }

    private string label;
    public string Label { get { return label; } set { label = value; } }

    private string type;
    public string Type { get { return type; } set { type = value; } }

    private string dataSet;
    public string DataSet { get { return dataSet; } set { dataSet = value; } }

    private DashboardReportItem[] items;
    public DashboardReportItem[] Items { get { return items; } set { items = value; } }
}








