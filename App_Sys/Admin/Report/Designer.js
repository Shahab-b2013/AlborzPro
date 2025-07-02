/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.6.0.0*/
/* Release Ferdos.BPMS*/

"use strict";
//مقادیر پیش فرض برای خروجی
var output_basic = [
  {
    ReportID: "",
    ModuleID: "",
    DatasetID: "",
    DatasetName: "",
    SelectClause: "",
    Columns: [],
    WhereClause: "",
    Filter: [],
    AccessRoles: [],
    AccessGroups: [],
    Label: "",
    Header: "",
    Footer: "",
    Description: "",
    GroupingLevel: 0,
    requestToken: "",
    Schedule: [],
  },
];
//بولین اولین ورود به صفحه اول (یا همان مشخصات کلی)
var BOOL_FIRST_COUNT = true;
//شماره شناسه یونیک
var RULE_ID = 0;
//آرایه اصلی
var OBJECT_ARRAY = [];
//رشته آپشن های فیلتر(صفحه ستون)
var TMP_FILTER_OPTIONS;
//شناسه ردیف(صفحه ستون)
var Tmp_ID_ROW = 0;
//آرایه رفرنس فیلتر
var REF_FILTER_DATA = [];
//آرایه فیلتر کنونی
var filterArr = [];
//آرایه  دیتا ست
var REF_DATASET = [];
// مقدار شمای گزارش
var VIEW_TITLE;
// شناسه شمای گزارش
var DATASET_ID;
// ارتباط گزارش
var RELATION_QUERY = "";
//شماره شناسه ی دکمه حذف(صفحه ستون)
var ITEM_ID = 0;
//آرایه موقتی ورودی
var JsonData;
//آرایه موقتی ستون ها
var OUTPUTColumns = [];
//خروجی
var OUTPUT = output_basic[0];
//خروجی رشته ای
var OUTPUT_JsonTxt = "";
//دستور اسکیوالی که به صورت رشته ای است
var strSql = "";
//کد دستوری شرط
var MyWhereResult;
//آرایه دراپ دان لیست فیلتر(در صفحه شرط)
var FILTER_filterArr = [];
//بخش مورد نظر(دیو)برای قرار دادن صفحه ستون
var content;
//آرایه شمای گزارش
var REPORT_SCHEMA_ARRAY = [];
//آرایه شمای تغییرات گزارش
var REPORT_CHANGE_SCHEMA_ARRAY = [];
//مقدار آخرین شمای گزارش
var LAST_SCHEMA_VALUE = "";
//ایندکس آخرین شمای گزارش
var LAST_SCHEMA_INDEX;
//مقدار دراپ دان لیست دسته بندی
var GROUPING_LEVEL;
//مقدار عنوان در صفحه مشخصات
var TMP_LABEL;
//مقدار سر صفحه در صفحه مشخصات
var TMP_HEADER;
//مقدار پا صفحه در صفحه مشخصات
var TMP_FOOTER;
//مقدار توضیحات در صفحه مشخصات
var TMP_DESCRIPTION;
//شماره ردیف خالی
var TMP_EMPTY_ROW;
//بولین سطر خالی(آیا سطر خالی داریم؟)
var BOOL_EMPTY_VALUE_HAS = false;

// var BOOL_FIRST_DELETE = false;
// CreateMode(T) Or EditMode(F)
var CREATE_MODE = false;
//آخرین  مود
var LAST_CREATE_MODE = false;
//بولین ذخیره آیتم ها
var SAVE_ITEMS = false;
// rpt-wiz-6 Is End Of Div Section
const ITEM_INDEX = 6;
//مقادیر پیش فرض برای صفحه ی شرط
var rules_basic = {
  condition: "AND",
  rules: [],
  valid: true,
};
// toDo
var BOOL_FIRST_GROUPBY = true;
//--------------------------------------
//بولین نقش کاربری
var BOOL_FORTH_PAGE_ROLE = true;
//بولین گروه کاربری
var BOOL_FORTH_PAGE_GROUP = true;
//آرایه چک باکس های نقش کاربری
var ROLES_CHECKED_ARRAY = [];
//آرایه چک باکس های گروه کاربری
var GROUPS_CHECKED_ARRAY = [];
//--------------------------------------
//بولین صفحه زمانبندی
var BOOL_SCHEDULER_PAGE = true;
//آرایه زمانبندی
var SCHEDULER_ARRAY = [];
//ستون آرایه جدید که در نهایت پس از زدن دکمه ذخیره، به ستون های جیسون دیتا ریخته می شود
var NEW_ARRAY_COLUMN = [];
//بولین  خروجی
var BOOL_EXPORT = false;
//-**--**-*-*-*-*--**-*-*-*--**-
//----------------انجام عمل اضافه کردن سطر جدید
function createAddRule(paramsId) {
  if (OBJECT_ARRAY.length == 0) {
    showColumnPage();
    filterArr = [];
    for (let index = 0; index < REF_FILTER_DATA.length; index++) {
      if (addFilterArr(REF_FILTER_DATA[index].Name)) {
        filterArr.push({
          id: REF_FILTER_DATA[index].Name,
          idCol: REF_FILTER_DATA[index].ID,
          name: REF_FILTER_DATA[index].Name,
          label: REF_FILTER_DATA[index].Label,
          type: REF_FILTER_DATA[index].Type,
          sortType: "",
          groupBy: "",
          TmpViewName: VIEW_TITLE,
        });
      }
    }
    resetColumnsPage();
    fillArray();
    let tmpExistRow = document.getElementById(OBJECT_ARRAY[0].rowTarget);
    if (OBJECT_ARRAY.length == 1 && tmpExistRow == undefined) {
      newRow(JsonData);
      document.getElementById("selectFilter_" + RULE_ID).onchange =
        visibleSqlSelects;
    }
    return;
  }
  //AlertCheckEmptyRow---------------row<=lenght
  let tmpObjectArray = removeRepeatValue(OBJECT_ARRAY);
  OBJECT_ARRAY = [];
  OBJECT_ARRAY = tmpObjectArray;
  let tmpFilterArray = removeRepeatFilter(filterArr);
  duplicateRemovalFilterArr();
  if (filterArr.length >= 1) {
    if (Tmp_ID_ROW >= 1) {
      Tmp_ID_ROW++;
    } else if (Tmp_ID_ROW <= 0) {
      Tmp_ID_ROW = 1;
    }
    let tmpValueFilter = $(".rowContent .form-control.selectCombo:last").val();
    if (OBJECT_ARRAY.length < Tmp_ID_ROW || tmpValueFilter == -1) {
      Tmp_ID_ROW--;
      alert(reportResources.get("addEmptyRow"));
    } else {
      deleteFilterItem(OBJECT_ARRAY.length - 1);
      nextItemId();
      newRow(OBJECT_ARRAY);
      //اینجا آرایه اصلی رو پر می کنم
      document.getElementById("selectFilter_" + RULE_ID).onchange =
        visibleSqlSelects;
      if (
        OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterVal == "" ||
        OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterVal == null
      ) {
        fillArrayById(OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget);
      }
      btnAddInLastRow();
    }
  } else if (filterArr.length === 0) {
    filterArr = tmpFilterArray;
  }
}

//تابعی که کد های اولیه جهت اجرای برنامه در آن نوشته می شود
//ورودی همان دمو یا مقادیر ورودی اولیه برنامه است
//*----*-----*-----*----*-----*-----*----*-----*-----*----*-----*-----*----*-----*-----renderDesigner_Start
function renderDesigner(designJson) {
  designJson = JSON.parse(designJson);
  //*-*-Start
  designJson.RefColumns = convertColumnTypes(designJson.RefColumns);
  //*-*-End
  if (designJson.Columns.length == 0 && designJson.Filter.length == 0) {
    CREATE_MODE = true;
    LAST_CREATE_MODE = true;
  }
  // //Page1--------------------------------------------------dataCategoryLevel_Start
  let tmpTltleTxt = designJson.Label;
  if (tmpTltleTxt.trim() != "")
    document.getElementById("tltleTxt").value = tmpTltleTxt;
  let tmpHeaderTxt = designJson.Header;
  if (tmpHeaderTxt.trim() != "")
    document.getElementById("headerTxt").value = tmpHeaderTxt;
  let tmpFooterTxt = designJson.Footer;
  if (tmpFooterTxt.trim() != "")
    document.getElementById("footerTxt").value = tmpFooterTxt;
  let tmpDescriptionTxt = designJson.Description;
  if (tmpDescriptionTxt.trim() != "")
    document.getElementById("descriptionTxt").value = tmpDescriptionTxt;

  // let tmpSchemaSelectedValue = designJson.DatasetName;
  let tmpSchemaSelectedValue = designJson.DatasetID;
  DATASET_ID = designJson.DatasetID;
  let tmpSelectDataCategory = document.getElementById("selectDataCategory");
  let CategoryLevel = ["noneLevel", "Level1", "Level2", "Level3"];
  var DataCategoryLevelArray = [];
  let txtLabel = "";
  $.each(CategoryLevel, function (index, data) {
    switch (data) {
      case "noneLevel":
        txtLabel = `${reportResources.get("notgrouping")}`;
        break;
      case "Level1":
        txtLabel = `${reportResources.get("onelevel")}`;
        break;
      case "Level2":
        txtLabel = `${reportResources.get("twolevel")}`;
        break;
      case "Level3":
        txtLabel = `${reportResources.get("threelevel")}`;
        break;
    }
    DataCategoryLevelArray.push({
      valueCategory: index,
      labelEnglish: data,
      label: txtLabel,
    });
    var elemanCategory = document.createElement("option");
    elemanCategory.text = txtLabel;
    elemanCategory.value = index;
    if (data == "noneLevel") {
      elemanCategory.selected = "selected";
    }
    tmpSelectDataCategory.add(elemanCategory);
  });
  tmpSelectDataCategory.selectedIndex = GROUPING_LEVEL =
    designJson.GroupingLevel;
  tmpSelectDataCategory.onchange = function () {
    let levelValue =
      tmpSelectDataCategory.options[tmpSelectDataCategory.selectedIndex].value;
    GROUPING_LEVEL = designJson.GroupingLevel = parseInt(levelValue);
  };
  // //--------------------------------------------------dataCategoryLevel_End
  // //*-*-*-*-*-*-*-*-*selectReportSchema_Start
  let tmpSelectReportSchema = document.getElementById("selectReportSchema");
  REF_DATASET = [...designJson.RefDatasets];
  $.each(designJson.RefDatasets, function (index, data) {
    var elemanReportSchema = document.createElement("option");
    elemanReportSchema.text = data.Label;
    // elemanReportSchema.value = data.Name;
    elemanReportSchema.value = data.ID;
    // RELATION_QUERY = data.QueryText;
    tmpSelectReportSchema.add(elemanReportSchema);
  });

  //set selected option by import
  if (tmpSchemaSelectedValue)
    document.getElementById("selectReportSchema").value =
      tmpSchemaSelectedValue;

  if (
    tmpSelectReportSchema.options[tmpSelectReportSchema.selectedIndex] &&
    typeof tmpSelectReportSchema.options[tmpSelectReportSchema.selectedIndex]
      .value !== "undefined"
  ) {
    LAST_SCHEMA_VALUE =
      tmpSelectReportSchema.options[tmpSelectReportSchema.selectedIndex].value;
  }

  LAST_SCHEMA_INDEX = tmpSelectReportSchema.selectedIndex;
  designJson.DatasetID = LAST_SCHEMA_VALUE;
  document.getElementById("selectReportSchema").onchange = function () {
    let ValueShema =
      tmpSelectReportSchema.options[tmpSelectReportSchema.selectedIndex].value;
    if (confirm(reportResources.get("changeSchema"))) {
      showColumnPage();
      designJson.DatasetName = "";
      VIEW_TITLE = getDatasetName(ValueShema);
      designJson.DatasetName = VIEW_TITLE;
      designJson.DatasetID = ValueShema;
      ////////---------------------------ریست شدن صفحه ستون و فیلتر
      if (!CREATE_MODE) {
        CREATE_MODE = true;
        BOOL_FIRST_COUNT = true;
      }
      JsonData.DatasetID = designJson.DatasetID;
      JsonData.DatasetName = designJson.DatasetName;
      JsonData.RefColumns = designJson.RefColumns;
      JsonData.Filter = [];
      JsonData.Columns = [];
      showColumnPage();
      if (OBJECT_ARRAY.length >= 1) {
        resetColumnsPage();
        fillArray();
        let tmpExistRow = document.getElementById(OBJECT_ARRAY[0].rowTarget);
        if (OBJECT_ARRAY.length == 1 && tmpExistRow == undefined) {
          newRow(JsonData);
          document.getElementById("selectFilter_" + RULE_ID).onchange =
            visibleSqlSelects;
        }
        document.getElementById(
          OBJECT_ARRAY[OBJECT_ARRAY.length - 1].commandTarget
        ).style.visibility = "hidden";
        document.getElementById(
          OBJECT_ARRAY[OBJECT_ARRAY.length - 1].sortTarget
        ).style.visibility = "hidden";
      }

      showColumnPage();
      fillFilterArrColumnsPage();
      fillFilterSelectOption();

      REPORT_CHANGE_SCHEMA_ARRAY = showColumnPage();
      showFiltersPage();
      REF_FILTER_DATA = [];
      REF_FILTER_DATA = REPORT_CHANGE_SCHEMA_ARRAY;
      resetFiltersPage();
      $("#builder-basic").queryBuilder("destroy");
      showFiltersPage();
      if (typeof jsonDataFilterArray === "object") {
        const filterbase = '[{"condition":"AND","rules":[],"valid":true}]';
        const jsonDataFilterArr = [];
        jsonDataFilterArr.push(jsonDataFilterArray);
        const jsonDataFilter = JSON.stringify(jsonDataFilterArr);
  
        if (filterbase === jsonDataFilter || jsonDataFilter === "[]") {
          jsonDataFilterArray = [];
          jsonDataFilterArray = jsonDataFilterArr;
        }
      }
      $("#builder-basic").queryBuilder({
        filters: [],
        plugins: [],
        rules: [],
        plugins: ["bt-tooltip-errors"],
        filters: FILTER_filterArr,
        rules: jsonDataFilterArray,
      });
      $(".selectpicker").selectpicker();
      resetAccessPage();
    } else {
      tmpSelectReportSchema.selectedIndex = LAST_SCHEMA_INDEX;
    }
  };
  // //Page1*-*-*-*-*-*-*-*-*selectReportSchema_Start
  // //Page2*-*-*-*-*-*-*-*-*UI_Start
  let divHome = document.createElement("div");
  divHome.setAttribute("id", "container");
  divHome.className = "container divHome";
  document.getElementById("select-builder").appendChild(divHome);
  content = document.createElement("div");
  content.setAttribute("id", "content");
  content.className = "col-md-12 content";
  divHome.appendChild(content);
  let btnDiv = document.createElement("div");
  btnDiv.className = "row btnDiv";
  content.appendChild(btnDiv);
  //---Start---------------------------------------------------------LabelTitle
  let labelDiv = document.createElement("div");
  labelDiv.className = "labelDiv col-md-2 col-lg-4 col-xs-1 col-sm-1";
  btnDiv.appendChild(labelDiv);
  let labelCommand = document.createElement("label");
    labelCommand.setAttribute("id", "labelCommand");
    labelCommand.style.verticalAlign = "bottom";
  labelCommand.className = "label";
  labelCommand.textContent = reportResources.get("value");
  labelDiv.appendChild(labelCommand);
  let labelSort = document.createElement("label");
    labelSort.setAttribute("id", "labelSort");
    labelSort.style.verticalAlign = "bottom";
  labelSort.className = "label";
  labelSort.textContent = reportResources.get("sorting");
  labelDiv.appendChild(labelSort);
  let labelFilter = document.createElement("label");
    labelFilter.setAttribute("id", "labelFilter");
    labelFilter.style.verticalAlign = "bottom";
  labelFilter.className = "label";
  labelFilter.textContent = reportResources.get("fieldname");
  labelDiv.appendChild(labelFilter);
  //---End---------------------------------------------------------LabelTitle
  let btnAddRule = document.createElement("button");
  btnAddRule.setAttribute("id", "btnAddRule");
  btnAddRule.className = "btn btn-xs";
  btnAddRule.textContent = reportResources.get("adddata");
  btnAddRule.addEventListener("click", function () {
    createAddRule(btnAddRule.id);
  });
  btnDiv.appendChild(btnAddRule);
  let glyphiconAdd = document.createElement("span");
  glyphiconAdd.className = " glyphicon glyphicon-plus";
  btnAddRule.appendChild(glyphiconAdd);
  if (BOOL_FIRST_COUNT) {
    newRow(designJson);
  }
  let divContainer = document.createElement("div");
  divContainer.setAttribute("id", "divContainer");
  divContainer.className = "container bs-docs-container col-md-10";
  document.getElementById("filter-builder").appendChild(divContainer);
  let divRow = document.createElement("div");
  divRow.setAttribute("id", "divRow");
  divRow.className = "row";
  divContainer.appendChild(divRow);
  let builderBasic = document.createElement("div");
  builderBasic.setAttribute("id", "builder-basic");
  builderBasic.className = "query-builder form-inline";
  divRow.appendChild(builderBasic);
  FillOpratorSelect();
  //FirstTimeForLoad
  document.getElementById("selectFilter_" + RULE_ID).onchange =
    visibleSqlSelects;
  // //Page2*-*-*-*-*-*-*-*-*UI_End
  for (let index = 1; index <= ITEM_INDEX; index++) {
    let strDivId = "rpt-wiz-" + index;
    document.getElementById(strDivId).style.display = "none";
  }
  document.getElementById("rpt-wiz-1").style.display = "block";
  // //Page3*-*-*-*-*-*-*-*-*--------------------------------------------------------------------------------------------ReportFilterUi_Start
  if (boolFirstCountThirdPage) {
    REPORT_CHANGE_SCHEMA_ARRAY = showColumnPage();
    if (!CREATE_MODE) {
      //EditMode
      jsonDataFilterArray = JsonData.Filter;
    }
    showFiltersPage();
    // jsonDataFilterArray

    // if (
    //   typeof jsonDataFilterArray === "object" &&
    //   jsonDataFilterArray.length <= 1
    // ) {
    if (typeof jsonDataFilterArray === "object") {
      const filterbase = '[{"condition":"AND","rules":[],"valid":true}]';
      const jsonDataFilterArr = [];
      jsonDataFilterArr.push(jsonDataFilterArray);
      const jsonDataFilter = JSON.stringify(jsonDataFilterArr);

      if (filterbase === jsonDataFilter || jsonDataFilter === "[]") {
        jsonDataFilterArray = [];
        jsonDataFilterArray = jsonDataFilterArr;
      }
    }
    $("#builder-basic").queryBuilder({
      filters: [],
      plugins: [],
      rules: [],
      plugins: ["bt-tooltip-errors"],
      filters: FILTER_filterArr,
      rules: jsonDataFilterArray,
    });
    $(".selectpicker").selectpicker();
  }
  // //Page3*-*-*-*-*-*-*-*-*--------------------------------------------------------------------------------------------ReportFilterUi_End
  //--***********---Page4

  showUserRules();
  showUserGroups();
  //--***********---Page4
  //-----Page5
  schedulerPage();
  loadInSchedulerPage();
  //-----Page5
}
//*----*-----*-----*----*-----*-----*----*-----*-----*----*-----*-----*----*-----*-----renderDesigner_End
//Export to backend
//-------------********--------------*******-----saveDesign_Start
function saveDesign(_alert) {
  var data = new FormData();
  data.append("design", Export());
  if (BOOL_EXPORT) {
    data.append("ID", JsonData.ReportID);
    var $report = new rdExecutor(data, _alert);
    $report.submit(data);
  }
}
//-------------********--------------*******-----saveDesign_End
//-------------********--------------*******-----convertColumnTypes_Start
// تبدیل نوع دیتای ورودی
function convertColumnTypes(tmpDesignJson) {
  tmpDesignJson.map(function (elem) {
    let tmpType = elem.Type;
    switch (tmpType) {
      case `String`:
      case `LatinString`:
      case `LocalString`:
      case `Computed`:
        elem.Type = `String`;
        break;
      case `Text`:
        elem.Type = `Text`;
        break;
      case `BigInteger`:
      case `Integer`:
      case `Money`:
      case `NumeralString`:
        elem.Type = `Number`;
        break;
      case `Time`:
        elem.Type = `DateTime`;
        break;
      case `Date`:
        elem.Type = `DateTime`;
        break;

      case `DateTime`:
        elem.Type = `DateTime`;
        break;
      case `Boolean`:
        elem.Type = `Boolean`;
        break;
      case `Password`:
        elem.Type = `String`;
        break;
      case `File`:
        elem.Type = `String`;
        break;
      case `Enum`:
      case `System`:
        elem.Type = `String`;
        break;
      case `Image`:
        elem.Type = `String`;
        break;
      case `Table`:
        elem.Type = `String`;
        break;
      default:
        elem.Type = `String`;
        break;
    }
  });
  return tmpDesignJson;
}
// گرفتن نام دیتا ست با استفاده از شناسه ی شما
function getDatasetName(shemaId) {
  let tmpDatasetName = "";
  var tmpObject = JSON.parse(designJson);
  REF_DATASET.map(function (elem) {
    if (elem.ID.toString() === shemaId) {
      tmpObject.DatasetID = shemaId;
      tmpDatasetName = tmpObject.DatasetName = elem.Name;
      RELATION_QUERY = elem.QueryText;
      designJson = JSON.stringify(tmpObject);
    }
  });
  return tmpDatasetName;
}

//-------------********--------------*******-----convertColumnTypes_End
