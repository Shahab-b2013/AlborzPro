SELECT 
SeverityLevel AS Color,  AlertMatchID AS AlertID, ClientName AS ClientName, 
  ClientIP AS ClientIP, PMSIP AS PMSIP,MalwareName AS Malware,   MDR_ReceivedDate AS ClientDate,
RecordDate AS AlertDate, IncidentID AS IncidentID
FROM dbo.Alt_AlertMatchs
WHERE (IncidentID <> @ObjectID OR IncidentID IS NULL) AND PadvishServerID = (SELECT PadvishServerID FROM Alt_Incidents WHERE IncidentID=@ObjectID)
 AND  TRY_CONVERT(DATETIME, CreatedDate) >DATEADD(DAY, -1000, GETDATE())
 ORDER BY TRY_CONVERT(DATETIME, CreatedDate) DESC

 توضیح اینکه از 6220002 به بعد حذف شدن

