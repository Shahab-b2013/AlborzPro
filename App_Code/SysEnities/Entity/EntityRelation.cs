// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0 
// Release Ferdos.BPMS

public class EntityRelation
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Label { get; set; }

    public string Type { get; set; }

    public int SourceEntityID { get; set; }
    
    public string SourceMultiplicity { get; set; }

    public string DestinationMultiplicity { get; set; }

    public int DestinationEntityID { get; set; }


    private AssociationEntity associationEntity;

    public AssociationEntity AssociationEntity { get { return associationEntity; } set { associationEntity = value; } }

}



