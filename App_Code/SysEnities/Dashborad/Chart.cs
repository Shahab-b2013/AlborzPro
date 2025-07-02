// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0 
// Release Ferdos.BPMS

public class Chart
{
    private string id;
    public string ID { get { return id; } set { id = value; } }

    private int rowID;
    public int RowID { get { return rowID; } set { rowID = value; } }

    private int columnIndex;
    public int ColumnIndex { get { return columnIndex; } set { columnIndex = value; } }

    private string name;
    public string Name { get { return name; } set { name = value; } }

    private string commandText;
    public string CommandText { get { return commandText; } set { commandText = value; } }

    private string text;
    public string Text { get { return text; } set { text = value; } }

    private string type;
    public string Type { get { return type; } set { type = value; } }

    private string categoryLabel;
    public string CategoryLabel { get { return categoryLabel; } set { categoryLabel = value; } }

    private string valueLabel;
    public string ValueLabel { get { return valueLabel; } set { valueLabel = value; } }

    private string categoryName;
    public string CategoryName { get { return categoryName; } set { categoryName = value; } }

    private string categoryExpression;
    public string CategoryExpression { get { return categoryExpression; } set { categoryExpression = value; } }

    private string seriesType;
    public string SeriesType { get { return seriesType; } set { seriesType = value; } }

    private string version;
    public string Version { get { return version; } set { version = value; } }

    private string internalID;
    public string InternalID { get { return internalID; } set { internalID = value; } }

    private Series[] series;
    public Series[] Series { get { return series; } set { series = value; } }
}