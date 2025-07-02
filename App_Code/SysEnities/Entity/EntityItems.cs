// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0 
// Release Ferdos.BPMS

public class EntityItems
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Label { get; set; }

    public string DataName { get; set; }

    public bool IsPredefined { get; set; }

    public bool IdentityAuto { get; set; }

    public bool Isbasic { get; set; }



    private Attributes attributes;

    public Attributes Attributes { get { return attributes; } set { attributes = value; } }


}
