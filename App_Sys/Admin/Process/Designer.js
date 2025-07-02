/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.1.0.0*/
/* Release Ferdos.BPMS*/

"use strict";

// function initiateToolbar() {}

function renderDesigner(designJson) {
  let interval = setInterval(() => {
    if ($editorUI != undefined) {
      new Actions($editorUI).Import_CS(designJson);
      clearInterval(interval);
    }
  }, 1);
}

function saveDesign(_alert) {
  let _Export;
  if ($editorUI != undefined) _Export = new Actions($editorUI).Export();
  if (_Export != "{}") {
    localStorage.setItem(
      "Variables" + _pageKey,
      JSON.stringify(JSON.parse(_Export).ProcessModel.Variables)
    );
    localStorage.setItem(
      "Variables" + _pageKey,
      JSON.stringify(VariableUI.MainArray)
    );

    if (VariableUI.MainArray.length > 0) {
      VariableUI.MainArray.sort(
        (a, b) => +a.SystemID.slice(3) - +b.SystemID.slice(3)
      );

      let last = VariableUI.MainArray.at(-1).SystemID;
      localStorage.setItem("LastSystemID" + _pageKey, last);
    } else {
      localStorage.setItem("LastSystemID" + _pageKey, "Val000");
    }

    var data = new FormData();
    data.append("design", _Export);
    data.append("id", _pageKey);
    var $process = new pdExecutor(data, _alert);
    $process.submit(data);
  } else {
    swal(`${mxResources.get("connectionisnotconnected")}`, {
      icon: "warning",
    });
  }
}
