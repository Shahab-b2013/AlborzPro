/* Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.0.0*/

"use strict";

function initiateToolbar() {}
var RowID;
function renderDesigner(designJson) {
  Import_Cs(designJson);

  function FormGroupBoxsID_Generator() {
    let id = +ROWBOXS.sort((a, b) => +a.RowID - +b.RowID).at(-1).RowID + 1;
    return () => id++ + "";
  }
  RowID = FormGroupBoxsID_Generator();
}

function saveDesign(_alert) {
  var data = new FormData();
  data.append("design", Export());
  data.append("ID", DASHBOARDID);
  var $dashboard = new ddExecutor(data, _alert);
  $dashboard.submit(data);
}
