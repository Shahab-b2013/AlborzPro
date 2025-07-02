/* Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.0.0*/
"use strict";
function Accesses(e) {
  let div =
    '<div id="myModal" class="modal" >' +
    '<div id="chartModal" class="modal-content">' +
    '<div id="contentM" class="col-md-12"></div>' +
    "</div></div>";
  $("body").append(div);

  $("#myModal").css("display", "block");
  $("#chartModal").css("width", "40%");

  $("#chartModal").addClass("containerside");
  //Tab
  $("#chartModal").append(createDiv("tabdiv", ""));
  $("#chartModal").append(
    '<ul id="Access_UI" class="col-md-12 ul nav nav-tabs navbar-right"></ul>'
  );
  $("#Access_UI").append(
    `<li id="Roles" class="active" onclick="tabLbl(id)"><a href="#Tab1" style="font-Weight:bold;font-size:14px;" data-toggle="tab" >${dashResources.get(
      "Roles"
    )}</a></li>`
  );
  $("#Access_UI").append(
    `<li id="Groups" onclick="tabLbl(id)"><a href="#Tab2" style="font-Weight:bold;font-size:14px;" data-toggle="tab" >${dashResources.get(
      "Groups"
    )}</a></li>`
  );
  //tab content
  $("#chartModal").append(
    `<div class="head_activi"><label id="radioLbl" class="radioLbl">${dashResources.get(
      "Roless"
    )}</label></div><div id="tab-content" class="tab-content"></div>`
  );

  //tab1
  $("#tab-content").append(
    '<div class="tab-pane fade in active" style="opacity:1;" id="Tab1"></div>'
  );
  //tab2
  $("#tab-content").append('<div class="tab-pane fade" style="opacity:1" id="Tab2"></div>');

  //get/set refRoles
  if (REFROLES != null) Tabinfo(REFROLES, "Tab1", "Roles");
  //get/set refGroups
  if (REFGROUPS != null) Tabinfo(REFGROUPS, "Tab2", "Groups");

  //tabs body
  function Tabinfo(listLbl, ID, tabId) {
    for (let item in listLbl) {
      $("#" + ID).append(
        '<div id="rowDiv' + ID + item + '" class="rowDiv" ></div>'
      );

      //label
      $("#rowDiv" + ID + item).append(
        '<label id="label' +
          item +
          tabId +
          '" class="lbl" style="display:inline;margin:5px 10px 0px 10px;">' +
          listLbl[item].Label +
          "</label>"
      );
      $("#label" + item + tabId).click(() => {
        $("#check" + item + tabId).is(":checked")
          ? $("#check" + item + tabId).prop("checked", false)
          : $("#check" + item + tabId).prop("checked", true);
      });

      //checkbox
      $("#rowDiv" + ID + item).append(
        '<input id="check' +
          item +
          tabId +
          '" type="checkbox" class="AccessCheckbox">'
      );
      //input isChecked
      let isLocal;
      tabId == "Roles" ? (isLocal = "accessRoles") : (isLocal = "accessGroups");

      let getListAccess =
        isLocal == "accessRoles" ? ACCESESROLES : ACCESESGROUPS;

      for (let i = 0; i < getListAccess.length; i++) {
        if (listLbl[item].Label == getListAccess[i].Label) {
          $("#check" + item + tabId).prop("checked", true);
        }
      }

      $("#rowDiv" + ID + item).append("</br>");
    }
  }

  //btn Save
  $("#chartModal").append('<div id="AccesessBtn"></div>');
  $("#AccesessBtn").append(
    `<button id="btnsave_Accessess" class="btn btn-primary" style="">${dashResources.get(
      "save"
    )}</button>`
  );
  $("#btnsave_Accessess").click(() => {
    let count = 0;
    let tabId;
    while (count < 2) {
      if (count == 0) {
        tabId = "Roles";
        tabIems(REFROLES, tabId);
      } else {
        tabId = "Groups";
        tabIems(REFGROUPS, tabId);
      }
      count++;
    }
    HideModal();
  });

  function tabIems(items, tabId) {
    let obj = {};
    let Array = [];
    for (let i in items) {
      let check = document.getElementById("check" + i + tabId);
      let label = document.getElementById("label" + i + tabId);
      let _ID;
      tabId == "Roles"
        ? (_ID = REFROLES.find(
            (Element) => Element.Label == label.innerHTML
          ).ID)
        : (_ID = REFGROUPS.find(
            (Element) => Element.Label == label.innerHTML
          ).ID);
      if (check.checked) {
        obj = {
          ID: _ID,
          Label: label.innerHTML,
        };
        Array.push(obj);
      }
    }
    if (tabId == "Roles") {
      ACCESESROLES = Array;
    } else if (tabId == "Groups") {
      ACCESESGROUPS = Array;
    }
  }
  //btn Exit
  $("#AccesessBtn").append(
    `<button class="btn btn btn-light" onclick="HideModal()" style="">${dashResources.get(
      "out"
    )}</button>`
  );
}

//change tab label
function tabLbl(id) {
  const lbl = id == "Roles" ? "Roless" : "Groupss";
  $(`#radioLbl`).html(dashResources.get(lbl));
}
