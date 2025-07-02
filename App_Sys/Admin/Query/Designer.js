/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.6.0.0*/
/* Release Ferdos.BPMS*/

function renderDesigner(designJson) {
  Import_CS(designJson);
}

function saveDesign(_alert) {
  var _export = Export();
  var data = new FormData();
  data.append("design", _export);
  data.append("id", +PAGE_ID);
  var $Query = new qdExecutor(data, _alert);
  $Query.submit(data);
}
