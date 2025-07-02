/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.6.0.0*/
/* Release Ferdos.BPMS*/

//رشته ی مقادیر گزینه های دراپ دان لیست مرتب سازی
let tmpSortOptions;
//رشته ی مقادیر گزینه های دراپ دان لیست مقدار عبارت
let tmpCommandOptions;
// شماره ی شناسه ی دکمه بالا یا پایین
let itemNumberId;
//نگهداری دیتا بر اساس شمای انتخابی
let refJsonData;
// این بولین نشان میدهد دارای داده ورودی است یا خیر
let metaData;
//شماره شناسه ی چک باکس
let Id_Number;
//شناسه چک باکس
let checkboxID;
// ایجاد سطر جدید
//------------------------------------------------------------newRow_Start
function newRow(designJson) {
  let rowContent = document.createElement("div");
  rowContent.setAttribute("id", "rowContent_" + RULE_ID);
  rowContent.className = "rowContent";
  content.appendChild(rowContent);
  let divUpDown = document.createElement("div");
  divUpDown.setAttribute("id", "divUpDown_" + RULE_ID);
  divUpDown.className = "divUpDown";
  divUpDown.style.display = "inline";
  rowContent.appendChild(divUpDown);
  //بالا
  var btnUp = document.createElement("button");
  btnUp.setAttribute("id", "btnUp_" + RULE_ID);
  btnUp.className = "btn btnUp";
  let glyphiconUp = document.createElement("span");
  glyphiconUp.setAttribute("id", "spanUp_" + RULE_ID);
  glyphiconUp.className = " 	glyphicon glyphicon-chevron-up";
  glyphiconUp.addEventListener("click", function (e) {
    itemNumberId = e.target.id.split("_")[1];
    upRule(itemNumberId);
  });
  glyphiconUp.style.verticalAlign = "middle";
  btnUp.appendChild(glyphiconUp);
  divUpDown.appendChild(btnUp);
  //پایین
  var btnDown = document.createElement("button");
  btnDown.setAttribute("id", "btnDown_" + RULE_ID);
  btnDown.className = "btn btnDown";
  let glyphiconDown = document.createElement("span");
  glyphiconDown.setAttribute("id", "spanDown_" + RULE_ID);
  glyphiconDown.className = "glyphicon glyphicon-chevron-down";
  glyphiconDown.addEventListener("click", function (e) {
    itemNumberId = e.target.id.split("_")[1];
    downRule(itemNumberId);
  });
  btnDown.appendChild(glyphiconDown);
  divUpDown.appendChild(btnDown);
  let selectFilter = document.createElement("select");
  selectFilter.setAttribute("id", "selectFilter_" + RULE_ID);
  selectFilter.className = "form-control selectCombo";
  rowContent.appendChild(selectFilter);
  let optionFilter = document.createElement("option");
  selectFilter.appendChild(optionFilter);
  let selectItem0 = "selectItem0";
  selectItem0 = document.createElement("select");
  selectItem0.setAttribute("id", "selectItem0_" + RULE_ID);
  selectItem0.className = "form-control selectSqlCombo";
  rowContent.appendChild(selectItem0);
  let selectItem2 = "selectItem2";
  selectItem2 = document.createElement("select");
  selectItem2.setAttribute("id", "selectItem2_" + RULE_ID);
  selectItem2.className = "form-control selectSqlCombo";
  rowContent.appendChild(selectItem2);
  let btnDeleteDiv = document.createElement("div");
  btnDeleteDiv.className = "btnDeleteDiv";
  rowContent.appendChild(btnDeleteDiv);
  //*-*--**-*--*-**--*-**-*--*-*-*-*-*-*-**-
  let btnAdd = document.createElement("button");
  btnAdd.setAttribute("id", "btnAdd_" + RULE_ID);
  btnAdd.className = "btn btnAdd";
  let glyphiconAdd = document.createElement("span");
  glyphiconAdd.setAttribute("id", "spanAdd_" + RULE_ID);
  glyphiconAdd.className = "glyphicon glyphicon-plus";
  glyphiconAdd.addEventListener("click", function (e) {
    createAddRule(btnAdd.id);
  });
  glyphiconAdd.style.verticalAlign = "middle";
  btnAdd.appendChild(glyphiconAdd);
  rowContent.appendChild(btnAdd);
  //*-*--**-*--*-**--*-**-*--*-*-*-*-*-*-**-
  //حذف
  var btnDeleteRule = document.createElement("button");
  btnDeleteRule.setAttribute("id", "btnDeleteRule_" + RULE_ID);
  btnDeleteRule.className = "btn btn-xs btnDelete";
  let glyphiconDelete = document.createElement("span");
  glyphiconDelete.setAttribute("id", "glyphDeleteRule_" + RULE_ID);
  glyphiconDelete.className = "glyphicon glyphicon-remove";
  glyphiconDelete.addEventListener("click", function (e) {
    ITEM_ID = e.target.id.split("_")[1];
    deleteRule(ITEM_ID);
  });
  btnDeleteRule.appendChild(glyphiconDelete);

  btnDeleteRule.style.marginLeft = "10px";
  btnDeleteDiv.appendChild(btnDeleteRule);
  if (TMP_FILTER_OPTIONS != "") {
    fillFilterSelect(designJson);
  }
  btnAddInLastRow();
}
//------------------------------------------------------------newRow_End
//بررسی آخرین سطر بودن یا نبودن جهت اضافه کردن دکمه ادد
function btnAddInLastRow() {
  $(`.rowContent .btn.btnAdd`).hide();
  let selectId = $(".rowContent .btn.btnAdd:last").attr("id");
  $(`#${selectId}`).show();
}

//وقتی که داده ی ورودی ، متا دیتا داشته باشد
//----------------------------------------------------------------------------------------------------StartnewFillFilterSelect
function newFillFilterSelect() {
  TMP_FILTER_OPTIONS = "";
  let commandLabel = "";
  let commandOptions = "";
  let tmpAscName = "ASC";
  let tmpDESCName = "DESC";
    for (let index = 0; index < filterArr.length; index++) {
        TMP_FILTER_OPTIONS = `<option value='${filterArr[index].id}'>${filterArr[index].label}</option>`;

        if (filterArr[index].sortType == tmpAscName) {
            // sortLabel = tmpAscLabel;
            tmpSortOptions = `<option value='${
                filterArr[index].sortType
                }'>${reportResources.get(
                    "ascending"
                )}</option><option value='${tmpDESCName}'>${reportResources.get(
                    "descending"
                )}</option><option value='filteronly'>${reportResources.get(
                    "filteronly"
                )}</option><option value='unsorted'>-----------------</option>`;
        } else if (filterArr[index].sortType == tmpDESCName) {
            // sortLabel = tmpDESCLabel;
            tmpSortOptions = `<option value='${
                filterArr[index].sortType
                }'>${reportResources.get(
                    "descending"
                )}</option><option value='${tmpAscName}'>${reportResources.get(
                    "ascending"
                )}</option><option value='filteronly'>${reportResources.get(
                    "filteronly"
                )}</option><option value='unsorted'>-----------------</option>`;
        } else {
            tmpSortOptions = `<option value='unsorted'>-----------------</option><option value='${tmpAscName}'>${reportResources.get(
                "ascending"
            )}</option><option value='${tmpDESCName}'>${reportResources.get(
                "descending"
            )}</option><option value='filteronly'>${reportResources.get(
                "filteronly"
            )}</option>`;
        }

        if (filterArr[index].sortType == "filteronly") {

            tmpSortOptions = `<option value='filteronly'>${reportResources.get(
                "filteronly"
            )}</option><option value='${tmpAscName}'>${reportResources.get(
                "ascending"
            )}</option><option value='${tmpDESCName}'>${reportResources.get(
                "descending"
            )}</option><option value='unsorted'>-----------------</option>`;
        }

    switch (filterArr[index].groupBy) {
      case "ExpressionGroupBy":
        commandLabel = `${reportResources.get("expressionGroupBy")}`;
        commandOptions = `<option value='Sum'>${reportResources.get(
          "sum"
        )}</option><option value='Avg'>${reportResources.get(
          "avg"
        )}</option><option value='Min'>${reportResources.get(
          "min"
        )}</option><option value='Max'>${reportResources.get(
          "max"
        )}</option><option value='Count'>${reportResources.get(
          "count"
        )}</option>`;
        break;
      case "Expression":
        commandLabel = `${reportResources.get("expression")}`;
        commandOptions = `<option value='Sum'>${reportResources.get(
          "sum"
        )}</option><option value='Avg'>${reportResources.get(
          "avg"
        )}</option><option value='Min'>${reportResources.get(
          "min"
        )}</option><option value='Max'>${reportResources.get(
          "max"
        )}</option><option value='Count'>${reportResources.get(
          "count"
        )}</option>`;
        break;
      case "GroupBy":
        commandLabel = `${reportResources.get("groupBy")}`;
        commandOptions = `<option value='Sum'>${reportResources.get(
          "sum"
        )}</option><option value='Avg'>${reportResources.get(
          "avg"
        )}</option><option value='Min'>${reportResources.get(
          "min"
        )}</option><option value='Max'>${reportResources.get(
          "max"
        )}</option><option value='Count'>${reportResources.get(
          "count"
        )}</option>`;
        break;
      case "Group By":
        commandLabel = `${reportResources.get("group_By")}`;
        commandOptions = `<option value='Sum'>${reportResources.get(
          "sum"
        )}</option><option value='Avg'>${reportResources.get(
          "avg"
        )}</option><option value='Min'>${reportResources.get(
          "min"
        )}</option><option value='Max'>${reportResources.get(
          "max"
        )}</option><option value='Count'>${reportResources.get(
          "count"
        )}</option>`;
        break;
      case "Sum":
        commandLabel = `${reportResources.get("sum")}`;
        commandOptions = `<option value='ExpressionGroupBy'>${reportResources.get(
          "expressionGroupBy"
        )}</option><option value='Avg'>${reportResources.get(
          "avg"
        )}</option><option value='Min'>${reportResources.get(
          "min"
        )}</option><option value='Max'>${reportResources.get(
          "max"
        )}</option><option value='Count'>${reportResources.get(
          "count"
        )}</option>`;
        break;
      case "Avg":
        commandLabel = `${reportResources.get("avg")}`;
        commandOptions = `<option value='ExpressionGroupBy'>${reportResources.get(
          "expressionGroupBy"
        )}</option><option value='Sum'>${reportResources.get(
          "sum"
        )}</option><option value='Min'>${reportResources.get(
          "min"
        )}</option><option value='Max'>${reportResources.get(
          "max"
        )}</option><option value='Count'>${reportResources.get(
          "count"
        )}</option>`;
        break;
      case "Min":
        commandLabel = `${reportResources.get("min")}`;
        commandOptions = `<option value='ExpressionGroupBy'>${reportResources.get(
          "expressionGroupBy"
        )}</option><option value='Sum'>${reportResources.get(
          "sum"
        )}</option><option value='Avg'>${reportResources.get(
          "avg"
        )}</option><option value='Max'>${reportResources.get(
          "max"
        )}</option><option value='Count'>${reportResources.get(
          "count"
        )}</option>`;
        break;
      case "Max":
        commandLabel = `${reportResources.get("max")}`;
        commandOptions = `<option value='ExpressionGroupBy'>${reportResources.get(
          "expressionGroupBy"
        )}</option><option value='Sum'>${reportResources.get(
          "sum"
        )}</option><option value='Avg'>${reportResources.get(
          "avg"
        )}</option><option value='Min'>${reportResources.get(
          "min"
        )}</option><option value='Count'>${reportResources.get(
          "count"
        )}</option>`;
        break;
      case "Count":
        commandLabel = `${reportResources.get("count")}`;
        commandOptions = `<option value='ExpressionGroupBy'>${reportResources.get(
          "expressionGroupBy"
        )}</option><option value='Sum'>${reportResources.get(
          "sum"
        )}</option><option value='Avg'>${reportResources.get(
          "avg"
        )}</option><option value='Min'>${reportResources.get(
          "min"
        )}</option><option value='Max'>${reportResources.get("max")}</option>`;
        break;

      default:
        commandLabel = `${reportResources.get("expressionGroupBy")}`;
        commandOptions = `<option value='Sum'>${reportResources.get(
          "sum"
        )}</option><option value='Avg'>${reportResources.get(
          "avg"
        )}</option><option value='Min'>${reportResources.get(
          "min"
        )}</option><option value='Max'>${reportResources.get(
          "max"
        )}</option><option value='Count'>${reportResources.get(
          "count"
        )}</option>`;
        break;
    }
    tmpCommandOptions =
      "<option value=" +
      filterArr[index].groupBy +
      ">" +
      commandLabel +
      "</option>" +
      commandOptions;
    document.getElementById("selectFilter_" + RULE_ID).innerHTML =
      TMP_FILTER_OPTIONS;
    document.getElementById("selectItem0_" + RULE_ID).innerHTML =
      tmpSortOptions;
    document.getElementById("selectItem2_" + RULE_ID).innerHTML =
      tmpCommandOptions;
    if (Tmp_ID_ROW >= 1) {
      Tmp_ID_ROW++;
    } else if (Tmp_ID_ROW <= 0) {
      Tmp_ID_ROW = 1;
    }
    document.getElementById("selectItem0_" + RULE_ID).style.visibility =
      "visible";
    document.getElementById("selectItem2_" + RULE_ID).style.visibility =
      "visible";
    document
      .getElementById("selectFilter_" + RULE_ID)
      .setAttribute("disabled", "disabled");
    let tmpIdOrder = RULE_ID;
    OBJECT_ARRAY.push({
      tmpId: tmpIdOrder,
      TmpIndex: RULE_ID,
      filterTarget: "selectFilter_" + RULE_ID,
      sortTarget: "selectItem0_" + RULE_ID,
      commandTarget: "selectItem2_" + RULE_ID,
      rowTarget: "rowContent_" + RULE_ID,
      filterVal: filterArr[index].id,
      SortVal: filterArr[index].sortType,
      CommandVal: filterArr[index].groupBy,
      TmpViewName: VIEW_TITLE,
    });
    nextItemId();
    TMP_FILTER_OPTIONS = "";
    tmpSortOptions = "";
    tmpCommandOptions = "";
    //NewChange
    newRow(OBJECT_ARRAY);
  }
}
//پر کردن مقادیر آرایه آبجکت در صورت خالی بودن برخی از مقادیرش
//----------------------------------------------------------------------------------------------------EndnewFillFilterSelect
function fillObjectArrayParameters() {
  if (OBJECT_ARRAY.length > 0) {
    OBJECT_ARRAY.map((item, index) => {
      if (
        item.filterVal == "" ||
        item.CommandVal == "" ||
        item.SortVal == "" ||
        item.TmpViewName == ""
      ) {
        if (item.filterTarget != "") {
          // //filterVal
          let tmpTargetFilterCombo = document.getElementById(item.filterTarget);
          let tmpValueTargetFilterCombo = tmpTargetFilterCombo.options[
            tmpTargetFilterCombo.selectedIndex
          ]
            ? tmpTargetFilterCombo.options[tmpTargetFilterCombo.selectedIndex]
                .value
            : null;
          if (
            tmpValueTargetFilterCombo != "" ||
            tmpValueTargetFilterCombo != "-1"
          ) {
            item.filterVal = tmpValueTargetFilterCombo;
            //  //SortVal
            let tmpSortTarget = document.getElementById(item.sortTarget);
            let tmpValueSortTarget = "";
            if (
              tmpSortTarget.options[tmpSortTarget.selectedIndex] &&
              typeof tmpSortTarget.options[tmpSortTarget.selectedIndex]
                .value !== undefined
            )
              tmpValueSortTarget =
                tmpSortTarget.options[tmpSortTarget.selectedIndex].value;

            if (tmpValueSortTarget != "") item.SortVal = tmpValueSortTarget;
            // //CommandVal
            let tmpCommandTarget = document.getElementById(item.commandTarget);
            let tmpValueCommandTarget = "";
            if (
              tmpCommandTarget.options[tmpCommandTarget.selectedIndex] &&
              typeof tmpCommandTarget.options[tmpCommandTarget.selectedIndex]
                .value !== undefined
            )
              tmpValueCommandTarget =
                tmpCommandTarget.options[tmpCommandTarget.selectedIndex].value;

            if (tmpValueCommandTarget != "")
              item.CommandVal = tmpValueCommandTarget;
            //  //TmpViewName
            if (VIEW_TITLE != "") item.TmpViewName = VIEW_TITLE;
          }
        }
      }
    });
  }
}
//  //EditMode
//پر کردن فیلتر در صورت مود ویرایش
function fillFilterEditMode() {
  if (CREATE_MODE == false) {
    filterArr = [];
    $.each(REPORT_SCHEMA_ARRAY, function (index, data) {
      let tmpType = data.Type;
      tmpType = tmpType.toLowerCase();
      if (data.GroupBy == undefined) {
        if (addFilterArr(data.Name)) {
          filterArr.push({
            id: data.Name,
            idCol: data.ID,
            name: data.Name,
            label: data.Label,
            type: tmpType,
            sortType: data.SortType,
            groupBy: data.GroupBy,
            TmpViewName: VIEW_TITLE,
          });
        }
      }
    });
    fillObjectArrayParameters();
    for (let i = 0; i < OBJECT_ARRAY.length; i++) {
      let tmpFilterTarget = OBJECT_ARRAY[i].filterTarget;
      let TmpselectFilter = document.getElementById(tmpFilterTarget);
      if (TmpselectFilter != undefined) {
        let TmpValueFilter =
          TmpselectFilter.options[TmpselectFilter.selectedIndex].value;
        if ($(`#${OBJECT_ARRAY[i].filterTarget}`).prop("disabled")) {
          filterArr.map((item, index) => {
            if (item.id == TmpValueFilter) {
              filterArr.splice(index, 1);
            }
          });
        }
      }
    }
  }
}
//----------------------------------------------------------------------------------------------------StartFillFilterSelect
// پر کرن آرایه فیلتر صفحه ستون ها در صورت مود ایجاد
//-------------------------------fillFilterArrColumnsPage_Start
function fillFilterArrColumnsPage() {
  if (CREATE_MODE) {
    filterArr = [];
    $.each(REPORT_SCHEMA_ARRAY, function (index, data) {
      let tmpType = data.Type;
      tmpType = tmpType.toLowerCase();
      if (data.GroupBy == undefined) {
        if (addFilterArr(data.Name)) {
          filterArr.push({
            id: data.Name,
            idCol: data.ID,
            name: data.Name,
            label: data.Label,
            type: tmpType,
            sortType: "",
            groupBy: "",
            TmpViewName: VIEW_TITLE,
          });
        }
      }
    });
  }
}
//-------------------------------fillFilterArrColumnsPage_End
// پر کرن آپشن های فیلتر صفحه ستون ها
//---*---*---*---*---*---*---*---*fillFilterSelectOption_Start
function fillFilterSelectOption() {
  TMP_FILTER_OPTIONS = "";
  TMP_FILTER_OPTIONS = "<option value='-1'>-----------------</option>";
  if (!CREATE_MODE) {
    let tmpFilterVal = OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterVal;
    for (let index = 0; index < filterArr.length; index++) {
      // index + 1 < OBJECT_ARRAY
      if (tmpFilterVal == filterArr[index].id) {
        TMP_FILTER_OPTIONS += `<option value='${filterArr[index].id}' selected >${filterArr[index].label}</option>`;
      } else {
        TMP_FILTER_OPTIONS += `<option value='${filterArr[index].id}'>${filterArr[index].label}</option>`;
      }
    }
  } else {
    filterArr.map((item, index) => {
      TMP_FILTER_OPTIONS += `<option value='${item.id}'>${item.label}</option>`;
    });
  }
  let tmpTargetSelectFilter = document.getElementById(
    "selectFilter_" + RULE_ID
  );
  if (tmpTargetSelectFilter != undefined) {
    tmpTargetSelectFilter.innerHTML = TMP_FILTER_OPTIONS;
  }
}
//---*---*---*---*---*---*---*---*fillFilterSelectOption_End
// پر کردن دراپ دان لیست فیلتر در صفحه ستون ها برای بار اول لود شدن
//**********----------------------------------fillFilterSelect_Start
function fillFilterSelect(designJson) {
  // ورودی مقدار شی اولیه یا همان دمو است
  if (BOOL_FIRST_COUNT) {
    if (JsonData != "" || JsonData != null) {
      JsonData = designJson;
      refJsonData = showColumnPage();
      let filterData = JsonData;
      REF_FILTER_DATA = refJsonData;
      VIEW_TITLE = JsonData.DatasetName;
      DATASET_ID = JsonData.DatasetID;
      for (let index = 0; index < filterData.Columns.length; index++) {
        let data = filterData.Columns[index];
        let tmpType = data.Type;
        tmpType = tmpType.toLowerCase();
        if (data.GroupBy != undefined) {
          if (addFilterArr(data.Name)) {
            filterArr.push({
              id: data.Name,
              idCol: data.ID,
              name: data.Name,
              label: data.Label,
              type: tmpType,
              sortType: data.SortType,
              groupBy: data.GroupBy,
              TmpViewName: VIEW_TITLE,
            });
          }
          metaData = true;
        }
      }
      if (metaData == true) {
        newFillFilterSelect();
        metaData = false;
        filterArr = [];
      }
    }
    for (let index = 0; index < REF_FILTER_DATA.length; index++) {
      let data = REF_FILTER_DATA[index];
      let tmpType = data.Type;
      tmpType = tmpType.toLowerCase();
      if (data.GroupBy == undefined) {
        if (addFilterArr(data.Name)) {
          filterArr.push({
            id: data.Name,
            idCol: data.ID,
            name: data.Name,
            label: data.Label,
            type: tmpType,
            sortType: "",
            groupBy: "",
            TmpViewName: VIEW_TITLE,
          });
        }
      }
    }
    BOOL_FIRST_COUNT = false;
    if (OBJECT_ARRAY.length >= 1) {
      for (let index = 0; index < OBJECT_ARRAY.length; index++) {
        let tmpFilterTarget = OBJECT_ARRAY[index].filterTarget;
        let TmpselectFilter = document.getElementById(tmpFilterTarget);
        if (TmpselectFilter != null) {
          let TmpValueFilter =
            TmpselectFilter.options[TmpselectFilter.selectedIndex].value;
          for (let index = 0; index < filterArr.length; index++) {
            if (filterArr[index].id == TmpValueFilter) {
              filterArr.splice(index, 1);
            }
          }
        }
      }
    }
  } else {
    deleteFilterItem(OBJECT_ARRAY.length - 1);
  }
  TMP_FILTER_OPTIONS = `<option value='-1'>-----------------</option>`;
  for (let index = 0; index < filterArr.length; index++) {
    TMP_FILTER_OPTIONS += `<option value='${filterArr[index].id}'>${filterArr[index].label}</option>`;
  }
  let tmpTargetSelectFilter = document.getElementById(
    "selectFilter_" + RULE_ID
  );
  if (tmpTargetSelectFilter != undefined)
    tmpTargetSelectFilter.innerHTML = TMP_FILTER_OPTIONS;
}
//**********----------------------------------fillFilterSelect_End
//----------------------------------------------------------------------------------------------------EndFillFilterSelect
// ساختن کد یکتا
//---nextItemId_Start
function nextItemId() {
  return RULE_ID++;
}
//---nextItemId_End
// ساختن صفحه چهارم-----------------------------****-------********---------------**************-----------*************Start
//  نمایش نقش های کاربری برای بار اول و نمایش دیتای پیشفرض در صفحه ی چهارم
//****************---------------------------*****showUserRules_Start
function showUserRules() {
  if (BOOL_FORTH_PAGE_ROLE) $("#rolesTabContent").empty();

  let rolesDivContent = document.createElement("div");
  rolesDivContent.setAttribute("id", "rolesDivContent");
  rolesDivContent.className = "rolesDivContent";
  rolesTabContent.appendChild(rolesDivContent);
  let boolDefaultValueRole = true;
  let accessRolesArray = JsonData.AccessRoles;
  if (accessRolesArray.length == 0) {
    boolDefaultValueRole = false;
  }
  var refRolesArray = JsonData.RefRoles;
  if (refRolesArray.length > 0 && BOOL_FORTH_PAGE_ROLE) {
    $.each(refRolesArray, function (index, data) {
      if (data != null && data != undefined) {
        let tmpValue;
        if (data.Id != null && data.Id != undefined) tmpValue = data.Id;
        let tmpLabel;
        tmpLabel = data.Label;
        let rolesRowContent = document.createElement("div");
        rolesRowContent.setAttribute("id", "rolesRowContent_" + tmpValue);
        rolesRowContent.className = "row rolesRowContent";
        rolesDivContent.appendChild(rolesRowContent);
        let rolesLabelChk = document.createElement("label");
        rolesLabelChk.setAttribute("id", "rolesLabelChk_" + tmpValue);
        rolesLabelChk.className = "rolesLabelChk";
        rolesLabelChk.textContent = tmpLabel;
        rolesRowContent.appendChild(rolesLabelChk);
        let rolesChk = document.createElement("INPUT");
        rolesChk.setAttribute("id", "rolesChk_" + tmpValue);
        rolesChk.setAttribute("type", "checkbox");
        rolesChk.className = "rolesChk";
        if (boolDefaultValueRole) {
          for (const i in accessRolesArray) {
            if (accessRolesArray[i].Id == tmpValue) {
              rolesChk.setAttribute("checked", "checked");
              ROLES_CHECKED_ARRAY.push({
                elementId: "rolesChk_" + tmpValue,
                idNumber: tmpValue,
                labelText: tmpLabel,
              });
            }
          }
        }
        rolesLabelChk.appendChild(rolesChk);
        if (index % 2 == 1) {
          document.getElementById(
            "rolesRowContent_" + tmpValue
          ).style.backgroundColor = "#fcfcfc";
        } else {
          document.getElementById(
            "rolesRowContent_" + tmpValue
          ).style.backgroundColor = "white";
        }
      }
    });
    $("#rolesDivContent :checkbox").change(function (e) {
      checkboxID = e.target.id;
      Id_Number = checkboxID.split("_")[1];
      if (this.checked) {
        saveRolesChk(checkboxID, Id_Number);
      } else {
        deleteRolesChk(checkboxID, Id_Number);
      }
      saveAccessInJsonData();
    });
    BOOL_FORTH_PAGE_ROLE = false;
  }
}
//****************---------------------------*****showUserRules_End
//  نمایش گروه های کاربری برای بار اول و نمایش دیتای پیشفرض در صفحه ی چهارم
//****************---------------------------*****showUserGroups_Start
function showUserGroups() {
  if (BOOL_FORTH_PAGE_GROUP) $("#groupsTabContent").empty();

  let groupsDivContent = document.createElement("div");
  groupsDivContent.setAttribute("id", "groupsDivContent");
  groupsDivContent.className = "groupsDivContent";
  groupsTabContent.appendChild(groupsDivContent);
  let boolDefaultValueGroup = true;
  let accessGroupsArray = JsonData.AccessGroups;
  if (accessGroupsArray.length == 0) {
    boolDefaultValueGroup = false;
  }
  var refGroupsArray = JsonData.RefGroups;
  if (refGroupsArray.length > 0 && BOOL_FORTH_PAGE_GROUP) {
    $.each(refGroupsArray, function (index, data) {
      if (data != null && data != undefined) {
        let tmpValue;
        if (data.Id != null && data.Id != undefined) tmpValue = data.Id;
        let tmpLabel;
        tmpLabel = data.Label;
        let groupsRowContent = document.createElement("div");
        groupsRowContent.setAttribute("id", "groupsRowContent_" + tmpValue);
        groupsRowContent.className = "row groupsRowContent";
        groupsDivContent.appendChild(groupsRowContent);
        let groupsLabelChk = document.createElement("label");
        groupsLabelChk.setAttribute("id", "groupsLabelChk_" + tmpValue);
        groupsLabelChk.className = "groupsLabelChk";
        groupsLabelChk.textContent = tmpLabel;
        groupsRowContent.appendChild(groupsLabelChk);
        let groupsChk = document.createElement("INPUT");
        groupsChk.setAttribute("id", "groupsChk_" + tmpValue);
        groupsChk.setAttribute("type", "checkbox");
        groupsChk.className = "groupsChk";
        if (boolDefaultValueGroup) {
          for (const i in accessGroupsArray) {
            if (accessGroupsArray[i].Id == tmpValue) {
              groupsChk.setAttribute("checked", "checked");
              GROUPS_CHECKED_ARRAY.push({
                elementId: "groupsChk_" + tmpValue,
                idNumber: tmpValue,
                labelText: tmpLabel,
              });
            }
          }
        }
        groupsLabelChk.appendChild(groupsChk);
        if (index % 2 == 1)
          document.getElementById(
            "groupsRowContent_" + tmpValue
          ).style.backgroundColor = "#fcfcfc";
        else
          document.getElementById(
            "groupsRowContent_" + tmpValue
          ).style.backgroundColor = "white";
      }
    });
    $("#groupsDivContent :checkbox").change(function (e) {
      checkboxID = e.target.id;
      Id_Number = checkboxID.split("_")[1];
      if (this.checked) {
        saveGroupsChk(checkboxID, Id_Number);
      } else {
        deleteGroupsChk(checkboxID, Id_Number);
      }
      saveAccessInJsonData();
    });
    BOOL_FORTH_PAGE_GROUP = false;
  }
}
//****************---------------------------*****showUserGroups_End
//  صفحه چهارم-----------------------------****-------********---------------**************-----------*************End
//------------------------/////////--------**-صفحه پنجم-**-----------\\\\\\\\\\\\
// پر کردن ورودی-مثل دراپ دان لیست و تکست باکس-های صفحه ی زمانبندی
//--schedulerPage______Start
function schedulerPage() {
  if (BOOL_SCHEDULER_PAGE) {
    $("#selectSchedulingPeriod").html("");
    let tmpScheduler = "";
    if (CREATE_MODE) {
      tmpScheduler = `<option value='monthly'>${reportResources.get(
        "monthly"
      )}</option><option value='weekly' selected>${reportResources.get(
        "weekly"
      )}</option><option value='daily'>${reportResources.get(
        "daily"
      )}</option>`;
    } else {
      tmpScheduler = `<option value='monthly'>${reportResources.get(
        "monthly"
      )}</option><option value='weekly'>${reportResources.get(
        "weekly"
      )}</option><option value='daily'>${reportResources.get(
        "daily"
      )}</option>`;
    }
    $("#selectSchedulingPeriod").append(tmpScheduler);
    $("#selectSchedulingPeriod").change(function () {
      let periodValue = $("#selectSchedulingPeriod").val();
      showMainPeriodDiv(periodValue);
    });
    $("#selectExportType").html("");
    let tmpExportType =
      "<option value='MicrosoftExcelXML'>MicrosoftExcelXML</option><option value='JSON'>JSON</option>";
    $("#selectExportType").append(tmpExportType);
  }
}
//--schedulerPage______End
//نمایش محتوای مناسب مربوط به دراپ دان لیست زمانبندی دوره
//--**--**--**--**--**--**--**--showMainPeriodDiv_Start
function showMainPeriodDiv(tmpValue) {
  document.getElementById("monthlyDiv").style.display = "none";
  document.getElementById("weeklyDiv").style.display = "none";
  document.getElementById("dailyDiv").style.display = "none";
  switch (tmpValue) {
    case "monthly":
      document.getElementById("monthlyDiv").style.display = "block";
      break;
    case "weekly":
      document.getElementById("weeklyDiv").style.display = "block";
      break;
    case "daily":
      document.getElementById("dailyDiv").style.display = "block";
      break;
    default:
      document.getElementById("weeklyDiv").style.display = "block";
      break;
  }
}
//--**--**--**--**--**--**--**--showMainPeriodDiv_End
//نمایش صفحه زمانبندی بر اساس داشتن دیتا یا نداشتن دیتا
//----*-*-----**----*----*-*-----**----*----*-*-----**----*----*-*-----**----*loadInSchedulerPage_Start//
function loadInSchedulerPage() {
  if (BOOL_SCHEDULER_PAGE) {
    if (JsonData.Schedule != undefined) {
      if (JsonData.Schedule != null) {
        if (JsonData.Schedule[0] != undefined) {
          if (JsonData.Schedule.length > 0) {
            let SchedulerArray = JsonData.Schedule[0];
            if (SchedulerArray.SchedulesEnable)
              $("#schedulingChk").prop("checked", true);
            //selectSchedulingPeriod
            if (SchedulerArray.Occurs != null) {
              //انتخاب آپشن دراپ دان لیست
              let tmpOccurs = SchedulerArray.Occurs;
              switch (tmpOccurs) {
                case `${reportResources.get("monthly")}`:
                  $("#selectSchedulingPeriod option[value=monthly]").attr(
                    "selected",
                    "selected"
                  );
                  if (SchedulerArray.Month != null)
                    $("#eachMonthTxt-monthly").val(SchedulerArray.Month);
                  if (SchedulerArray.DayMonth != null)
                    $("#eachDayTxt-monthly").val(SchedulerArray.DayMonth);
                  break;
                case `${reportResources.get("weekly")}`:
                  $("#selectSchedulingPeriod option[value=weekly]").attr(
                    "selected",
                    "selected"
                  );
                  if (SchedulerArray.Week != null)
                    $("#eachTxt-weekly").val(SchedulerArray.Week);
                  if (SchedulerArray.Sunday)
                    $("#sundayChk").prop("checked", true);
                  if (SchedulerArray.Monday)
                    $("#mondayChk").prop("checked", true);
                  if (SchedulerArray.Tuesday)
                    $("#tuesdayChk").prop("checked", true);
                  if (SchedulerArray.Wednesday)
                    $("#wednesdayChk").prop("checked", true);
                  if (SchedulerArray.Thursday)
                    $("#thursdayChk").prop("checked", true);
                  if (SchedulerArray.Friday)
                    $("#fridayChk").prop("checked", true);
                  if (SchedulerArray.Saturday)
                    $("#saturdayChk").prop("checked", true);
                  break;
                case `${reportResources.get("daily")}`:
                  $("#selectSchedulingPeriod option[value=daily]").attr(
                    "selected",
                    "selected"
                  );
                  if (SchedulerArray.Daily != null)
                    $("#eachDayTxt-daily").val(SchedulerArray.Daily);
                  break;
                default:
                  $("#selectSchedulingPeriod option[value=weekly]").attr(
                    "selected",
                    "selected"
                  );
                  if (SchedulerArray.Week != null)
                    $("#eachTxt-weekly").val(SchedulerArray.Week);
                  break;
              }
              let periodValue = $("#selectSchedulingPeriod").val();
              showMainPeriodDiv(periodValue);
            }
            if (SchedulerArray.SendTime != null)
              $("#postTimeTxt").val(SchedulerArray.SendTime);

            if (SchedulerArray.ExportType != null)
              $("#selectExportType").val(SchedulerArray.ExportType);

            if (SchedulerArray.SendToAllUsers)
              $("#sendAllChk").prop("checked", true);

            if (SchedulerArray.SaveReport)
              $("#saveReportChk").prop("checked", true);

            if (
              SchedulerArray.ReportPath != null &&
              SchedulerArray.ReportPath != ""
            )
              $("#reportPath").val(SchedulerArray.ReportPath);

            if (SchedulerArray.SendReport)
              $("#sendEmailsChk").prop("checked", true);

            if (
              SchedulerArray.SendEmails != null &&
              SchedulerArray.SendEmails != ""
            )
              $("#sendEmails").val(SchedulerArray.SendEmails);
          }
        } else {
          $("#schedulingChk").prop("checked", false);
          $("#selectSchedulingPeriod option[value=weekly]").attr(
            "selected",
            "selected"
          );
          showMainPeriodDiv($("#selectSchedulingPeriod").val());
          let tmpNowTime = nowTime();
          if (tmpNowTime != "") $("#postTimeTxt").val(tmpNowTime);

          $("#sundayChk").prop("checked", false);
          $("#mondayChk").prop("checked", false);
          $("#tuesdayChk").prop("checked", false);
          $("#wednesdayChk").prop("checked", false);
          $("#thursdayChk").prop("checked", false);
          $("#fridayChk").prop("checked", false);
          $("#saturdayChk").prop("checked", false);

          $("#saveReportChk").prop("checked", false);
          $("#sendEmailsChk").prop("checked", false);
          $("#reportPath").val("");
          $("#sendEmails").val("");
        }
      }
    }
    BOOL_SCHEDULER_PAGE = false;
  }
}
//----*-*-----**----*----*-*-----**----*----*-*-----**----*----*-*-----**----*loadInSchedulerPage_End
// این تابع زمان را به صورت رشته ای بر می گرداند
//---*---*---*---*---*---*---*---*nowTime_Start
function nowTime() {
  new Date($.now());
  var dateObj = new Date();
  let tmpMinute = (dateObj.getMinutes() < 10 ? "0" : "") + dateObj.getMinutes();
  let tmpHour = (dateObj.getHours() < 10 ? "0" : "") + dateObj.getHours();
  var tmpTime = tmpHour + ":" + tmpMinute;
  return tmpTime;
}
//---*---*---*---*---*---*---*---*nowTime_End
//------------------------/////////--------**-صفحه پنجم-**-----------\\\\\\\\\\\\
function Exit() {
    saveDesign(false);
    setTimeout(() => {
        window.open("", "_self").close();
    }, 500);
}