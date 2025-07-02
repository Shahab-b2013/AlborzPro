// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.0.0
// Release Ferdos.BPMS

public class SelectJoin
{
    private string sourceTable;
    public string SourceTable { get { return sourceTable; } set { sourceTable = value; } }

    private string sourceColumn;
    public string SourceColumn { get { return sourceColumn; } set { sourceColumn = value; } }

    private string sourceTableOrginal;
    public string SourceTableOrginal { get { return sourceTableOrginal; } set { sourceTableOrginal = value; } }

    private string destTable;
    public string DestTable { get { return destTable; } set { destTable = value; } }

    private string destColumn;
    public string DestColumn { get { return destColumn; } set { destColumn = value; } }

    private string destTableOrginal;
    public string DestTableOrginal { get { return destTableOrginal; } set { destTableOrginal = value; } }

    private string type;
    public string Type { get { return type; } set { type = value; } }

    private string joinType;
    public string JoinType { get { return joinType; } set { joinType = value; } }
}