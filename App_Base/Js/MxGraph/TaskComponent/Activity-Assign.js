/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.1.0*/
/* Release Ferdos.BPMS*/

function Activity_Assign(graph) {
  $("body").append(
    '<div id="send_activi_Modal" class="modal"><div id="send_activi_ID" class="modal-content" style="width:985px;top:-15px;max-height: 735px;"></div></div>'
  );
  $("#send_activi_Modal").css("display", "block");

  let mainDiv =
    `<span class="fa fa-user"></span><label   class="" style="font-size:17px;font-weight: 700;">${mxResources.get(
      "Referralactivity"
    )}</label>` +
    '<hr style="border-Top: 2px solid #ccc;"/>' +
    '<form  id="mainDIv"  style="padding: 0px 2px 2px 2px;border:0px solid;">' +
    `<div class="head_activi"><label class="radioLbl">${mxResources.get(
      "Referraltype"
    )}</label>` +
    `<input type="radio" id="radio1" class="radioActivity"  name="mainDiv" checked/><label for="radio1" class="radioLbl">${mxResources.get(
      "Individual"
    )}</label>` +
    // `<input type="radio" id="radio2" class="radioActivity"  name="mainDiv" /><label for="radio2" class="radioLbl">${mxResources.get(
    //   "inorder"
    // )}</label>` +
    `<input type="radio" id="radio3" class="radioActivity"  name="mainDiv" /><label for="radio3" class="radioLbl">${mxResources.get(
      "Group"
    )}</label>` +
    // `<input type="radio" id="radio4" class="radioActivity"  name="mainDiv" /><label for="radio4" class="radioLbl">${mxResources.get(
    //   "smart"
    // )}</label>
    `</div>` +
    "</form>";
  $(`#send_activi_ID`).append(mainDiv);

  F1("mainDIv");
  F2();
  F3();
  F4();

  //btn
  $(`#mainDIv`).append(
    `<input type="button" id="btn_primary" class="btn btn-primary" style="width: 70px;margin-top: 5px;" value="${mxResources.get(
      "btnPrimary"
    )}">`
  );
  $(`#mainDIv`).append(
    `<input type="button" id="btn_exit" class="btn btn btn-light" style="width: 70px;margin-top: 5px;" value="${mxResources.get(
      "btnCancel"
    )}"/>`
  );

  Activity_Action();
  Activity_btn(graph);
  Activity_onload(graph);
}

function F1(parent) {
  let F1 =
    `<form id="F1" class="Activity_Assign" style="display:block">` +
    `<label class="sub_radioLbl">${mxResources.get("Usertype")} </label>` +
    `<input type="radio" id="radio5" class="radioActivity" name="F1" checked/><label for="radio5" class="sub_radioLbl">${mxResources.get(
      "Systemuser"
    )} </label>` +
    `<input type="radio" id="radio6" class="radioActivity" name="F1" /><label for="radio6" class="sub_radioLbl">${mxResources.get(
      "organizationlevel"
    )}</label>` +
    `<input type="radio" id="radio7" class="radioActivity" name="F1" /><label for="radio7" class="sub_radioLbl">${mxResources.get(
      "Workteammanager"
    )}</label>` +
    `<input type="radio" id="radio8" class="radioActivity" name="F1" /><label for="radio8" class="sub_radioLbl">${mxResources.get(
      "Relatedtotheprocess"
    )}</label>` +
    "</div>";
  $(`#` + parent).append(F1);
  const F1_1 =
    '<div id="F1_1" class="ّF1_sub" style="margin-top: 20px;" >' +
    `<label  class="selectLbl">${mxResources.get(
      "Mainuser"
    )}</label><select  id="select1" class="selectF" ></select></br>` +
    // `<label  class="selectLbl">${mxResources.get(
    //   "Substituteuser"
    // )}</label><select  id="select2" class="selectF" ></select>` +
    "</div>";
  $(`#F1`).append(F1_1);
  const F1_2 =
    '<div id="F1_2" class="ّF1_sub" style="margin-top: 20px;display:none;" >' +
    `<label  class="selectLbl">${mxResources.get(
      "Mainlevel"
    )}</label><select  id="select3" class="selectF"></select></br>` +
    // `<label  class="selectLbl">${mxResources.get(
    //   "Substitutelevel"
    // )}</label><select  id="select4" class="selectF" ></select>` +
    "</div>";
  $(`#F1`).append(F1_2);
  const F1_3 =
    '<div id="F1_3" class="ّF1_sub" style="margin-top: 20px;display:none;" >' +
    `<label  class="selectLbl">${mxResources.get(
      "Mainworkteam"
    )}</label><select  id="select5" class="selectF"></select></br>` +
    // `<label   class="selectLbl">${mxResources.get(
    //   "Substituteworkteam"
    // )}</label><select  id="select6" class="selectF" ></select>` +
    "</div>";
  $(`#F1`).append(F1_3);
  const F1_4 =
    '<div id="F1_4" class="ّF1_sub" style="margin-top: 20px;display:none;" >' +
    `<label   class="selectLbl">${mxResources.get(
      "Processinformation"
    )}</label><select  id="select55" class="selectF" ></select>` +
    "</div>";
  $(`#F1`).append(F1_4);
}
function F2() {
  const F2 =
    '<div id="F2" class="Activity_Assign">' +
    `<label   class="selectLbl">${mxResources.get(
      "Mainworkteam"
    )}</label><select  id="select7" class="selectF" ></select></br>` +
    `<label   class="selectLbl">${mxResources.get(
      "Substituteworkteam"
    )}</label><select  id="select8" class="selectF" ></select>` +
    "</div>";
  //$(`#mainDIv`).append(F2);
}
function F3() {
  const F3 =
    '<div id="F3" class="Activity_Assign" style="max-height: 500px;overflow: auto;">' +
    `<label class="sub_radioLbl">${mxResources.get("Usertype")}</label>` +
    `<input type="radio" id="radio9" class="radioActivity" name="F3" checked/><label for="radio9" class="sub_radioLbl">${mxResources.get(
      "OrgChart"
    )}</label>` +
    `<input type="radio" id="radio10" class="radioActivity" name="F3" /><label for="radio10" class="sub_radioLbl">${mxResources.get(
      "Location"
    )}</label>` +
    `<input type="radio" id="radio11" class="radioActivity" name="F3" /><label for="radio11" class="sub_radioLbl">${mxResources.get(
      "ContractType"
    )}</label>` +
    `<input type="radio" id="radio12" class="radioActivity" name="F3" /><label for="radio12" class="sub_radioLbl">${mxResources.get(
      "WorkingProfile"
    )}</label>` +
    "</div>";

  $(`#mainDIv`).append(F3);

  // Populate F3_1, F3_2, and F3_3 from JSON
  populateF3_1FromJSON();
  populateF3_2FromJSON();
  populateF3_3FromJSON();
  populateF3_4FromJSON();
  $("#F3_2").hide();
  $("#F3_3").hide();
  $("#F3_4").hide();
}

function populateF3_1FromJSON() {
  const F3_1 = `<div id="F3_1"><div id="dropdown" class="dropdown-content"><ul class="tree" style="list-style-type: none;"></ul></div></div>`;
  $(`#F3`).append(F3_1);

  // Sample flat JSON data structure for F3_1
  const jsonData = $JSON_IMPORTED.ProcessModel.SysDepartment;

  // Transform flat data to hierarchical structure
  const treeData = buildTree(jsonData);

  // Populate tree with hierarchical data
  const treeContainer = document.querySelector("#F3_1 .tree");
  populateTree(treeContainer, treeData, "department");
}

function populateF3_4FromJSON() {
  const F3_4 = `<div id="F3_4">
      <label class="sub_radioLbl">${mxResources.get("Profiles")}</label>
      <select id="F3_4_Select" style="width:300px"></select>
    </div>`;
  $(`#F3`).append(F3_4);

  // // Sample options data for F3_3
  // let optionsData = [];

  // // Getting Profiles From dataBase
  // $.ajax({
  //   type: "POST",
  //   url: "../../App_Sys/Services/Admin/Process.asmx/GetWorkingProfiles",
  //   data: ``,
  //   contentType: "application/json; charset=utf-8",
  //   async: false,
  //   dataType: "json",
  //   success: function (data) {
  //     optionsData = JSON.parse(data.d);
  //   },
  //   error: function (error) {
  //     alert(JSON.stringify(error));
  //   },
  // });

  // // Append options dynamically using ID and Label
  // optionsData.forEach((option) => {
  //   $("#F3_4_Select").append(new Option(option.Label, option.ID));
  // });

  $("#F3_4_Select").select2({
    multiple: true, // Allow selecting multiple items
  });

  $("#F3_4_Select").val(null).trigger("change"); // Clear default value of select list
}

function populateF3_3FromJSON() {
  const F3_3 = `<div id="F3_3">
                  <label class="sub_radioLbl">${mxResources.get(
                    "SelectItems"
                  )}</label>
                  <select id="F3_3_Select" style="width:300px"></select>
                </div>`;
  $(`#F3`).append(F3_3);

  // Sample options data for F3_3
  // const optionsData = [
  //   { value: "آموزشی", text: "آموزشی" },
  //   { value: "آزمایشی", text: "آزمایشی" },
  //   { value: "مدت معین", text: "مدت معین" },
  // ];

  // // Append options dynamically
  // optionsData.forEach((option) => {
  //   $("#F3_3_Select").append(new Option(option.text, option.value));
  // });

  $("#F3_3_Select").select2({
    multiple: true, // Allow to select multiple items
  });

  $("#F3_3_Select").val(null).trigger("change"); // Clear default value of select list
}

function populateF3_2FromJSON() {
  const F3_2 = `<div id="F3_2"><div id="dropdown" class="dropdown-content"><ul class="tree" style="list-style-type: none;"></ul></div></div>`;
  $(`#F3`).append(F3_2);

  // JSON data for Sites and Buildings
  const jsonDataSites = $JSON_IMPORTED.ProcessModel.SysSties;

  const jsonDataBuilding = $JSON_IMPORTED.ProcessModel.SysBuildings;

  // Build the initial tree from jsonDataSites
  const treeData = buildTree(jsonDataSites);

  // Add buildings as children to the respective sites
  addBuildingsToTree(treeData, jsonDataBuilding);

  // Populate tree with hierarchical data
  const treeContainer = document.querySelector("#F3_2 .tree");
  populateTree(treeContainer, treeData, "sites");
}

function buildTree(data) {
  const tree = [];
  const lookup = {};

  // Initialize the tree with sites
  data.forEach((item) => {
    lookup[item.ID] = { ...item, children: [] }; // Ensure children is an array
  });

  // Build tree based on ParentId
  data.forEach((item) => {
    if (item.ParentId) {
      lookup[item.ParentId]?.children.push(lookup[item.ID]); // Add to parent's children
    } else {
      tree.push(lookup[item.ID]); // No ParentId, push to root tree
    }
  });

  return tree;
}

function addBuildingsToTree(treeData, buildingData) {
  const lookup = {};

  // Create a lookup from treeData (sites)
  treeData.forEach((site) => {
    lookup[site.ID] = site;
  });

  // Add buildings as children of respective sites
  buildingData.forEach((building) => {
    const parentSite = lookup[building.ParentId];
    if (parentSite) {
      // Add an attribute before adding the building
      const buildingWithAttribute = {
        ...building,
        children: [],
        "data-type": "building", // Add your custom attribute here
      };
      parentSite.children.push(buildingWithAttribute); // Add building as a child of the site
    }
  });
}

function populateTree(container, items, subject, hasParent = false) {
  items.forEach((item) => {
    const li = document.createElement("li");
    let iconClass;
    const hasChildren = item.children && item.children.length > 0; // Check if children exist
    const building = item["data-type"] === "building"; // Check if the item is a building

    // Determine the icon class based on the item's properties
    if (hasChildren && !building) {
      // For parent items with children
      if (subject === "department") {
        iconClass = "fa-regular fa-sitemap darkBlue"; // Org chart icon
      } else {
        iconClass = "fa fa-solid fa-apartment darkgreen"; // Site icon for locations with children
      }
    } else if (building) {
      // For buildings specifically
      iconClass = "fa-solid fa-building brown"; // Building icon
    } else if (hasParent && !hasChildren) {
      // For leaf items under a parent (e.g., specific departments or locations)
      if (subject === "department") {
        iconClass = "fa-solid fa-users darkcyan"; // Department leaf node
      } else {
        iconClass = "fa fa-solid fa-apartment darkgreen"; // Location leaf node
      }
    } else if (!hasParent && !hasChildren) {
      // For top-level items with no children
      if (subject === "department") {
        iconClass = "fa-regular fa-sitemap"; // Top-level department with no children
      } else {
        iconClass = "fa fa-solid fa-apartment darkgreen"; // Top-level location with no children
      }
    }

    // Create the checkbox, icon, and label
    li.innerHTML = `<input type="checkbox" value="${item.ID}" name="${
      item.Label
    }" data-type="${item["data-type"] || ""}" class="tree-checkbox"/>${
      hasChildren
        ? `<span class="toggle-icon" onclick="toggleGroup(this, event)">
        <i class="fas fa-caret-left"></i></span>`
        : ""
    }
      <i class="${iconClass} tree-item-icon"></i>
      <label class="tree-item-label">${item.Label}</label>`;

    // Add the list item to the container
    container.appendChild(li);

    // If the item has children, recursively populate the child list
    if (hasChildren) {
      const ul = document.createElement("ul");
      ul.style.display = "none"; // Collapse by default
      populateTree(ul, item.children, subject, true); // Pass true for hasParent
      li.appendChild(ul);
    }

    // Get the checkbox and add the change event listener
    const checkbox = li.querySelector(".tree-checkbox");
    if (hasChildren) {
      checkbox.addEventListener("change", function () {
        toggleChildCheckboxes(checkbox, li);
      });
    }
  });
}

// Function to toggle child checkboxes based on the parent checkbox state
function toggleChildCheckboxes(parentCheckbox, listItem) {
  const childCheckboxes = listItem.querySelectorAll("ul .tree-checkbox");
  childCheckboxes.forEach((checkbox) => {
    checkbox.checked = parentCheckbox.checked; // Set the same state as the parent
  });
}

function toggleGroup(toggleIcon, event) {
  event.stopPropagation(); // Prevent closing the dropdown
  var sublist = toggleIcon.parentElement.querySelector("ul");
  if (sublist.style.display === "none" || sublist.style.display === "") {
    sublist.style.display = "block";
    toggleIcon.innerHTML = '<i class="fas fa-caret-down"></i>';
  } else {
    sublist.style.display = "none";
    toggleIcon.innerHTML = '<i class="fas fa-caret-left"></i>';
  }
}

function F4() {
  const F4 =
    '<div id="F4" class="Activity_Assign">' +
    `<label   class="selectLbl">${mxResources.get(
      "Activityreferralrules"
    )}</label><select  id="select11" class="selectF" ></select></br>` +
    `<label   class="selectLbl">${mxResources.get(
      "Substituteworkteam"
    )}</label><select  id="select12" class="selectF" ></select>` +
    "</div>";
  //$(`#mainDIv`).append(F4);
}
function Activity_Action() {
  //set options for selects
  $(".selectF").select2();
  let item = $JSON_IMPORTED.ProcessModel;
  let opt = "";
  if (item) {
    //RefUser
    if (item.RefUsers)
      for (let i in item.RefUsers)
        opt += `<option value="${item.RefUsers[i].ID}">${item.RefUsers[i].Label}</option>`;

    $(`#select1`).append(opt);

    //$(`#select2`).append(opt);

    opt = "";
    //RefRoles
    if (item.RefRoles)
      for (let i in item.RefRoles)
        opt += `<option value="${item.RefRoles[i].ID}">${item.RefRoles[i].Label}</option>`;
    $(`#select3`).append(opt);
    //$(`#select4`).append(opt);
    opt = "";
    //RefTeams
    if (item.RefTeams)
      for (let i in item.RefTeams)
        opt += `<option value="${item.RefTeams[i].ID}">${item.RefTeams[i].Label}</option>`;
    $(`#select5`).append(opt);
    //$(`#select6`).append(opt);
    $(`#select7`).append(opt);
    $(`#select8`).append(opt);
    $(`#select9`).append(opt);
    $(`#select10`).append(opt);
    opt = "";
    //RuleProcedures
    if (item.RuleProcedures)
      for (let i in item.RuleProcedures)
        opt += `<option value="${item.RuleProcedures[i].ID}">${item.RuleProcedures[i].Label}</option>`;
    $(`#select11`).append(opt);
    $(`#select12`).append(opt);
    opt = "";
    //DefVariables
    if (item.DefVariables)
      for (let i in item.DefVariables)
        opt += `<option value="${item.DefVariables[i].ID}">${item.DefVariables[i].Label}</option>`;
    $(`#select55`).append(opt);
    opt = "";
  }

  $(`#radio1`).on("click", () => show_hide("F1", "F2", "F3", "F4"));
  $(`#radio2`).on("click", () => show_hide("F2", "F1", "F3", "F4"));
  $(`#radio3`).on("click", () => show_hide("F3", "F1", "F2", "F4"));
  $(`#radio4`).on("click", () => show_hide("F4", "F1", "F2", "F3"));
  $(`#radio5`).on("click", () => show_hide("F1_1", "F1_2", "F1_3", "F1_4"));
  $(`#radio6`).on("click", () => show_hide("F1_2", "F1_1", "F1_3", "F1_4"));
  $(`#radio7`).on("click", () => show_hide("F1_3", "F1_1", "F1_2", "F1_4"));
  $(`#radio8`).on("click", () => show_hide("F1_4", "F1_1", "F1_2", "F1_3"));
  $(`#radio9`).on("click", () => show_hide("F3_1", "F3_2", "F3_3", "F3_4"));
  $(`#radio10`).on("click", () => show_hide("F3_2", "F3_1", "F3_3", "F3_4"));
  $(`#radio11`).on("click", () => show_hide("F3_3", "F3_2", "F3_1", "F3_4"));
  $(`#radio12`).on("click", () => show_hide("F3_4", "F3_2", "F3_1", "F3_3"));
}

function show_hide(showID, hideID1, hideID2, hideID3) {
  $(`#${showID}`).show();
  $(`#${hideID1}`).hide();
  $(`#${hideID2}`).hide();
  $(`#${hideID3}`).hide();
}
function Activity_btn(graph) {
  //btn
  let isValue;
  $(`#btn_primary`).on("click", () => {
    let bool = true;

    try {
      isValue = _AssignmentOBJ.filter(
        (x) => x.ID == +graph.getSelectionCell().id
      );
      if (isValue.length > 0)
        _AssignmentOBJ.splice(_AssignmentOBJ.indexOf(isValue[0]), 1);
      let Obj = {
        ID: +graph.getSelectionCell().id,
        Type: "",
        AssignedUserID: 0,
        AssignedTeamID: 0,
        AssignedPositionID: 0,
        DefaultUserID: 0,
        DefaultTeamID: 0,
        DefaultPositionID: 0,
        AssignmentProcedureID: 0,
        AssignedVariableID: 0,
        AssignedDepartmentID: 0,
        AssignedSiteID: 0,
        AssignedBuildingID: 0,
        AssignedContractID: 0,
        AssignedProfiles: 0,
      };
      if ($(`#radio1`)[0].checked) {
        Obj.Type = "Individual";
        if ($(`#radio5`)[0].checked) {
          if ($(`#select1`).val() == undefined) {
            alertBox("select1");
            bool = false;
          } else {
            Obj.AssignedUserID = +$(`#select1`).val();
          }
        } else if ($(`#radio6`)[0].checked) {
          if ($(`#select3`).val() == undefined) {
            alertBox("select3");
            bool = false;
          } else {
            Obj.AssignedPositionID = +$(`#select3`).val();
          }
        } else if ($(`#radio7`)[0].checked) {
          if ($(`#select5`).val() == undefined) {
            alertBox("select5");
            bool = false;
          } else {
            Obj.AssignedTeamID = +$(`#select5`).val();
            // Obj.DefaultTeamID = +$(`#select6`).val();
          }
        } else if ($(`#radio8`)[0].checked) {
          if ($(`#select55`).val() == undefined) {
            alertBox("select55");
            bool = false;
          } else {
            Obj.AssignedVariableID = +$(`#select55`).val();
          }
        }
      } else if ($(`#radio3`)[0].checked) {
        Obj.Type = "Collective";

        if ($(`#radio9`)[0].checked) {
          const checkedInputs = $("#F3_1 input:checked"); // Get all checked input elements in #F3_1
          const checkedValues = {}; // Use an object instead of an array for checked values

          checkedInputs.each(function () {
            const name = $(this).attr("name") || $(this).attr("id"); // Use input name or id as key
            const value = $(this).val(); // Get the value of the input
            checkedValues[name] = value; // Use name as key and value as value
          });

          // Save stringified checked values in the main object
          Obj.AssignedDepartmentID = JSON.stringify(checkedValues); // Stringified object of checked inputs
        } else if ($(`#radio10`)[0].checked) {
          const checkedInputs = $("#F3_2 input:checked"); // Get all checked input elements in #F3_2
          const checkedValues = {}; // Use an object instead of an array for checked values
          const buildingValues = {}; // Initialize an object for buildings

          checkedInputs.each(function () {
            const name = $(this).attr("name") || $(this).attr("id"); // Use input name or id as key
            const value = $(this).val(); // Get the value of the input
            const dataType = $(this).attr("data-type"); // Get the data-type attribute

            // Check the data-type and save values accordingly
            if (dataType === "building") {
              // Use name as key and value as value for buildings
              buildingValues[name] = value;
            } else {
              checkedValues[name] = value; // Use name as key and value as value for sites
            }
          });

          // Save stringified checked values in the main object
          Obj.AssignedSiteID = JSON.stringify(checkedValues); // Stringified object of checked inputs
          Obj.AssignedBuildingID = JSON.stringify(buildingValues); // Stringified object of buildings
        } else if ($(`#radio11`)[0].checked) {
          // Get the selected values from the #F3_3_Select element (assuming it's a multiple select)
          const selectedValues = $(`#F3_3_Select`).val(); // This should return an array of selected IDs

          if (selectedValues === undefined || selectedValues.length === 0) {
            alertBox("F3_3_Select");
            bool = false;
          } else {
            // Join the array into a string separated by commas
            Obj.AssignedContractID = selectedValues.join(","); // Convert array to comma-separated string
          }
        } else if ($(`#radio12`)[0].checked) {
          const selectedValues = $(`#F3_4_Select`).val(); // This should return an array of selected IDs
          if (!selectedValues || selectedValues.length === 0) {
            alertBox("F3_3_Select");
            bool = false;
          } else {
            // Join the array into a string separated by commas
            Obj.AssignedProfiles = selectedValues.join(","); // Convert array to comma-separated string
          }
        }
      }

      // else if ($(`#radio4`)[0].checked) {
      // if (
      //   $(`#select11`).val() == undefined ||
      //   $(`#select12`).val() == undefined
      // ) {
      //   alertBox("select11");
      //   bool = false;
      // } else {
      //   Obj.Type = "SmartRules";
      //   Obj.AssignmentProcedureID = +$(`#select11`).val();
      //   Obj.DefaultTeamID = +$(`#select12`).val();
      // }
      // }
      function alertBox(itemID) {
        $(`#` + itemID)
          .parent()
          .append(
            `<div style="padding:5px"><span style="color:red;font-size:12px">${mxResources.get(
              "listisempty"
            )}</span></div>`
          );
      }
      //check allow insert
      if (bool) {
        _AssignmentOBJ.push(Obj);
        $(`#send_activi_Modal`).remove();
      }
    } catch (error) {
      swal(error.message, { icon: "warning" });
    }
  });
  $(`#btn_exit`).on("click", () => $(`#send_activi_Modal`).remove());
}

function Activity_onload(graph) {
  //onload
  isValue = _AssignmentOBJ.filter((x) => x.ID == +graph.getSelectionCell().id);
  if (isValue.length) {
    switch (isValue[0].Type) {
      case "Individual":
        $(`#radio1`).prop("checked", true);
        show_hide("F1", "F2", "F3", "F4");

        if (isValue[0].AssignedUserID != "") {
          $(`#radio5`).prop("checked", true);
          show_hide("F1_1", "F1_2", "F1_3", "F1_4");
          $(`#select1`).val(isValue[0].AssignedUserID);
          $(`#select2`).val(isValue[0].DefaultUserID);
        } else if (isValue[0].AssignedPositionID != "") {
          $(`#radio6`).prop("checked", true);
          show_hide("F1_2", "F1_1", "F1_3", "F1_4");
          $(`#select3`).val(isValue[0].AssignedPositionID);
          // $(`#select4`).val(isValue[0].DefaultPositionID);
        } else if (isValue[0].AssignedTeamID != "") {
          $(`#radio7`).prop("checked", true);
          show_hide("F1_3", "F1_1", "F1_2", "F1_4");
          $(`#select5`).val(isValue[0].AssignedTeamID);
          $(`#select6`).val(isValue[0].DefaultTeamID);
        } else if (isValue[0].AssignedVariableID != "") {
          $(`#radio8`).prop("checked", true);
          show_hide("F1_4", "F1_1", "F1_2", "F1_3");
          $(`#select55`).val(isValue[0].AssignedVariableID);
        }
        break;
      case "Cyclical":
        $(`#radio2`).prop("checked", true);
        $(`#radio1`).prop("checked", false);
        show_hide("F2", "F1", "F3", "F4");
        $(`#select7`).val(isValue[0].AssignedTeamID);
        $(`#select8`).val(isValue[0].DefaultTeamID);
        break;
      case "Collective":
        $(`#radio3`).prop("checked", true);
        $(`#radio9`).prop("checked", true);
        show_hide("F3", "F1", "F2", "F4");

        // Check if AssignedDepartmentID is not empty or zero
        if (
          isValue[0].AssignedDepartmentID &&
          Object.keys(JSON.parse(isValue[0].AssignedDepartmentID)).length > 0
        ) {
          const assignedDepartments = JSON.parse(
            isValue[0].AssignedDepartmentID
          ); // Parse the string into an object
          const Inputs = $("#F3_1 input");

          // Iterate over the object
          for (const department in assignedDepartments) {
            if (assignedDepartments.hasOwnProperty(department)) {
              const itemValue = assignedDepartments[department]; // Get the ID associated with the department

              Inputs.each(function () {
                if (itemValue == $(this).attr("value")) {
                  $(this).prop("checked", true); // Check the input

                  // Check if the parent layer/section is collapsed and open it
                  const parentLayer = $(this).closest("ul");
                  if (
                    parentLayer.length &&
                    parentLayer.css("display") === "none"
                  ) {
                    parentLayer.show(); // Open the layer (show it)

                    // Optionally, change the toggle icon to indicate it's expanded
                    const toggleIcon = parentLayer
                      .prev()
                      .find(".toggle-icon i");
                    if (toggleIcon.hasClass("fa-caret-left")) {
                      toggleIcon
                        .removeClass("fa-caret-left")
                        .addClass("fa-caret-down"); // Change icon
                    }
                  }
                }
              });
            }
          }
        } else if (
          (isValue[0].AssignedSiteID &&
            Object.keys(JSON.parse(isValue[0].AssignedSiteID)).length > 0) ||
          (isValue[0].AssignedBuildingID &&
            Object.keys(JSON.parse(isValue[0].AssignedBuildingID)).length > 0)
        ) {
          $(`#radio10`).prop("checked", true);
          show_hide("F3_2", "F3_1", "F3_3", "F3_4");

          const Inputs = $("#F3_2 input");

          // Load AssignedSiteID if it's not empty
          if (
            isValue[0].AssignedSiteID &&
            Object.keys(JSON.parse(isValue[0].AssignedSiteID)).length > 0
          ) {
            const assignedSites = JSON.parse(isValue[0].AssignedSiteID); // Parse the string into an object
            for (const site in assignedSites) {
              if (assignedSites.hasOwnProperty(site)) {
                const itemValue = assignedSites[site]; // Get the ID associated with the site

                Inputs.each(function () {
                  if (
                    itemValue == $(this).attr("value") &&
                    site == $(this).attr("name")
                  ) {
                    // Match site name
                    $(this).prop("checked", true); // Check the input

                    // Check if the parent layer/section is collapsed and open it
                    const parentLayer = $(this).closest("ul");
                    if (
                      parentLayer.length &&
                      parentLayer.css("display") === "none"
                    ) {
                      parentLayer.show(); // Open the layer (show it)

                      // Change the toggle icon to indicate it's expanded
                      const toggleIcon = parentLayer
                        .prev()
                        .find(".toggle-icon i");
                      if (toggleIcon.hasClass("fa-caret-left")) {
                        toggleIcon
                          .removeClass("fa-caret-left")
                          .addClass("fa-caret-down"); // Change icon
                      }
                    }
                  }
                });
              }
            }
          }

          // Load AssignedBuildingID if it's not empty
          if (
            isValue[0].AssignedBuildingID &&
            Object.keys(JSON.parse(isValue[0].AssignedBuildingID)).length > 0
          ) {
            const assignedBuildings = JSON.parse(isValue[0].AssignedBuildingID); // Parse the string into an object
            for (const building in assignedBuildings) {
              if (assignedBuildings.hasOwnProperty(building)) {
                const itemValue = assignedBuildings[building]; // Get the ID associated with the building

                Inputs.each(function () {
                  if (
                    itemValue == $(this).attr("value") &&
                    building == $(this).attr("name") && // Match building name
                    $(this).attr("data-type") === "building" // Ensure it's a building
                  ) {
                    $(this).prop("checked", true); // Check the input

                    // Check if the parent layer/section is collapsed and open it
                    const parentLayer = $(this).closest("ul");
                    if (
                      parentLayer.length &&
                      parentLayer.css("display") === "none"
                    ) {
                      parentLayer.show(); // Open the layer (show it)

                      // Change the toggle icon to indicate it's expanded
                      const toggleIcon = parentLayer
                        .prev()
                        .find(".toggle-icon i");
                      if (toggleIcon.hasClass("fa-caret-left")) {
                        toggleIcon
                          .removeClass("fa-caret-left")
                          .addClass("fa-caret-down"); // Change icon
                      }
                    }
                  }
                });
              }
            }
          }
        } else if (isValue[0].AssignedContractID) {
          $(`#radio11`).prop("checked", true);
          show_hide("F3_3", "F3_2", "F3_1", "F3_4");

          // Split the AssignedContractID string into an array
          const assignedContractIDs = isValue[0].AssignedContractID.split(",");

          // Set the values and trigger change event
          $(`#F3_3_Select`).val(assignedContractIDs).trigger("change");
        } else if (isValue[0].AssignedProfiles) {
          $(`#radio12`).prop("checked", true);
          show_hide("F3_4", "F3_2", "F3_1", "F3_3");

          // Split the AssignedContractID string into an array
          const AssignedProfiles = isValue[0].AssignedProfiles.split(",");
          // Set the values and trigger change event
          $(`#F3_4_Select`).val(AssignedProfiles).trigger("change");
        }

        break;

      case "SmartRules":
        $(`#radio4`).prop("checked", true);
        show_hide("F4", "F1", "F2", "F3");
        $(`#radio4`).prop("checked", true);
        $(`#select11`).val(isValue[0].AssignmentProcedureID);
        $(`#select12`).val(isValue[0].DefaultTeamID);
        break;
    }
  }
}
