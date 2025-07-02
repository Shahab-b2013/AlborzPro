// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0 
// Release Ferdos.BPMS

public class EntityAttribute
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Label { get; set; }

    public bool Nullable { get; set; }

    public int AttributeTypeID { get; set; }

    public int EnumTypeID { get; set; }

    public string DefaultValue { get; set; }

    public string Subject { get; set; }

    public bool IsSysAttribute { get; set; } 
    
    public string Formula { get; set; }

    public bool IsComputed { get; set; }

    public bool ValueIsUnique { get; set; }

}

