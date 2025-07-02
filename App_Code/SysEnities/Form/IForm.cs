// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.2.0
// Release Ferdos.BPMS

public class IForm
{
    private int processID;
    public int ProcessID { get { return processID; } set { processID = value; } }

    private int formID;
    public int FormID { get { return formID; } set { formID = value; } }

    private bool itemsGrouping;
    public bool ItemsGrouping { get { return itemsGrouping; } set { itemsGrouping = value; } }

    private string columnLayout;
    public string ColumnLayout { get { return columnLayout; } set { columnLayout = value; } }

    private string label;
    public string Label { get { return label; } set { label = value; } }

    private string columnWidth;
    public string ColumnWidth { get { return columnWidth; } set { columnWidth = value; } }

    private int activityID;
    public int ActivityID { get { return activityID; } set { activityID = value; } }

    private int dataActivityID;
    public int DataActivityID { get { return dataActivityID; } set { dataActivityID = value; } }

    private FormItem[] formItems;
    public FormItem[] FormItems { get { return formItems; } set { formItems = value; } }

    private FormGroupBox[] formGroupBoxs;
    public FormGroupBox[] FormGroupBoxs { get { return formGroupBoxs; } set { formGroupBoxs = value; } }

    private FormVariables[] variables;
    public FormVariables[] Variables { get { return variables; } set { variables = value; } }
}