// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0
// Release Ferdos.BPMS

public class FormColumns
{
    private int processid;
    public int ProcessID { get { return processid; } set { processid = value; } }

    private int rowKey;
    public int Rowkey { get { return rowKey; } set { rowKey = value; } }

    private int subtableid;
    public int SubTableID { get { return subtableid; } set { subtableid = value; } }

    private string name;
    public string Name { get { return name; } set { name = value; } }

    private string label;
    public string Label { get { return label; } set { label = value; } }

    private string colwidht;
    public string ColWidth { get { return colwidht; } set { colwidht = value; } }

    private string colheight;
    public string ColHeight { get { return colheight; } set { colheight = value; } }

    private string datatype;
    public string DataType { get { return datatype; } set { datatype = value; } }

    private int enumTypeID;
    public int EnumTypeID { get { return enumTypeID; } set { enumTypeID = value; } }

    private int entityTypeID;
    public int EntityTypeID { get { return entityTypeID; } set { entityTypeID = value; } }

    private bool nullable;
    public bool Nullable { get { return nullable; } set { nullable = value; } }
    
    private bool showinlist;
    public bool ShowInList { get { return showinlist; } set { showinlist = value; } }

    private FormStyle style;
    public FormStyle Style { get { return style; } set { style = value; } }
}