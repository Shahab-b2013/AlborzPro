/* Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.0.0*/

"use strict";
//Global Var
var CHARTTYPE;
var DASHBOARDID;
var MODULEID;
var ENTITYID;
var ACCESSID;
var NAME;
var ITEMSGROUPING;
var PAGETEMPLATEID;
var LABEL;
var TYPE;
var HEADERVISIBLE;
var VERSION;
var DESC;
var COLUMNLAYOUT;
var COLUMNWIDTH;
var ROWBOXS = [];
var CHARTS = [];
var FILTERS = {};
var SQLFILTERS = "";
var ACCESESROLES = [];
var ACCESESGROUPS = [];
var REFROLES = [];
var REFGROUPS = [];
var REFCOLUMNS = [];
var SERIES = [];
var $CategoryQuery = [];
var $aggregationsObj = {};
var ImgCopy = null;
var Id_Copy = null;
var CopyIndex = 0;
var $Query = {};
var TEMPORARYCHART = {};
var TEMPORARYCHART2 = {};
var TEMPORARYCHART3 = {};
var _imgID = null;

function getCopyIndex() {
  return CopyIndex++;
}

// right click borwser disabled
$(document).on("contextmenu", (e) => e.preventDefault(), false);

function createDiv(className, id) {
  let elt = document.createElement("div");
  elt.className = className;
  elt.setAttribute("id", id);
  return elt;
}

//==========================================================================================Action Items =========================================================================

//create img id
function createImgID() {
  let Img = $(`.fit-image`);
  let id;
  if (Img.length) {
    id =
      $(Img)
        .sort((a, b) => a.id - b.id)
        .at(-1).id + 1;
  }

  id ??= 100;
  return () => id++;
}
const chart_defaultId = createImgID();

function createImgChart(e, parentID, chartItem, Type) {
  let _Base64 = chartItem ? chartItem.ImgBs64 : styleChart(Type);
  function styleChart(type) {
    let value;
    switch (type) {
      case "column":
        value = columnBs64; //from img.js
        break;
      case "pie":
        value = pieBs64;
        break;
      case "progress_circle":
        value = progress_circleBs64;
        break;
      case "bar":
        value = barBs64;
        break;
      case "line":
        value = lineBs64;
        break;
      case "areaspline":
        value = areaSplineBs64;
        break;
      case "polar":
        value = polarBs64;
        break;
      case "table":
        value = tableBs64;
        break;
      default:
        value = imgDefault;
        break;
    }
    return value;
  }

  let ID = chartItem ? chartItem.ID : chart_defaultId();
  if (Type == "table") {
    if (typeof ID == "number") {
      ID = ID = "highcharts-" + ID;
    } else {
      ID = ID;
    }
  }

  //set src and create img
  let chartType = chartItem ? chartItem.Type : Type;
  let src;
  if (chartItem) {
    if (chartItem.Type == "table" || CHARTTYPE == "table") {
      src = "data:image/png;base64,";
    } else if (chartItem.Type == "progress_circle") {
      //Adding Png prefix to load the progress circle

      src = "data:image/svg+xml;base64,";
    } else {
      src = "data:image/svg+xml;base64,";
    }
  } else if (chartType == "progress_circle") {
    src = " data:image/png;base64,";
  } else {
    src = "data:image/svg+xml;base64,";
  }
  let parent = parentID ? parentID : e.target.id;
  let img =
    '<img class="fit-image noDrop" type="' +
    chartType +
    '" draggable="true" oncontextmenu="PopupMenu(event)"  ondragstart="dragstart(event)" ondrop="" ondragover="event.preventDefault()"  onmouseenter="rowbtnOn(this)" onmouseleave="rowbtnOff(this)" style ="border:1px solid #ccc;border-radius:5px;cursor:move"  src="' +
    src +
    _Base64 +
    '" id="' +
    ID +
    '" >' +
    rowbtn_img(ID);

  $("#" + parent)
    .append(img)
    .css("border", "")
    .css("box-shadow", "");
}

//swaping img
function swapping(e) {
  $(`#contextMenu`).remove();
  var targetID = e.target.id;
  var transFerID = e.dataTransfer.getData("text");
  let temp;
  let oneID = $("#" + e.dataTransfer.getData("text"));
  let twoID = $("#" + e.target.id);

  if (e.dataTransfer.getData("text")) {
    e.preventDefault();

    function ExistOneID(item) {
      return item.ID === e.dataTransfer.getData("text");
    }

    function ExistTwoID(item) {
      return item.ID === e.target.id;
    }

    //****SWAPP***//

    //SWAPP IDS
    let parent1 = oneID.parent().attr("id");
    let parent2 = twoID.parent().attr("id");

    //first id
    $(`#` + parent1 + " img").attr("id", e.target.id);
    $(`#` + parent1 + " div").attr("id", "rowbtn-img-" + e.target.id);
    $(`#` + parent1 + " div")
      .children()
      .eq(0)
      .attr("id", "spanDelete" + e.target.id);
    $(`#` + parent1 + " div")
      .children()
      .eq(1)
      .attr("id", "spanEdit" + e.target.id);

    //seconde id
    $(`#` + parent2 + " img").attr("id", e.dataTransfer.getData("text"));
    $(`#` + parent2 + " div").attr(
      "id",
      "rowbtn-img-" + e.dataTransfer.getData("text")
    );
    $(`#` + parent2 + " div")
      .children()
      .eq(0)
      .attr("id", "spanDelete" + e.dataTransfer.getData("text"));
    $(`#` + parent2 + " div")
      .children()
      .eq(1)
      .attr("id", "spanEdit" + e.dataTransfer.getData("text"));

    //src
    temp = oneID.attr("src");
    oneID.attr("src", twoID.attr("src"));
    twoID.attr("src", temp);

    //type
    temp = oneID.attr("type");
    oneID.attr("type", twoID.attr("type"));
    twoID.attr("type", temp);

    //**SWAPP DATA**
    let oneObj;
    let twoObj;

    //check ExistOneID and ExistTwoID
    if (CHARTS.some(ExistOneID) && CHARTS.some(ExistTwoID)) {
      oneObj = CHARTS.find((element) => element.ID == transFerID);
      twoObj = CHARTS.find((element) => element.ID == targetID);
    }
    if (oneObj && twoObj) {
      //ID
      oneObj.ID = transFerID;
      twoObj.ID = targetID;

      //RowID
      oneObj.RowID = +$(`#` + transFerID)
        .parent()
        .parent()
        .attr("id")
        .split("-")[2];

      twoObj.RowID = +$(`#` + targetID)
        .parent()
        .parent()
        .attr("id")
        .split("-")[2];

      //ColumnIndex
      oneObj.ColumnIndex = +$(`#` + transFerID)
        .parent()
        .attr("ColumnIndex");
      twoObj.ColumnIndex = +$(`#` + targetID)
        .parent()
        .attr("ColumnIndex");
    }
    $(`#` + targetID).css("border", "1px solid #ccc");
    $(`#` + transFerID).css("border", "1px solid #ccc");
  }
}

function dragstart(e) {
  $(`.paste`).removeClass("paste");
  ImgCopy = null;
  e.stopPropagation();
  e.dataTransfer.setData("text", e.target.id);
  if ($(`#${e.target.id}`).attr("type") == "Row") {
    $(".form-group-body").addClass("noDrop");

    if ($("#content").children().length) {
      let rows = $(".form-group-box");
      for (let i = 0; i < rows.length; i++) {
        i == 0
          ? $(rows[i]).before(
              `<div id="${i}" class="NewRow" ondragover="event.preventDefault()" ondragleave="onMouseOut(event)" ondrop="drop(event)">${dashResources.get(
                "boxdrophere"
              )}</div>`
            ) &&
            $(rows[i]).after(
              `<div id="${i}" class="NewRow" ondragover="event.preventDefault()" ondragleave="onMouseOut(event)" ondrop="drop(event)">${dashResources.get(
                "boxdrophere"
              )}</div>`
            )
          : $(rows[i]).after(
              `<div id="${i}" class="NewRow" ondragover="event.preventDefault()" ondragleave="onMouseOut(event)" ondrop="drop(event)">${dashResources.get(
                "boxdrophere"
              )}</div>`
            );
      }
    } else {
      $("#content").append(
        `<div id="" class="NewRow" ondragover="event.preventDefault()" ondragleave="onMouseOut(event)" ondrop="drop(event)">${dashResources.get(
          "boxdrophere"
        )}</div>`
      );
    }
  }
  return true;
}

function Dragend(ev) {
  $(".NewRow").remove();
  $(ev.target).css("border", "");
  $(ev.target).css("box-shadow", "");
  $(ev.target).css("z-index", 0);
  $(".form-group-body").removeClass("noDrop");
}

function ColumnFns(e) {
  if ($("#" + e.target.id).hasClass("form-group-body")) {
    createImgChart(e, null, null, "column");
  }
}

function PieFns(e) {
  if ($("#" + e.target.id).hasClass("form-group-body")) {
    createImgChart(e, null, null, "pie");
  }
}

function progress_circleFns(e) {
  if ($("#" + e.target.id).hasClass("form-group-body")) {
    createImgChart(e, null, null, "progress_circle");
  }
}

function BarFns(e) {
  if ($("#" + e.target.id).hasClass("form-group-body")) {
    createImgChart(e, null, null, "bar");
  }
}

function LineFns(e) {
  if ($("#" + e.target.id).hasClass("form-group-body")) {
    createImgChart(e, null, null, "line");
  }
}

function AreaSplineFns(e) {
  if ($("#" + e.target.id).hasClass("form-group-body")) {
    createImgChart(e, null, null, "areaspline");
  }
}

function polarFns(e) {
  if ($("#" + e.target.id).hasClass("form-group-body")) {
    createImgChart(e, null, null, "polar");
  }
}

function TableFns(e) {
  if ($("#" + e.target.id).hasClass("form-group-body")) {
    createImgChart(e, null, null, "table");
  }
}

function GroupFns(e) {
  let id = RowID();

  if ($("#content .form-group-box").length <= 9) {
    if ($("#" + e.target.id).hasClass("NewRow")) {
      $(e.target).attr("class", "row form-group-box");
      $(e.target).attr("id", `form-group-${id}`);
      $(e.target).attr("RowIndex", "");
      $(e.target).html("");
      $(e.target).removeAttr("ondrop");
      $(e.target).removeAttr("ondragover");

      //create UI row
      $(e.target).append(
        '<div style="" class="' +
          "col-lg-4 col-md-4 form-group-body" +
          `"   onmouseover="copyCheck(event)"  onmouseout="onMouseOut(event)" ondrop="drop(event)" ondragover="allowDrop(event)" columnindex="0" id="form-group-body-` +
          id +
          '-0"></div><div style="" class="' +
          "col-lg-4 col-md-4 form-group-body" +
          '"  onmouseover="copyCheck(event)" onmouseout="onMouseOut(event)" ondrop="drop(event)" ondragover="allowDrop(event)" columnindex="1" id="form-group-body-' +
          id +
          '-1"></div><div style="" class="' +
          "col-lg-4 col-md-4 form-group-body" +
          '"   onmouseover="copyCheck(event)" onmouseout="onMouseOut(event)" ondrop="drop(event)" ondragover="allowDrop(event)" columnindex="2" id="form-group-body-' +
          id +
          '-2"></div>' +
          Group_Btn(id)
      );
      Dragend(e);

      $(".form-group-body").css("opacity", "1");
      $(".form-group-body").removeClass("noDrop");
      $(".rowBtnGroup-span").css("display", "none");
    }
  } else {
    alert(dashResources.get("rowsoverflowed"));
  }
  initClickOutsideEvent();
}

//=============================================================================drag and drop functions=================================================================================

function drop(ev) {
  ev.preventDefault();
  let transFerID = ev.dataTransfer.getData("text");
  let type = $(`#${transFerID}`).attr("type");

  //NewBox
  if ($(ev.target).hasClass("NewRow") && type == "Row") {
    GroupFns(ev);
    $(".form-group-body").removeClass("noDrop");
  }

  if (ev.target.id) {
    if (
      !$("#" + ev.target.id).hasClass("noDrop") &&
      $("#" + ev.target.id).hasClass("form-group-body") &&
      type != "Row"
    ) {
      if ($(`#` + transFerID).hasClass("fit-image")) {
        $(ev.target).html("");

        setTimeout(() => {
          $(ev.target).append($(`#${transFerID}`));
          $(ev.target).append($(`#rowbtn-img-${transFerID}`));

          //set col index charts
          let filter = CHARTS.filter((x) => x.ID == transFerID);
          if (filter.length) {
            filter[0].ColumnIndex = +$(`#${transFerID}`)
              .parent()
              .attr("columnIndex");

            filter[0].RowID = $(`#${transFerID}`)
              .parent()
              .parent()
              .attr("id")
              .split("-")[2];
          }

          $("#" + transFerID).css("border", "1px solid #ccc");
        }, 10);
      } else {
        //delete placeholder div
        $("#" + ev.target.id).html("");
        switch (type) {
          case "column":
            ColumnFns(ev);
            break;
          case "pie":
            PieFns(ev);
            break;
          case "progress_circle":
            progress_circleFns(ev);
            break;
          case "bar":
            BarFns(ev);
            break;
          case "line":
            LineFns(ev);
            break;
          case "areaspline":
            AreaSplineFns(ev);
            break;
          case "polar":
            polarFns(ev);
            break;
          case "table":
            TableFns(ev);
            break;

          default:
            break;
        }
      }
      Dragend(ev);
    } else if (
      $(`#` + transFerID).hasClass("fit-image") &&
      $(`#` + ev.target.id).hasClass("fit-image")
    ) {
      swapping(ev);
    }
  }
}

function allowDrop(e) {
  if (e.target.id) {
    if (!$("#" + e.target.id).hasClass("noDrop")) {
      if ($("#" + e.target.id).children().length == 0) {
        $("#" + e.target.id).css("border", "1px solid #ccc");
        $("#" + e.target.id).css("border-radius", "5px");
        if ($("#" + e.target.id).hasClass("form-group-body")) {
          $("#" + e.target.id).css("color", "#ccc");
          $("#" + e.target.id).css("font-size", "29px");
          $("#" + e.target.id).css("z-index", "4");
          $("#" + e.target.id).css("font-family", "tahoma");
          $("#" + e.target.id).css("box-shadow", "0px 0px 2px 1px #d1d1d1");
          $("#" + e.target.id).html("&#10;&#10;&#10;&#10;+");
          e.preventDefault();
        }
      }
    }
  }
}

function DeleteGroup(elem) {
  let RowCount = $("#content").children().length;
  if (RowCount > 1) {
    let RowID = elem.parentNode.parentNode.id;
    //check is chid row and delete row
    let bool = true;
    $(`#${RowID} .form-group-body`).map((index, value) => {
      if ($(value).children().length > 0) bool = false;
    });
    if (bool) {
      swal({
        text: dashResources.get("suredelete"),
        icon: `warning`,
        buttons: {
          confirm: `${dashResources.get("ok")}`,
          cancel: `${dashResources.get("cancel")}`,
        },
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          $(`#${RowID}`).remove();
        }
      });
    } else {
      swal(`${dashResources.get("deleteBox")}`, {
        icon: "warning",
        buttons: {
          confirm: `${dashResources.get("ok")}`,
        },
      });
    }
  } else {
    swal(`${dashResources.get("deleteFirstBox")}`, {
      icon: "warning",
      buttons: {
        confirm: `${dashResources.get("ok")}`,
      },
    });
  }
}

function dragEnter(e) {
  if (e.target.id == true && e.target.id != "lbl5") {
    if ($("#" + e.target.id).children().length == 0) {
      if ($("#" + e.target.id).hasClass("form-group-body")) {
        $("#" + e.target.id).css("border", "1px solid #ccc");

        $("#" + e.target.id).css("border-radius", "10px");
      }
    }
  }
}

function onMouseOut(e) {
  if (e.target.id) {
    if (!$("#" + e.target.id).hasClass("noDrop")) {
      if ($("#" + e.target.id).children().length == 0) {
        $("#" + e.target.id).css("border", "");
        $("#" + e.target.id).css("box-shadow", "");
        $("#" + e.target.id).html("");
      }
      $(`.paste`).removeClass("paste");
    }
  }
}

function dragLeave(e) {
  Dragend(e);
  if (e.target.id) {
    if (!$("#" + e.target.id).hasClass("noDrop")) {
      if ($("#" + e.target.id).children().length == 0) {
        $("#" + e.target.id).css("border", "");
        $("#" + e.target.id).css("box-shadow", "");
        $("#" + e.target.id).html("");
      }
    }
  }
}

function rowMoveUp(e) {
  let oneID = $("#" + e.target.parentNode.parentNode.id);
  if (oneID.prev()[0]) {
    let cloned = oneID.clone(true);
    let twoID = oneID.prev()[0].id;
    if (!$("#" + twoID).hasClass("divHeader")) {
      $("#" + twoID).before(cloned);
      oneID.remove();
    }
  }
}

function rowMoveDown(e) {
  window.scrollTo(0, 0);
  let oneID = $("#" + e.target.parentNode.parentNode.id);
  if (oneID) {
    let cloned = oneID.clone(true);
    if (oneID.next()[0]) {
      let twoID = oneID.next()[0].id;
      if (twoID != "content") {
        $("#" + twoID).after(cloned);
        oneID.remove();
      }
    }
  }
}

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

//chart modal edit
function ModalConstractor(width, parent) {
  let div =
    '<div id="myModal" class="modal" >' +
    '<div id="chartModal" class="modal-content">' +
    "</div></div>";
  $("#" + parent).append(div);

  $("#myModal").css("display", "block");
  $("#chartModal").css("width", width);
}

function rowbtnOn(elem) {
  $("#rowbtn-img-" + $(elem)[0].id).css("display", "inline-flex");

  //for copy & paste  by imgKeyPress function
  _imgID = $(elem)[0].id;
}

function rowbtnOn2(elem) {
  $("#" + $(elem)[0].id).css("display", "inline-flex");
}

function rowbtnOff(elem) {
  $("#rowbtn-img-" + $(elem)[0].id).css("display", "none");
}

function chartDelete(key, Id) {
  let id;
  if (key == "btn") {
    const boxId = $(`#` + Id)
      .parent()
      .parent()
      .attr("id");
    id = $(`#` + boxId + " img").attr("id");
  } else if (key == "popup") {
    id = Id;
  }

  swal({
    text: dashResources.get("suredelete"),
    icon: `warning`,
    buttons: {
      confirm: `${dashResources.get("ok")}`,
      cancel: `${dashResources.get("cancel")}`,
    },
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      ImgCopy = null;
      //delete img
      $(`#${id}`).remove();
      //delete rowbtn
      $(`#rowbtn-img-${id}`).remove();

      //modify chars arr
      const findIndex = CHARTS.findIndex((Element) => Element.ID == id);
      if (findIndex != -1) {
        CHARTS.splice(
          CHARTS.findIndex((Element) => Element.ID == id),
          1
        );
      }
    }
  });
}

function GroupSplit(id) {
  //group child count & set lblsilder
  let childCount = $("#form-group-" + id).children().length - 1;
  $("#lblSlider-" + id).html(childCount);
  if (childCount == 1) {
    childCount = 1;
  } else if (childCount == 2) {
    childCount = 10;
  } else if (childCount == 3) {
    childCount = 20;
  }
  $("#myslider-" + id).val(childCount);

  //close other slider
  $(".slider").css("display", "none");
  $("#slider-" + id).css("display", "block");
}

function volume(elem) {
  let id = elem.id.replaceAll("myslider-", "lblSlider-");
  function childCount() {
    return (
      $("#" + elem.id.replaceAll("myslider", "form-group")).children().length -
      1
    );
  }

  switch (+elem.value) {
    case 1:
      DivSplit_1(elem);
      $("#" + id).html(childCount());
      break;
    case 10:
      DivSplit_2(elem);
      $("#" + id).html(childCount());
      break;
    case 20:
      DivSplit_3(elem);
      $("#" + id).html(childCount());
      break;
  }
}

function DivSplit_1(elem) {
  remove_Empty_Div(elem);
  if (get_Items_Row(elem).length == 1) {
    setDiv1(elem, 12);
    chartArr_Modify(elem);
  }
}

function DivSplit_2(elem) {
  remove_Empty_Div(elem);
  if (get_Items_Row(elem).length == 1) {
    setDiv1(elem, 6);
    CreateDiv2(elem, 6);
    chartArr_Modify(elem);
  }
  if (get_Items_Row(elem).length == 2) {
    setDiv1(elem, 6);
    setDiv2(elem, 6);
    chartArr_Modify(elem);
  }
}

function DivSplit_3(elem) {
  remove_Empty_Div(elem);
  if (get_Items_Row(elem).length == 1) {
    setDiv1(elem, 4);
    CreateDiv2(elem, 4);
    CreateDiv3(elem, 4);
    chartArr_Modify(elem);
  }
  if (get_Items_Row(elem).length == 2) {
    remove_Empty_Div(elem);
    setDiv1(elem, 4);
    setDiv2(elem, 4);
    CreateDiv3(elem, 4);
    chartArr_Modify(elem);
  }
}

function chartArr_Modify(elem) {
  let chartID;
  let RowID = $("#" + get_Items_Row(elem)[0]).parent()[0].id;
  let colCount = $("#" + RowID).children().length;
  for (let i = colCount - 1; i >= 0; i--) {
    let colID = $("#" + RowID).children()[i].id;
    if ($("#" + colID).hasClass("form-group-body")) {
      if ($("#" + colID).children().length > 1)
        chartID = $("#" + colID).children()[0].id;
      //set new colIndex in arr
      if (chartID) {
        let colIndex = $("#" + colID).attr("ColumnIndex");
        let element = CHARTS.filter((x) => x.ID == chartID);

        if (element[0]) element[0].ColumnIndex = +colIndex;
      }
    }
  }
  initClickOutsideEvent();
}

function setDiv1(elem, colNum) {
  $("#" + get_Items_Row(elem)[0]).attr(
    "class",
    "form-group-body  col-md-" + colNum
  );
  $("#" + get_Items_Row(elem)[0]).attr("ColumnIndex", 0);
}

function setDiv2(elem, colNum) {
  $("#" + get_Items_Row(elem)[1]).attr(
    "class",
    "form-group-body col-md-" + colNum
  );
  $("#" + get_Items_Row(elem)[1]).attr("ColumnIndex", 1);
}

function CreateDiv2(elem, colNum) {
  let div1ID = get_Items_Row(elem)[0];
  let lastCharId = +div1ID.substr(div1ID.length - 1) + 1;
  let div2ID = div1ID.substring(0, div1ID.length - 1).concat(lastCharId); //Delete/Add last chart from id
  let div2 =
    '<div class="form-group-body col-md-' +
    colNum +
    '" style="" ondragenter="dragEnter(event)" onmouseover="copyCheck(event)" onmouseout="onMouseOut(event)" ondragleave="dragLeave(event)" ondrop="drop(event)" ondragover="allowDrop(event)" ColumnIndex="1" id="' +
    div2ID +
    '" ></div>';
  //set div2
  $("#" + get_Items_Row(elem)[0]).after($(div2));
}

function CreateDiv3(elem, colNum) {
  //create div3
  let div2ID = get_Items_Row(elem)[1];
  let lastCharId = +div2ID.substr(div2ID.length - 1) + 1;
  let div3ID = div2ID.substring(0, div2ID.length - 1).concat(lastCharId); //Delete/Add last chart from id

  let div3 =
    '<div class="form-group-body col-md-' +
    colNum +
    '" style="" ondragenter="dragEnter(event)" onmouseover="copyCheck(event)" onmouseout="onMouseOut(event)" ondragleave="dragLeave(event)"  ondrop="drop(event)" ondragover="allowDrop(event)" ColumnIndex="2" id="' +
    div3ID +
    '"></div>';
  //set div3
  $("#" + get_Items_Row(elem)[1]).after($(div3));
}

function rowbtn_img(ID) {
  return (
    '<div class="row rowbtnchart" onmouseenter = "rowbtnOn2(this)" id = "rowbtn-img-' +
    ID +
    '"><span id="spanDelete' +
    ID +
    `" class="btn btn-light glyphicon glyphicon-trash" onclick="chartDelete('btn',id)" style="margin-left:10px;color:#000"></span>` +
    '<span id="spanEdit' +
    ID +
    `" class="spanEdit btn btn-light glyphicon glyphicon-cog" onclick="chartEdit('btn',this)" style="color:#000"></span></div>`
  );
}

function copyCheck(e) {
  if (!$(`#iCopy`).hasClass("disabled")) {
    if ($("#" + e.target.id).hasClass("form-group-body")) {
      if (!$("#" + e.target.id + " img").length) {
        if (ImgCopy != null) {
          $("#" + e.target.id).css("border", "1px solid #ccc");
          $("#" + e.target.id).css("border-radius", "10px");
          $("#" + e.target.id).css("color", "#ccc");
          $("#" + e.target.id).css("font-size", "29px");

          $("#" + e.target.id).css("font-family", "tahoma");
          $("#" + e.target.id).addClass("paste");
          $("#" + e.target.id).html(`&#10;&#10;&#10;&#10;+`);
          $("#" + e.target.id).on("contextmenu", (event) => PopupMenu(event));
          _imgID = e.target.id;
        }
      }
    }
  }
}

function PopupMenu(e) {
  let itemID = e.target.id;
  //Not default img
  $(`#contextMenu`).remove();
  if (
    $(`#` + itemID).hasClass("fit-image") ||
    $(`#` + itemID).hasClass("paste")
  ) {
    let menu_Ui =
      '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:none;width:250px;z-index:1000000;" id="contextMenu" >' +
      `<li id="iCopy"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBElEQVR4nO3WvQ6CMBAHcN7uBnXVRZeOGt+DBEcSwqYP4MorkCaaDoTN5EZXVpbWsKOl5Srl45LbIPlx/x4QBFMtCHPVt9cX/nAKxEpad3P/LhZyE3HuLfBe1mobC7mK+NNLYPaS7pBUwKwLkuLAn66FNVCLbC7uUxDm6pAIdb6V1sCfSApg8a7VPhHq2HGSbcCvSAogVtII2eXYkAPREKl7ACdAJEI6BSIB0jkQeyLJgaDpQYG60uGbd+jgQPR9gug7EDrEagRkqbD6aWCpGOcEcXZbzAwiZi2xjm6C6DsQli2eW8SwbPHUIkZq4PItrjyLGCz6r8CgTy3AcA4TBMcdTLU+Ptb+HqaFL0AAAAAASUVORK5CYII="><span>${dashResources.get(
        "copy"
      )}</span></li>` +
      `<li id="iPaste" class="disabled"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAArUlEQVR4nGNggIJLS6OMryxL8gPhVVOLs2b2l6UnV/SGplT2hYDYIDGYPEgtAzp4sSP32ddDZf9BuLmj639aZf//tIq+OWkV/XNAbJAYTP7F9rynGAa82pH/6vvF6f9/Pz/5v3/6fIgBSBgkBpIDqQGpxWrAz1tr/4PAj5+//j948hIFg8RAAKSGoAH4wKgB/0fD4D+BMIAlZXwYZ1JGzkyEMNbMhJydCWHk7AwAAeeEpnq+vDYAAAAASUVORK5CYII="><span style="color:#938f8fa1">${dashResources.get(
        "paste"
      )}</span></li>` +
      `<li id="idelete" class="dropdown-submenu"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAvklEQVR4nGNgwAF6yxfp9xQvMAZhEJuBFNBVMt+6q2R+MMwAEBskhlPDnM6tAVuWnbqzY+WZByC8bcXpp1uXnX6DjEFiMPmty0/fndW+0R9uwKzOjT4rpu29unr2wZfEYJBakB4UVyyfsX/Jnauf/p/Yd/8/Mo1NDKQWwxvLoQbsWX/xPzKNTWzUgE+jYXAVRxgsmrhr6ukDD/6eOfjoPz4MUrNk4q6pGAbU1+9n6SlaaAjLgThx0UJDkFqYRgAg9zA842RuswAAAABJRU5ErkJggg=="><span  tabindex="-1">${dashResources.get(
        "delete"
      )}</span>` +
      '<li class="divider" style="padding: 0px;margin:5px 10px;border-top: 1px solid #b7b1b1;"></li>' +
      `<li id="ichartDesign"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAACDElEQVR4nI2S3WvTUBjGgx/RC/2bdrtbLzLEm4HMdhbToCAiYk6wFptUp1HoVoIUlNnaKFXXRkXdmN0HZv2wLnY6WFtrR+i2hN541cVXTrRd0tXqC+cmOb+H5zzvQxB/BiGN9N7Ne4n/mLmhoUOuDwhp5Pn75eehtGH5Ih/v/A2MjY4eXeGCisFxO3WajrlgQWkBkhsQfNG0zk0Wb/XCKInI2TcZvajVoSrFwGBZQ6MoksC2b6SN3fDLFuDDZ0y4ltJ3Gakc7MDJJHUwn53IFNer8FX/AYXVGqgBPt1VZySN5dNGuyMSeNYE7knDoqOfBAx/z6HET+MhbNdkKK5XYPbdax0/x2WRcYgIimkLsXLdWp6/9xnDYOLzAAoLE69EkT7SNyTG5cSE7GIcnPBmgYvPoZ4N9BfZbvfC6ntx7Z8wHvxmdV4sOeGl5UfAJr/ZmRCDJmkHxk674KU43FQMOxMcrH+qFO4PI4rcWLi84YRzWXFVmNnqBns91YRASrd8k6V9PSHUx+NT5lq4Czfy3DR25Je0q84V457gsvkixb3GIh91rP72UqW1gsAsC1BbvFKNRj2HO/8ZSQuGMntlQ/Im4PKN3f5wxr7gHx9JRPmzgEVUeSwiisP79ux0gmt/Ifbl6TCt/L536uSJCu0dSfAXTx8fFDIWCc3stF0wIogDA1fTM9i2x5PrPu8XJvyyBgJOW74AAAAASUVORK5CYII="></span><span tabindex="-1">${dashResources.get(
        "chartDesign"
      )}</span></li>` +
      '<ul class="dropdown-menu">' +
      "..." +
      "</ul>" +
      "</li>" +
      "</ul>";
    $("#content").append(menu_Ui);

    if (!itemID.includes("highcharts")) {
      $("#iCopy").addClass("disabled");
      $("#iCopy span").css("color", "#938f8fa1");
      $("#iCopy").hover(function () {
        $(this).css("background-color", "whitesmoke");
      });
      if ($(`#` + itemID).hasClass("fit-image")) {
        $("#iPaste").hover(function () {
          $(this).css("background-color", "whitesmoke");
        });
      }
    } else {
      $("#iCopy").removeClass("disabled");
      $("#iCopy span").css("color", "#000");
      $("#iCopy").hover(function () {
        $(this).css("background-color", "##a9a9a98f");
      });
      $("#iPaste").hover(function () {
        $(this).css("background-color", "whitesmoke");
      });
      $("#iCopy").on("click", () => isCopy(itemID));
    }

    if (
      !$(`#` + itemID).hasClass("fit-image") &&
      $(`#` + itemID).hasClass("paste")
    ) {
      $("#iPaste").on("click", () => isPaste(itemID));
      $("#iPaste span").css("color", "#000");
    } else {
      $("#iPaste span").css("color", "##a9a9a98f");
    }

    $("#ichartDesign").on("click", () => chartEdit("popup", itemID));
    $("#idelete").on("click", () => chartDelete("popup", itemID));

    //css menu
    let menu = $("#contextMenu");
    menu.css("display", "block");
    _Lang == "fa"
      ? menu.css("left", e.pageX - 240 + "px")
      : menu.css("left", e.pageX - 240 + "px");
    menu.css("top", e.pageY - $("#content").offset().top + "px");
    //disable menu
    document.onclick = () => $("#contextMenu").remove();
    e.preventDefault();
  }
}

async function isCopy(Id) {
  if (!$(`#iCopy`).hasClass("disabled")) {
    if (Id.includes("highcharts")) {
      ImgCopy = await $("#" + Id).clone(true);
      $(ImgCopy).attr("id", Id + getCopyIndex());

      $("#iPaste").removeClass("disabled");
      $("#iPaste span").css("color", "#000000");

      Id_Copy = Id;
    }
  }
}

async function isPaste(id) {
  if (!$(`#` + id + " img").hasClass("fit-image")) {
    await $("#" + id).append(ImgCopy);
    //css
    $("#iPaste").addClass("disabled");
    $("#iPaste span").css("color", "#938f8f");
    $("#iPaste").hover(function () {
      $(this).css("background-color", "whitesmoke");
    });

    //edit btn
    if (ImgCopy != null)
      await $("#" + ImgCopy[0].id).after(rowbtn_img(ImgCopy[0].id));

    //clone array item
    if (Id_Copy != null) {
      let newItem = CHARTS.filter((x) => x.ID == Id_Copy);

      let cloneObj = { ...newItem[0] };
      cloneObj.ID = ImgCopy[0].id;
      cloneObj.ColumnIndex = +$(ImgCopy[0]).parent().attr("ColumnIndex");
      cloneObj.RowID = +$(ImgCopy[0]).parent().attr("id").split("-")[3];
      CHARTS.push(cloneObj);
    }

    $("#" + id).removeClass("paste");

    Id_Copy = null;
    ImgCopy = null;
  }
}

//Remove empty Div when DivSplit
function remove_Empty_Div(elem) {
  let chartCount = 0;
  let Items_Row = get_Items_Row(elem);
  for (let k = Items_Row.length - 1; k >= 0; k--) {
    let elements = +$("#" + Items_Row[k]).children().length;
    if ($("#" + elem.id).hasClass("myslider")) {
      if (get_Items_Row(elem).length > 1) {
        if (elements == 0) {
          $("#" + Items_Row[k]).remove();
        }
      }
    } else if ($("#" + elem.id).hasClass("delete")) {
      if (elements > 0) {
        chartCount++;
      }
      if (k == 0) {
        if (chartCount == 0) {
          //chart is null
          for (let index = Items_Row.length - 1; index >= 0; index--) {
            if ($("#" + elem.id).hasClass("delete")) {
              if (elements == 0) {
                $("#" + Items_Row[index]).remove();
              }
            }
          }
        }
      }
    }
  }
}

function get_Items_Row(elem) {
  let get_Items_Row = [];
  let parnetnodeID = $("#" + elem.id).hasClass("delete")
    ? elem.parentNode.parentNode.id
    : elem.parentNode.parentNode.parentNode.parentNode.id;
  parnetnodeID = document.getElementById(parnetnodeID);
  for (let q = 0; q < parnetnodeID.childNodes.length; q++) {
    if (parnetnodeID.childNodes[q].id) {
      let id = parnetnodeID.childNodes[q].id;
      if ($("#" + id).hasClass("form-group-body")) {
        get_Items_Row.push(id);
      }
    }
  }
  return [...new Set(get_Items_Row)];
}

function HideModal() {
  $("#myModal").remove();
}

///EXPORT JSON
function Export() {
  let $GROUPS_ARRAY = [];
  let getRow = $("#content .form-group-box");
  getRow.map((index, item) => {
    //Group default
    $GROUPS_ARRAY.push({
      RowID: +item.id.split("-")[2],
      RowIndex: index,
      RowDisplayMode: "GroupWithBox",
      ColumnLayout: ColumnLayout(item.id),
      ColumnWidth: "default",
    });
  });
  function ColumnLayout(rowID) {
    switch ($(`#${rowID} .form-group-body`).length) {
      case 1:
        return "OnceColumn";
        break;
      case 2:
        return "TwoColumn";
        break;
      case 3:
        return "ThreeColumn";
        break;

      default:
        break;
    }
  }
  let json = {
    DashboardID: DASHBOARDID,
    ModuleID: MODULEID,
    EntityID: ENTITYID,
    AccessID: ACCESSID,
    Label: LABEL,
    Name: NAME,
    ItemsGrouping: ITEMSGROUPING,
    PageTemplateID: PAGETEMPLATEID,
    Type: TYPE,
    HeaderVisible: HEADERVISIBLE,
    Version: VERSION,
    Desc: DESC,
    RowBoxs: $GROUPS_ARRAY,
    Charts: CHARTS,
    Filters: FILTERS,
    SqlFilters: SQLFILTERS,
    AccessRoles: ACCESESROLES,
    AccessGroups: ACCESESGROUPS,
  };
  return JSON.stringify(json);
}

function ExportFile() {
  const filename = `Dashboard-${_pageKey}.fdm`;
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(Export())
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function btnSubmit(par, text) {
  let btn = document.createElement("button");
  btn.className = "btn btn-primary btn_submint_exit";
  btn.innerText = text;
  $(par).append(btn);
  return btn;
}

function btnExit(par) {
  let btnEx = document.createElement("button");
  btnEx.className = "btn btn-light btn_submint_exit";
  btnEx.innerText = dashResources.get("cancel");
  $(par).append(btnEx);
  return btnEx;
}

function Import() {
  /*UI OpenFile*/
  if ($("#myModal").css("display") != "block") {
    ModalConstractor("450px", "content");

    $("#chartModal").css("top", "150px");
    $("#chartModal").css("border-radius", "0.25rem");
    $(".modal-content").css("padding", "0px");
    const div = '<div id="open_div" style="padding:0px 10px"></div>';
    const btn = '<div id="open_btn_Div"></div>';
    $("#chartModal").append(div);
    $("#chartModal").append(btn);
    let input_file = `<input type="file" id="file-input" accept=".fdm" style="margin-bottom: 20px;margin-top: 20px;font-size:14px;cursor: pointer;font-weight: 600;font-family: sans-serif;" onchange="ShowBtn()"/><span style="color:#7c7c7c">
    ${dashResources.get("jsonsuport")}</span>`;
    $("#open_div").append(input_file);
    let Open_btn = `<input type="button" id="open_btn" class="btn btn-primary" value="${dashResources.get(
      "open"
    )}" onclick="openfile()" style="background-color: #3a5ba0;padding-bottom: 20px;width:70px;margin-bottom:5px;font-size: 13px;height:35px" Disabled />`;
    $("#open_btn_Div").append(Open_btn);
    let cancel_btn = `<input type="button" id="cancel_btn" class="btn btn-light" value="${dashResources.get(
      "cancel"
    )}" style="margin-right:5px;width:70px;margin-bottom:5px;font-size: 13px;height:35px" onclick="HideModal()">`;
    $("#open_btn_Div").append(cancel_btn);
  }
}
function ShowBtn() {
  $("#open_btn").removeAttr("Disabled");
}
var $JSON;
function openfile() {
  let input = document.getElementById("file-input").files[0];
  if (input) {
    var reader = new FileReader();
    reader.onload = function (e) {
      let json = e.target.result;

      $JSON = JSON.parse(json);
      RenderJson(false, $JSON);
    };
    reader.readAsText(input);
  }
}
var $JSON_IMPORTED;
function Import_Cs(json) {
  RenderJson(true, json);
}

function RenderJson(sidebar, $JSON) {
  $JSON_IMPORTED = $JSON;
  $(`#page-header b b`).remove();
  setTimeout(() => {
    $(`#page-header b`).append(
      `<b style="font-weight:bold"> [ ${LABEL} ] </b>`
    );
  }, 100);

  //set variables
  DASHBOARDID = $JSON.DashboardID;
  MODULEID = $JSON.ModuleID;
  ENTITYID = $JSON.EntityID;
  ACCESSID = $JSON.AccessID;
  NAME = $JSON.Name;
  PAGETEMPLATEID = $JSON.PageTemplateID;
  LABEL = $JSON.Label;
  TYPE = $JSON.Type;
  HEADERVISIBLE = $JSON.HeaderVisible;
  VERSION = $JSON.Version;
  DESC = $JSON.Desc;
  ITEMSGROUPING = $JSON.ItemsGrouping;
  COLUMNLAYOUT = $JSON.ColumnLayout;
  COLUMNWIDTH = $JSON.ColumnWidth;
  ROWBOXS = $JSON.RowBoxs;
  CHARTS = $JSON.Charts;
  FILTERS = $JSON.Filters;
  SQLFILTERS = $JSON.SqlFilters;
  ACCESESROLES = $JSON.AccessRoles;
  ACCESESGROUPS = $JSON.AccessGroups;
  REFROLES = $JSON_IMPORTED.RefRoles;
  REFGROUPS = $JSON_IMPORTED.RefGroups;
  REFCOLUMNS = $JSON_IMPORTED.RefColumns;
  if (sidebar) Sidebar();
  DashboardView($JSON);
}

function openShow() {
  $("#open_btn").removeAttr("Disabled");
}

function Group_Btn(GroupId) {
  return (
    '<div id="rowBtnGroup-' +
    GroupId +
    '" class="rowBtnGroup noDrop" dragabble="false" ondragstart="return false">' +
    `<span style="border-top-right-radius: 0px;border-bottom-right-radius: 0px;color:#000" class="delete btn btn-light glyphicon glyphicon-trash" titleLang="deleteRow" onclick="DeleteGroup(this);" id=` +
    GroupId +
    "DeleteGroup></span>" +
    `<span style="border-radius:0px;font-size: 20px;color:#000" class="edit btn btn-light fa fa-sliders" titleLang="rowCount" ` +
    ` onclickoutside="$('#slider-${GroupId}').css('display','none');" onclick="GroupSplit(${GroupId});" id="EditGroup-` +
    GroupId +
    '"></span>' +
    '<span class="vol"><span style="display:none" id="slider-' +
    GroupId +
    `" class="slider"><input type="range" id="myslider-` +
    GroupId +
    `" class="myslider" min="1" max="20" step="1" oninput="volume(this)" /><label class="lblSlider" id="lblSlider-` +
    GroupId +
    '"></label></span></span>' +
    `<span style="border-radius:0px;color:#000" class="btn btn-light glyphicon glyphicon-arrow-up" titleLang="rowMoveUp"  onclick="rowMoveUp(event);" id="moveup-` +
    GroupId +
    `"></span><span style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;color:#000" class="btn btn-light glyphicon glyphicon-arrow-down" data-placement="top" titleLang="rowMoveDown"  onclick="rowMoveDown(event)" id="movedown-` +
    GroupId +
    '"></span>'
  );
}

//change language
function ChangeLang() {
  if (_Lang == "Fa") {
    $(`#page-header span`).prop("class", "fa fa-angle-double-left");
    $(`#out a i`).addClass("fa-rotate-180");
  } else if (_Lang == "En") {
    $(`.rotate`).attr(
      "class",
      `fa fa-angle-right pull-right rotate fa-rotate-90`
    );
    $(`.rotate:first`).attr(
      "class",
      `fa fa-angle-right pull-right rotate fa-rotate-90`
    );
    $(`#page-header span`).prop("class", "fa fa-angle-double-right ");
    $(`#out`).attr("style", "position:absolute;right:0px");
  }

  initClickOutsideEvent();
}

function Exit() {
  saveDesign(false);
  setTimeout(() => {
    window.open("", "_self").close();
  }, 1000);
}

function initClickOutsideEvent() {
  let elements = document.querySelectorAll("*[onclickoutside]");
  window.addEventListener("click", (event) => {
    elements.forEach((element) => {
      if (element != event.target) {
        if (
          event.target.getAttribute("changelang") != "out" &&
          event.target.getAttribute("changelang") != "editbtn" &&
          $(event.target).hasClass("fa-sliders") == false
        )
          eval(element.getAttribute("onclickoutside"));
      }
    });
  });
}

$(function imgKeyPress() {
  document.addEventListener("keydown", (event) => {
    if (_imgID != null) {
      // event.preventDefault();
      let charCode = String.fromCharCode(event.which).toLowerCase();
      if ((event.ctrlKey || event.metaKey) && charCode === "c") {
        isCopy(_imgID);
      } else if ((event.ctrlKey || event.metaKey) && charCode === "v") {
        if (!$("#" + _imgID).hasClass("noDrop")) {
          if ($("#" + _imgID).children().length == 0) {
            $("#" + _imgID).css("border", "");
            $("#" + _imgID).css("box-shadow", "");
            $("#" + _imgID).html("");
          }
          $(`.paste`).removeClass("paste");
          isPaste(_imgID);
        }
      }
    }
  });
});
