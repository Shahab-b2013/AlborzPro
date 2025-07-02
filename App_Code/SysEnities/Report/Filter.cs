// Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.6.0.0
// Release Ferdos.BPMS

public class Filter
{
    private string _condition;
    public string condition { get { return _condition; } set { _condition = value; } }

    private Rule[] _rules;
    public Rule[] rules { get { return _rules; } set { _rules = value; } }

    private bool _valid = false;
    public bool valid { get { return _valid; } set { _valid = value; } }
}