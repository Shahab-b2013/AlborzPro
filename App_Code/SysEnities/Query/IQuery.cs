// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.0.0
// Release Ferdos.BPMS

public class IQuery
{
    private QueryModel queryModel;
    public QueryModel QueryModel { get { return queryModel; } set { queryModel = value; } }
}

 
public class QueryModel
{
    private int id;
    public int ID { get { return id; } set { id = value; } }

    private string name;
    public string Name { get { return name; } set { name = value; } } 
    
    private string label;
    public string Label { get { return label; } set { label = value; } }

    private string[] selectTable;
    public string[] SelectTable { get { return selectTable; } set { selectTable = value; } }

    private SelectColumn[] selectColumn;
    public SelectColumn[] SelectColumn { get { return selectColumn; } set { selectColumn = value; } }

    private SelectJoin[] selectJoin;
    public SelectJoin[] SelectJoin { get { return selectJoin; } set { selectJoin = value; } }

    private string query;
    public string Query { get { return query; } set { query = value; } }

}
