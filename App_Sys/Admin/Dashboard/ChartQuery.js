/* Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.0.0*/
let textAreat_Clipboard = "";
var $aggregationsObj = {};
function CommandText(i) {
  TEMPORARYCHART3 = { ...TEMPORARYCHART2 };
  let div =
    '<div id="myModalCommand" class="modal" style="padding-top: 150px;">' +
    `<div id="commandModal" class="modal-content">` +
    `<div style="display:flex;align-items: center;"><span class="fa fa-question-circle" style="font-size:23px;"></span><label style="margin: 0px 5px;
    font-size: 17px;">${dashResources.get(
      "Query"
    )}</label></div><hr style="width: 100%;height: 1px;margin-top: 10px;margin-bottom: 5px;border-top: 2px solid #ccc;
    "><div id="contentCommand" class="row col-md-12" style=""><button id="newBtn" class="btn btn-success querybtn" style="padding-right: 25px;"><i class="glyphicon glyphicon-pencil" style="margin:5px;"></i><span style="padding-top: 4px;">
    </span></button><button id="edit" class="btn querybtnprimary"${
      $QueryValue == "" ? "disabled" : ""
    } style=" 34px;width: 75px;padding-right: 25px;background-color: #ffb700 !important;border-color: rgb(255, 166, 0) !important;"><i class="glyphicon glyphicon-edit" style="margin:5px;height:"></i><span style="padding-top: 4px;">
  </span></button><textarea id="textArea" class="textarea" style="color:#525151" disabled>${$QueryValue}</textarea></div>` +
    `<div id="btn_modal"></div>` +
    `</div>`;

  $("#myModal").append(div);
  $("#myModalCommand").css("display", "block");
  $("#commandModal").css("width", "50%");

  let textArea = ``;
  $("#contentCommand").append(textArea);

  let queryTextarea = $(`#textArea`).val();

  //btnsubmit
  let Submit = btnSubmit("#btn_modal", dashResources.get("save"));
  //querysubmit
  Submit.onclick = () => {
    if ($(`#textArea`).val() != "") {
      $(`#item-${i}`).val(dashResources.get("Filled"));

      $(`#item-${i}`).css("border", "1px solid #ccc");

      $QueryValue = $("#textArea").val();

      let _TableNames = extractColumnNames($QueryValue); //Get added columns aliases

      $CategoryQuery = _TableNames;

      selectCategory("item-4");
    } else {
      $(`#item-${i}`).val(dashResources.get("Empty"));
    }

    //Empty Series

    let diff = $(`#textArea`).val() === queryTextarea;
    if (!diff) {
      SERIES = [];
      $(`#item-6`).val("");
    }

    $("#myModalCommand").remove();
    TEMPORARYCHART2 = { ...TEMPORARYCHART3 };
  };
  //btn close
  $(`#btn_modal`).append(
    `<button class="btn btn-light btn_submint_exit" onclick="btnOnclickExit()">${dashResources.get(
      "exit"
    )}</button>`
  );

  $(`#newBtn`).on("click", () => {
    openQuery("newBtn");
  });
  $("#edit").on("click", () => {
    $("#textArea").toggleClass("allowEdit");
    $("#edit i").toggleClass("glyphicon-edit");
    $("#edit i").toggleClass("glyphicon-lock");
    if ($("#textArea").hasClass("allowEdit")) {
      $("#textArea").prop("disabled", false);
    } else {
      $("#textArea").prop("disabled", true);
    }
  });
}

function btnOnclickExit() {
  $("#myModalCommand").remove();
}

function tabExit() {
  $("#textArea").val(textAreat_Clipboard);
  $(`#myModalQuery`).remove();
  if ($("#textArea").val() != "") $(`#edit`).attr("disabled", false);
}

var _Grouping_level;
var _ReportSchema;
function openQuery(_action) {
  textAreat_Clipboard = $("#textArea").val();

  boolFirstOperator = true;
  IDType = [];
  expressionOrGroup = true;
  opratorArr = [];
  boolFirstCountThirdPage = true;
  jsonDataFilterArray = [];
  output_basic.cleanValues;
  output_basic = [];
  output_basic = [
    {
      reportid: "",
      moduleid: "",
      datasetname: "",
      selectclause: "",
      columns: [],
      whereclause: "",
      filter: [],
      accessroles: [],
      accessgroups: [],
      label: "",
      header: "",
      footer: "",
      description: "",
      groupinglevel: 0,
      requesttoken: "",
      schedule: [],
    },
  ];
  BOOL_FIRST_COUNT = true;
  RULE_ID = 0;
  OBJECT_ARRAY = [];
  Tmp_ID_ROW = 0;
  REF_FILTER_DATA = [];
  filterArr = [];
  ITEM_ID = 0;
  OUTPUTColumns = [];
  OUTPUT = output_basic;
  OUTPUT_JsonTxt = "";
  strSql = "";
  FILTER_filterArr = [];
  REPORT_SCHEMA_ARRAY = [];
  REPORT_CHANGE_SCHEMA_ARRAY = [];
  LAST_SCHEMA_VALUE = "";
  BOOL_EMPTY_VALUE_HAS = false;
  LAST_CREATE_MODE = false;
  SAVE_ITEMS = false;
  rules_basic.cleanValues;
  rules_basic = {};
  rules_basic = {
    condition: "AND",
    rules: [],
    valid: true,
  };

  NEW_ARRAY_COLUMN = [];

  let div =
    `<div id="myModalQuery" class="modal" style="padding-top: 150px;">` +
    `<div id="queryModal" class="modal-content"><div style="display:flex;align-items: center;><span class="fa fa-question-circle" style="font-size:23px;"></span><label style="margin: 0px 5px;
    font-size: 17px;">${dashResources.get(
      "queryDesigner"
    )}</label></div><hr style="width: 100%;height: 1px;margin-top: 10px;margin-bottom: 0px;border-top: 2px solid #ccc;
    ">` +
    `<div id="query" class="row col-md-12" style="margin-bottom:5px!important;"></div>` +
    "</div></div>";
  if (_action != "reload") $("#myModal").append(div);
  $("#myModalQuery").css("display", "block");
  $("#queryModal").attr("style", "width:60%;overflow:auto;top:-90px;");

  fetch("../App_Sys/Admin/Dashboard/ReportDesigner/ReportDesigner.html")
    .then((response) => response.text())
    .then((text) => {
      document.getElementById("query").innerHTML = text;
      clickNavbar("Lirpt-wiz-1");
      ResourceFunct();

      //Load Data from DB
      var DashboardReportRef;
      $.ajax({
        type: "POST",

        url: "../../App_Sys/Services/Admin/DashboardReport.asmx/GetDesign",

        data: "",

        contentType: false,
        async: false,

        dataType: "xml",

        processData: false,

        error: function (jqXHR, textStatus, errorThrown) {
          alert(JSON.stringify(jqXHR));
        },

        success: function (data) {
          DashboardReportRef = JSON.parse(
            data.getElementsByTagName("string")[0].childNodes[0].nodeValue
          );

          if (_action == "newBtn" || _action == "reload") {
            CREATE_MODE = true;
            DashboardReportRef.Columns = [];
            DashboardReportRef.Filter = "";
            DashboardReportRef.GroupingLevel = "0";
            DashboardReportRef.WhereClause = "";
            $(`#edit`).attr("disabled", true);
            renderReportDesigner(DashboardReportRef, _action);
          }
        },
      });
    });
}

function extractColumnNames(query) {
  // Define a regular expression pattern to extract the columns part from the SELECT clause
  let pattern = /SELECT\s+(.*?)\s+FROM/i;
  let match = query.match(pattern);

  if (match) {
    // Split the matched columns string by comma to get individual column names
    let tableNames = match[1].trim().split(",");
    let columnStrings = [];

    // Iterate over each column name
    tableNames.forEach((tableName) => {
      tableName = tableName.trim();
      let columnName = "";
      // Check if the column name contains an alias and extract the alias if present
      if (tableName) {
        const parts = tableName.split(/ as /i); // Split on " as " or " AS " (case-insensitive)

        if (parts.length > 1) {
          if (parts[0].includes(".")) {
            columnName = parts[0].trim(); // Use the part before "as" if it contains a dot
          } else {
            // Check if the first part or the second part contains any of the specified keywords
            if (
              /sum|avg|min|max|count/i.test(parts[0]) ||
              /sum|avg|min|max|count/i.test(parts[1])
            ) {
              columnName = parts[0].trim(); // Use the part before "as" if it matches
            } else {
              columnName = parts[1].trim(); // Use the part after "as"
            }
          }
        } else {
          columnName = tableName.trim(); // If no alias, just trim the original tableName
        }
      }

      let parts = [];

      // Check if the column name is qualified (contains a dot)
      parts = columnNameChanger(columnName);
      if (parts.length > 1) {
        if (columnName.includes("(")) {
          // Check for SQL aggregation functions
          switch (columnName.split("(")[0]) {
            case "SUM":
              $aggregationsObj[parts] = dashResources.get("sum");
              break;
            case "AVG":
              $aggregationsObj[parts] = dashResources.get("avg");
              break;
            case "MIN":
              $aggregationsObj[parts] = dashResources.get("min");
              break;
            case "MAX":
              $aggregationsObj[parts] = dashResources.get("max");
              break;
            case "Count":
              $aggregationsObj[parts] = dashResources.get("count");
              break;
          }
          $aggregationsObjFDM = {};
        } else {
          $aggregationsObj[parts] = "";
          $aggregationsObjFDM = {};
        }
        columnStrings.push(parts);
      } else {
        columnStrings.push(columnName);
      }
    });

    // Remove duplicates and null values from the column strings array
    columnStrings = removeDuplicatesWithNull(columnStrings);
    return columnStrings;
  } else {
    return null;
  }
}

function removeDuplicatesWithNull(array) {
  const uniqueItems = new Set();
  const resultArray = [];

  array.forEach((item) => {
    if (item === null) {
      resultArray.push(null);
    } else if (!uniqueItems.has(item)) {
      uniqueItems.add(item);
      resultArray.push(item);
    }
  });

  return resultArray;
}

//Function for processing column names
function columnNameChanger(columnsNames) {
  let column;
  //When column has added by wizard
  if (columnsNames.includes("Sys_")) {
    column = columnsNames.split("Sys_");
    if (column.length > 1) {
      if (column[1].includes("Processes")) {
        column = column[1].split(")")[0]; // Extract the actual column name part if it contains a function
        if (column.includes(".")) column = column.split(".")[1];
      } else {
        column = column[1].replaceAll("Process", "");
        column = column.split(")");
        column = column[0].replaceAll(".", "");
      }
    } else {
      //When column has added manually
      column = column[0];
    }
  } else if (columnsNames.includes("(")) {
    //When column has added manually with aggregate
    column = columnsNames.split("(")[1].replaceAll(")", "");
  } else {
    column = columnsNames.trim();
  }
  return column;
}
