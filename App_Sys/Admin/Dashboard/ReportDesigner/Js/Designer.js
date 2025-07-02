/* Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.0.0*/

"use strict";
//مقادیر پیش فرض برای خروجی
var output_basic = [
  {
    ReportID: "",
    ModuleID: "",
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
    RequestToken: "",
    Schedule: [],
  },
];

var ValueShema;
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
// مقدار شمای گزارش
var VIEW_TITLE;
// ارتباط گزارش
var RELATION_QUERY = "";
//شماره شناسه ی دکمه حذف(صفحه ستون)
var ITEM_ID = 0;
//آرایه موقتی ورودی
var JsonData;
//آرایه موقتی ستون ها
var OUTPUTColumns = [];
//خروجی
var OUTPUT = output_basic;
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
const ITEM_INDEX = 3;
//مقادیر پیش فرض برای صفحه ی شرط
var rules_basic = {
  condition: "AND",
  rules: [],
  valid: true,
};
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
//تابعی که کد های اولیه جهت اجرای برنامه در آن نوشته می شود
//*----*-----*-----*----*-----*-----*----*-----*-----*----*-----*-----*----*-----*-----renderDesigner_Start
function renderReportDesigner(designJson, _action) {
  if (designJson.Columns.length == 0 && designJson.Filter.length == 0) {
    CREATE_MODE = true;
    LAST_CREATE_MODE = true;
  } else {
    CREATE_MODE = false;
    LAST_CREATE_MODE = false;
  }
  let tmpSelectDataCategory = document.getElementById("selectDataCategory");
  let CategoryLevel = ["noneLevel", "Level1", "Level2", "Level3"];
  var DataCategoryLevelArray = [];
  let txtLabel = "";
  $.each(CategoryLevel, function (index, data) {
    switch (data) {
      case "noneLevel":
        txtLabel = dashResources.get("notgrouping");
        break;
      case "Level1":
        txtLabel = dashResources.get("onelevel");
        break;
      case "Level2":
        txtLabel = dashResources.get("twolevel");
        break;
      case "Level3":
        txtLabel = dashResources.get("threelevel");
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

    tmpSelectDataCategory.add(elemanCategory);
    tmpSelectDataCategory.value = "0";
  });

  let levelValue;
  // tmpSelectDataCategory.value = designJson.GroupingLevel;
  levelValue = +designJson.GroupingLevel;
  GROUPING_LEVEL = levelValue;

  tmpSelectDataCategory.onchange = function () {
    let levelValue =
      tmpSelectDataCategory.options[tmpSelectDataCategory.selectedIndex].value;
    GROUPING_LEVEL = designJson.GroupingLevel = parseInt(levelValue);
  };

  // //--------------------------------------------------dataCategoryLevel_End
  // //*-*-*-*-*-*-*-*-*selectReportSchema_Start
  let tmpSelectReportSchema = document.getElementById("selectReportSchema");
  $.each(designJson.RefDatasets, function (index, data) {
    var elemanReportSchema = document.createElement("option");
    elemanReportSchema.text = data.Label;
    elemanReportSchema.value = data.ID;
    RELATION_QUERY = data.QueryText;
    tmpSelectReportSchema.add(elemanReportSchema);
  });
  //onload selectReportSchema
  if (_action == "reload") $(`#selectReportSchema`).val(ValueShema);
  // if (_action == "edit") $(`#selectReportSchema`).val(designJson.ReportSchema);
  LAST_SCHEMA_INDEX =
    tmpSelectReportSchema.options[tmpSelectReportSchema.selectedIndex].value;
  document.getElementById("selectReportSchema").onchange = function () {
    if (confirm(dashResources.get("schemachanged"))) {
      ValueShema =
        tmpSelectReportSchema.options[tmpSelectReportSchema.selectedIndex]
          .value;

      openQuery("reload");
    } else {
      $(`#selectReportSchema`).val(LAST_SCHEMA_INDEX);
    }
  };
  // //Page1*-*-*-*-*-*-*-*-*selectReportSchema_Start
  // //Page2*-*-*-*-*-*-*-*-*UI_Start
  let divHome = document.createElement("div");
  divHome.setAttribute("id", "container");
  divHome.className = "container divHome";
  document.getElementById("select-builder").appendChild(divHome);
  content = document.createElement("div");
  content.setAttribute("id", "Reportcontent");
  content.className = "col-md-12 Reportcontent";
  divHome.appendChild(content);
  let btnDiv = document.createElement("div");
  btnDiv.className = "row btnDiv";
  content.appendChild(btnDiv);
  //---Start---------------------------------------------------------LabelTitle
  let labelDiv = document.createElement("div");
  labelDiv.setAttribute("id", "labels");
  labelDiv.className = "labelDiv";
  btnDiv.appendChild(labelDiv);
  let labelCommand = document.createElement("label");
  labelCommand.setAttribute("id", "labelCommand");
  labelCommand.className = "label";
  labelCommand.textContent = dashResources.get("value");
  labelDiv.appendChild(labelCommand);
  let labelSort = document.createElement("label");
  labelSort.setAttribute("id", "labelSort");
  labelSort.className = "label";
  labelSort.textContent = dashResources.get("sorting");
  labelDiv.appendChild(labelSort);
  let labelFilter = document.createElement("label");
  labelFilter.setAttribute("id", "labelFilter");
  labelFilter.className = "label";
  labelFilter.textContent = dashResources.get("fieldname");
  labelDiv.appendChild(labelFilter);
  //---End---------------------------------------------------------LabelTitle
  let btnAddRule = document.createElement("button");
  btnAddRule.setAttribute("id", "btnAddRule");
  btnAddRule.className = "btn btn-xs";
  btnAddRule.textContent = dashResources.get("adddata");

  btnAddRule.addEventListener("click", function () {
    if (OBJECT_ARRAY.length == 0) {
      showColumnPage();
      filterArr = [];
      for (let index = 0; index < REF_FILTER_DATA.length; index++) {
        filterArr.push({
          id: REF_FILTER_DATA[index].Name,
          idCol: REF_FILTER_DATA[index].ID,
          name: REF_FILTER_DATA[index].Name,
          label: REF_FILTER_DATA[index].Label,
          type: REF_FILTER_DATA[index].Type.toLowerCase(),
          sortType: "",
          groupBy: "",
          TmpViewName: VIEW_TITLE,
        });
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
    if (Tmp_ID_ROW >= 1) {
      Tmp_ID_ROW++;
    } else if (Tmp_ID_ROW <= 0) {
      Tmp_ID_ROW = 1;
    }
    //AlertCheckEmptyRow---------------row<=lenght
    let tmpObjectArray = removeRepeatValue(OBJECT_ARRAY);
    OBJECT_ARRAY = [];
    OBJECT_ARRAY = tmpObjectArray;
    let tmpFilterArray = removeRepeatFilter(filterArr);
    filterArr = [];
    filterArr = tmpFilterArray;
    let tmpValueFilter = $(
      "#" + OBJECT_ARRAY[OBJECT_ARRAY.length - 1].filterTarget
    ).val();
    if (OBJECT_ARRAY.length < Tmp_ID_ROW || tmpValueFilter == -1) {
      Tmp_ID_ROW--;
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
    }
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
  divContainer.className = "container bs-docs-container divHome";
  document.getElementById("filter-builder").appendChild(divContainer);
  let divRow = document.createElement("div");
  divRow.setAttribute("id", "divRow");
  divRow.className = "row";
  divContainer.appendChild(divRow);
  let builderBasic = document.createElement("div");
  builderBasic.setAttribute("id", "builder-basic");
  builderBasic.className = "query-builder form-inline col-md-12";
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
      jsonDataFilterArray = designJson.Filter;
    }

    showFiltersPage();
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
}
