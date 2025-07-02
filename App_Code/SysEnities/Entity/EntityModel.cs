// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0 
// Release Ferdos.BPMS

public class EntityModel
{
    private int id;

    public int Id { get { return id; } set { id = value; } }

    private string name;

    public string Name { get { return name; } set { name = value; } }

    private string label;

    public string Label { get { return label; } set { label = value; } }

    private Entities entities;

    public Entities Entities { get { return entities; } set { entities = value; } }

    private EntityRelations entityRelations;

    public EntityRelations EntityRelations { get { return entityRelations; } set { entityRelations = value; } }

}