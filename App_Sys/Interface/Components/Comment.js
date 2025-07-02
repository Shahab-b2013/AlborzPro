function Comment(tmpAlertList, parentID, _objKey) {
  $(`.alertListDiv`).remove();
 let strAlertTh = "";
 let strAlertTd = "";

 for (const key in tmpAlertList[0]) {
   let _with = "";
   if (key != "ObjKey" && key != "requestDate" && key != "requestToken") {
     if (key == "UserName") {
       _with = "width: 100px !important;";
     } else if (key == "CommentDate") {
       _with = "width: 160px !important;";
     }

     strAlertTh += `<th style="${_with}">${key}</th>`;
   }
 }

 tmpAlertList.map((item, index) => {
   strAlertTd += `<tr  class="trHover">`;

   for (const key in item) {
     if (key !== "ObjKey" && key !== "requestDate" && key !== "requestToken") {
       let tmpStr = item[key];
       if (typeof tmpStr === "string" && tmpStr.includes("/Date("))
         strAlertTd += `<td class="ellipsis">${hasDateInStr(tmpStr)}</td>`;
       else strAlertTd += `<td class="ellipsis">${tmpStr}</td>`;
     }
   }

   strAlertTd += `</tr>`;
 });

 let strAlertTbl = `<table id="commentTable" class="table-bordered gridList incidentTable"><tr>${strAlertTh}</tr>${strAlertTd}</table>`;

 let _alert = `<div class="alertListDiv">${strAlertTbl}</div>`;

 $(`#` + parentID).append(_alert);
}
