/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.5.0.0*/
/* Release Ferdos.BPMS*/
let $tmpBoxArr = [];

function Import() {
  /*UI OpenFile*/
  if ($("#myModal").css("display") != "block") {
    ModalConstractor("450px", "content");

    $("#formModal").css("top", "150px");
    $("#formModal").css("border-radius", "0.25rem");
    $(".modal-content").css("padding", "0px");
    const div = '<div id="open_div" style="padding:0px 10px"></div>';
    const btn = '<div id="open_btn_Div"></div>';
    $("#formModal").append(div);
    $("#formModal").append(btn);
    let input_file = `<input type="file" id="file-input" accept=".fdm" style="margin-bottom: 20px;margin-top: 20px;font-size:14px;cursor: pointer;font-weight: 600;font-family: sans-serif;" onchange="ShowBtn()"/><span style="color:#7c7c7c">
    ${docResources.get("jsonsuport")}</span>`;
    $("#open_div").append(input_file);
    let Open_btn = `<input type="button" id="open_btn" class="btn btn-primary" value="${docResources.get(
      "open"
    )}" onclick="openDialog()" style="background-color: #3a5ba0;padding-bottom: 20px;width:70px;margin-bottom:5px;font-size: 13px;height:35px" Disabled />`;
    $("#open_btn_Div").append(Open_btn);
    let cancel_btn = `<input type="button" id="cancel_btn" class="btn btn-light" value="${docResources.get(
      "cancel"
    )}" style="margin-right:5px;width:70px;margin-bottom:5px;font-size: 13px;height:35px" onclick="HideModal()">`;
    $("#open_btn_Div").append(cancel_btn);
  }
}

var $DocLabel;
var $DocItemID = "";
let localStorage_Variables;

function openDialog() {
  let input = document.getElementById("file-input").files[0];
  if (input) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let _json = JSON.parse(e.target.result);
      _json.isDefault = false;
      $DocLabel = _json.Label;
      $("#content").empty();
      RenderJson(_json);
    };
    reader.readAsText(input);
  }
}

function Import_CS(Doc) {
  RenderJson(Doc);
  setTimeout(() => {
    $(`#page-header b`)
      .text(" " + docResources.get("designdoc") + "  ")
      .append(
        `<b style="font-weight:bold">${localStorage.getItem(
          "docLabel" + Doc.RowKey
        )}</b>`
      );
  }, 100);
}

function RenderJson(Doc) {
  if (Doc.Documents.length) {
    $tmpBoxArr = Doc.Documents;
    let tmpArr = [];
    Doc.Documents.forEach((element) => {
      tmpArr.push(...element.Value);
    });
    if (tmpArr.length) {
      tmpArr.sort((one, two) => one.ID - two.ID);
      $DocItemID = tmpArr.at(-1).ID.toString();
    }
  } else {
    $DocItemID = _pageKey.toString() + "00";
  }
  localStorage_Variables = Doc.isDefault
    ? $Variables
    : Doc.Variables;
  DocView(Doc);
  Sidebar();
  dataProcessItems();
}

function ShowBtn() {
  $("#open_btn").removeAttr("Disabled");
}

function HideModal() {
  $("#myModal").remove();
}

let totalPagesNum = $("#pageNumber").attr("totalPages");
var _rawBoxArr = [];

function Export() {
  ExportPage();
  //get set img
  // $JSON.ProcessModel
  //   ? (_DocIMG = $JSON.ProcessModel.Documents.filter(
  //       (x) => x.RowKey == +_pageKey
  //     )[0])
  //   : (_DocIMG = $JSON);

  let ExportDoc = {
    DocumentID: +_pageKey,
    Label: localStorage.getItem(
      "docLabel" + (_pageKey - Math.round(($ProcessID + 500) * 10000))
    ),
    ImgSrc: "",
    ImgName: Doc.ImgName,
    ImgSize: docProcess[0].ImgSize,
    RowKey: _pageKey - Math.round(($ProcessID + 500) * 10000),
    ProcessID: $ProcessID,
    Documents: $tmpBoxArr,
    Variables: localStorage_Variables,
  };
  
  return JSON.stringify(ExportDoc);
}

// Exports elements of each page
function ExportPage() {
  let pageNumber = $("#pageNumber").attr("index");
  //BOXS
  let _boxObj = {};
  let Boxs = document.getElementsByClassName(`doc-item`);
  let _Style = {};
  let _Boxs = [];
  _rawBoxArr = $tmpBoxArr;
  if (Boxs.length) {
    for (let i = 0; i < Boxs.length; i++) {
      if ($(Boxs[i]).hasClass("SIGNATURE")){
        _Style = {
          FontFamily: $(Boxs[i]).css("fontFamily").replaceAll(/\"/gi, ""),
          FontSize: +$(Boxs[i]).css("fontSize").replaceAll("px", ""),
          FontColor: $(Boxs[i]).css("color"),
          BackgroundColor: $(Boxs[i]).css("backgroundColor"),
        };

        _Boxs.push({
          ID: +Boxs[i].id,
          VariableID_Box: parseInt(
            Boxs[i].getAttribute("systemid").match(/\d+/)[0]
          ),
          RowKey: +Boxs[i].getAttribute("rowkey"),
          Label: Boxs[i].value,
          FieldName: Boxs[i].getAttribute("fieldname"),
          Type:
            ChangeTypeUpperCase(Boxs[i].getAttribute("type")) != undefined
              ? ChangeTypeUpperCase(Boxs[i].getAttribute("type"))
              : Boxs[i].type,
          InputType: "Signature",
          InputCount: 1,
          Width: Boxs[i].offsetWidth,
          Height: Boxs[i].offsetHeight,
          Top: Boxs[i].offsetTop,
          Left: Boxs[i].offsetLeft,
          Style: _Style,
          src: Boxs[i].getAttribute("src") ? Boxs[i].getAttribute("src") : "",
          SystemID: Boxs[i].getAttribute("systemid")
            ? Boxs[i].getAttribute("systemid")
            : "",
        });
      }else
      if ($(Boxs[i]).hasClass("TABLES")) {
        //ITEM TABLE
        let rows = Boxs[i].getElementsByTagName("tr");
        let cols = rows[0].getElementsByTagName("th");
        let _Columns = [];
        for (let j = 0; j < cols.length; j++) {
          _Columns.push({
            ID: cols[j].id,
            Label: cols[j].innerText
              .split("_")[0]
              .replaceAll("[", "")
              .replaceAll("]", "")
              .trim(),
            Width: cols[j].offsetWidth,
            Height: cols[j].offsetHeight,
          });
        }

        ColHeader = rows[0].getElementsByTagName("th");
        ColBody = rows[1].getElementsByTagName("td");

        _Style = {
          Header: {
            FontFamily: $(ColHeader[0])
              .css("fontFamily")
              .replaceAll(/\"/gi, ""),
            FontSize: parseInt($(ColHeader[0]).css("fontSize")),
            FontColor: $(ColHeader[0]).css("color").replaceAll(/\"/gi, ""),
            BackgroundColor: $(ColHeader[0])
              .parent()
              .parent()
              .css("background-color"),
          },
          Body: {
            FontFamily: $(ColBody[1]).css("fontFamily").replaceAll(/\"/gi, ""),
            FontSize: parseInt($(ColBody[1]).css("fontSize")),
            FontColor: $(ColBody[1]).css("color").replaceAll(/\"/gi, ""),
            BackgroundColor: $(ColBody[1])
              .parent()
              .parent()
              .css("background-color"),
          },
          Position: {
            Top: Boxs[i].parentElement.offsetTop,
            Left: Boxs[i].parentElement.offsetLeft,
          },
        };
        
        _Boxs.push({
          ID: +Boxs[i].getAttribute("id").replaceAll("TBL", ""),
          Type: "Table",
          RowsNum: rows.length - 1,
          RowKey: +Boxs[i].getAttribute("rowkey"),
          InputType: "Table",
          Label: "",
          FieldName: Boxs[i].getAttribute("fieldname"),
          InputCount: "List",
          SystemID: Boxs[i].getAttribute("systemid"),
          Columns: _Columns,
          Style: _Style,
        });
        _boxObj.PageNum = +pageNumber + 1;
        _boxObj.Value = _Boxs;
        _rawBoxArr[pageNumber] = _boxObj;
      } else {
        //OTHER ITEM
        _Style = {
          FontFamily: $(Boxs[i]).css("fontFamily").replaceAll(/\"/gi, ""),
          FontSize: +$(Boxs[i]).css("fontSize").replaceAll("px", ""),
          FontColor: $(Boxs[i]).css("color"),
          BackgroundColor: $(Boxs[i]).css("backgroundColor"),
        };


        _Boxs.push({
          ID: +Boxs[i].id,
          VariableID_Box: parseInt(
            Boxs[i].getAttribute("systemid").match(/\d+/)[0]
          ),
          RowKey: +Boxs[i].getAttribute("rowkey"),
          Label: Boxs[i].value,
          FieldName: Boxs[i].getAttribute("fieldname"),
          Type:
            ChangeTypeUpperCase(Boxs[i].getAttribute("type")) != undefined
              ? ChangeTypeUpperCase(Boxs[i].getAttribute("type"))
              : Boxs[i].type,
          InputType: inputtype(
            ChangeTypeUpperCase(Boxs[i].getAttribute("type")) != undefined
              ? ChangeTypeUpperCase(Boxs[i].getAttribute("type"))
              : Boxs[i].type
          ),
          InputCount: localStorage_Variables.filter(
            (x) => x.RowKey === +Boxs[i].getAttribute("rowkey")
          )[0].InputCount,
          Width: Boxs[i].offsetWidth,
          Height: Boxs[i].offsetHeight,
          Top: Boxs[i].offsetTop,
          Left: Boxs[i].offsetLeft,
          Style: _Style,
          src: Boxs[i].getAttribute("src") ? Boxs[i].getAttribute("src") : "",
          SystemID: Boxs[i].getAttribute("systemid")
            ? Boxs[i].getAttribute("systemid")
            : "",
        });
        _boxObj.PageNum = +pageNumber + 1;
        _boxObj.Value = _Boxs;
        _rawBoxArr[pageNumber] = _boxObj;
      }
    }
  } else {
    _boxObj.PageNum = +pageNumber + 1;
    _boxObj.Value = [];
    _rawBoxArr[pageNumber] = _boxObj;
  }
  $tmpBoxArr = _rawBoxArr;
  $tmpBoxArr = $tmpBoxArr.filter((n) => n);
}

ExportFile = () => {
  const filename = `Document-${_pageKey}.fdm`;
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
};

function ChangeTypeUpperCase(type) {
  switch (type) {
    case "text":
      return "Text";
      break;
    case "number":
      return "Integer";
      break;
    case "time":
      return "Time";
      break;
    case "date":
      return "Date";
      break;
    case "datetime-local":
      return "DateTime";
      break;
    case "checkbox":
      return "Boolean";
    case "Image":
      return "Image";
      break;
    case "Signature":
    return "Signature"
    default:
      break;
  }
}

function ModalConstractor(width, parent) {
  let div =
    '<div id="myModal" class="modal" >' +
    '<div id="formModal" class="modal-content">' +
    '<div id="contentM" class="row col-md-12"></div>' +
    "</div></div>";
  $("#" + parent).append(div);

  $("#myModal").css("display", "block");
  $("#formModal").css("width", width);
}

/*
 *  functions
 * */

function Drag(ev) {
  if (ev.target.id) ev.dataTransfer.setData(`text`, ev.target.id);
}

function Dragleave(ev) {
  $(`.form-group-body , .form-group-mbody`).css(`border`, ``);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function Drop(ev) {
  if (!$(ev.target).hasClass(`noDrop`)) {
    // drop DataProcessChild Items to PasteElement
    const ItemType = $(`#${ev.dataTransfer.getData(`text`)}`).attr(`type`);
    switch (ItemType) {
      case `LatinString`:
      case `LocalString`:
      case `String`:
      case `Computed`:
      case `System`:
      case `Text`:
        TextboxFns(ev, "text");
        break;
      case `BigInteger`:
      case `Integer`:
      case `Money`:
        TextboxFns(ev, "number");
        break;
      case `Time`:
        TextboxFns(ev, "time");
        break;
      case `Date`:
        TextboxFns(ev, "date");
        break;
      case `DateTime`:
        TextboxFns(ev, "datetime-local");
        break;
      case `Boolean`:
        TextboxFns(ev, "checkbox");
        break;
      case `Signature`: 
        SignatureFns(ev)
        break;
      case `Image`:
        ImageFns(ev);
        break;
      case `Table`:
        TableFns(ev);
        break;
      case `Enum`:
        TextboxFns(ev, "text");
        break;
      default:
        break;
    }
  }
}
var $Variables=JSON.parse(localStorage.getItem("Variables" + $ProcessID));
function TableFns(ev) {
 
  const Table_Object = {
    parentID: ev.target,
    cols: $Variables.filter(
      (x) =>
        x.SystemID == $(`#${ev.dataTransfer.getData(`text`)}`).attr("systemid")
    )[0].Columns,
    rowKey: $(`#${ev.dataTransfer.getData(`text`)}`).attr("rowkey"),
    X:
      ev.clientX -
      document.getElementById("divImg").offsetLeft +
      document.body.scrollLeft +
      document.getElementsByClassName("main-content")[0].scrollLeft -
      120,
    Y:
      ev.clientY -
      document.getElementById("divImg").offsetTop +
      document.body.scrollTop +
      document.getElementsByClassName("main-content")[0].scrollTop -
      110,
    style: {
      header: {
        fontFamily: "IRANSansWeb",
        fontSize: 14,
        fontColor: "#000",
        backgroundColor: "#ffffe0",
      },
      body: {
        fontFamily: "IRANSansWeb",
        fontSize: 13,
        fontColor: "#000",
        backgroundColor: "#ffffe0",
      },
    },
    rowsNum: 3,
    systemId: $(`#${ev.dataTransfer.getData(`text`)}`).attr("systemid"),
    fieldName: $(`#${ev.dataTransfer.getData("text")} p`).html(),
  };

  RenderTableBox(Table_Object);
}

function TextboxFns(ev, _type) {
  let _label = "";

  if (_type == "number") {
    _label = 0;
  } else {
    _label = $(`#${ev.dataTransfer.getData("text")} p`).html();
    _label = _label.includes("[") == false ? "[ " + _label + " ]" : _label;
  }
  const Input_Object = {
    parentID: ev.target,
    rowKey: +$(`#${ev.dataTransfer.getData(`text`)}`).attr("rowkey"),
    X:
      ev.clientX -
      document.getElementById("divImg").offsetLeft +
      document.body.scrollLeft +
      document.getElementsByClassName("main-content")[0].scrollLeft -
      120,
    Y:
      ev.clientY -
      document.getElementById("divImg").offsetTop +
      document.body.scrollTop +
      document.getElementsByClassName("main-content")[0].scrollTop -
      110,
    width: "150",
    height: "30",
    fieldName: $(`#${ev.dataTransfer.getData("text")} p`).html(),
    label: _label,
    type: _type,
    Style: {
      fontFamily: "IRANSansWeb",
      fontSize: 14,
      fontColor: "000",
      backgroundColor: "ffffe0",
    },
    systemId: $(`#${ev.dataTransfer.getData(`text`)}`).attr("systemid"),
  };
  RenderTextBox(Input_Object);
}

function ImageFns(ev) {
  const Input_Object = {
    parentID: ev.target,
    rowKey: +$(`#${ev.dataTransfer.getData(`text`)}`).attr("rowkey"),
    X:
      ev.clientX -
      document.getElementById("divImg").offsetLeft +
      document.body.scrollLeft +
      document.getElementsByClassName("main-content")[0].scrollLeft -
      120,
    Y:
      ev.clientY -
      document.getElementById("divImg").offsetTop +
      document.body.scrollTop +
      document.getElementsByClassName("main-content")[0].scrollTop -
      110,
    width: "150",
    height: "100",
    src: $Img_Default,
    systemId: $(`#${ev.dataTransfer.getData(`text`)}`).attr("systemid"),
    fieldName: $(`#${ev.dataTransfer.getData("text")} p`).html(),
  };

  RenderImageBox(Input_Object);
}


function SignatureFns(ev) {
  console.log(ev);
  const Input_Object = {
    parentID: ev.target,
    rowKey: +$(`#${ev.dataTransfer.getData(`text`)}`).attr("rowkey"),
    X:
      ev.clientX -
      document.getElementById("divImg").offsetLeft +
      document.body.scrollLeft +
      document.getElementsByClassName("main-content")[0].scrollLeft -
      120,
    Y:
      ev.clientY -
      document.getElementById("divImg").offsetTop +
      document.body.scrollTop +
      document.getElementsByClassName("main-content")[0].scrollTop -
      110,
    width: "150",
    height: "100",
    src: $Img_Default,
    systemId: $(`#${ev.dataTransfer.getData(`text`)}`).attr("systemid"),
    fieldName: $(`#${ev.dataTransfer.getData("text")} p`).html(),
  };

  RenderSignatureBox(Input_Object);
}


//Move Element
function moveElement(id) {
  //Make the DIV element draggagle:

  dragElement(document.getElementById(id));
  function dragElement(elmnt) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if ($(elmnt).attr("class") == "DivTable") {
      if ($(`#${elmnt.id} tr`)) {
        /* if present, the header is where you move the DIV from:*/
        $($(`#TBL${elmnt.id} tr`)).mousedown((e) => dragMouseDown(e));
      }
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }
    var getOffset = function (el) {
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: el.offsetWidth,
        height: el.offsetHeight,
      };
    };
    function dragMouseDown(e) {
      if ($(`#` + e.target.id).css("cursor") == "move") {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }
    }

    function elementDrag(e) {
      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      //table position
      const top = elmnt.offsetTop - pos2;
      const left = elmnt.offsetLeft - pos1;
      const width = elmnt.offsetWidth;
      const height = elmnt.offsetHeight;
      //divimg position
      const divImg_left = +getOffset(document.getElementById("divImg")).left;
      const divImg_width = +document.getElementById("divImg").offsetWidth;
      const divImg_height = +document.getElementById("divImg").offsetHeight;
      //no exit over divimg
      // set the element's new position:
      //top bottom
      top > 0
        ? (elmnt.style.top =
            top + height > divImg_height
              ? divImg_height - height + "px"
              : (elmnt.style.top = elmnt.offsetTop - pos2 + "px"))
        : (elmnt.style.top = "0px");

      //left right
      left > 0
        ? left + width + divImg_left > divImg_left + divImg_width
          ? (elmnt.style.left = divImg_width - width + "px")
          : (elmnt.style.left = left + "px")
        : (elmnt.style.left = "0px");
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

//change language
function ChangeLang() {
  if (_Lang == "Fa") {
    $(`#page-header span`).prop("class", "fa fa-angle-double-left");
    $(`#out a i`).addClass("fa-rotate-180");
  } else if (_Lang == "En") {
    $(`.rotate`).attr("class", `fa fa-angle-right pull-right rotate`);
    $(`.rotate:first`).attr(
      "class",
      `fa fa-angle-right pull-right rotate fa-rotate-90`
    );

    $(`#page-header span`).prop("class", "fa fa-angle-double-right");
  }

  $(`#content`).css("box-shadow", "0px 0px 0px 0px");
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
        if (event.target.getAttribute("BtnExit") != "true")
          eval(element.getAttribute("onclickoutside"));
      }
    });
  });
}

function inputtype(type) {
  let outputType;
  switch (type) {
    case "String":
    case "Integer":
    case "Money":
    case "Computed":
      outputType = "TextBox";
      break;
    case "Text":
      outputType = "TextBox";
      break;
    case "Date":
      outputType = "DateBox";
      break;
    case "Time":
      outputType = "TimeBox";
      break;
    case "File":
      outputType = "FileBrowse";
      break;
    case "DateTime":
      outputType = "DateTimeBox";
      break;
    case "Enum":
    case "System":
      outputType = "SelectBox";
      break;
    case "Boolean":
      outputType = "CheckBox";
      break;
    case "Image":
      outputType = "Image";
      break;

    default:
      break;
  }
  return outputType;
}

function resizable() {
  var tables = document.getElementsByClassName("resizable");
  for (var i = 0; i < tables.length; i++) resizableGrid(tables[i]);
  function resizableGrid(table) {
    var row = table.getElementsByTagName("tr")[0],
      cols = row ? row.children : undefined;
    if (!cols) return;

    table.style.overflow = "hidden";

    var tableHeight = table.offsetHeight;

    for (var i = 0; i < cols.length; i++) {
      var div = createDiv(tableHeight);
      cols[i].appendChild(div);
      cols[i].style.position = "relative";
      setListeners(div);
    }

    function setListeners(div) {
      var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

      div.addEventListener("mousedown", function (e) {
        curCol = e.target.parentElement;
        nxtCol = curCol.nextElementSibling;
        pageX = e.pageX;

        var padding = paddingDiff(curCol);

        curColWidth = curCol.offsetWidth - padding;
        if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
        e.stopPropagation();
      });

      div.addEventListener("mouseover", function (e) {
        e.stopPropagation();
        e.target.style.borderRight = "2px solid #0000ff";
      });

      div.addEventListener("mouseout", function (e) {
        e.target.style.borderRight = "";
      });

      document.addEventListener("mousemove", function (e) {
        if (curCol) {
          var diffX = e.pageX - pageX;
          curCol.style.width = curColWidth + diffX + "px";
        }
        e.stopPropagation();
      });

      document.addEventListener("mouseup", function (e) {
        curCol = undefined;
        nxtCol = undefined;
        pageX = undefined;
        nxtColWidth = undefined;
        curColWidth = undefined;
        e.stopPropagation();
      });
    }

    function createDiv(height) {
      var div = document.createElement("div");
      div.style.top = 0;
      div.style.right = 0;
      div.style.width = "5px";
      div.style.position = "absolute";
      div.style.cursor = "col-resize";
      div.style.userSelect = "none";
      div.style.height = height + "px";
      return div;
    }

    function paddingDiff(col) {
      if (getStyleVal(col, "box-sizing") == "border-box") {
        return 0;
      }

      var padLeft = getStyleVal(col, "padding-left");
      var padRight = getStyleVal(col, "padding-right");
      return parseInt(padLeft) + parseInt(padRight);
    }

    function getStyleVal(elm, css) {
      return window.getComputedStyle(elm, null).getPropertyValue(css);
    }
  }
}
