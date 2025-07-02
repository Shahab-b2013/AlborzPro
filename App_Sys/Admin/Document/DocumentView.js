/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.1.0.0*/
/* Release Ferdos.BPMS*/

var $DATA_PROCESS;
var DocumentItemID_Generator;
function DocView(Doc) {
  //id constractor
  function IDConstractor() {
    let id = +$DocItemID;
    return () => {
      return id++;
    };
  }
  var $ID = IDConstractor();

  this.RenderTableBox = function (Table_Object) {
    const {
      parentID,
      rowKey,
      cols,
      X,
      Y,
      id = $ID(),
      rowsNum,
      systemId,
      fieldName,
    } = Table_Object;

    //Head
    let _header = Table_Object.style.header;
    const HfontFamily = _header.fontFamily,
      HbackgroundColor = _header.backgroundColor,
      HfontColor = _header.fontColor,
      HfontSize = _header.fontSize;

    let thead = "<tr>";

    if (cols[0].ID != 0)
      thead += `<th style="border: 1px solid ;font-family:${HfontFamily}" id="0">ردیف</th>`;

    for (let i in cols)
      thead += `<th style="width:${(cols[i].Width ??=
        "")}px;border: 1px solid;font-family:${HfontFamily}" id="${(cols[
        i
      ].SubTableID ??= cols[i].ID)}">${cols[i].Label}</th>`;

    thead += `</tr>`;

    //Body
    let _body = Table_Object.style.body;
    const BfontFamily = _body.fontFamily,
      BbackgroundColor = _body.backgroundColor,
      BfontColor = _body.fontColor,
      BfontSize = _body.fontSize;

    let tbody = "";
    for (let j = 0; j < rowsNum; j++) {
      if (cols[0].ID != 0)
        tbody += `<tr><td style="padding:5px;font-family:${BfontFamily};">${
          j + 1
        }</td>`;

      for (let i in cols)
        tbody += `<td style="padding:5px;font-family:${BfontFamily};"> ${
          cols[i].ID == 0 ? j + 1 : "[" + cols[i].Label + "_" + j + "]"
        } </td>`;
      tbody += `</tr>`;
    }

    $(parentID).append(
      `<div id="${id}" class="DivTable" typeof style="position: absolute;left:${X}px;top:${Y}px;">
       <table id="TBL${id}" rowkey="${rowKey}" systemid="${systemId}" fieldname="${fieldName}" type="table" class="TABLES resizable doc-item"style="">
       <thead id="headID_${id}" type="table" onclick="Doc_Prop(this)" style="font-size:${HfontSize}px !important;color:${HfontColor} !important;background-color:${HbackgroundColor};font-family:${HfontFamily};cursor:move">${thead}</thead>
       <tbody id="bodyID_${id}" type="table" onclick="Doc_Prop(this)" style="font-size:${BfontSize}px !important;color:${BfontColor} !important;background-color:${BbackgroundColor};font-family:${BfontFamily};">${tbody}</tbody>
       </table>`
    );
    //Resizable Table
    resizable();

    //move Table
    moveElement(id);
  };

  this.RenderTextBox = function (Input_Object) {
    let {
      type,
      width,
      height,
      parentID,
      id = $ID(),
      rowKey,
      Y,
      X,
      label,
      fieldName,
      systemId,
    } = Input_Object;

    let style = Input_Object.Style;
    const fontFamily = style.fontFamily,
      fontSize = style.fontSize,
      fontColor = style.fontColor,
      backgroundColor = style.backgroundColor;

    if (type == "checkbox") {
      width = "16";
      height = "16";
    }

    if (type == "number") {
      $(parentID).append(
        `<input id="${id}" rowKey=${rowKey} type="${type}" systemid="${systemId}" fieldname="${fieldName}" class="BOXS doc-item" typeof style="position: absolute;left:${X}px !important;top:${Y}px !important;max-height: max-content !important;` +
          `width:${width}px !important;height:${height}px !important;font-size:${fontSize}px !important;` +
          `font-family:${fontFamily} !important;color:${fontColor} !important;cursor:move !important;background-color:${backgroundColor};" min="0" max="100000" value=" ${label} " onclick="Doc_Prop(event)"/>`
      );
    } else {
      $(parentID).append(
        `<input id="${id}" rowKey="${rowKey}" type="${type}" systemid="${systemId}" fieldname="${fieldName}" class="BOXS doc-item" typeof style="position: absolute;left:${X}px !important;top:${Y}px !important;max-height: max-content !important;` +
          `width:${width}px !important;height:${height}px !important;font-size:${fontSize}px !important;` +
          `font-family:${fontFamily} !important;color:${fontColor} !important;cursor:move !important;background-color:${backgroundColor};" value=" ${label}" onclick="Doc_Prop(event)"/>`
      );
    }
    moveElement(id);
    // $(`#` + id).resizable({
    //   helper: "ui-resizable-helper",
    // });
  };

  this.RenderImageBox = function (Input_Object) {
    const {
      parentID,
      id = $ID(),
      rowKey,
      X,
      Y,
      width,
      height,
      src,
      systemId,
      fieldName,
    } = Input_Object;

    $(parentID).append(
      `<img id="${id}" rowKey=${rowKey} class="BOXS doc-item" typeof src="${src}" systemid="${systemId}" fieldname="${fieldName}" type="Image" style="position: absolute;left:${X}px !important;top:${Y}px !important;max-height: max-content !important;` +
        `width:${width}px !important;height:${height}px !important;cursor:move !important;" onclick="Doc_Prop(event)"/>`
    );

    moveElement(id);
  };

  this.RenderSignatureBox = function (Input_Object) {
    const {
      parentID,
      id = $ID(),
      rowKey,
      X,
      Y,
      width,
      height,
      src,
      systemId,
      fieldName,
    } = Input_Object;

    $(parentID).append(
      `<img id="${id}" rowKey=${rowKey} class="BOXS SIGNATURE doc-item" typeof src="${src}" systemid="${systemId}" fieldname="${fieldName}" type="Signature" style="position: absolute;left:${X}px !important;top:${Y}px !important;max-height: max-content !important;` +
        `width:${width}px !important;height:${height}px !important;cursor:move !important;" onclick="Doc_Prop(event)"/>`
    );

    moveElement(id);
  };

  this.getOffset = function (el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: el.offsetWidth,
      height: el.offsetHeight,
    };
  };

  let pageCounter = 0;
  let $currentPageVal = Doc.ImgSrc[pageCounter].Value;
  if (Doc) {
    $("#content").append(
      `<div style = "text-align: center; background-color: #f7f7f7; padding-bottom: 30px; margin:auto;">
      <span>
          <button class="glyphicon glyphicon-forward pageBtn" onclick="LastPage()"></button>
          <button class="glyphicon glyphicon-triangle-right pageBtn" id="Nextbutton" onclick="Next()"></button>
          <span style="color:gray; cursor: default;;" id="pageNumber" index="${pageCounter}" totalPages="${
        Doc.ImgSrc.length
      }">${pageCounter + 1} از ${Doc.ImgSrc.length}</span>
          <button class="glyphicon glyphicon-triangle-left pageBtn" id="previousButton"  onclick="Previous()"></button>
          <button class="glyphicon glyphicon-backward pageBtn"  onclick="Firstpage()"></button>
      </span>
      </div>`
    );
    $("#content").append(
      `<div id="mainDiv" class="noDrop">
        <div id="divImg" onclick="clearBorder(event)" ondrop="Drop(event)" ondragover="allowDrop(event)"
          style="position: relative; background-image: url('${$currentPageVal}');">
        </div>
      </div>`
    );
    //set Size Page
    const Size = Doc.ImgSize;
    if (Size == "A4") {
      $(`#divImg`).css("width", "794px");
      $(`#divImg`).css("height", "1123px");
      $(`#divImg`).css("background-size", "794px 1123px");
    } else if (Size == "A5") {
      $(`#divImg`).css("width", "559px");
      $(`#divImg`).css("height", "794px");
      $(`#divImg`).css("background-size", "559px 794px");
    }
  }

  loadBoxs("firstload");

  function loadBoxs(state) {
    let currentPage = $("#pageNumber").attr("index");
    if (state == "firstload") {
      $tmpBoxArr = Doc.Documents;
    }
    let _boxs = [];
    try {
      _boxs = $tmpBoxArr[currentPage].Value;
    } catch {
      console.log("Error");
    }

    for (let i in _boxs) {
      let Input_Object;
      if (_boxs[i].Type == "Image") {
        Input_Object = {
          parentID: "#divImg",
          rowKey: _boxs[i].RowKey,
          type: _boxs[i].Type,
          X: _boxs[i].Left,
          Y: _boxs[i].Top,
          width: _boxs[i].Width,
          height: _boxs[i].Height,
          src: _boxs[i].src,
          systemId: _boxs[i].SystemID,
          fieldName: _boxs[i].FieldName,
        };
        RenderImageBox(Input_Object);
      } else if (_boxs[i].Type == "Signature") {
        Input_Object = {
          parentID: "#divImg",
          rowKey: _boxs[i].RowKey,
          type: _boxs[i].Type,
          X: _boxs[i].Left,
          Y: _boxs[i].Top,
          width: _boxs[i].Width,
          height: _boxs[i].Height,
          src: _boxs[i].src,
          systemId: _boxs[i].SystemID,
          fieldName: _boxs[i].FieldName,
        };
        RenderSignatureBox(Input_Object);
      } else if (_boxs[i].Type == "Table") {
        const Table_Object = {
          parentID: "#divImg",
          rowKey: _boxs[i].RowKey,
          cols: _boxs[i].Columns,
          X: _boxs[i].Style.Position.Left,
          Y: _boxs[i].Style.Position.Top,
          style: {
            header: {
              fontFamily: _boxs[i].Style.Header.FontFamily,
              fontSize: _boxs[i].Style.Header.FontSize,
              fontColor: _boxs[i].Style.Header.FontColor,
              backgroundColor: _boxs[i].Style.Header.BackgroundColor,
            },
            body: {
              fontFamily: _boxs[i].Style.Body.FontFamily,
              fontSize: _boxs[i].Style.Body.FontSize,
              fontColor: _boxs[i].Style.Body.FontColor,
              backgroundColor: _boxs[i].Style.Body.BackgroundColor,
            },
          },

          rowsNum: _boxs[i].RowsNum,
          systemId: _boxs[i].SystemID,
          fieldName: _boxs[i].FieldName,
        };

        RenderTableBox(Table_Object);
      } else {
        Input_Object = {
          parentID: "#divImg",
          rowKey: _boxs[i].RowKey,
          X: _boxs[i].Left,
          Y: _boxs[i].Top,
          width: _boxs[i].Width,
          height: _boxs[i].Height,
          label: _boxs[i].Label,
          fieldName: _boxs[i].FieldName,
          type: ChangeTypeLowerCase(_boxs[i].Type),
          Style: {
            fontFamily: _boxs[i].Style.FontFamily,
            fontSize: _boxs[i].Style.FontSize,
            fontColor: _boxs[i].Style.FontColor,
            backgroundColor: _boxs[i].Style.BackgroundColor,
          },
          systemId: _boxs[i].SystemID,
        };

        RenderTextBox(Input_Object);
      }
    }
  }

  function removeEl() {
    $("#divImg").empty();
  }

  function updatePageNumber() {
    $("#pageNumber").text(`${pageCounter + 1} از ${Doc.ImgSrc.length}`);
    $("#pageNumber").attr("index", pageCounter);
  }

  //Repeating Next() to create object foreach page
  this.LastPage = function () {
    $currentPageVal = Doc.ImgSrc[Doc.ImgSrc.length - 1].Value;
    for (let i = 0; i < Doc.ImgSrc.length - 1; i++) {
      this.Next();
    }
  };
  this.Firstpage = function () {
    $currentPageVal = Doc.ImgSrc[0].Value;
    pageCounter = 0;
    $("#divImg").css("background-image", `url('${$currentPageVal}')`);
    ExportPage();
    removeEl();
    updatePageNumber();
    loadBoxs("null");
  };
  this.Next = function () {
    if (pageCounter < Doc.ImgSrc.length - 1) {
      pageCounter++;
      $currentPageVal = Doc.ImgSrc[pageCounter].Value;
      // Update the background image of divImg
      $("#divImg").css("background-image", `url('${$currentPageVal}')`);
      ExportPage();
      removeEl();
      updatePageNumber();
      loadBoxs("null");
    }
  };
  this.Previous = function () {
    if (pageCounter > 0) {
      pageCounter--;
      $currentPageVal = Doc.ImgSrc[pageCounter].Value;
      // Update the background image of divImg
      $("#divImg").css("background-image", `url('${$currentPageVal}')`);
      ExportPage();
      removeEl();
      updatePageNumber();
      loadBoxs("null");
    }
  };
  this.clearBorder = function (e) {
    $(`#SettingField i`).removeClass("fa-rotate-90");
    $(`.BOXS`).css("border", "1px dashed #ccc");
    $(`.TABLES tbody`).css("border", "1px solid");
    $(`.TABLES thead`).css("border", "1px solid");
    empty();
  };

  function ChangeTypeLowerCase(type) {
    switch (type) {
      case "Text":
        return "text";
        break;
      case "Integer":
        return "number";
        break;
      case "Time":
        return "time";
        break;
      case "Date":
        return "date";
        break;
      case "DateTime":
        return "datetime-local";
        break;
      case "Boolean":
        return "checkbox";
        break;
      default:
        break;
    }
  }

  //edit element
  var remove_elmn = [];
  var copy_elmn;
  var cloneDivTable;
  var paste_elmn;
  var undo_elmn = [];
  $(document).keydown(function (e) {
    let deleteID = localStorage.getItem("deleteID");
    //Remove
    if (e.keyCode == 46) {
      //isTable
      if (
        $(`#${deleteID}`).prop("tagName") == "TBODY" ||
        $(`#${deleteID}`).prop("tagName") == "THEAD"
      ) {
        remove_elmn.push($(`#${deleteID}`).parent().parent().remove());
        $("#SettingFieldChild").empty();
      } else {
        remove_elmn.push($(`#${deleteID}`).remove());
        $("#SettingFieldChild").empty();
      }
    }

    // //Copy
    // if (e.keyCode == 67 && e.ctrlKey) {
    //   //isTable

    //   if (
    //     $(`#${deleteID}`).prop("tagName") == "TBODY" ||
    //     $(`#${deleteID}`).prop("tagName") == "THEAD"
    //   ) {
    //     cloneDivTable = $(`#${deleteID}`).parent().parent().clone();
    //     copy_elmn = cloneDivTable;
    //   } else {
    //     //is not Table
    //     copy_elmn = $(`#${deleteID}`).clone();
    //   }
    //   copy_elmn[0].style.top = "0px";
    //   copy_elmn[0].style.left = "0px";
    // }

    // //Paste
    // if (e.keyCode == 86 && e.ctrlKey) {
    //   if (copy_elmn.length) {
    //     const ID = $ID();
    //     var moveID;
    //     if (
    //       $(`#${deleteID}`).prop("tagName") == "TBODY" ||
    //       $(`#${deleteID}`).prop("tagName") == "THEAD"
    //     ) {
    //       copy_elmn.attr("id", ID);
    //       copy_elmn.children()[0].id = ID;
    //       copy_elmn.children().children()[0].id = "bodyID_" + ID;
    //       moveID = ID;
    //     } else {
    //       copy_elmn[0].id = ID;
    //       moveID = ID;
    //     }

    //     paste_elmn = copy_elmn;
    //     $(`#divImg`).append(paste_elmn);
    //   }
    //   resizable();
    //   moveElement(moveID);
    // }

    //Undo
    if (e.keyCode == 90 && e.ctrlKey) {
      if (remove_elmn.length) {
        $(`#divImg`).append(remove_elmn.at(-1));
        undo_elmn.push(remove_elmn.at(-1));
        remove_elmn.splice(remove_elmn.length - 1, 1);
      }

      if (paste_elmn) $(paste_elmn).remove();
      $(`.BOXS`).css("border", "1px dashed #ccc");
    }

    //Esc
    if (e.keyCode == 27) {
      copy_elmn = "";
      paste_elmn = "";
    }
  });
}
