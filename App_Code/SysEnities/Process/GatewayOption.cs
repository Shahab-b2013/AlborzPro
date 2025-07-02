// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.5.0.0
// Release Ferdos.BPMS

public class GatewayOption
{
    private RoutingRules[] routingRule;
    public RoutingRules[] RoutingRules { get { return routingRule; } set { routingRule = value; } }
}

public class RoutingRules
{  
    private string lang;
    public string Lang { get { return lang; } set { lang = value; } }

    private string sql;
    public string Sql { get { return sql; } set { sql = value; } }

    private string label;
    public string Label { get { return label; } set { label = value; } }

    private string name;
    public string Name { get { return name; } set { name = value; } }

    private string conditions;
    public string Conditions { get { return conditions; } set { conditions = value; } }

    private int outgoingEID;
    public int OutgoingEID { get { return outgoingEID; } set { outgoingEID = value; } }

    private int stateID;
    public int StateID { get { return stateID; } set { stateID = value; } }

    private int[] access;
    public int[] Access { get { return access; } set { access = value; } }
}