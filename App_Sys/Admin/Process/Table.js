/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.0.0*/
/* Release Ferdos.BPMS*/

var UI;
var Items_Array = [];
var Items;
let GID;
let getTemporaryArray;
var _Filtered = [];
var _docImgArr = [];
var $usedVariable = [];
let _mainDocImgArray = [];
let _itemVisibilityArr = [];
let _formVisibilityLabel = [];

/*
 *
 *  Table
 *
 */

const Table = async (_jsonUi) => {
  localStorage.setItem("Saveinterval", false);
  UI = _jsonUi;
  localStorage.removeItem("editID");
  localStorage.removeItem("deleteID");
  UI.TemporaryArray = [];
  if ($JSON_IMPORTED != "") {
    let JS = $JSON_IMPORTED.ProcessModel;
    const fieldName = localStorage.getItem("FieldType");
    if (fieldName == "RoutingRules" && JS.FlowElements.length) {
      let Inclucive = JS.FlowElements.filter(
        (x) => x.Type == "Inclusive Gateway"
      ).filter((x) => x.GatewayOption.RoutingRules.length > 0);
      Inclucive.push(
        ...JS.FlowElements.filter((x) => x.Type == "Exclusive Gateway").filter(
          (x) => x.GatewayOption.RoutingRules.length > 0
        )
      );

      if (Inclucive.length) UI.MainArray = [];
      for (let i in Inclucive)
        UI.MainArray.push(...Inclucive[i].GatewayOption.RoutingRules);

      //clear
      setTimeout(() => {
        for (let i in Inclucive) Inclucive[i].GatewayOption.RoutingRules = [];
      }, 100);
    }
  }

  if (UI.MainArray.length) UI.TemporaryArray.push(...UI.MainArray);

  const List_Modal = UI.List_Modal;
  const Table_id = List_Modal.Table.id;
  const Table_Width = List_Modal.Table.widht;

  //*Modal component
  MODAL_component(List_Modal, Table_id, Table_Width);

  //*TABLE component
  TABLE_component(UI, Table_id);
  //* ONLOAD
  //TBody
  if (UI.TemporaryArray.length > 0) {
    //Tr
    let getTemporaryArray = showTable(UI);
    // showTable(UI);

    //get array from service
    $.ajax({
      type: "POST",
      url: "../../App_Sys/Services/Admin/Process.asmx/GetUsedVariables",
      data: `{processID : ${_pageKey}}`,
      contentType: "application/json; charset=utf-8",
      async: false,
      dataType: "json",
      success: function (data) {
        $usedVariable = JSON.parse(data.d);
      },
      error: function (error) {
        alert(JSON.stringify(error));
      },
    });

    for (let j in getTemporaryArray) {
      let arrused = "";

      for (let i = 0; i < $usedVariable.length; i++) {
        if (getTemporaryArray[j].RowKey == $usedVariable[i].Rowkey) {
          arrused = $usedVariable[i].Rowkey;
        }
      }

      const display = arrused !== "" ? "block" : "none";
      let Table = "";
      Table += "<tr>";
      Table += "<td>" + (+j + 1) + "</td>";

      Table +=
        '<td style="display: none;">' +
        getTemporaryArray[j].GeneralId +
        "</td>";
      Table +=
        '<td style="display: none;">' + getTemporaryArray[j].RowKey + "</td>";

      //Td

      const Thead = Object.keys(UI.List_Modal.Table.Thead);
      for (let i in Thead) {
        if (Thead[i] == "Used") {
          Table += `<td><span class="glyphicon glyphicon-ok" data-toggle="tooltip" data-placement="bottom" title="${mxResources.get(
            "UsedTooltip"
          )}" style="height:19px;width: 23px;margin: 0px auto;cursor:pointer;display:${display}" 
            onclick="usedForm(this)"></span></td>`;
        }

        // else if (Thead[i] == "SystemID" && Table_id == "ProcessData_Table") {
        //   //load SystemID
        //   Table += `<td >${getTemporaryArray[j][Thead[i]]}</td>`;
        // }
        else if (Thead[i] == "OutgoingEID") {
          let value = Elements_except_Connections().filter(
            (x) => x.id == getTemporaryArray[j][Thead[i]]
          );

          if (value.length) {
            value[0].value = RemoveSpaceStr(value[0].value);

            // if (
            //   getType(value[0].style) == "Exclusive Gateway" ||
            //   getType(value[0].style) == "Inclusive Gateway"
            // )
            //   value[0].value = mxResources.get("DecisionGateway");

            if (getType(value[0].style) == "EndEvent") {
              if (value[0].value == "") {
                value[0].value = mxResources.get("EndProcess");
              }
            }
          } else {
            value[0] = "";
          }
          Table +=
            '<td scope="row">' +
            GetLabel_En_To_Fa(
              value[0] == undefined ? "" : value[0].value,
              Thead[i]
            ) +
            "</td>";
        } else if (Thead[i] == "DocImg") {
          Table += `<td scope="row"><img src="${getTemporaryArray[j].ImgSrc}" style="width:50px;height:50px;" onmouseout="zoomout()" onmouseenter="zoomImg(this)" ></img></td>`;
        } else if (Thead[i] == "ImgSize") {
          Table += "<td >" + getTemporaryArray[j].ImgSize + "</td>";
        }
        // else if (Thead[i] == "DownloadAccessID") {
        //   let item = getTemporaryArray[j][Thead[i]][0];
        //   let str = "";
        //   for (let k in item) {
        //     let lbl = $JSON_IMPORTED.ProcessModel.RefRoles.filter(
        //       (x) => x.ID == item[k]
        //     );
        //     if (lbl.length) {
        //       lbl = lbl[0].Label;
        //       k == 0 ? (str += lbl) : (str += ", " + lbl);
        //     } else {
        //       str += mxResources.get("alluser");
        //     }
        //   }

        //   Table += `<td >${str}</td>`;
        // }
        // else if (Thead[i] == "ViewAccessID") {
        //   let item = getTemporaryArray[j][Thead[i]][0];
        //   let str = "";
        //   for (let k = 0; k < item.length; k++) {
        //     let lbl = $JSON_IMPORTED.ProcessModel.RefRoles.filter(
        //       (x) => x.ID == item[k]
        //     );
        //     if (lbl.length) {
        //       lbl = lbl[0].Label;
        //       k == 0 ? (str += lbl) : (str += ", " + lbl);
        //     } else {
        //       str += mxResources.get("alluser");
        //     }
        //   }
        //   Table += `<td >${str}</td>`;
        // }
        else if (Thead[i] == "ActivityID") {
          let Elements = [];
          Elements = getAllUserTask();
          Elements.push(...getAllExclusiveGateway());
          let lbl;
          const baseId = (500 + +_pageKey) * 10000;
          for (let k in Elements) {
            const originalId = Elements[k].id;
            Elements[k].id = baseId + +originalId;
            if (Elements[k].id == getTemporaryArray[j][Thead[i]]) {
              if (Elements[k].value == "") {
                lbl =
                  getType(Elements[k].style) == "Exclusive Gateway" ||
                  getType(Elements[k].style) == "Inclusive Gateway"
                    ? mxResources.get("DecisionGateway")
                    : mxResources.get("valueisempty");
              } else {
                lbl = Elements[k].value;
              }
            } else if (getTemporaryArray[j][Thead[i]]) {
              lbl = mxResources.get("lastlevel");
            }

            // Restore original id for further operations
            Elements[k].id = originalId;
          }

          Table += `<td >${lbl}</td>`;
        } else if (
          Thead[i] == "EntityTypeID" &&
          getTemporaryArray[j][Thead[i]] != undefined &&
          getTemporaryArray[j][Thead[i]] != "0"
        ) {
          let lbl = $JSON_IMPORTED.ProcessModel.EntityTypes.filter(
            (x) => x.ID == getTemporaryArray[j][Thead[i]]
          );
          if (lbl.length) lbl = lbl[0].Label;
          Table += `<td scope="row">${mxResources.get(lbl)}</td>`;
        } else if (Thead[i] == "State") {
          let lbl = $JSON_IMPORTED.ProcessModel.FlowStates.filter(
            (x) => x.ID == getTemporaryArray[j][Thead[i]]
          );
          if (lbl) lbl = lbl[0].Label;
          Table += `<td scope="row">${mxResources.get(lbl)}</td>`;
        } else if (Thead[i] == "StateID") {
          let lbl = $JSON_IMPORTED.ProcessModel.FlowStates.filter(
            (x) => x.ID == getTemporaryArray[j][Thead[i]]
          );
          if (lbl.length) {
            lbl = lbl[0].Label;
            Table += `<td scope="row">${mxResources.get(lbl)}</td>`;
          }
        } else if (
          Thead[i] == "EnumTypeID" &&
          getTemporaryArray[j][Thead[i]] != undefined &&
          getTemporaryArray[j][Thead[i]] != "0"
        ) {
          let lbl = Obj_EnumType.filter(
            (x) => x.ID == getTemporaryArray[j]["EnumTypeID"]
          ).length
            ? Obj_EnumType.filter(
                (x) => x.ID == getTemporaryArray[j]["EnumTypeID"]
              )[0].Label
            : "-";
          Table += `<td scope="row">${mxResources.get(lbl)}</td>`;
        } else {
          let txt;
          if (Thead[i] == "Label") {
            txt = getTemporaryArray[j][Thead[i]];
          } else if (getTemporaryArray[j][Thead[i]] != 0) {
            txt = mxResources.get(
              GetLabel_En_To_Fa(getTemporaryArray[j][Thead[i]], Thead[i])
            );
            if (Thead[i] == "IsDefault" || Thead[i] == "Nullable") {
              if ((Thead[i], getTemporaryArray[j][Thead[i]])) {
                txt = `<input type="checkbox"  checked style="pointer-events: none" >`;
              } else {
                txt = `<input type="checkbox"  style="pointer-events: none" >`;
              }
            }
          } else if (Thead[i] == "IsDefault" || Thead[i] == "Nullable") {
            if ((Thead[i], getTemporaryArray[j][Thead[i]])) {
              txt = `<input type="checkbox"  checked  style="pointer-events: none">`;
            } else {
              txt = `<input type="checkbox"  style="pointer-events: none" >`;
            }
          } else {
            txt = "-";
          }
          Table += `<td scope="row">${txt}</td>`;
        }
      }

      Table += Rowbtn(+j + 1, getTemporaryArray[j].RowKey);
      Table += "</tr>";
      $("#tbody_" + Table_id).append(Table);

      //btn details display
      BtnDisplay(+j + 1, getTemporaryArray[j].RowKey);
    }

    //disabled false SubTable
    SubTableUI.MainArray.map((value, index) => {
      if (value.disabled) {
        value.disabled = false;
      }
    });
  }
  CRUD_component(UI, Table_id);

  ResourceFunct();
};

//Items_Array
function Items_Array_Func() {
  Items_Array = [];
  Items = UI.Item_Modal.Add_Items.Items;

  for (let i in Items) if (Items[i].type != "label") Items_Array.push(Items[i]);
  return Items_Array;
}
/*
 *
 *  ********Sub_Table
 *
 *
 */

const Sub_Table = async (_jsonUi, RowKey, EntityID) => {
  UI = _jsonUi;
  UI.TemporaryArray = [];
  if (UI.MainArray.length) UI.TemporaryArray.push(...UI.MainArray);

  const List_Modal = UI.List_Modal;
  const Table_id = List_Modal.Table.id;
  const Table_Width = List_Modal.Table.widht;
  //Items_Array
  Items_Array_Func();
  MODAL_component(List_Modal, Table_id, Table_Width);
  TABLE_component(UI, Table_id);

  //*ONLOAD
  //EntityID = 0 means none of the entities were selected
  if (EntityID != 0) {
    $("#btnAdd_SubTable_Table").addClass("entityBtn");
    $("#btnAdd_SubTable_Table").css("display", "none");
    let columnObj = [];
    //To get the 'Val' of the row selected  based on rowkey
    let RowVal;
    let SelectedRowTd;
    let SelectedRowKey;
    let tr = $("#ProcessData_Table table tbody tr");
    tr.each(function () {
      SelectedRowTd = $(this).find("td").eq(2);
      SelectedRowKey = SelectedRowTd.html();

      if (SelectedRowKey == RowKey) RowVal = $(this).find("td").eq(4).html();
    });
    //Get the selected Entity Columns (Entity Attribute)
    $.ajax({
      type: "POST",
      url: "../../App_Sys/Services/Admin/Process.asmx/GetEntityColumns",
      data: JSON.stringify({ entityID: EntityID }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        columnObj = JSON.parse(data.d);
        console.log(columnObj);
        // Generate rows for each column
        generateTableRows(columnObj, Table_id, RowVal, SelectedRowKey);
      },
      error: function (error) {
        console.error("Error fetching entity columns:", error);
        alert("An error occurred while fetching entity columns.");
      },
    });
  } else {
    const tbody = $("#tbody_" + Table_id);
    tbody.empty();
  }

  const generateTableRows = (columns, tableId, rowVal, SelectedRowKey) => {
    const tbody = $("#tbody_" + tableId);
    tbody.empty();

    // Mapping of Farsi types to English types
    const typeMapping = {
      "کلید خارجی": "ForeignKey",
      "رشته متنی فارسی": "LocalString",
      "رشته متنی لاتین": "LatinString",
      "رشته متنی": "String",
      متن: "Text",
      "رشته عددی": "Integer",
      "رشته عددی بزرگ": "BigInteger",
      زمان: "Time",
      تاریخ: "Date",
      "تاریخ و زمان": "DateTime",
      گزاره: "Boolean",
      پول: "Money",
      فایل: "File",
      رمز: "Password",
      "شماره موبایل": "Mobile",
      "پست الکترونیکی": "EmailID",
      "شماره تماس": "Phone",
      "آدرس شبکه": "IP Address",
      "آدرس کارت شبکه": "MAC Address",
      "محدوده آدرس شبکه": "IP Address Range",
      "لیست آدرس شبکه": "IP Address List",
      "محدوده آدرس شبکه": "IP Address Mask",
      "فایل تصویر": "Image",
      "رشته رمز شده": "SecureString",
      "گیگا بابت": "GB",
      "مگا بابت": "MB",
      "کیلو بابت": "KB",
      "رشته متنی عددی": "NumeralString",
      "رشته اعشاری": "Float",
      "زمان طولانی": "LongTime",
      "زمان کوتاه": "ShortTime",
      "فایل امضاء": "Signature",
      "متن لاتین": "LatinText",
      "متن دستوری": "CommandText",
      "رشته زمان": "TimeString",
      "جدول ویرایشی": "Table",
      "جدول انتخابی": "SelectiveTable",
      "ارسال پیامک": "Sms",
      "توافق نامه": "Agreement",
      "رزرو رفاهیات": "TimingBox",
      رفاهیات: "FacilityBox",
    };
    let tmpColArray = [];
    columns.forEach((column, index) => {
      let showInList = false;

      UI.TemporaryArray.forEach((row) => {
        if (row.RowKey == SelectedRowKey && column.Label == row.Label) {
          showInList = row.ShowInList;
        }
      });

      let entityName = "-",
        enumTypeName = "-";
      if (
        column.RefEntityID != "0" &&
        column.RefEntityID != " " &&
        column.RefEntityID != undefined
      ) {
        $.ajax({
          type: "POST",
          url: "../../App_Sys/Services/EditActivity.asmx/GetEntity_EnumName",
          data: JSON.stringify({
            Id: column.RefEntityID,
            type: "Entity",
          }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          async: false,
          success: function (response) {
            entityName = response.d;
          },
          error: function (error) {
            console.error("Error fetching entity details:", error);
          },
        });
      } else if (
        column.EnumTypeId != "0" &&
        column.EnumTypeId != " " &&
        column.EnumTypeId != undefined
      ) {
        $.ajax({
          type: "POST",
          url: "../../App_Sys/Services/EditActivity.asmx/GetEntity_EnumName",
          data: JSON.stringify({
            Id: column.EnumTypeId,
            type: "Enum",
          }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          async: false,
          success: function (response) {
            enumTypeName = response.d;
          },
          error: function (error) {
            console.error("Error fetching entity details:", error);
          },
        });
      }

      if (index == 0) return;
      let row = `<tr style="height: 40px;">`;
      row += `<td>${index}</td>`;
      row += `<td style="display: none;">${index + 1}</td>`;
      row += `<td style="display: none;">${index + 1}</td>`;
      row += `<td style="display: none;">${SelectedRowKey}</td>`;
      row += `<td>${column.Label}</td>`;
      row += `<td>${column.Type}</td>`;
      row += `<td>${entityName}</td>`;
      row += `<td>${enumTypeName}</td>`;
      if (column.Nullable === "True") {
        row += `<td><input type="checkbox" checked style="pointer-events: none"></td>`;
      } else {
        row += `<td><input type="checkbox" style="pointer-events: none"></td>`;
      }
      row += `<td><input id="showInListCheck-${index + 1}" ${
        showInList ? "checked" : ""
      } type="checkbox" style="pointer-events: none"></td>`;
      row += Rowbtn(index, SelectedRowKey, true);
      row += `<td style="display: none;">${column.Name}</td>`;
      row += "</tr>";

      tbody.append(row); // Append the row to the table body

      // Map the Farsi column.Type to English DataType
      const dataType = typeMapping[column.Type] || "LocalString"; // Default to "LocalString" if not found

      const rowObject = {
        GeneralId: index + 1,
        SubTableID: index + 1,
        RowKey: +SelectedRowKey,
        TableID: Table_id,
        Name: column.Name,
        Label: column.Label,
        MinValueLenght: "",
        MaxValueLenght: "",
        MinValue: "",
        MaxValue: "",
        Version: "",
        Description: "",
        EnumID: "",
        disabled: false,
        Style: {
          ColWidth: "auto",
          ColHeight: "10px",
        },
        Nullable: column.Nullable == "true" ? true : false,
        DataType: dataType,
        EntityTypeID: +column.RefEntityID,
        Formula: "",
        EnumTypeID: +column.EnumTypeId,
        ShowInList: showInList,
      };
      tmpColArray.push(rowObject);
    });
    UI.TemporaryArray = tmpColArray;
    console.log(UI.TemporaryArray);
    InsertColumnsTotable(UI.TemporaryArray, rowVal);
  };

  //TBody
  if (UI.TemporaryArray.length > 0) {
    let getTemporaryArray = UI.TemporaryArray.filter(
      (x) => x.RowKey == +RowKey
    ).sort((a, b) => a.GeneralId - b.GeneralId);

    for (let j in getTemporaryArray) {
      let Sub_Table = "";
      Sub_Table += "<tr>";
      Sub_Table += "<td>" + (+j + 1) + "</td>";
      Sub_Table +=
        '<td style="display: none;">' +
        getTemporaryArray[j].GeneralId +
        "</td>";
      Sub_Table +=
        '<td style="display: none;">' +
        getTemporaryArray[j].SubTableID +
        "</td>";
      Sub_Table += '<td style="display: none;">' + RowKey + "</td>";

      //Td
      const Thead = Object.keys(UI.List_Modal.Table.Thead);
      for (let i in Thead) {
        if (Thead[i] == "OutgoingEID") {
          let value = Elements_except_Connections().filter(
            (x) => x.id == getTemporaryArray[j][Thead[i]]
          );
          Sub_Table +=
            '<td scope="row">' +
            mxResources.get(GetLabel_En_To_Fa(value[0].value, Thead[i])) +
            "</td>";
        } else if (
          Thead[i] == "EnumTypeID" &&
          getTemporaryArray[j][Thead[i]] != undefined &&
          getTemporaryArray[j][Thead[i]] != "0"
        ) {
          let lbl = Obj_EnumType.filter(
            (x) => x.ID == getTemporaryArray[j]["EnumTypeID"]
          ).length
            ? Obj_EnumType.filter(
                (x) => x.ID == getTemporaryArray[j]["EnumTypeID"]
              )[0].Label
            : "-";
          Sub_Table += `<td scope="row">${mxResources.get(lbl)}</td>`;
        } else if (
          Thead[i] == "EntityTypeID" &&
          getTemporaryArray[j][Thead[i]] != undefined &&
          getTemporaryArray[j][Thead[i]] != "0"
        ) {
          let lbl = $JSON_IMPORTED.ProcessModel.EntityTypes.filter(
            (x) => x.ID == getTemporaryArray[j][Thead[i]]
          );
          if (lbl.length) lbl = lbl[0].Label;
          Sub_Table += `<td scope="row">${mxResources.get(lbl)}</td>`;
        } else {
          let txt;
          if (Thead[i] == "Label") {
            txt = getTemporaryArray[j][Thead[i]];
          } else if (getTemporaryArray[j][Thead[i]] != 0) {
            if (
              getTemporaryArray[j][Thead[i]] == "سیستمی" ||
              getTemporaryArray[j][Thead[i]] == "انتخابی" ||
              getTemporaryArray[j][Thead[i]] == "محاسباتی"
            ) {
              txt = getTemporaryArray[j][Thead[i]];
            } else {
              txt = mxResources.get(
                GetLabel_En_To_Fa(getTemporaryArray[j][Thead[i]], Thead[i])
              );
            }

            if (
              Thead[i] == "IsDefault" ||
              Thead[i] == "Nullable" ||
              Thead[i] == "ShowInList"
            ) {
              if (getTemporaryArray[j][Thead[i]]) {
                txt = `<input type="checkbox" checked  style="pointer-events: none">`;
              } else {
                txt = `<input type="checkbox"  style="pointer-events: none" >`;
              }
            }
          } else if (
            Thead[i] == "IsDefault" ||
            Thead[i] == "Nullable" ||
            Thead[i] == "ShowInList"
          ) {
            if (getTemporaryArray[j][Thead[i]]) {
              txt = `<input type="checkbox" checked  style="pointer-events: none">`;
            } else {
              txt = `<input type="checkbox"  style="pointer-events: none" >`;
            }
          } else {
            txt = "-";
          }

          Sub_Table += `<td scope="row">${txt}</td>`;
        }
      }

      Sub_Table += Rowbtn(+j + 1, RowKey);
      Sub_Table += "</tr>";
      $("#tbody_" + Table_id).append(Sub_Table);

      //btn details display
      BtnDisplay(+j + 1, RowKey);
    }
  }

  CRUD_component(UI, Table_id);
};

function MODAL_component(List_Modal, Table_id, Table_Width) {
  let div =
    '<div id="' +
    List_Modal.id +
    '" class="modal">' +
    '<div id="' +
    Table_id +
    '" class="modal-content" style="width:' +
    Table_Width +
    'px"></div></div>';
  $("body").append(div);
  $("#" + List_Modal.id).css("display", "block");
}
function TABLE_ICON(id) {
  if (id == "ProcessData_Table") {
    return '<span class="fa fa-database"></span>';
  } else if (id == "SubTable_Table") {
    return '<span class="fa fa-table"></span>';
  } else if (id == "Condition_Table") {
    return '<span class="fa fa-code"></span>';
  } else if (id == "Doc_Table") {
    return '<span class="fa fa-file-o"></span>';
  }
}

function searchInModal(event) {
  let searchTerm = event.target.value.toLowerCase(); 
  let tableId = event.target.id.replace("search_", "tbody_");

  let tableBody = document.getElementById(tableId);

  Array.from(tableBody.rows).forEach((row) => {
    let rowText = row.textContent.toLowerCase();
    if (rowText.includes(searchTerm)) {
      row.style.display = ""; 
    } else {
      row.style.display = "none"; 
    }

    let removeIcon = document.getElementById(
      "remove_" + tableId.replace("tbody_", "")
    );
    if (searchTerm) {
      removeIcon.style.display = "block";
    } else {
      removeIcon.style.display = "none";
    }
  });
}

function clearInput(event) {
  let removeIcon = event.target;
  let tableId = removeIcon.id.replace("remove_", "search_");
  let inputField = document.getElementById(tableId);
  inputField.value = "";
  inputField.dispatchEvent(new Event("input")); // Trigger the input event to update the state
}

let NewUI = [];

function TABLE_component(UI, Table_id) {
  let Table =
    '<div class="" style="height:300px !important;direction:rtl;border-bottom:1px solid #ccc;margin-bottom:10px;display:contents;">' +
    `<div id="Title" style="">${TABLE_ICON(UI.List_Modal.Table.id)}` +
    mxResources.get(UI.List_Modal.title) +
    `</div><hr style="margin-bottom:10px;border-Top:2px solid #ccc;"><div style="height: 50px;">
      <i class="fa-duotone fa-magnifying-glass search-icon tablesearchicon"></i>
      <input type="text" class="tablesearchbox" id="search_${Table_id}"  oninput="searchInModal(event)">
      <i class="fas fa-times remove-icon tableremoveicon" style="display:none;"  id="remove_${Table_id}"  onclick="clearInput(event)"></i>

    <button id="btnAdd_` +
    Table_id +
    `" class="btn btn-success" onclick="ITEM_Modal('success',id)" style="margin-top:5px;padding: 4px 10px;"` +
    ` >${mxResources.get("add")}</button>` +
    // `<select id="selectVariable" onclick="selectVariable(event)"></select>`
    `</div > <div class="tableFixHead"><table class="table table-bordered table-hover">` +
    "<thead>" +
    "<tr>" +
    `<th scope="col" data-sortable="true" style="width:20px;vertical-align: middle;" >${mxResources.get(
      "row"
    )}</th>` +
    `<th scope="col" style="display:none;" >GID</th>` +
    `<th scope="col" style="display: none;">RowKey</th>`;
  //thead
  for (let i in UI.List_Modal.Table.Thead) {
    Table += `<th scope="col" style="vertical-align: middle; ${
      UI.List_Modal.Table.Thead[i] == "title"
        ? "width:200px;"
        : UI.List_Modal.Table.Thead[i] == "Label"
        ? "width:345px;"
        : UI.List_Modal.Table.Thead[i] == "Nullable" ||
          UI.List_Modal.Table.Thead[i] == "ShowInList" ||
          UI.List_Modal.Table.Thead[i] == "IsDefault"
        ? "width:85px;"
        : UI.List_Modal.Table.Thead[i] == "EnumTypeID"
        ? "width:50px;"
        : UI.List_Modal.Table.Thead[i] == "EntityTypeID"
        ? "width:50px;"
        : UI.List_Modal.Table.Thead[i] == "ImgSize"
        ? "width:20px;"
        : UI.List_Modal.Table.Thead[i] == "InputCount"
        ? "width:90px;"
        : UI.List_Modal.Table.Thead[i] == "Name"
        ? "width:345px;"
        : UI.List_Modal.Table.Thead[i] == "Details"
        ? ""
        : UI.List_Modal.Table.Thead[i] == "DocImg"
        ? "width:70px;"
        : UI.List_Modal.Table.Thead[i] == "ActivityID"
        ? "width:70px;"
        : "min-width:100px;"
    }" >${mxResources.get(UI.List_Modal.Table.Thead[i])}</th>`;
  }

  Table += `<th scope="col" style="vertical-align: middle;${
    Table_id == "Condition_Table"
      ? "min-width:80px;"
      : Table_id == "Doc_Table"
      ? "min-width:120px;"
      : Table_id == "ProcessData_Table"
      ? "min-width:120px;"
      : ""
  }">${mxResources.get(
    "operationsID"
  )}</th></tr></thead><tbody id="tbody_${Table_id}">`;
  Table += "</tr>";
  Table += "</tbody ></table ></div></div>";
  $(`#${Table_id}`).append(Table);

  // Refresh UI
  if (NewUI.filter((x) => Object.keys(x) == Table_id)[0]) {
    NewUI.splice(
      NewUI.indexOf(NewUI.filter((x) => Object.keys(x) == Table_id)[0]),
      1,
      Object.fromEntries([[Table_id, UI]])
    );
  } else {
    NewUI.push(Object.fromEntries([[Table_id, UI]]));
  }
}

function selectVariable(e) {
  let Arr = JSON.parse(localStorage.getItem("isNotVariable"));
  $(`#${e.target.id}`).empty();
  Arr.map((value) =>
    $(`#${e.target.id}`).append(`<option onclick="ss()">${value.lbl}</option>`)
  );
}

let lastID = null;
function ITEM_Modal(Text, TableID) {
  if (lastID != TableID) {
    let TableIDSP;
    if (
      TableID.split("_")[1] == "ProcessData" ||
      TableID.split("_")[1] == "SubTable" ||
      TableID.split("_")[1] == "Condition" ||
      TableID.split("_")[1] == "Doc"
    ) {
      TableIDSP = TableID.split("_")[1] + "_" + TableID.split("_")[2];
      // imageUploaded_URL = Default_src;
    } else if (TableID.split("_")[1] == "Edit") {
      TableIDSP = TableID.split("_")[2] + "_" + TableID.split("_")[3];
    }

    //UI Refresh

    UI =
      TableIDSP == undefined
        ? RefreshUIbyBTN(TableID.split("_")[1] + "_AddTable")
        : RefreshUIbyBTN(TableIDSP.split("_")[0] + "_AddTable");

    TableID ??= 0;

    if (TableID.split("_")[1] == "ProcessData") {
      //todo
      if (UI.TemporaryArray.length) {
        let _tempArr = UI.TemporaryArray;
        let _sorted = _tempArr.sort(
          (a, b) => +a.SystemID.slice(3) - +b.SystemID.slice(3)
        );

        const lastSystemID = _sorted.at(-1).SystemID;
        localStorage.setItem("LastSystemID" + _pageKey, lastSystemID);
      } else {
        localStorage.setItem("LastSystemID" + _pageKey, "Val000");
      }
    }

    const Item_Modal = UI.Item_Modal;
    const Add_Items_id = Item_Modal.Add_Items.id;
    const Add_Items_Width = Item_Modal.Add_Items.widht;

    // imageUploaded_URL Refresh
    imageUploaded_URL = [];

    //Item UI
    let div =
      '<div id="' +
      Item_Modal.id +
      '" class="modal" style="">' +
      '<div id="' +
      Add_Items_id +
      '" class="modal-content" style="top:25px;width:' +
      Add_Items_Width +
      'px">' +
      `<div id="Title" style="font-size:14px;" ><span class="${
        Text == "edit" ? "glyphicon glyphicon-pencil" : "fa fa-plus"
      }" style=""></span>` +
      mxResources.get(
        Text == "edit" ? "edit" + UI.Item_Modal.title : UI.Item_Modal.title
      ) +
      '</div><hr style="margin-bottom:10px;border-Top:2px solid #ccc;">' +
      "</div>" +
      "</div>";
    $("#" + UI.List_Modal.id).append(div);

    $("#" + Item_Modal.id).css("display", "block");

    let form = '<div class="subDiv">';
    //Refresh Items

    Items_Array_Func();

    for (let i in Items) {
      const item = Items[i];
      switch (item.type) {
        case "label":
          form += Labels(item);
          break;
        case "text":
          form += TextBox(item);
          break;
        case "textarea":
          form += Textarea(item);
          break;
        case "checkbox":
          form += CheckBox(item);
          break;
        case "dropdown":
          form += DropDown(item);

          break;
        case "dropdownDynamic":
          form += DropDownDynamic(item);
          break;
        case "file":
          form += FileBox(item, TableID);
          break;
      }
    }
    form += "</div>";
    $("#" + Add_Items_id).append(form);

    $(`.dropDown`).select2();
    $(`.dropdownDynamic`).select2();
    $(`.select2-container`).css("position", "revert");

    if (_Lang == "Fa" && UI.List_Modal.Table.id == "Doc_Table")
      $(`#item_3`).css("text-align", "right");
    if (UI.List_Modal.Table.id == "Condition_Table")
      $(`#item_3`).css("text-align", "center");

    //btnsubmit
    let Submit = btnSubmit("#" + Add_Items_id, "btnPrimary");
    Submit.setAttribute("id", "Add_Items_btn");
    Text == "edit"
      ? (Submit.innerHTML = mxResources.get("edit"))
      : (Submit.innerHTML = mxResources.get("btnPrimary"));
    UI = RefreshUIbyBTN(TableID.split("_")[1] + "AddTable");

    Submit.onclick = async (e) => {
      _formVisibilityLabel = [];
      _itemVisibilityArr.forEach((item) => {
        if (item.Visibility == "true") {
          _formVisibilityLabel.push(item.Label);
        }
      });
      let allowSave = true;
      if (_formVisibilityLabel.length) {
        if ($("#item_4").is(":checked") == false) {
          allowSave = false;
          let isUsed = "";
          _formVisibilityLabel.forEach((element) => {
            isUsed += " - " + element + " \n";
          });
          swal(
            `${mxResources.get("visibilityAlert")}` +
              `
          ${isUsed}`,
            {
              icon: "warning",
              buttons: {
                confirm: `${mxResources.get("ok")}`,
              },
            }
          );
        }
      }
      lastID = "";
      let Enabled = true;
      if (Text == "edit") {
        //*Edit Table
        $(`:disabled`).removeAttr("disabled");
        try {
          let tr = $("#" + TableID)
            .parents()
            .eq(1);

          Enabled = checkDuplicateValue(
            +tr.children().eq(2).text(),
            +tr.children().eq(1).text(),
            "Edit"
          );
          Enabled = allowSave;

          if (Enabled) {
            let rowID = +tr.children().eq(0).text();
            let GID = +tr.children().eq(1).text();
            //set Table
            let count = 0;

            for (let i = 0; i < Items_Array.length; i++) {
              if (
                Items_Array[i].variableExp != "Conditions" &&
                Items_Array[i].variableExp != "Access" &&
                Items_Array[i].variableExp != "Computed"
              ) {
                let value;
                if (Items_Array[i].type == "checkbox") {
                  if ($("#" + Items_Array[i].id).is(":checked")) {
                    value = `<input type="checkbox" checked style="pointer-events: none">`;
                  } else {
                    value = `<input type="checkbox" style="pointer-events: none">`;
                  }
                } else if (
                  Items_Array[i].type == "dropdown" ||
                  Items_Array[i].type == "dropdownDynamic"
                ) {
                  if (
                    $("#" + Items_Array[i].id)
                      .parent()
                      .css("display") != "none"
                  ) {
                    $("#" + Items_Array[i].id).attr("multiple") == "multiple"
                      ? (value = $("#" + Items_Array[i].id).val())
                      : (value = $(
                          "#" + Items_Array[i].id + " option:selected"
                        ).text());
                  } else {
                    value = "-";
                  }

                  if (
                    //Items_Array[i].id == "item_9" ||
                    Items_Array[i].id == "item_11" ||
                    Items_Array[i].id == "item_12"
                  ) {
                    let item = value;
                    let str = "";
                    for (let k in item) {
                      let lbl = $JSON_IMPORTED.ProcessModel.RefRoles.filter(
                        (x) => x.ID == item[k]
                      );
                      if (lbl.length) {
                        lbl = lbl[0].Label;
                        k == 0 ? (str += lbl) : (str += ", " + lbl);
                      } else {
                        str += mxResources.get("alluser");
                      }
                    }
                    value = str;
                  }
                } else if (Items_Array[i].type == "file") {
                  value = `<img src="${imageUploaded_URL[0]}" style="width:50px;height:50px;" onmouseout="zoomout()" onmouseenter="zoomImg(this)"/>`;
                } else {
                  value = $("#" + Items_Array[i].id).val();
                }

                if (TableID.split("_")[2] == "Condition") {
                  tr.children()
                    .eq(count + 3)
                    .html(value);
                } else if (TableID.split("_")[2] == "ProcessData") {
                  tr.children()
                    .eq(count + 5)
                    .html(value);
                } else if (TableID.split("_")[2] == "SubTable") {
                  tr.children()
                    .eq(count + 4)
                    .html(value);
                } else {
                  tr.children()
                    .eq(count + 3)
                    .html(value);
                }
                count++;
              }
            }

            //Update fdmt file
            if (_docImgArr.length) DocService(_docImgArr, "edit");

            //remove TemporaryArray item
            let RowKey;
            let Filter;
            let _Columns = [];

            if (TableID.split("_")[2] == "SubTable") {
              let SubTableID = +tr.children().eq(2).text();
              RowKey = +tr.children().eq(3).text();
              if (UI.TemporaryArray.length)
                Filter = UI.TemporaryArray.filter(
                  (x) => x.SubTableID == SubTableID
                );

              for (let k = 0; k < Filter.length; k++) {
                UI.TemporaryArray.splice(
                  UI.TemporaryArray.indexOf(Filter[k]),
                  1
                );
              }
            } else {
              RowKey = +tr.children().eq(2).text();

              if (UI.TemporaryArray.length)
                Filter = UI.TemporaryArray.filter((x) => x.RowKey == RowKey);

              //save old columns form table

              if (Filter.length) {
                if (
                  Filter[0].DataType == "Table" ||
                  Filter[0].DataType == "SelectiveTable"
                )
                  _Columns = Filter[0].Columns;

                for (let k = 0; k < Filter.length; k++) {
                  UI.TemporaryArray.splice(
                    UI.TemporaryArray.indexOf(Filter[k]),
                    1
                  );
                }
              }
            }
            localStorage.setItem("CurrentRowKey", RowKey);

            //add to UI.TemporaryArray
            const subid = +tr.children().eq(2).text();

            let _SystemID = localStorage.getItem("CurrentSystemID" + _pageKey);
            TableID.split("_")[2] == "SubTable"
              ? UI.Insert(subid, GID, RowKey, _SystemID)
              : UI.Insert(rowID, GID, RowKey, _SystemID, _Columns);

            //btn details display
            BtnDisplay(rowID, RowKey);

            //close
            $("#" + UI.Item_Modal.id).remove();
            _formVisibilityLabel = [];
            _itemVisibilityArr = [];
          }
        } catch (error) {
          alert(error);
        }
      } else {
        //todo
        //*INSERT TABLE
        try {
          let _ID =
            $("#tbody_" + UI.List_Modal.Table.id + " tr").length == 0
              ? 1
              : +$("#tbody_" + UI.List_Modal.Table.id + " tr:last")
                  .children()
                  .eq(0)
                  .text() + 1;

          let RowKey;
          let SystemID;
          if (UI.List_Modal.Table.id == "ProcessData_Table") {
            SystemID = SystemIDGenerator();
            RowKey = +localStorage.getItem("LastRowkey");
          } else if (
            UI.List_Modal.Table.id == "Condition_Table" ||
            UI.List_Modal.Table.id == "Doc_Table"
          ) {
            RowKey = +localStorage.getItem("LastRowkey");
          } else if (UI.List_Modal.Table.id == "SubTable_Table") {
            RowKey = +localStorage.getItem("CurrentRowKey");
            SystemID = localStorage.getItem("CurrentSystemID" + _pageKey);
          }

          //Set GID
          getTemporaryArray = showTable(UI);

          _ID > 1
            ? (GID =
                getTemporaryArray
                  .sort((a, b) => a.GeneralId - b.GeneralId)
                  .at(-1).GeneralId + 1)
            : (GID = _ID);

          Enabled = checkDuplicateValue(RowKey, _ID, "insert");
          if (Enabled) {
            $(`#btn-apply`).removeAttr("disabled");
            //Tbody
            let tbody = '<tr><td scope="row">' + _ID + "</td>";
            tbody += '<td scope="row" style="display:none;">' + GID + "</td >";
            if (UI.List_Modal.Table.id == "SubTable_Table")
              tbody +=
                '<td scope="row" style="display:none;">' + GID + "</td >";

            tbody +=
              '<td scope="row" style="display:none;">' + RowKey + "</td>";

            // used column for form
            if (
              UI.List_Modal.Table.id != "SubTable_Table" &&
              UI.List_Modal.Table.id != "Doc_Table" &&
              UI.List_Modal.Table.id != "Condition_Table"
            )
              tbody += `<td scope="row"></td>`;

            if (UI.List_Modal.Table.id == "ProcessData_Table")
              tbody += `<td scope="row">${SystemID}</td>`;

            for (let i in Items_Array) {
              let typpe = Items_Array[i].type;
              if (typpe == "text" || typpe == "textarea") {
                if (
                  Items_Array[i].title != "lblconditions" &&
                  Items_Array[i].title != `formula`
                ) {
                  const txt =
                    Items_Array[i].id != "item_1"
                      ? mxResources.get($("#" + Items_Array[i].id).val())
                      : $("#" + Items_Array[i].id).val();

                  $("#" + Items_Array[i].id)
                    .parent()
                    .css("display") != "none"
                    ? (tbody += '<td scope="row">' + txt + "</td>")
                    : (tbody += '<td scope="row">' + "-" + "</td>");
                }
              } else if (typpe == "dropdown" || typpe == "dropdownDynamic") {
                if (Items_Array[i].title != "executionaccess") {
                  if (
                    $("#" + Items_Array[i].id)
                      .parent()
                      .css("display") != "none"
                  ) {
                    let Arraylbl = [];
                    if (
                      Items_Array[i].id == "item_11" ||
                      Items_Array[i].id == "item_12"
                    ) {
                      const ElementArray = $("#" + Items_Array[i].id).val();
                      for (let i in ElementArray) {
                        let filter =
                          $JSON_IMPORTED.ProcessModel.RefRoles.filter(
                            (x) => x.ID == +ElementArray[i]
                          );

                        if (filter.length) {
                          filter = filter[0].Label;
                          i == 0
                            ? Arraylbl.push(filter)
                            : Arraylbl.push(" " + filter);
                        } else {
                          Arraylbl.push(mxResources.get("alluser"));
                        }
                      }
                    } else {
                      Arraylbl.push(
                        $("#" + Items_Array[i].id + " option:selected").text()
                      );
                    }
                    tbody += '<td scope="row">' + [...Arraylbl] + "</td>";
                  } else {
                    tbody += '<td scope="row">' + "-" + "</td>";
                  }
                }
              } else if (typpe == "checkbox") {
                if ($("#" + Items_Array[i].id).is(":checked")) {
                  value = `<input type="checkbox" checked style="pointer-events: none">`;
                } else {
                  value = `<input type="checkbox" style="pointer-events: none">`;
                }
                tbody += `<td scope="row">${value}</td>`;
              } else if (typpe == "file") {
                tbody += `<td scope="row"><img src="${imageUploaded_URL[0]}" style="width:50px;height:50px;" onmouseout="zoomout()" onmouseenter="zoomImg(this)"></img></td>`;
              }
            }

            tbody += Rowbtn(_ID, RowKey);
            tbody += "</tr>";

            $(`#tbody_${UI.List_Modal.Table.id}`).append(tbody);

            //add to UI.TemporaryArray

            UI.Insert(_ID, GID, RowKey, SystemID);

            //Saving Documents images in App_data

            if (_docImgArr.length) DocService(_docImgArr, "insert");

            //for edit insert row
            localStorage.setItem("CurrentRowKey", RowKey);

            localStorage.setItem("LastRowkey", RowKey + 1);

            //btn details display
            BtnDisplay(_ID, RowKey);

            //close
            $("#" + UI.Item_Modal.id).remove();
          }
        } catch (error) {
          alert(error);
        }
      }
    };

    //btn exit
    btnExit("#" + Add_Items_id, UI.Item_Modal.id);

    $(`[multiple]`).on("input", (e) => {
      let a = $(e.target).val();
      for (let i in a) {
        if (a[i] == "0") {
          $(e.target).val(["0"]);
        }
      }
    });
  }
  lastID = TableID;
}

function checkDuplicateValue(current_Id, current_GeneralID, status) {
  let list = $(`.subDiv input,select,textarea`);
  let Enabled = true;

  //check not element empty

  for (let j = 0; j < list.length; j++) {
    if (
      $(list[j]).attr("type") == "file" ||
      $(list[j]).css("display") != "inline-block"
    ) {
      if ($(list[j]).val() == "" || $(list[j]).val() == undefined) {
        if ($(list[j]).attr("type") == "file") {
          if (
            $(list[j]).next().next().text() == mxResources.get("selectFileName")
          ) {
            $($(list[j]).next().next().next()).css("border-color", "#f00");

            Enabled = false;
          } else {
            $($(list[j]).next().next().next()).css("border-color", "#ccc");
          }
        } else {
          if ($(list[j]).prop("tagName") == "SELECT") {
            if ($(list[j]).attr("id") != "item_7") {
              $(`#select2-${$(list[j]).attr("id")}-container`)
                .parent()
                .css("border-color", "#f00");

              Enabled = false;
            } else if (
              $(list[j]).attr("id") == "item_7" &&
              $(`#item_3`).val() == "Enum"
            ) {
              if ($(`#item_7`).val() == "") {
                $(`#select2-${$(list[j]).attr("id")}-container`)
                  .parent()
                  .css("border-color", "#f00");

                Enabled = false;
              }
            }
          } else {
            if (
              $(list[j]).parent().parent().parent().attr("id") ==
              "Condition_Items"
            ) {
              $(list[j]).css("border-color", "#f00");
              Enabled = false;
            } else {
              $(list[j]).css("border-color", "#f00");
              // Enabled = false;
            }
          }
        }
      } else {
        $(list[j]).css("border-color", "#ccc");
      }

      if ($(list[j]).attr("type") == "file") {
        if (
          $(list[j]).next().next().text() == mxResources.get("selectFileName")
        ) {
          $($(list[j]).next().next().next()).css("border-color", "#f00");

          Enabled = false;
        } else {
          $($(list[j]).next().next().next()).css("border-color", "#ccc");
        }
      }
      if ($(list[j]).prop("tagName") == "SELECT") {
        if ($(list[j]).attr("id") != "item_7") {
          if ($(list[j]).val() == "") {
            $(list[j]).css("border-color", "#f00");

            Enabled = false;
          }
        }
      }
    } else {
      if (
        $(list[j]).css("display") != "inline-block" &&
        $(list[j]).val() == ""
      ) {
        $(list[j]).css("border-color", "#f00");

        Enabled = false;
      }
    }
  }

  //check not repeat title duplicka
  if ($(`#item_1`).parent().parent().parent().attr("id") == "SubTable_Items") {
    UI.TemporaryArray.map((value, index) => {
      if (value.GeneralId != current_Id) {
        if ($(`#item_1`).val() != "" && value.Label == $(`#item_1`).val()) {
          Enabled = false;
          $(`#item_1`).css("border-color", "#f00");
          $(`#item_1`).val("");
          $(`#item_1`).attr("placeholder", mxResources.get("repeat_title"));
        }
      }
    });
  } else if (
    $(`#item_1`).parent().parent().parent().attr("id") == "Condition_Items"
  ) {
    UI.TemporaryArray.map((value, index) => {
      if (value.RowKey != current_Id) {
        if ($(`#item_1`).val() != "" && value.Label == $(`#item_1`).val()) {
          Enabled = false;
          $(`#item_1`).css("border-color", "#f00");
          $(`#item_1`).val("");
          $(`#item_1`).attr("placeholder", mxResources.get("repeat_title"));
        }
      }
    });
  } else {
    UI.TemporaryArray.map((value, index) => {
      if (value.RowKey != current_Id) {
        if ($(`#item_1`).val() != "" && value.Label == $(`#item_1`).val()) {
          Enabled = false;
          $(`#item_1`).css("border-color", "#f00");
          $(`#item_1`).val("");
          $(`#item_1`).attr("placeholder", mxResources.get("repeat_title"));

          //plus lastSystemID
          if (status == "insert") SystemIDGenerator();
        }
      }
    });
  }

  return Enabled;
}

function zoomImg(item) {
  const src = $(item).attr("src");
  const left = $(item).css("left");
  let top = $(item).offset().top - 205;

  const style =
    `width:100px;height:100px;display:block;position:absolute;margin:-0.7em; box-shadow: 0px 0px 16px 1px #000000;`.concat(
      `${"left"}:${left};top:${top}px;z-index:1000;`
    );

  const div = `<div class="zoomThumb" onmouseout="zoomout()" style="z-index:999999;"><img src="${src}" style="${style}"></div>`;
  $(item).parent().append(div);
}

function zoomout() {
  $(`.zoomThumb`).remove();
}

async function CRUD_component(UI, Table_id) {
  //submit
  let submit = btnSubmit("#" + Table_id, "btnPrimary");
  submit.onclick = () => {
    UI.MainArray = [];
    lastID = "";

    UI.MainArray.push(...UI.TemporaryArray);

    UI.TemporaryArray = [];

    if (_mainDocImgArray.length) {
      _mainDocImgArray.forEach((element) => {
        $.ajax({
          type: "POST",
          url: "../../App_Sys/Services/Admin/Process.asmx/FdmtGenerator",
          data: element,
          contentType: "application/json; charset=utf-8",
          async: false,
          dataType: "json",
          success: function () {
            console.log("Saved");
          },
        });
      });
    }
    _mainDocImgArray = [];

    if (UI.Item_Modal.id == "SubTable_AddItems") {
      $("#" + SubTableUI.List_Modal.id).remove();
    } else {
      $("#" + UI.List_Modal.id).remove();
    }
  };

  //apply
  if (Table_id == "Doc_Table") {
    let apply = btnApply("#" + Table_id, `${mxResources.get("apply")}`);
    apply.onclick = (e) => {
      UI.MainArray = [];

      UI.MainArray.push(...UI.TemporaryArray);

      if (_mainDocImgArray.length) {
        _mainDocImgArray.forEach((element) => {
          $.ajax({
            type: "POST",
            url: "../../App_Sys/Services/Admin/Process.asmx/FdmtGenerator",
            data: element,
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function () {
              console.log("Saved");
            },
          });
        });
      }
      _mainDocImgArray = [];

      //btn details display
      for (let i = 0; i < $(`#tbody_Doc_Table td:last-child`).length; i++)
        $(`#tbody_Doc_Table td:last-child`)[i].children[1].style.display =
          "inline-block";

      $(`.btn-primary`).prop("disabled", "disabled");
    };
  }

  //exit
  btnExit("#" + Table_id, UI.List_Modal.id);
}

function GetLabel_En_To_Fa(val, Thead) {
  Items_Array_Func();
  let item = null;
  for (let i in Items_Array) {
    if (Items_Array[i].variableExp == Thead) {
      for (let j in Items_Array[i].options) {
        if (Items_Array[i].options[j].id == val) {
          item = Items_Array[i].options[j].label;
        }
      }
    }
  }
  item ??= val;
  //for checkbox
  return (item ??= "-");
}
function GetLabel_Fa_To_En(val) {
  Items_Array_Func();
  let item = null;
  for (let i in Items_Array) {
    for (let j in Items_Array[i].options)
      if (Items_Array[i].options[j].label == val)
        item = Items_Array[i].options[j].id;
  }
  item ??= val;
  return item;
}

function BtnDisplay(_ID, _RowKey) {
  //on/of Row_Detail
  if (
    $(`#tbody_${UI.List_Modal.Table.id} tr:eq(${+_ID - 1})`)
      .children()
      .eq(6)
      .text() == mxResources.get("Table") ||
    $(`#tbody_${UI.List_Modal.Table.id} tr:eq(${+_ID - 1})`)
      .children()
      .eq(6)
      .text() == mxResources.get("SelectiveTable")
  ) {
    $(`#Row_Detail_${UI.List_Modal.Table.id}_${_ID}`).css(
      "display",
      "inline-block"
    );
  } else if (
    //on/of Row_Doc
    $(`#tbody_${UI.List_Modal.Table.id} tr:eq(${+_ID - 1})`)
      .children()
      .eq(5)
      .html()
  ) {
    if (
      $(`#tbody_${UI.List_Modal.Table.id} tr:eq(${+_ID - 1})`)
        .children()
        .eq(4)
        .html()
        .indexOf("<img") != -1
    ) {
      if (UI.MainArray.filter((x) => x.RowKey == _RowKey).length) {
        $(`#Row_Doc_${UI.List_Modal.Table.id}_${_ID}`).css(
          "display",
          "inline-block"
        );
      }
    } else {
      $(`#Row_Doc_${UI.List_Modal.Table.id}_${_ID}`).css("display", "none");
      $(`#Row_Detail_${UI.List_Modal.Table.id}_${_ID}`).css("display", "none");
    }
  }
}

//DELETE ROW
function Row_Deleted_btn(id, RowKey) {
  let _AppID = +RowKey + Math.round((500 + +_pageKey) * 10000);

  // Delete each row in mainDocImg Array
  _mainDocImgArray.forEach((element, index) => {
    if (JSON.parse(element).ID == _AppID) {
      _mainDocImgArray.splice(index, 1);
    }
  });

  let Enabled = true;
  if (
    id.split("_")[2] == "Doc" &&
    JSON.parse(localStorage.getItem("ActiveDD"))
  ) {
    Enabled = false;
    swal(`${mxResources.get("DocDuplicate")}`, {
      icon: "warning",
      buttons: {
        confirm: `${mxResources.get("ok")}`,
      },
    });
  }

  if (Enabled) {
    let tr = $("#" + id)
      .parents()
      .eq(1);
    let _UI = RefreshUIbyBTN($(tr).parents().eq(5).attr("id"));

    let isUsed = "";
    let ArrayUsed = [];

    $usedVariable.forEach((x) => {
      if (x.Rowkey == RowKey) {
        ArrayUsed.push(x);
      }
    });

    if (ArrayUsed.length) {
      for (const i in ArrayUsed) {
        isUsed +=
          "- " +
          mxResources.get(ArrayUsed[i].Type) +
          " " +
          RemoveSpaceStr(ArrayUsed[i].Label) +
          "\n";
      }
      swal(
        `${mxResources.get("usedVariable")}` +
          `
     ${isUsed}`,
        {
          icon: "warning",
          buttons: {
            confirm: `${mxResources.get("ok")}`,
          },
        }
      );
    } else {
      let label = "";
      if (
        tr.children().eq(6).text() == `${mxResources.get("Table")}` ||
        tr.children().eq(6).text() == `${mxResources.get("SelectiveTable")}`
      ) {
        label = `${mxResources.get("all")} ${mxResources.get(
          "tabledata"
        )} [ ${tr.children().eq(5).text()} ] ${mxResources.get(
          "will be deleted"
        )}`;
      } else {
        //doc or condition
        if (
          id.split("_")[0] + "_" + id.split("_")[1] + "_" + id.split("_")[2] ==
            "Row_Delete_Doc" ||
          id.split("_")[0] + "_" + id.split("_")[1] + "_" + id.split("_")[2] ==
            "Row_Delete_Condition"
        ) {
          label = `${mxResources.get("delete")} [ ${tr
            .children()
            .eq(3)
            .text()} ]`;
        } else if (
          id.split("_")[0] + "_" + id.split("_")[1] + "_" + id.split("_")[2] ==
          "Row_Delete_SubTable"
        ) {
          label = `${mxResources.get("delete")} [ ${tr
            .children()
            .eq(4)
            .text()} ]`;
        } else {
          label += `${mxResources.get("delete")} [ ${tr
            .children()
            .eq(5)
            .text()} ]`;
        }
      }

      swal({
        title: label,
        text: `${mxResources.get("areyou")}`,
        icon: "warning",
        buttons: {
          cancel: `${mxResources.get("cancel")}`,
          confirm: `${mxResources.get("ok")}`,
        },
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          let tr = $("#" + id)
            .parent()
            .parent();

          //START SORT TABLE
          let rows = $(tr).parent();
          tr.remove();
          rows = $(rows).children();

          for (let i = 1; i <= rows.length; i++) {
            //id
            $(rows[i - 1])
              .children()
              .eq(0)
              .text(i);
            //gid
            $(rows[i - 1])
              .children()
              .eq(1)
              .text(i);

            // if (
            //   _UI.TemporaryArray.filter(
            //     (x) =>
            //       x.RowKey ==
            //       $(rows[i - 1])
            //         .children()
            //         .eq(2)
            //         .text()
            //   ).length
            // ) {
            //   let filt = _UI.TemporaryArray.filter(
            //     (x) =>
            //       x.RowKey ==
            //       $(rows[i - 1])
            //         .children()
            //         .eq(2)
            //         .text()
            //   )[i - 1];

            //   if (filt != undefined) {
            // if (filt.GeneralId != undefined) filt.GeneralId = i;
            // if (filt.SubTableID != undefined) filt.SubTableID = i;
            // if (filt.DocumentID != undefined) filt.DocumentID = i;
            // }
            // }
          }

          let UIid = id.split("_")[2] + "_" + id.split("_")[3];
          let Filter;

          //remove from Array
          _UI = NEWUI_OBJVALUE(UIid);
          if (_UI.Item_Modal.id == "SubTable_AddItems") {
            if (_UI.TemporaryArray.length)
              Filter = _UI.TemporaryArray.filter(
                (x) => x.SubTableID == +tr.children().eq(2).text()
              );

            for (let i in Filter)
              _UI.TemporaryArray.splice(
                _UI.TemporaryArray.indexOf(Filter[i]),
                1
              );

            //insert col to table
            InsertColumnsTotable(
              _UI.TemporaryArray,
              localStorage.getItem("CurrentSystemID" + _pageKey)
            );
          } else {
            if (_UI.TemporaryArray.length)
              Filter = _UI.TemporaryArray.filter(
                (x) => x.RowKey == +tr.children().eq(2).text()
              );
            for (let i in Filter)
              _UI.TemporaryArray.splice(
                _UI.TemporaryArray.indexOf(Filter[i]),
                1
              );
          }

          //Delete Document File and Database
          const RowKey = +tr.children().eq(2).text();
          const DocID = +RowKey + Math.round((500 + +_pageKey) * 10000);
          $DeletedIDs.DeletedDocIDs.push(DocID);

          //btn primary Enable
          $(`:disabled`).removeAttr("disabled");
        }
      });
    }
  }
}

function RemoveSpaceStr(_str) {
  let str = _str.replaceAll("&nbsp;", " ");
  const _length = str.split("<br");

  for (let i = 0; i < _length.length - 1; i++) {
    let a = str.indexOf("<");
    let b = str.indexOf(">");
    str = str.slice(0, a) + " " + str.slice(b + 1);
  }

  return str;
}

function NEWUI_OBJVALUE(key) {
  let a = NewUI.filter((x) => Object.keys(x) == key);
  return a.length
    ? Object.values(NewUI.filter((x) => Object.keys(x) == key)[0])[0]
    : "";
}

//EDIT ROW TABLE
//Onload for edit
function Row_Edited_btn(id, RowKey, isEntity) {
  //flag

  $.ajax({
    type: "POST",
    url: "../../App_Sys/Services/Admin/Process.asmx/GetItemVisibility",
    data: JSON.stringify({ processID: _pageKey, rowKey: RowKey }),
    contentType: "application/json; charset=utf-8",
    async: false,
    dataType: "json",
    success: function (data) {
      _itemVisibilityArr = JSON.parse(data.d);
    },
    error: function (error) {
      alert(JSON.stringify(error));
    },
  });
  let Enabled = true;
  if (
    id.split("_")[2] == "Doc" &&
    JSON.parse(localStorage.getItem("ActiveDD"))
  ) {
    Enabled = false;
    swal(`${mxResources.get("DocDuplicate")}`, {
      icon: "warning",
      buttons: {
        confirm: `${mxResources.get("ok")}`,
      },
    });
  }

  if (Enabled) {
    let tr = $("#" + id)
      .parents()
      .eq(1);
    let _UI = RefreshUIbyBTN($(tr).parents().eq(5).attr("id"));
    localStorage.setItem("CurrentRowKey", RowKey);

    if (id.split("_")[2] == "ProcessData") {
      const _SystemID = $("#" + id)
        .parents()
        .eq(1)
        .children()
        .eq(4)
        .text();
      localStorage.setItem("CurrentSystemID" + _pageKey, _SystemID);
      const IconID =
        id.split("_")[0] +
        "_" +
        id.split("_")[1].replaceAll("Edit", "Doc") +
        "_" +
        id.split("_")[2] +
        "_" +
        id.split("_")[3] +
        "_" +
        id.split("_")[4];
      $(`#${IconID}`).css("display", "none");
    }

    //set table default items

    ITEM_Modal("edit", id);

    //btn primary Enable

    const trRowkey =
      id.split("_")[2] == "SubTable"
        ? tr.children().eq(3).text()
        : tr.children().eq(2).text();

    let row = _UI.TemporaryArray.filter((x) => x.RowKey == trRowkey);

    for (let i = 0; i < Items_Array.length; i++) {
      //get-set DocImg Name and Src
      //set one record from subTable
      if (id.split("_")[2] == "SubTable")
        row = row.filter((x) => x.SubTableID == +tr.children().eq(2).text());

      if (Items_Array[i].type == "checkbox") {
        let bool;
        if (Items_Array[i].id == "item_4") bool = row[0].Nullable;

        if (Items_Array[i].id == "item_8") bool = row[0].ShowInList;

        if (Items_Array[i].id == "item_13") bool = row[0].IsDefault;

        $("#" + Items_Array[i].id).prop("checked", bool);
      } else if (Items_Array[i].type == "dropdown") {
        if (Items_Array[i].id == "item_3") {
          if (
            row[0].DataType == "Table" ||
            row[0].DataType == "SelectiveTable"
          ) {
            $(`#item_13`).parent().css("display", "none");
            $(`#item_5`).val(row[0].EntityTypeID);
            $(`#item_5`).parent().css("display", "flex");
          }

          if (row[0].DataType == "Computed") {
            $(`#item_4`).parent().css("display", "none");
          }
        }

        let GetLabel_item = $("#" + Items_Array[i].id + " option").prop(
          "label"
        );
        if (GetLabel_item == mxResources.get("LocalString")) {
          if (row.length > 0) {
            if (row[0].DataType == "System") {
              $(`#item_5`).parent().css("display", "flex");
              $("#item_5").val(row[0].EntityTypeID);
            } else if (row[0].DataType == "Computed") {
              $(`#item_6`).parent().css("display", "flex");
              $(`#item_6`).val(row[0].Formula);
            } else if (row[0].DataType == "Enum") {
              $(`#item_7`).parent().css("display", "flex");
              $.ajax({
                type: "POST",

                url: "../../App_Sys/Services/Admin/Process.asmx/GetEnumTypes",

                data: "",

                contentType: false,

                dataType: "xml",

                processData: false,

                error: function (jqXHR, textStatus, errorThrown) {
                  alert(JSON.stringify(jqXHR));
                },
                success: function (data) {
                  Obj_EnumType = JSON.parse(
                    data.getElementsByTagName("string")[0].childNodes[0]
                      .nodeValue
                  );
                  if (Obj_EnumType) {
                    for (let i in Obj_EnumType)
                      $(`#item_7`).append(
                        `<option value="${Obj_EnumType[i].ID}">${Obj_EnumType[i].Label}</option>`
                      );
                    $(`#item_7`).val(row[0].EnumTypeID);
                  }
                },
              });
            }

            $("#" + Items_Array[i].id).val(row[0].DataType);
          }
        } else if (GetLabel_item == mxResources.get("Single")) {
          if (
            tr.children().eq(6).text() == mxResources.get("Table") ||
            tr.children().eq(6).text() == mxResources.get("SelectiveTable")
          ) {
            let opt = $("#" + Items_Array[i].id + " option");
            for (let i in opt) opt.remove();
            $("#" + Items_Array[i].id).append(
              `<option value="List"> ${mxResources.get("List")}</option>`
            );
          } else {
            if (
              mxResources.get(tr.children().eq(6).text()) == "Enum" ||
              mxResources.get(tr.children().eq(6).text()) == "System"
            ) {
              let opt = $("#" + Items_Array[i].id + " option");
              for (let i in opt) opt.remove();
              $("#" + Items_Array[i].id).append(
                `<option value="Single"> ${mxResources.get(
                  "Single"
                )}</option>` +
                  `<option value="Array"> ${mxResources.get("Array")}</option>`
              );

              $("#" + Items_Array[i].id).val(row[0].InputCount);
            } else {
              $("#" + Items_Array[i].id).val(row[0].InputCount);
            }
          }
        } else {
          if ($(`#item_8`).parent().css("display") == "flex")
            $(`#item_8`).val(row[0].StateID);

          if ($(`#item_9`).parent().css("display") == "flex") {
            $(`#item_9`).val(row[0].Access);
          }

          if ($(`#item_10`).parent().css("display") == "flex")
            $(`#item_10`).val(row[0].ActivityID);

          // if ($(`#item_11`).parent().css("display") == "flex")
          //   $("#item_11").val(...row[0].ViewAccessID);

          // if ($(`#item_12`).parent().css("display") == "flex")
          //   $("#item_12").val(...row[0].DownloadAccessID);
        }
        if (GetLabel_item == "A4") $(`#item_4`).val(row[0].ImgSize);
      } else if (Items_Array[i].type == "dropdownDynamic") {
        const currentval =
          id.split("_")[2] == "SubTable"
            ? tr.children().eq(5).text()
            : tr.children().eq(4).text();
        let value = Elements_except_Connections().filter(
          (x) => x.value == currentval
        );
        if (value[0] != undefined) {
          if (value[0].id != undefined)
            $(`#${Items_Array[i].id}`).val(value[0].id);
        }
      } else if (Items_Array[i].type == "file") {
        value = tr
          .children()
          .eq(4)
          .html()
          .replaceAll("<img", "")
          .replaceAll('src="', "")
          .replaceAll(
            '" style="width:50px;height:50px;" onmouseout="zoomout()" onmouseenter="zoomImg(this)">',
            ""
          );
        $(`#ImgBrowser`).attr("src", value);

        let warningstar = $("<span>").text("*");
        warningstar.css("color", "rgb(240, 124, 58)");
        $("#FileBrowser").prev().addBack().append(warningstar);

        let warningLabel = $("<label>")
          .attr("for", "ImgBrowser")
          .text("* درصورت بارگذاری فایل جدید مستندات طراحی شده پاک میشوند.");
        warningLabel.css({
          color: "rgb(240, 124, 58)",
          "font-weight": "bold",
          padding: "5px 28px",
        });
        $("#FileBrowserLbl").parent().parent().append(warningLabel);

        imageUploaded_URL = [];
        imageUploaded_URL.push(row[0].ImgSrc);
        imageUploaded_URL.push(row[0].ImgName);
        $(`#FileBrowserLbl1`).text(row[0].ImgName);
      } else {
        if (Items_Array[i].type == "textarea") {
          if (row[0]) {
            if (row[0].Conditions) {
              $("#" + Items_Array[i].id).text(row[0].Conditions);
            } else if (row[0].Details) {
              $("#" + Items_Array[i].id).text(row[0].Details);
            } else if (row[0].Formula) {
              $("#" + Items_Array[i].id).text(row[0].Formula);
            }
          }
        } else {
          $("#" + Items_Array[i].id).val(row[0].Label);
        }
      }
    }
    $(`.dropDown`).select2();
    $(`.dropdownDynamic`).select2();
    $(`.select2-container`).css("position", "revert");

    let ArrayUsed = [];

    $usedVariable.forEach((x) => {
      if (x.Rowkey == RowKey) {
        ArrayUsed.push(x);
      }
    });

    if (ArrayUsed.length || isEntity) {
      $(
        "#ProcessData_Items input[type=text], input[type=number], textarea, select"
      ).attr("disabled", true);
      $(
        "#SubTable_Items input[type=text], input[type=number], textarea, select"
      ).attr("disabled", true);
    }
  }
}

function usedForm(elem) {
  let objArray = [];
  let id = $(elem)
    .parent()
    .parent()
    .parent()
    .attr("id")
    .replaceAll("tbody_", "");
  let RowKey = $(elem).parent().prev().text();

  $usedVariable.forEach((x) => {
    if (x.Rowkey == RowKey) {
      objArray.push(x);
    }
  });

  let Label = "";

  if (objArray.length) {
    for (const i in objArray) {
      Label +=
        "- " +
        mxResources.get(objArray[i].Type) +
        " " +
        (objArray[i].Label == ""
          ? objArray[i].ID
          : objArray[i].Label.replaceAll("&nbsp;", "").replaceAll(
              "<br>",
              " "
            )) +
        "\n";
    }
    swal(
      `${mxResources.get("usedVariable")}` +
        `
     ${Label}`,
      {
        icon: "warning",
        buttons: {
          confirm: `${mxResources.get("ok")}`,
        },
      }
    );
  }
}

function Row_Detail_btn(id) {
  //Set RowKey to localStorage
  let EntityID;
  let _SystemID = $($(`#${id}`).parents().eq(1))
    .children()
    .eq(4)[0].innerText;
  let _RowKey = $($(`#${id}`).parents().eq(1))
    .children()
    .eq(2)[0].innerText;
  localStorage.setItem("CurrentRowKey", _RowKey);
  localStorage.setItem("CurrentSystemID" + _pageKey, _SystemID);

  localStorage.setItem("FieldType", "SubTable");
  if ($JSON_IMPORTED != "") {
    let _Variable = VariableUI.TemporaryArray;
    if (_Variable.length) {
      let _var = _Variable.find(CheckObj);
      function CheckObj(obj) {
        return (
          (obj.InputType == "Table" || obj.InputType == "SelectiveTable") &&
          obj.SystemID == _SystemID
        );
      }
      EntityID = _var == undefined ? 0 : _var.EntityTypeID;
      SubTableUI.MainArray = _var == undefined ? [] : _var.Columns;
    }
  }

  Sub_Table(SubTableUI, _RowKey, EntityID);
}

function Row_Doc_btn(id) {
  //prevent duplicate Doc tab
  if (
    !JSON.parse(localStorage.getItem("ActiveDD")) ||
    localStorage.getItem("ActiveDD") == undefined
  ) {
    const RowKey = $($(`#${id}`).parent().parent())
      .children()
      .eq(2)[0].innerText;
    const docLabel = $($(`#${id}`).parent().parent())
      .children()
      .eq(3)[0].innerText;

    localStorage.setItem("docLabel" + RowKey, docLabel);

    saveDesign(false);

    let jsonData = UI.TemporaryArray;
    // Setting localStorage item with concatenated key
    localStorage.setItem("Documents" + _pageKey, JSON.stringify(jsonData));

    localStorage.setItem("CurrentRowKey", +RowKey);

    const _id = +RowKey + Math.round((500 + +_pageKey) * 10000);

    window.open(`../App_Dgr/DocumentDesigner.aspx?id=${_id}`, "_blank");
  } else {
    swal(`${mxResources.get("DocDuplicate")}`, {
      icon: "warning",
      buttons: {
        confirm: `${mxResources.get("ok")}`,
      },
    });
  }

  //APPLY
  UI.MainArray = [];

  UI.MainArray.push(...UI.TemporaryArray);

  if (_mainDocImgArray.length) {
    _mainDocImgArray.forEach((element) => {
      $.ajax({
        type: "POST",
        url: "../../App_Sys/Services/Admin/Process.asmx/FdmtGenerator",
        data: element,
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function () {
          console.log("Saved");
        },
      });
    });
  }
  _mainDocImgArray = [];

  //btn details display
  for (let i = 0; i < $(`#tbody_Doc_Table td:last-child`).length; i++)
    $(`#tbody_Doc_Table td:last-child`)[i].children[1].style.display =
      "inline-block";

  // $(`.btn-primary`).prop("disabled", "disabled");
}

function Labels(item) {
  return (
    '<label  class="lbl" style="margin:5px 2px 0px 2px;' +
    item.label.style +
    `" for="${item.id}">` +
    mxResources.get(item.title) +
    "</label>"
  );
}
function TextBox(item) {
  return (
    '<div class="rowTable">' +
    Labels(item) +
    '<input id="' +
    item.id +
    '" class="' +
    item.class +
    '" type="' +
    item.type +
    '" style="' +
    item.style +
    '" ></input></div>'
  );
}
function Textarea(item) {
  let textarea =
    `<div class="rowTable" style="${
      item.id == "item_6" ? "display:none" : "display:flex"
    }">` +
    Labels(item) +
    '<textarea  id="' +
    item.id +
    '" class="' +
    item.class +
    '" type="' +
    item.type +
    '" style="' +
    item.style +
    `" ></textarea>`;

  if (item.variableExp == "Conditions")
    textarea += `<button id="areaEx" onclick="AreaEX()" style="cursor:pointer;color:#000;padding:5px;" class="btn btn-light fa fa-plus" aria-hidden="true"></button>`;

  textarea += `</div>`;
  if (item.id == "item_3" && item.title == "lblconditions")
    textarea += `<div id = "conditionExample">Ex: [Valxxx] = N'value'</div>`;
  return textarea;
}

function AreaEX() {
  //todo
  let div = `
  <div id="Exmodal" class="modal" style="display:block">
    <div class="modal-content" style="top:30px;padding:10px 20px;width:1000px;">
      <div id="Title" style="font-weight: 600px;font-size:14px;">
        ${mxResources.get("addRules")}
      </div>
      <hr style="margin-bottom:10px;border-top:2px solid #ccc;margin-top:5px">
  
      <div class="col-md-5" style="padding: 10px;border: 1px solid #d5d5d5;border-radius: 2px;height: 259px;margin-top: 15px;margin-right: 33px;">
        <div id="divlblEX1">
          <label style="font-size: 14px; font-weight: bold;">
            ${mxResources.get("CreateRules")}
          </label>
        </div>
        <div style="display:flex;align-items: center">
          <label style="margin:10px 2px;">
            ${mxResources.get("variable")}
          </label>
          <select id="Ex1" class="select" style="width: 295px !important;"></select>
        </div>
        <div id="datavalue" style="display:none;align-items: center"></div>
        <div style="display:flex;align-items: center">
          <label style="margin:10px 2px;">
            ${mxResources.get("Operators")}
          </label>
          <select id="ExOperator" class="select" style="width: 295px !important;">
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>
        <div style="display:flex;align-items: center" class="row">
          <label style="margin:10px 2px;width: 105px" for="NOT">
            NOT
          </label>
          <input id="NOT" type="checkbox" />
        </div>
       
      </div>
  
      <div class="col-md-1" style="padding: 10px;height: 259px;margin-top: 15px;display: flex;align-items: center;justify-content: center">
          <i id="btnAddEX" class="fa-regular fa-right-to-bracket" style="cursor: pointer;transform: rotate(180deg);height:20px;"  onclick="AddtolistEX()" ></i>
      </div>

      <div class="pull-left col-md-5">
        <i id="ExClear" onclick="ExClear()">پاک کردن</i>
        <textarea id="listEX" class="ExConditionstxtArea"></textarea>
      </div>
  
      <div style="box-sizing: border-box;border-top: 1px solid #ccc;padding-top: 9px;margin-top: 20px;height: 50px;bottom: 0px;display: inline-table;width: 100%;">
        <button id="btnExPrim" class="btn btn-primary btn_submint_exit" onclick="ExSubmit()">
          ${mxResources.get("btnPrimary")}
        </button>
        <button id="btnPExcancel" class="btn btn-light btn_submint_exit" onclick="EXExit()" style="margin:0px 5px;">
          ${mxResources.get("btnCancel")}
        </button>
      </div>
    </div>
  </div>`;

  $(`body`).append(div);

  $(`#listEX`).val($(`#item_3`).val());

  // set dropdown options variables
  let _Options = "";

  VariableUI.MainArray.map((value) => {
    if (
      value.DataType != "File" &&
      value.DataType != "Image" &&
      value.DataType != "Computed" &&
      value.DataType != "System" &&
      value.DataType != "Table" &&
      value.DataType != "SelectiveTable"
    ) {
      _Options += `<option value="${value.SystemID}">${mxResources.get(
        value.Label
      )}</option>`;
    }
  });

  $(`#Ex1`).append(_Options);

  //default value
  EXdataValue($(`#Ex1`).val());

  $(`.select`).select2();

  $(`#Ex1`).on("change", (e) => {
    EXdataValue($(e.target).val());
  });
}

function EXdataValue(systemid) {
  $(`#datavalue`).empty();

  $(`#datavalue`).append(
    `<label  class="" style="margin:10px 2px;">${mxResources.get(
      "dataValue"
    )}</label>`
  );

  let item = VariableUI.MainArray.filter((x) => x.SystemID == systemid);

  if (item.length) {
    $(`#datavalue`).css("display", "flex");

    if (item[0].DataType == "Enum") {
      let _rowKey = item[0].RowKey;

      let EnumTypeID;
      $.ajax({
        type: "POST",

        url: "../../App_Sys/Services/Admin/Process.asmx/GetFlowVariables",

        data: `{"rowkey":"${_rowKey}","processid":"${_pageKey}"}`,

        contentType: "application/json; charset=utf-8",

        async: false,

        dataType: "json",

        processData: false,

        error: function (jqXHR, textStatus, errorThrown) {
          alert(JSON.stringify(jqXHR));
        },
        success: function (data) {
          EnumTypeID = JSON.parse(data.d);
        },
      });

      let Enum;
      $.ajax({
        type: "POST",

        url: "../../App_Sys/Services/Admin/Process.asmx/GetEnums",

        data: `{"enumTypeId":"${EnumTypeID[0].ID}"}`,

        contentType: "application/json; charset=utf-8",

        async: false,

        dataType: "json",

        processData: false,

        error: function (jqXHR, textStatus, errorThrown) {
          alert(JSON.stringify(jqXHR));
        },

        success: function (data) {
          Enum = JSON.parse(data.d);
        },
      });

      if (Enum.length) {
        try {
          _Options = "";
          for (let i = 0; i < Enum.length; i++) {
            _Options += `<option value="${Enum[i].Label}">${Enum[i].Label}</option>`;
          }
        } finally {
          $(`#datavalue`).append(
            `<select id="Ex2" class="select" style="width: 295px !important">${_Options}</select>`
          );
        }
      } else {
        $(`#datavalue`).append(
          `<select id="Ex2" class="select" style="width: 295px !important"></select>`
        );
      }

      $(`.select`).select2();
    } else if (item[0].DataType == "Text") {
      $(`#datavalue`).append(
        `<textarea id="Ex2" class="ExConditions"></textarea>`
      );
    } else if (
      item[0].DataType == "Integer" ||
      item[0].DataType == "BigInteger"
    ) {
      $(`#datavalue`).append(
        `<input id="Ex2" type="number" class="ExConditions"></input>`
      );
    } else if (
      item[0].DataType == "LocalString" ||
      item[0].DataType == "String"
    ) {
      $(`#datavalue`).append(
        `<input id="Ex2" type="text" class="ExConditions"></input>`
      );
    } else if (item[0].DataType == "Time") {
      $(`#datavalue`).append(
        `<input id="Ex2" type="time" class="ExConditions"></input>`
      );
    } else if (item[0].DataType == "Date") {
      $(`#datavalue`).append(
        `<input id="Ex2" type="date" class="ExConditions"></input>`
      );
    } else if (item[0].DataType == "DateTime") {
      $(`#datavalue`).append(
        `<input id="Ex2" type="datetime-local" class="ExConditions"></input>`
      );
    } else if (item[0].DataType == "Boolean") {
      $(`#datavalue`).append(
        `<input id="Ex2" type="checkbox" class="ExConditions ExConditionsChecbox"></input>`
      );
    } else if (item[0].DataType == "Money") {
      $(`#datavalue`).append(
        `<input id="Ex2" type="number" min="1" step="any" class="ExConditions"></input>`
      );
    } else {
      $(`#datavalue`).append(
        `<input id="Ex2" type="text" class="ExConditions"></input>`
      );
    }
  }
}

function AddtolistEX() {
  let systemid = $(`#Ex1`).val();
  let value;
  if ($(`#Ex2`).attr("type") == "checkbox") {
    value = $(`#Ex2`).is(":checked");
  } else {
    value = $(`#Ex2`).val();
  }

  let listEx = $(`#listEX`).val();

  if (listEx == "") {
    $("#NOT").prop("checked")
      ? $(`#listEX`).val(`NOT ([${systemid}]=N'${value}')`)
      : $(`#listEX`).val(`[${systemid}]=N'${value}'`);
  } else {
    $("#NOT").prop("checked")
      ? (listEx +=
          " " +
          $(`#ExOperator`).val() +
          " NOT  (" +
          `[${systemid}]=N'${value}')`)
      : (listEx +=
          " " + $(`#ExOperator`).val() + " " + `[${systemid}]=N'${value}'`);

    $(`#listEX`).val(listEx);
  }
  $("#NOT").prop("checked", false);
}

function ExClear() {
  $(`#listEX`).val("");
}
function ExSubmit() {
  $(`#item_3`).val($(`#listEX`).val());

  EXExit();
}

function EXExit() {
  $(`#Exmodal`).remove();
}

function CheckBox(item) {
  return (
    '<div class="rowTable">' +
    Labels(item) +
    '<input id="' +
    item.id +
    '" class="' +
    item.class +
    '" type="' +
    item.type +
    '" style="' +
    item.style +
    '" ></input></div>'
  );
}

function DropDown(item) {
  let obj = $JSON_IMPORTED.ProcessModel;
  if (item.id == "item_5") {
    if (obj) {
      item.options = [];
      item.options.push({ id: "0", label: "هیچکدام" });
      for (let i in obj.EntityTypes) {
        item.options.push({
          id: obj.EntityTypes[i].ID,
          label: obj.EntityTypes[i].Label,
        });
      }
    }
  } else if (item.id == "item_8") {
    if (obj) {
      item.options = [];
      for (let i in obj.FlowStates) {
        item.options.push({
          id: obj.FlowStates[i].ID,
          label: obj.FlowStates[i].Label,
        });
      }
    }
  } else if (
    item.id == "item_9" ||
    item.id == "item_11" ||
    item.id == "item_12"
  ) {
    if (obj) {
      item.options = [{ id: 0, label: mxResources.get("alluser") }];
      for (let i in obj.RefRoles) {
        item.options.push({
          id: obj.RefRoles[i].ID,
          label: obj.RefRoles[i].Label,
        });
      }
    }
  } else if (item.id == "item_10") {
    if (obj) {
      let userTasks = getAllUserTask();
      item.options = [];
      for (let i = 1; i < userTasks.length; i++) {
        //Start filling drop down from second item in array
        item.options.push({
          id: +userTasks[i].id + (500 + +_pageKey) * 10000,
          label:
            userTasks[i].value == ""
              ? mxResources.get("valueisempty")
              : userTasks[i].value
                  .replaceAll("<br>", " ")
                  .replaceAll("&nbsp;", " "),
        });
      }

      // Add last level to drop down
      item.options.push({
        id: 0,
        label: mxResources.get("lastlevel"),
      });
    }
  }

  //system variable hide
  let select = `<div class="rowTable" style="${
    item.id == "item_5" || item.id == "item_7" ? "display:none" : "display:flex"
  };">${Labels(item)}<select id="${item.id}" class="${item.class}"  ${
    item.id == "item_11" || item.id == "item_12" || item.id == "item_9"
      ? (multiple = "multiple")
      : ""
  } style="${item.style}" onchange="selectOpt(id)">`;

  //set dropdown options
  item.options.map((value) => {
    if (value.id != "List" && value.id != "Array") {
      select += `<option value="${value.id}">${mxResources.get(
        value.label
      )}</option>`;
    }
  });

  select += "</select>";
  if (item.id == "item_7")
    select +=
      '<button id="btn_7" class="btn btn-light fa fa-plus" onclick="Enum_addItem()" style="padding: 5px;color: #000;"></button>';

  select += "</div>";
  return select;
}

function Enum_addItem() {
  //get default value syslbl
  let lastid = +$(`#item_7 option:last-child`).val();
  lastid = lastid >= 11000 ? lastid - 11000 + 1 : lastid + 1;

  const syslblValue = "Type " + lastid;
  let div =
    '<div id="EnumModal" class="modal" >' +
    '<div id="modalEnumform" class="modal-content" style="top:20px;width:615px;padding:20px">' +
    "</div></div>";
  $("#item_7").parent().parent().parent().append(div);

  $("#EnumModal").css("display", "block");
  $("#modalEnumform").css("width", "500px");

  let item = "";
  item += `<div id="Title" style="font-weight: 600px;font-size:14px;">${mxResources.get(
    "addEnumList"
  )}</div>`;
  item += `<hr style="margin-bottom:10px;border-Top:2px solid #ccc;margin-top:5px">`;
  item += `<label class="lblPopup lbl" style="display: block;width: auto;font: 14px var(--mainFont);padding:0;margin-bottom: 0px;">${mxResources.get(
    "systemLabel"
  )}</label>`;
  item += `<div class="input-group" ><input id="syslbl" type="text" class="txtPopup" style="border-radius: 0px;" value="${syslblValue}" onkeypress="return ValidateKey(event)"></div>`;
  item += `<small style="display: block;font-size: 80%; margin-top: 5px;" class="text-muted">English characters</small>`;
  item += `<label class="lblPopup lbl" style="display: block;width: auto;margin-top:15px;font: 14px var(--mainFont);padding:0;margin-bottom: 0px;">${mxResources.get(
    "dataLabel"
  )}</label>`;
  item += `<div class="input-group"><input id="datalbl"  type="text" class="txtPopup" style="border-radius: 0px;"></div>`;

  item += `<div style="border-top: 1px solid #ccc;padding-top: 5px;margin-top:45px;"><button id="btnPopup"  class="btn btn-primary btn_submint_exit" onclick="EnumSubmit()">${mxResources.get(
    "btnPrimary"
  )}</button>`;
  item += `<button id="btnPopup1" class="btn btn-light btn_submint_exit" onclick="EnumExit()" style="margin:0px 5px;">${mxResources.get(
    "btnCancel"
  )}</button> </div>`;
  $(`#modalEnumform`).append(item);
  $(`#input1`).focus();
}

function EnumSubmit() {
  //Add to prc_enumType and Get last ID
  var _data = new FormData();
  _data.append(
    "design",
    JSON.stringify({ ELabel: $(`#syslbl`).val(), Label: $(`#datalbl`).val() })
  );
  $.ajax({
    type: "POST",

    url: "../../App_Sys/Services/Admin/Process.asmx/EditEnumType",

    data: _data,

    contentType: false,

    dataType: "xml",

    processData: false,

    error: function (jqXHR, textStatus, errorThrown) {
      alert(JSON.stringify(jqXHR));
    },
    success: function (data) {
      let _LastOBJ = JSON.parse(
        data.getElementsByTagName("string")[0].childNodes[0].nodeValue
      )[0];

      $(`#item_7`).append(
        `<option value="${_LastOBJ.ID}">${_LastOBJ.Label}</option>`
      );
      $(`#item_7`).val(_LastOBJ.ID);

      //enum list in ui updated
      Obj_EnumType.push({ ID: _LastOBJ.ID, Label: _LastOBJ.Label });
    },
  });

  EnumExit();
}

function EnumExit() {
  $("#EnumModal").remove();
}

function selectOpt(id) {
  if (
    id != "item_2" &&
    id != "item_8" &&
    id != "item_9" &&
    id != "item_7" &&
    id != "item_5"
  ) {
    if ($(`#${id}`).val() == "Table" || $(`#${id}`).val() == "SelectiveTable") {
      $(`#item_5`).parent().css("display", "flex");
      $(`#item_6`).parent().css("display", "none");
      $(`#item_7`).parent().css("display", "none");
      $(`#item_13`).parent().css("display", "none");
      $(`#item_4`).parent().css("display", "none");
    } else if ($(`#${id}`).val() == "System") {
      $(`#item_5`).parent().css("display", "flex");
      $(`#item_13`).parent().css("display", "flex");
      $(`#item_4`).parent().css("display", "flex");
      $(`#item_6`).parent().css("display", "none");
      $(`#item_7`).parent().css("display", "none");
      $(`#item_5`).val(1);
    } else if ($(`#${id}`).val() == "Computed") {
      $(`#item_6`).parent().css("display", "flex");
      $(`#item_13`).parent().css("display", "flex");
      $(`#item_7`).parent().css("display", "none");
      $(`#item_5`).parent().css("display", "none");
      $(`#item_4`).parent().css("display", "none");
    } else if ($(`#${id}`).val() == "Enum") {
      $(`#item_7`).parent().css("display", "flex");
      $(`#item_13`).parent().css("display", "flex");
      $(`#item_4`).parent().css("display", "flex");
      $(`#item_5`).parent().css("display", "none");
      $(`#item_6`).parent().css("display", "none");
      $(`#item_7`).val(1);
    } else {
      $(`#item_5`).parent().css("display", "none");
      $(`#item_13`).parent().css("display", "flex");
      $(`#item_4`).parent().css("display", "flex");
      $(`#item_6`).parent().css("display", "none");
      $(`#item_7`).parent().css("display", "none");
    }

    if (
      $(`#item_3`).val() == "Table" ||
      $(`#item_3`).val() == "SelectiveTable"
    ) {
      $(`#item_2 option`).remove();
      $(`#item_2`).append(
        `<option value="List">${mxResources.get("List")}</option>`
      );
    } else {
      $(`#item_2 option`).remove();
      if ($(`#item_3`).val() == "Enum" || $(`#item_3`).val() == "System") {
        if ($(`#item_3`).val() == "Enum") {
          $.ajax({
            type: "POST",

            url: "../../App_Sys/Services/Admin/Process.asmx/GetEnumTypes",

            data: "",

            contentType: false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {
              alert(JSON.stringify(jqXHR));
            },
            success: function (data) {
              Obj_EnumType = JSON.parse(
                data.getElementsByTagName("string")[0].childNodes[0].nodeValue
              );
              if (Obj_EnumType) {
                for (let i in Obj_EnumType)
                  $(`#item_7`).append(
                    `<option value="${Obj_EnumType[i].ID}">${Obj_EnumType[i].Label}</option>`
                  );
              }
              $(`#item_7`).val(1);
            },
          });
        }
        $(`#item_2`).append(
          `<option value="Single">${mxResources.get("Single")}</option>` +
            `<option value="Array">${mxResources.get("Array")}</option>`
        );
      } else {
        $(`#item_2`).append(
          `<option value="Single">${mxResources.get("Single")}</option>`
        );
      }
    }
  }
  $(`.dropDown`).select2();
  $(`.dropdownDynamic`).select2();
  $(`.select2-container`).css("position", "revert");
}

function DropDownDynamic(item) {
  let select = `<div class="rowTable">${Labels(item)}<select id="${
    item.id
  }" class="${item.class}" style="${
    item.style
  }" onchange = "conditionClear()">`;
  let opt = OptionDynamic();

  opt.map(
    (value) =>
      (select += `<option value="${value.id}">${RemoveSpaceStr(
        value.label
      )}</option>`)
  );
  select += "</select></div>";
  return select;
}

function conditionClear() {
  $(`#item_3`).val("");
}
function FileBox(item) {
  return (
    `<div class="rowTable">${Labels(item)}<input type="${
      item.type
    }" id="FileBrowser" style="display:none;text-align: center;margin: auto;" onchange="imageUploaded()" accept=".jpg,.png,.pdf"/>` +
    `<button id="FileBrowserBtn" onclick="">${mxResources.get(
      "selectFile"
    )}</button><label id="FileBrowserLbl1" style="width:45%">${mxResources.get(
      "selectFileName"
    )}</label><label id="FileBrowserLbl" for="FileBrowser" class="${
      item.class
    }" style="${item.style} "></label><img id="ImgBrowser" src="${
      imageUploaded_URL.length
        ? imageUploaded_URL[0]
        : "data:image/jpg;base64,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"
    }" onmouseout="zoomout()" onmouseenter="zoomImg(this)"></img></div>`
  );
}

// save img src and id
var imageUploaded_URL = [];

function imageUploaded() {
  let file = document.getElementById("FileBrowser").files[0];
  if (file) {
    let reader = new FileReader();
    imageUploaded_URL = [];
    reader.onload = function (e) {
      if (file.type === "application/pdf") {
        convertToBase64(file)
          .then((result) => {
            imageUploaded_URL.push(result[0].Value);
            imageUploaded_URL.push(file.name);
            $("#ImgBrowser").attr("src", imageUploaded_URL[0]);

            _docImgArr = result;
          })
          .catch((error) => {
            console.error("Error converting to base64:", error);
          });
      } else {
        imageUploaded_URL.push(reader.result);
        imageUploaded_URL.push(file.name);
        _docImgArr = [{ ID: "1", Value: reader.result }];
        $("#ImgBrowser").attr("src", imageUploaded_URL[0]);
      }
    };

    reader.readAsDataURL(file);
    $(`#FileBrowserLbl1`).text(file.name);
  }
}

//Ajax function to save images Base64 codes

function DocService(imgArr, state) {
  let tempArr = [];

  for (let i = 0; i < imgArr.length; i++) {
    tempArr.push(`{ID:${imgArr[i].ID}, Value : ${imgArr[i].Value}}`);
  }

  const RowKey =
    state == "insert"
      ? localStorage.getItem("LastRowkey")
      : localStorage.getItem("CurrentRowKey");
  const _ID = +RowKey + Math.round((500 + +_pageKey) * 10000);

  _mainDocImgArray.push(`{"ID":${_ID},"Value":"[${tempArr}]"}`);
  _docImgArr = [];
  imgArr = [];
  tempArr = [];
}

//Converting Pdf to base64 code
async function convertToBase64(file, scale = 2) {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const imagesData = [];

  const totalPages = pdf.numPages;
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const imageDataURL = await convertPageToBase64(page, scale);
    imagesData.push({ ID: pageNum, Value: imageDataURL });
  }

  return imagesData;
}

async function convertPageToBase64(page, scale = 1) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };
  await page.render(renderContext).promise;
  return canvas.toDataURL("image/jpeg");
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      resolve(e.target.result);
    };
    fileReader.onerror = function (error) {
      reject(error);
    };
    fileReader.readAsArrayBuffer(file);
  });
}

function btnSubmit(par, text) {
  let btn = document.createElement("button");
  btn.className = "btn btn-primary btn_submint_exit";
  btn.innerText = mxResources.get(`${text}`);
  $(par).append(btn);
  return btn;
}
function btnApply(par) {
  let btn = document.createElement("button");
  btn.className = "btn btn-primary btn_submint_exit btn-apply";
  btn.setAttribute("id", "btn-apply");
  btn.setAttribute("disabled", "disabled");
  btn.setAttribute("changeLang", "apply");
  $(par).append(btn);
  return btn;
}

function btnExit(par, closeId) {
  let btnEx = document.createElement("button");
  btnEx.className = "btn btn-light btn_submint_exit";
  btnEx.innerText = mxResources.get("btnExit");
  btnEx.addEventListener("click", async (e) => {
    if (
      closeId != "Condition_AddItems" &&
      closeId != "Doc_AddItems" &&
      closeId != "ProcessData_AddItems" &&
      closeId != "SubTable_AddItems"
    ) {
      //Refresh UI
      if ($(e.target).parent().parent().attr("id") == "ProcessData_AddTable") {
        UI = VariableUI;
      } else if (
        $(e.target).parent().parent().attr("id") == "SubTable_AddTable"
      ) {
        UI = SubTableUI;
      } else if ($(e.target).parent().parent().attr("id") == "Doc_AddTable") {
        UI = DocumentUI;
      } else if (
        $(e.target).parent().parent().attr("id") == "Condition_AddTable"
      ) {
        UI = Conditions;
      }
      if (JSON.stringify(UI.MainArray) != JSON.stringify(UI.TemporaryArray)) {
        swal({
          title: `${mxResources.get("Unsaved changes")}`,
          text: `${mxResources.get("Do you want to save the changes")}`,
          icon: "warning",
          buttons: {
            cancel: `${mxResources.get("cancel")}`,
            confirm: `${mxResources.get("ok")}`,
          },
          dangerMode: true,
        }).then((willinsert) => {
          if (willinsert) {
            if (
              $(`#` + closeId)
                .children()
                .eq(0)
                .attr("id") == "ProcessData_Table" ||
              closeId == "SubTable_AddTable" ||
              closeId == "Doc_AddTable" ||
              closeId == "Condition_AddTable"
            )
              UI.MainArray = UI.TemporaryArray;

            $("#" + closeId).remove();
            UI.TemporaryArray = [];
          } else {
            lastID = "";
            $(`#` + closeId).remove();
          }
        });
      } else {
        lastID = "";
        $(`#` + closeId).remove();
      }
    } else {
      lastID = "";
      $(`#` + closeId).remove();
    }
  });

  $(par).append(btnEx);

  return btnEx;
}

//btn delete & edit
function Rowbtn(id, RowKey, isEntity) {
  let rowbtn = "";

  if ($("#SubTable_Table .entityBtn").length > 0) {
    isEntity = true;
  }

  if (isEntity) {
    rowbtn =
      '<td scope="row" style="text-align: center;">' +
      `<span id="Row_Edit_${
        UI.List_Modal.Table.id
      }_${id}" class=" glyphicon glyphicon-edit" onclick="Row_Edited_btn(id,${RowKey},true)" title="${mxResources.get(
        "edit"
      )}"></span>` +
      `</td>`;
  } else {
    rowbtn =
      '<td scope="row" >' +
      `<span id="Row_Detail_${
        UI.List_Modal.Table.id
      }_${id}" style="display:none;margin:0px 5px" onclick="Row_Detail_btn(id,${RowKey})" title="${mxResources.get(
        "tableDesign"
      )}">` +
      `<img src="data:image/png;base64,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" style="width:24px;height:20px;position:relative;top:-4px;cursor: pointer;"></span>` +
      `<span id="Row_Doc_${
        UI.List_Modal.Table.id
      }_${id}" style="display:none;margin:0px 5px" onclick="Row_Doc_btn(id)" title="${mxResources.get(
        "DocDesigner"
      )}">` +
      `<img src="data:image/png;base64,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" style="width:24px;height:20px;position:relative;top:-4px;cursor: pointer;"></span>` +
      `<span id="Row_Edit_${
        UI.List_Modal.Table.id
      }_${id}" class=" glyphicon glyphicon-edit" onclick="Row_Edited_btn(id,${RowKey})" title="${mxResources.get(
        "edit"
      )}"></span>` +
      `<span id="Row_Delete_${
        UI.List_Modal.Table.id
      }_${id}" class=" glyphicon glyphicon-trash" onclick="Row_Deleted_btn(id,${RowKey})" title="${mxResources.get(
        "delete"
      )}"></span>` +
      `</td>`;
  }

  return rowbtn;
}

function getAllUserTask() {
  //Get All UserTask
  let cells = getGraphChildCells();
  let AllUserTask = [];
  cells.map((index) => getUserTask(index));

  function getUserTask(obj) {
    if (obj.children) {
      for (const i in obj.children)
        getType(obj.style) == "UserTask"
          ? AllUserTask.push(obj)
          : getUserTask(obj.children[i]);
    } else {
      if (getType(obj.style) == "UserTask") AllUserTask.push(obj);
    }
  }

  return AllUserTask;
}
function getAllExclusiveGateway() {
  //Get All UserTask
  let cells = getGraphChildCells();
  let AllExclusiveGateway = [];
  cells.map((index) => getExclusive(index));

  function getExclusive(obj) {
    if (obj.children) {
      for (const i in obj.children)
        getType(obj.style) == "Exclusive Gateway" ||
        (getType(obj.style) == "Inclusive Gateway" &&
          obj.id != +localStorage.getItem("Gateway"))
          ? AllExclusiveGateway.push(obj)
          : getExclusive(obj.children[i]);
    }
  }

  return AllExclusiveGateway;
}

function getAllEndEvent() {
  //Get All EndEvent
  let cells = getGraphChildCells();
  let AllEndEvent = [];
  cells.map((index) => getEndEvent(index));

  function getEndEvent(obj) {
    if (Object.keys(obj).includes("style")) {
      if (getType(obj.style) == "EndEvent") AllEndEvent.push(obj);
    }
    if (Object.keys(obj).includes("style")) {
      if (getType(obj.style) == "EndEvent") AllEndEvent.push(obj);
    }
  }

  return AllEndEvent;
}

function OptionDynamic() {
  let mxCellArr = [];
  let optArr = [];
  let _arrAllObj = getFlows();
  _arrAllObj.map((obj) => {
    if (obj.ElementID == +localStorage.getItem("Gateway")) {
      obj.OutgoingEIDs.map((targetElems) => {
        for (let i in _arrAllObj) {
          if (_arrAllObj[i].ElementID == targetElems) {
            if (_arrAllObj[i].Type == "EndEvent") {
              mxCellArr.push(
                Object.fromEntries([
                  [
                    _arrAllObj[i].ElementID,
                    _arrAllObj[i].Label == ""
                      ? "پایان فرآیند"
                      : _arrAllObj[i].Label,
                  ],
                ])
              );
            } else {
              mxCellArr.push(
                Object.fromEntries([
                  [
                    _arrAllObj[i].ElementID,
                    _arrAllObj[i].Label == ""
                      ? mxResources.get(_arrAllObj[i].Type)
                      : _arrAllObj[i].Label,
                  ],
                ])
              );
            }
          }
        }
      });
    }
  });

  //Set option to select
  for (let i in mxCellArr)
    optArr.push(
      new Option_Constractor(
        Object.keys(mxCellArr[i])[0],
        Object.values(mxCellArr[i])[0]
      )
    );

  return optArr;
}

function showTable(UI) {
  const fieldName = localStorage.getItem("FieldType");
  if (fieldName == "RoutingRules") {
    if (UI.TemporaryArray.length) {
      return UI.TemporaryArray.filter(
        (x) => x.OwnerEID == +localStorage.getItem("Gateway")
      );
    } else {
      UI.TemporaryArray = UI.MainArray;
      return UI.TemporaryArray.filter(
        (x) => x.OwnerEID == +localStorage.getItem("Gateway")
      );
    }
  } else {
    return UI.TemporaryArray;
  }
}
function ValidateKey(ev) {
  var allowed =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789";
  return allowed.indexOf(String.fromCharCode(ev.keyCode)) == -1 ? false : true;
}

//SystemID generator
function SystemIDGenerator() {
  let id;
  if (localStorage.getItem("LastSystemID" + _pageKey)) {
    let LastSystemID = localStorage.getItem("LastSystemID" + _pageKey);
    LastSystemID = LastSystemID == "null" ? "Val000" : LastSystemID;
    let sysid = +LastSystemID.replaceAll("Val", "");
    sysid = sysid + 1;
    if (sysid.toString().length == 1) {
      id = "Val00" + sysid;
    } else if (sysid.toString().length == 2) {
      id = "Val0" + sysid;
    } else if (sysid.toString().length == 3) {
      id = "Val" + sysid;
    }
  } else {
    id = "Val001";
  }
  localStorage.setItem("LastSystemID" + _pageKey, id);
  return id;
}

function RefreshUIbyBTN(ModalID) {
  //Refresh UI for btns
  if (ModalID == "ProcessData_AddTable") {
    UI = VariableUI;
  } else if (ModalID == "SubTable_AddTable") {
    UI = SubTableUI;
  } else if (ModalID == "Doc_AddTable") {
    UI = DocumentUI;
  } else if (ModalID == "Condition_AddTable") {
    UI = Conditions;
  }
  return UI;
}
