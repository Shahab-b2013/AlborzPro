// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.5.0.0
// Release Ferdos.BPMS

public class FormGroupBox
{
    public int FormGroupBoxID { get; set; }

    public int FormID { get; set; }

    public string Name { get; set; }

    public string Label { get; set; }

    public int GroupIndex { get; set; }

    public string GroupDisplayMode { get; set; }

    public string ColumnLayout { get; set; }

    public string ColumnWidth { get; set; }

    public bool DefaultVisible { get; set; }

    public bool TaskProceedingsArea { get; set; }

    public bool ProcessStatingArea { get; set; }

    public bool Visibility { get; set; }

    public bool Enabled { get; set; }

    public string Version { get; set; }

    public string Description { get; set; }

    public FormGroupBox()
    {
        this.Description = string.Empty;
    }
}
