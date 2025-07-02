// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.0.0
// Release Ferdos.BPMS

public class Schedule
{
    private bool schedulesEnable = false;
    public bool SchedulesEnable { get { return schedulesEnable; } set { schedulesEnable = value; } }

    private string occurs;
    public string Occurs { get { return occurs; } set { occurs = value; } }

    private string month;
    public string Month { get { return month; } set { month = value; } }

    private string week ;
    public string Week { get { return week; } set { week = value; } }

    private string dayMonth;
    public string DayMonth { get { return dayMonth; } set { dayMonth = value; } }

    private string daily;
    public string Daily { get { return daily; } set { daily = value; } }

    private bool saturday = false;
    public bool Saturday { get { return saturday; } set { saturday = value; } }

    private bool sunday = false;
    public bool Sunday { get { return sunday; } set { sunday = value; } }

    private bool monday = false;
    public bool Monday { get { return monday; } set { monday = value; } }

    private bool tuesday = false;
    public bool Tuesday { get { return tuesday; } set { tuesday = value; } }

    private bool wednesday = false;
    public bool Wednesday { get { return wednesday; } set { wednesday = value; } }

    private bool thursday = false;
    public bool Thursday { get { return thursday; } set { thursday = value; } }

    private bool friday = false;
    public bool Friday { get { return friday; } set { friday = value; } }

    private string sendTime;
    public string SendTime { get { return sendTime; } set { sendTime = value; } }

    private string exportType;
    public string ExportType { get { return exportType; } set { exportType = value; } }

    private bool sendToAllUsers = false;
    public bool SendToAllUsers { get { return sendToAllUsers; } set { sendToAllUsers = value; } }

    private bool saveReport = false;
    public bool SaveReport { get { return saveReport; } set { saveReport = value; } }

    private string reportPath;
    public string ReportPath { get { return reportPath; } set { reportPath = value; } }

    private bool sendReport = false;
    public bool SendReport { get { return sendReport; } set { sendReport = value; } }

    private string sendEmails;
    public string SendEmails { get { return sendEmails; } set { sendEmails = value; } }


}