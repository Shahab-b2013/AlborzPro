// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.5.0.0
// Release Ferdos.BPMS

public class FormItem
{
    public int FormItemID { get; set; }

    public int FormID { get; set; }

    public int ActivityParamID { get; set; }

    public int ParamIndex { get; set; }

    public int ActionControlID { get; set; }

    public int FormGroupBoxID { get; set; }

    public string Name { get; set; }

    public string Label { get; set; }

    public bool Repeat { get; set; }

    public bool IsReadOnly { get; set; }

    public bool IsRequired { get; set; }

    public string InputType { get; set; }

    public int RowIndex { get; set; }

    public int ColumnIndex { get; set; }

    public string DisplayMode { get; set; }

    public string Width { get; set; }

    public string DefaultValue { get; set; }

    public string Events { get; set; }

    public bool SubTextVisible { get; set; }

    public string ActionOnChange { get; set; }

    public bool Visibility { get; set; }

    public string ParentName { get; set; }

    public string ParentName2 { get; set; }

    public string HasAddon { get; set; }

    public string Enabled { get; set; }

    public string version { get; set; }

    public int Rowkey { get; set; }

    public int SubTableID { get; set; }

    public string ColWidth { get; set; }

    public string ColHeight { get; set; }

    public int ForeignKey { get; set; }

    public string Description { get; set; }

    public FormItem()
    {
        this.Description = string.Empty;
    }
}