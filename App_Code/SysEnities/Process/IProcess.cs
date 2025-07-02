// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0
// Release Ferdos.BPMS

public class IProcess
{
    private ProcessModel processModel;
    public ProcessModel ProcessModel { get { return processModel; } set { processModel = value; } }
}

public class ProcessModel
{
    private int processID;
    public int ProcessID { get { return processID; } set { processID = value; } }

    private string label;
    public string Label { get { return label; } set { label = value; } }

    private string type;
    public string Type { get { return type; } set { type = value; } }

    private string category;
    public string Category { get { return category; } set { category = value; } }

    private string status;
    public string Status { get { return status; } set { status = value; } }

    private bool enabled;
    public bool Enabled { get { return enabled; } set { enabled = value; } }

    private string version;
    public string Version { get { return version; } set { version = value; } }

    private string description;
    public string Description { get { return description; } set { description = value; } }

    private FlowElement[] flowElements;
    public FlowElement[] FlowElements { get { return flowElements; } set { flowElements = value; } } 
    
    private Documents[] documents;
    public Documents[] Documents { get { return documents; } set { documents = value; } }

    private Variables[] variables;
    public Variables[] Variables { get { return variables; } set { variables = value; } }

    private DeletedIDs deletedIDs;
    public DeletedIDs DeletedIDs { get { return deletedIDs; } set { deletedIDs = value; } }

    private EnumType[] enumTypes;
    public EnumType[] EnumTypes { get { return enumTypes; } set { enumTypes = value; } }

}

public class Variables
{
    private int variableID;
    public int VariableID { get { return variableID; } set { variableID = value; } }

    private int formItemID;
    public int FormItemID { get { return formItemID; } set { formItemID = value; } }
    
    private string label;
    public string Label { get { return label; } set { label = value; } }

    private string name;
    public string Name { get { return name; } set { name = value; } }

    private string dataType;
    public string DataType { get { return dataType; } set { dataType = value; } }

    private string inputType;
    public string InputType { get { return inputType; } set { inputType = value; } }

    private bool nullable;
    public bool Nullable { get { return nullable; } set { nullable = value; } }

    private bool isDefault;
    public bool IsDefault { get { return isDefault; } set { isDefault = value; } }

    private int enumTypeID;
    public int EnumTypeID { get { return enumTypeID; } set { enumTypeID = value; } }

    private int entityTypeID;
    public int EntityTypeID { get { return entityTypeID; } set { entityTypeID = value; } }

    private string formula;
    public string Formula { get { return formula; } set { formula = value; } }

    private string defaultValue;
    public string DefaultValue { get { return defaultValue; } set { defaultValue = value; } }

    private bool enabled;
    public bool Enabled { get { return enabled; } set { enabled = value; } }

    private string version;
    public string Version { get { return version; } set { version = value; } }

    private string description;
    public string Description { get { return description; } set { description = value; } }

    private int rowKey;
    public int RowKey { get { return rowKey; } set { rowKey = value; } }

    private string inputCount;
    public string InputCount { get { return inputCount; } set { inputCount = value; } } 
    

    private Columns[] columns;
    public Columns[] Columns { get { return columns; } set { columns = value; } }


}
public class Columns
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

    private Style style;
    public Style Style { get { return style; } set { style = value; } }

}

public class DeletedIDs
{
    private int[] deletedFormIDs;
    public int[] DeletedFormIDs { get { return deletedFormIDs; } set { deletedFormIDs = value; } }

    private int[] deletedDocIDs;
    public int[] DeletedDocIDs { get { return deletedDocIDs; } set { deletedDocIDs = value; } }

}

public class Style
{
    private string colWidth;
    public string ColWidth { get { return colWidth; } set { colWidth = value; } }

    private string colHeight;
    public string ColHeight { get { return colHeight; } set { colHeight = value; } }
}