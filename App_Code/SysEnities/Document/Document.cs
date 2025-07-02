// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.1.0.0
// Release Ferdos.BPMS

public class IDocument
{
    private int documentID;
    public int DocumentID { get { return documentID; } set { documentID = value; } }

    private int processID;
    public int ProcessID { get { return processID; } set { processID = value; } }

    private int rowKey;
    public int RowKey { get { return rowKey; } set { rowKey = value; } }

     private string label;
    public string Label { get { return label; } set { label = value; } }

    private string imgSrc;
    public string ImgSrc { get { return imgSrc; } set { imgSrc = value; } }

    private string imgName;
    public string ImgName { get { return imgName; } set { imgName = value; } }

    private string imgSize;
    public string ImgSize { get { return imgSize; } set { imgSize = value; } }

    private int activityID;
    public int ActivityID { get { return activityID; } set { activityID = value; } }

     private DocumentsPageItem[] documents;
    public DocumentsPageItem[] Documents { get { return documents; } set { documents = value; } }

   
}

