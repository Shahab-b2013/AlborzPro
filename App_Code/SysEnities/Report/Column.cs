// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.0.0
// Release Ferdos.BPMS

public class Column
{
    private string id;
    public string ID { get { return id; } set { id = value; } }

    private string name;
    public string Name { get { return name; } set { name = value; } }

    private string label;
    public string Label { get { return label; } set { label = value; } }

    private string type;
    public string Type { get { return type; } set { type = value; } }

    private string textExpression;
    public string TextExpression { get { return textExpression.Replace(".","_"); } set { textExpression = value; } }

    private string sortType;
    public string SortType { get { return sortType; } set { sortType = value; } }

    private string sortOrder;
    public string SortOrder { get { return sortOrder; } set { sortOrder = value; } }

    private string groupBy;
    public string GroupBy { get { return groupBy; } set { groupBy = value; } }

    private string enumTypeId;
    public string EnumTypeID { get { return enumTypeId; } set { enumTypeId = value; } }

    private string refEntityId;
    public string RefEntityID { get { return refEntityId; } set { refEntityId = value; } }

    private string entityAttributeId;
    public string EntityAttributeID { get { return entityAttributeId; } set { entityAttributeId = value; } }
}
