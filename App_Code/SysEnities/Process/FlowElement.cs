// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.2.1.0
// Release Ferdos.BPMS

public class FlowElement
{
    private int elementID;
    public int ElementID { get { return elementID; } set { elementID = value; } }

    private string label;
    public string Label { get { return label; } set { label = value; } }

    private string name;
    public string Name { get { return "Activity_"+ elementID; } set { name = value; } }

    private string type;
    public string Type { get { return type; } set { type = value; } }

    private string stateID;
    public string StateID { get { return stateID == "" ? "0" : stateID; } set { stateID = value; } }

    private int[] incomingEIDs;
    public int[] IncomingEIDs { get { return incomingEIDs; } set { incomingEIDs = value; } }

    private int[] outgoingEIDs;
    public int[] OutgoingEIDs { get { return outgoingEIDs; } set { outgoingEIDs = value; } }

    private Assignment assignment;
    public Assignment Assignment { get { return assignment; } set { assignment = value; } }

    private ActivitySchedule schedule;
    public ActivitySchedule Schedule { get { return schedule; } set { schedule = value; } }

    private GatewayOption gatewayOption ;
    public GatewayOption GatewayOption { get { return gatewayOption; } set { gatewayOption = value; } }

    private bool isFirstTask;
    public bool IsFirstTask { get { return isFirstTask; } set { isFirstTask = value; } }
}

public class ActivitySchedule
{
    private ScheduleItem[] accessTiming;
    private int id;

    public ScheduleItem[] AccessTiming
    {
        get { return accessTiming; }
        set { accessTiming = value; }
    }

    public int ID
    {
        get { return id; }
        set { id = value; }
    }
}

public class ScheduleItem
{
    private string startDate;
    private string startHour; 
    private string finishDate; 
    private string finishHour; 

    public string StartDate
    {
        get { return startDate; }
        set { startDate = value; }
    }

    public string StartHour
    {
        get { return startHour; }
        set { startHour = value; }
    }

    public string FinishDate
    {
        get { return finishDate; }
        set { finishDate = value; }
    }

    public string FinishHour
    {
        get { return finishHour; }
        set { finishHour = value; }
    }
}


