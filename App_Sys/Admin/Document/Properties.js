/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.1.0.0*/
/* Release Ferdos.BPMS*/

//Form_group Properties
function Doc_Prop(e) {
  let id;
  clearBorder(e);
  $(`#SettingField i`).addClass("fa-rotate-90");

  if ($(e.target).length == 0) {
    id = $(e)[0].id;
    $(`.DivTable`).attr("onclick", "event.stopPropagation()");
  } else {
    id = e.target.id;
    e.stopPropagation();
  }

  localStorage.setItem("deleteID", id);
  $(`#${id}`).css("border", "2px dashed cornflowerblue");

  let getInputID = id;

  switch ($(`#${id}`).attr("type")) {
    case `text`:
    case `number`:
    case `time`:
    case `date`:
    case `datetime-local`:
      TextboxProp(getInputID);
      break;
    case `checkbox`:
      CheckBoxProp(getInputID);
      break;
    case `table`:
      TableProp(getInputID);
      break;
    case `Image`:
    case `Signature`:
      ImageProp(id);
      break;
    default:
      break;
  }
}
function empty() {
  $(`#SettingFieldChild`).empty();
}
//TextBox Properties
function TextboxProp(id) {
  empty();
  let backColor_RGB = $(`#${id}`)
    .css(`backgroundColor`)
    .replaceAll(`rgb(`, ``)
    .replaceAll(`)`, ``)
    .split(`,`);
  let width = $(`#${id}`).css(`width`).replaceAll(`px`, ``);
  let height = $(`#${id}`).css(`height`).replaceAll(`px`, ``);
  let fieldname = $(`#${id}`).attr(`fieldname`);
  //UI
  let Textbox = `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${docResources.get(
    "text"
  )}</span><table id="PropTable" class="table  table-bordered"> <tbody id="TableProp">`;

  Textbox += `<tr><td class="td1">${docResources.get(
    "fieldname"
  )}</td><td class="td2"><input id="fieldname" class="fontSize" value="${fieldname}" disabled ></td></tr>`;

  Textbox +=
    `<tr><td class="td1">${docResources.get(
      "backcolor"
    )}</td><td class="td2"><input id="backgroundColorTXT" type="color" ` +
    `value="${rgbToHex(
      +backColor_RGB[0],
      +backColor_RGB[1],
      +backColor_RGB[2]
    )}" ></td></tr>`;

  Textbox += `<tr><td class="td1">${docResources.get(
    "width"
  )}</td><td class="td2"><input type='range' min="20" max="800" step="3"  class="textProp" value="${width}" oninput="widthChagne(event,'${id}')"/></td></tr>`;

  Textbox += `<tr><td class="td1">${docResources.get(
    "height"
  )}</td><td class="td2"><input type='range' min="20" max="500" step="3"  class="textProp" value="${height}" oninput="heightChagne(event,'${id}')"/></td></tr>`;

  Textbox += `</tbody ></table></div>`;
  $(`#SettingFieldChild`).append(Textbox);
  FontProp(id, docResources.get("fonttext"));

  //Command
  $(`#backgroundColorTXT`).on(`input`, () => {
    $(`#${id}`).css(`backgroundColor`, $(`#backgroundColorTXT`).val());
  });
  $(`#borderColorTXT`).on(`input`, () => {
    $(`#${id}`).css(`borderColor`, $(`#borderColorTXT`).val());
  });
}

function widthChagne(e, id) {
  if (typeof id === "object") id = $(id).attr("id");
  let changeValue =
    +$(`#${id}`).css("width").replaceAll("px", "") - +$(e.target).val();
  $(`#${id}`).css("width", +$(e.target).val() + "px");
  $(`#${id}`).css(
    "left",
    +$(`#${id}`).css("left").replaceAll("px", "") + changeValue + "px"
  );
}

function heightChagne(e, id) {
  if (typeof id === "object") id = $(id).attr("id");
  $(`#${id}`).css("height", +$(e.target).val() + "px");
}

function TableProp(id) {
  empty();
  let backColor_RGB = $(`#${id}`)
    .css(`backgroundColor`)
    .replaceAll(`rgb(`, ``)
    .replaceAll(`)`, ``)
    .split(`,`);
  let RowLength = +$(`#${id} tr`).length;

  //UI
  let Table =
    `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus">${docResources.get(
      "table"
    )}</span>` +
    `<table id="PropTable" class="table  table-bordered"> <tbody id="TableProp">`;
  Table +=
    `<tr><td class="td1">${docResources.get(
      "backcolor"
    )}</td><td class="td2"><input id="backgroundColorTXT" type="color" ` +
    `value="${rgbToHex(
      +backColor_RGB[0],
      +backColor_RGB[1],
      +backColor_RGB[2]
    )}" ></td></tr>`;

  if (id.split("_")[0] == "bodyID")
    Table += `<tr><td class="td1">${docResources.get(
      "rownum"
    )}</td><td class="td2"><input id="rowCount-${id}" type="number" min="1" max="10" class="fontSize" 
    value="${RowLength}" ></td></tr>`;

  Table += `</tbody ></table></div>`;
  $(`#SettingFieldChild`).append(Table);
  FontProp(id, docResources.get("tablefont"));

  //Command
  $(`#backgroundColorTXT`).on(`input`, () => {
    $(`#${id}`).css(`backgroundColor`, $(`#backgroundColorTXT`).val());
  });

  //onclick
  let idd = $(`#${id}`).parent().attr("id");
  $(`#rowCount-${id}`).on(`input`, (e) => {
    if ($(`#${id}`).attr("type") == "table") {
      if ($(e.target).val() > 10) {
        $(e.target).val(10);
      } else if ($(e.target).val() < 1) {
        $(e.target).val(1);
      }
      let tblRow_clone = $(`#${idd} tbody tr:first`).clone();
      let cells = tblRow_clone[0].cells;
      $(`#${idd} tbody tr`).remove();
      let Tbl_Rows = "";

      for (let j = 0; j < $(e.target).val(); j++) {
        Tbl_Rows += `<tr>`;
        if (j == 0) {
          for (let i = 0; i < cells.length; i++) {
            if (i == 0) {
              Tbl_Rows += `<td>${j + 1}</td>`;
            } else {
              Tbl_Rows += `<td style="width:${cells[i].style.width}">${cells[
                i
              ].innerText.replaceAll("_0 ]", "")}_${j} ]</td>`;
            }
          }
        } else {
          for (let i = 0; i < cells.length; i++) {
            if (i == 0) {
              Tbl_Rows += `<td>${j + 1}</td>`;
            } else {
              Tbl_Rows += `<td>${cells[i].innerText.replaceAll(
                "_0 ]",
                ""
              )}_${j} ]</td>`;
            }
          }
        }
        Tbl_Rows += `</tr>`;
      }

      $(`#${idd} tbody`).append(Tbl_Rows);

      const divtableId = +$(`#${idd}`).attr("id");

      resizable();
      moveElement(divtableId);
    }
  });
}

function ImageProp(id) {
  empty();
  //UI
  let width = $(`#${id}`).css(`width`).replaceAll(`px`, ``);
  let height = $(`#${id}`).css(`height`).replaceAll(`px`, ``);
  let fieldname = $(`#${id}`).attr(`fieldname`);

  let Imagebox =
    `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${docResources.get(
      "Image"
    )}</span>` +
    `<table id="PropTable" class="table  table-bordered"> <tbody id="TableProp">`;

  Imagebox += `<tr><td class="td1">${docResources.get(
    "fieldname"
  )}</td><td class="td2"><input id="fieldname" class="fontSize" value="${fieldname}" disabled ></td><tr/>`;

  Imagebox += `<tr><td class="td1">${docResources.get(
    "width"
  )}</td><td class="td2"><input type='range' min="20" max="800" step="3"  class="textProp" value="${width}" oninput="widthChagne(event,'${id}')"/></td></tr>`;
  Imagebox += `<tr><td class="td1">${docResources.get(
    "height"
  )}</td><td class="td2"><input type='range' min="20" max="500" step="3"  class="textProp" value="${height}" oninput="heightChagne(event,'${id}')"/></td></tr>`;
  Imagebox += `</tbody ></table></div>`;
  $(`#SettingFieldChild`).append(Imagebox);
}

//CheckBox Properties
function CheckBoxProp(id) {
  empty();
  //UI
  let fieldname = $(`#${id}`).attr(`fieldname`);

  let checkBox =
    `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus"> ${docResources.get(
      "check"
    )}</span>` +
    `<table id="PropTable" class="table  table-bordered">` +
    `<tbody id="TableProp">`;

  checkBox += `<tr><td class="td1">${docResources.get(
    "fieldname"
  )}</td><td class="td2"><input id="fieldname" class="fontSize" value="${fieldname}" disabled ></td></tr>`;

  checkBox += `</tbody ></table ></div>`;
  $(`#SettingFieldChild`).append(checkBox);
}

/*
 **FONT
 */
function FontProp(id, text) {
  //UI
  let Default =
    `<div class="PropBorder"><span class="propTitleIcon fa fa-minus-square-o" onclick="Plus_Minus_Prop(this)"></span><span class="propTitlePlus">${text}</span>` +
    `<table class="table  table-bordered" style=""><tbody id="TableProp"><tr><td class="td1">${docResources.get(
      "fontfamily"
    )}</td><td class="td2"><select id="fontFamily-${id}" class="selectProp">` +
    `<option value="IRANSansWeb">IRANSansWeb</option>` +
    `<option value="B Titr">B Titr</option>` +
    `<option value="B Badr">B Badr</option>` +
    `<option value="Tahoma">Tahoma</option>` +
    `<option value="Source Sans Pro">Source Sans Pro</option>` +
    `</select></td></tr>`;
  Default += `<tr><td class="td1">${docResources.get(
    "fontsize"
  )}</td><td class="td2"><input id="fontSize-${id}" type="number" class="fontSize"  value="14"></td></tr>`;

  Default += `<tr><td class="td1">${docResources.get(
    "fontcolor"
  )}</td><td class="td2"><input id="fontColor-${id}" type="color" class="fontColor"  value="#000000"></td></tr></tbody></table></div>`;
  $(`#SettingFieldChild`).append(Default);

  //get font setting
  let SetFontFamily;
  if (id.split("_")[0] == "headID") {
    SetFontFamily = $(`#${id} th`).css(`font-family`).replaceAll(`"`, ``);
  } else if (id.split("_")[0] == "bodyID") {
    SetFontFamily = $(`#${id} td`)
      .css(`font-family`)
      .split(`,`)[0]
      .replaceAll(`"`, ``);
  } else {
    SetFontFamily = $(`#${id}`).css(`font-family`).replaceAll(`"`, ``);
  }

  const SetFontSize = $(`#${id}`).css(`font-size`).replaceAll(`px`, ``);
  const SetFontColor = $(`#${id}`)
    .css(`color`)
    .replaceAll(`rgb(`, ``)
    .replaceAll(`)`, ``)
    .split(`,`);

  //onload
  $(`#fontFamily-${id}`).val(SetFontFamily);
  $(`#fontSize-${id}`).val(SetFontSize);
  $(`#fontColor-${id}`).val(
    rgbToHex(+SetFontColor[0], +SetFontColor[1], +SetFontColor[2])
  );

  //onclick
  $(`#fontFamily-${id}`).on(`input`, () => {
    if (id.split("_")[0] == "headID") {
      $(`#${id} th`).css(
        `font-family`,
        $(`#fontFamily-${id}`).val().replaceAll(`"`, ``)
      );
    } else if (id.split("_")[0] == "bodyID") {
      $(`#${id} td`).css(
        `font-family`,
        $(`#fontFamily-${id}`).val().replaceAll(`"`, ``)
      );
    } else {
      $(`#${id}`).css(
        `font-family`,
        $(`#fontFamily-${id}`).val().replaceAll(`"`, ``)
      );
    }
  });

  $(`#fontSize-${id}`).on(`input`, () =>
    $(`#${id}`).css(`font-size`, +$(`#fontSize-${id}`).val())
  );
  $(`#fontColor-${id}`).on(`input`, () =>
    $(`#${id}`).css(`color`, $(`#fontColor-${id}`).val())
  );
}

//Font  Settings
function Plus_Minus_Prop(elem) {
  let Item = $(elem).parent().children().eq(2);
  if (Item.css(`display`) == `none`) {
    Item.show();
    $(elem).attr(`class`, `propTitleIcon fa fa-minus-square-o`);
  } else {
    Item.hide();
    $(elem).attr(`class`, `propTitleIcon fa fa-plus-square-o`);
  }
}

function DataVariable() {
  if ($DATA_PROCESS) {
    let variables = $DATA_PROCESS.Variables;
    return variables.map(
      (Item) => `<option value="${Item.Label}">${Item.Label}</option>`
    );
  }
}
function br() {
  $(`#SettingFieldChild`).append(document.createElement(`br`));
}
