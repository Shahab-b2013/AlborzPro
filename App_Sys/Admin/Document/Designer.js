/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.1.0.0*/
/* Release Ferdos.BPMS*/

"use strict";

function initiateToolbar() {}
var Doc = {};
var docProcess = JSON.parse(localStorage.getItem("Documents" + $ProcessID));

function renderDesigner(designJson) {
  if ($.isEmptyObject(JSON.parse(designJson))) {
        const _RowKey = _pageKey - Math.round(($ProcessID + 500) * 10000);

    let Arr = docProcess.filter(
      (x) => x.RowKey == _RowKey
    )[0];
    //convert to object
    Doc = Arr;
    Doc.isDefault = true;
    Doc.Documents = [];
    $.ajax({
      type: "POST",
      url: "../../App_Sys/Services/Admin/Document.asmx/GetDocImg",
      data: `{id:${_pageKey}}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async: false,
      success: function (data) {
        let dataObj = JSON.parse(data.d);
        Doc.ImgSrc = dataObj;

        Import_CS(Doc);
      },
      error: function (error) {
        console.error("Error fetching data:", error);
      },
    });
  } else {
    let Doc = JSON.parse(designJson);
    const _RowKey = _pageKey - Math.round(($ProcessID + 500) * 10000);

    let Arr = docProcess.filter(
      (x) => x.RowKey == _RowKey
    )[0];
    // $JSON = object;
    // Doc = object;
    Doc.ImgSize = Arr.ImgSize;
    Doc.label = Arr.Label;
    Doc.isDefault = false;
    $.ajax({
      type: "POST",
      url: "../../App_Sys/Services/Admin/Document.asmx/GetDocImg",
      data: `{id:${_pageKey}}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async: false,
      success: function (data) {
        let dataObj = JSON.parse(data.d);
        Doc.ImgSrc = dataObj;

        Import_CS(Doc);
      },
      error: function (error) {
        console.error("Error fetching data:", error);
      },
    });
  }

  //Get images data from ".fdmt" file
}

function saveDesign(_alert) {
  var data = new FormData();
  data.append("design", Export());
  data.append("id", +_pageKey);
  var $Doc = new udExecutor(data, _alert);
  $Doc.submit(data);

  localStorage.setItem("Saveinterval", true);
}
