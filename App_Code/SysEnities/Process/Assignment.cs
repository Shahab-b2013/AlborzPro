// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.2.1.0
// Release Ferdos.BPMS

public class Assignment
{
    private string type;
    public string Type { get { return type; } set { type = value; } }

    private int assignedUserID;
    public int AssignedUserID { get { return assignedUserID; } set { assignedUserID = value; } }

    private int assignedTeamID;
    public int AssignedTeamID { get { return assignedTeamID; } set { assignedTeamID = value; } }

    private int assignedPositionID;
    public int AssignedPositionID { get { return assignedPositionID; } set { assignedPositionID = value; } }

    private int defaultUserID;
    public int DefaultUserID { get { return defaultUserID; } set { defaultUserID = value; } }

    private int defaultTeamID;
    public int DefaultTeamID { get { return defaultTeamID; } set { defaultTeamID = value; } }

    private int defaultPositionID;
    public int DefaultPositionID { get { return defaultPositionID; } set { defaultPositionID = value; } }
     
    private int assignmentProcedureID;        
    public int AssignmentProcedureID { get { return assignmentProcedureID; } set { assignmentProcedureID = value; } }

    private int assignedVariableID;
    public int AssignedVariableID { get { return assignedVariableID; } set { assignedVariableID = value; } }

    private string assignedDepartmentID;
    public string AssignedDepartmentID { get { return assignedDepartmentID; } set { assignedDepartmentID = value; } }

    private string assignedSiteID;
    public string AssignedSiteID { get { return assignedSiteID; } set { assignedSiteID = value; } }

    private string assignedContractID;
    public string AssignedContractID { get { return assignedContractID; } set { assignedContractID = value; } }

    private string assignedProfiles;
    public string AssignedProfiles { get { return assignedProfiles; } set { assignedProfiles = value; } }

    private string assignedBuildingID;
    public string AssignedBuildingID { get { return assignedBuildingID; } set { assignedBuildingID = value; } }

    private Cartable cartable;
    public Cartable Cartable { get { return cartable; } set { cartable = value; } }

    private SLA sla;
    public SLA SLA { get { return sla; } set { sla = value; } }

    private Settings settings;
    public Settings Settings { get { return settings; } set { settings = value; } }
}

public class Cartable
{
    private int assignedCartabeleID;
    public int AssignedCartabeleID { get { return assignedCartabeleID; } set { assignedCartabeleID = value; } }

    private int defaultCartabeleID;
    public int DefaultCartabeleID { get { return defaultCartabeleID; } set { defaultCartabeleID = value; } }
}

public class SLA
{
    private int resolutionTimes;
    public int ResolutionTimes { get { return resolutionTimes; } set { resolutionTimes = value; } }

    private string resolutionType;
    public string ResolutionType { get { return resolutionType; } set { resolutionType = value; } }

    private bool bOption0;
    public bool BOption0 { get { return bOption0; } set { bOption0 = value; } }

    private bool bOption6;
    public bool BOption6 { get { return bOption6; } set { bOption6 = value; } }
}

public class Settings
{
    private bool bOption1;
    public bool BOption1 { get { return bOption1; } set { bOption1 = value; } }

    private bool bOption2;
    public bool BOption2 { get { return bOption2; } set { bOption2 = value; } }

    private bool bOption3;
    public bool BOption3 { get { return bOption3; } set { bOption3 = value; } }

    private bool bOption4;
    public bool BOption4 { get { return bOption4; } set { bOption4 = value; } }

    private bool bOption5;
    public bool BOption5 { get { return bOption5; } set { bOption5 = value; } }
}