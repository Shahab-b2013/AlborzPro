// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0
// Release Ferdos.BPMS

public class DocumentItems
{
    public int ID { get; set; }

    public int DocumentID { get; set; }

    public int RowKey { get; set; }

    public string Name { get; set; }

    public string Label { get; set; }

    public string InputType { get; set; }

    public bool Enabled { get; set; }

    public string Version { get; set; }

    public string Description { get; set; }
}

public class DocumentsPageItem
{
    public DocumentItems[] Value { get; set; }
}