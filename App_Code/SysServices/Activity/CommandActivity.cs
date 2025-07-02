// Code File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.0.0.0
using System;

public class SeriesOption
{
    public string Type;

    public string GroupingExpression;

    public string TimePrioiedType;
}

public class ActivityParam
{
    public string ParamIndex;

    public string ParamValue;

    public string ParamName;

    public int FileIsExist;

    public string FileAttachCode;

    public ActivityParam()
    {
    }
}

public class OrderParam
{
    public int ColumnIndex;

    public string ColumnName;

    public string OrderDir;

    public OrderParam() { }

    public OrderParam(object columnIndex, object orderDir)
    {
        this.ColumnIndex = Convert.ToInt32(columnIndex);

        this.OrderDir = orderDir.ToString();
    }
}
