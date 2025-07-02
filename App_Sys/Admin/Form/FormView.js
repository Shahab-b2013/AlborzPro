/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.2.0*/
/* Release Ferdos.BPMS*/

var _reportID;
var FormItemID_Generator;
var FormGroupBoxsID_Generator;

function FormView($JSON) {
  // form item create id

  let local = (localStorage_Variables = JSON.parse(
    localStorage.getItem("Variables" + $ProcessID)
  ));

  function FormItem_Generator() {
    let id = $FormItemID + "";
    return () => {
      let p = id;
      let plusLast_Number = +id.slice(-2) + 1 + "";
      plusLast_Number =
        plusLast_Number < 10 ? "0" + plusLast_Number : plusLast_Number;
      id = id.slice(0, -2) + plusLast_Number;
      return +p;
    };
  }
  FormItemID_Generator = FormItem_Generator();

  //row create id
  function FormGroup_Generator() {
    let id = $FormGroupBoxID;
    return () => {
      let plusLast_Number = +id.slice(-1) + 1 + "";
      id = id.slice(0, -1) + plusLast_Number;
      return +id;
    };
  }
  FormGroupBoxsID_Generator = FormGroup_Generator();

  //empty sidebarchildren
  SettingChild_empty();

  _reportID = +`125` >= 3000000 ? id : 5;
  let content;
  let bodyID = `#content`;
  let _formGroups = $JSON;

  //#region Render Form Items Layout & Grouping

  if (_formGroups.ItemsGrouping) {
    try {
      $.each(_formGroups.FormGroupBoxs, function (index, formGroup) {
        content =
          `<div style="${
            formGroup.Visibility == `true` ? `` : ``
          }" id="form-group-${formGroup.FormGroupBoxID}"` +
          ` class="row form-group-box" ondragenter="allowDrop(event)" >`;

        if (formGroup.GroupDisplayMode == `GroupWithBox`) {
          content +=
            `<div class="col-lg-2 col-md-2 group-info noDrop" id="group-info-${formGroup.FormGroupBoxID}"` +
            ` onclick="GroupProp(this)"><h4 class="group-title">${
              formGroup.Label == "[Default Box]"
                ? formResources.get("defaultbox")
                : formGroup.Label
            }<br/><small>${formGroup.Description}</small></h4></div>`;
        }

        let columnWidth = formGroup.ColumnWidth;

        if (formGroup.ColumnLayout == `OnceColumn`) {
          if (columnWidth == `default`) {
            columnWidth = `col-lg-8 col-md-10`;
          }

          content +=
            `<div class="${columnWidth} col-sm-12  col-xs-12 form-group-body"  ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)"` +
            `id="form-group-body-${formGroup.FormGroupBoxID}-0"></span></div><div class="col-md-1 noDrop" ondragover="allowDrop(event)" id="miniDiv-1${formGroup.FormGroupBoxID}"` +
            ` onclick="GroupProp(this)"></div>`;
        }

        if (formGroup.ColumnLayout == `TwoColumn`) {
          columnWidth = `col-md-4`;

          content +=
            `<div class="${columnWidth} form-group-body"  ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)" ` +
            `id="form-group-body-${formGroup.FormGroupBoxID}-0"></div><div  class="col-md-1 noDrop" ondragover="allowDrop(event)" ` +
            `id="miniDiv-2-0${formGroup.FormGroupBoxID}" onclick="GroupProp(this)"></div><div class="${columnWidth} form-group-body"  ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)" ` +
            `id="form-group-body-${formGroup.FormGroupBoxID}-1"></div>`;
        }

        if (formGroup.ColumnLayout == `ThreeColumn`) {
          columnWidth = `col-md-3`;
          content +=
            `<div class="${columnWidth} form-group-body"  ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)" ` +
            `id="form-group-body-${formGroup.FormGroupBoxID}-0"></div><div class="" ondragover="allowDrop(event)" ` +
            `id="miniDiv-2-0${formGroup.FormGroupBoxID}" onclick="GroupProp(this)"></div><div class="${columnWidth} form-group-body"  ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)" ` +
            `id="form-group-body-${formGroup.FormGroupBoxID}-1"></div><div class="${columnWidth} form-group-body"  ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)" ` +
            `id="form-group-body-${formGroup.FormGroupBoxID}-2"></div>`;
        }

        //btn json default
        content += Group_Btn(formGroup.FormGroupBoxID) + `</div>`;
        $(bodyID).append(content);
        if (formGroup.GroupDisplayMode == `GroupWithTitle`) {
          $(`#form-group-body-${formGroup.FormGroupBoxID}-0`).append(
            `<h4 class="group-title">${formGroup.Label}<br /><small>${formGroup.Description}</small></h4>`
          );
        }
      });
    } catch (e) {
      //   raiseError(e, bodyID);

      return;
    }
  } else {
    try {
      content = `<div class="row form-group-box">`;

      let columnWidth = formGroup.ColumnWidth;

      if (formGroup.ColumnLayout == `OnceColumn`) {
        if (columnWidth == `default`) {
          columnWidth = `col-lg-8 col-md-8`;
        }

        content += `<div class="${columnWidth} form-group-mbody"  id="form-group-mbody-${formGroup.FormID}-0"  ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)></div>`;
      }

      if (formGroup.ColumnLayout == `TwoColumn`) {
        columnWidth = `col-md-4`;

        content +=
          `<div class="${columnWidth} form-group-mbody" id="form-group-mbody-${formGroup.FormID}-0"  ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)></div><div class="col-md-1 noDrop" ondragover="allowDrop(event)"></div>` +
          `<div class="${columnWidth} form-group-mbody" id="form-group-mbody-${formGroup.FormID}-1"  ondrop="Drop(event)" ondragleave="Dragleave(event)" ondragover="allowDrop(event)></div><div class="col-md-1 noDrop" ondragover="allowDrop(event)"></div>`;
      }
      content += `</div>`;

      $(bodyID).append(content);
    } catch (e) {
      //   raiseError(e, bodyID);

      return;
    }
  }

  //#endregion

  //#region Render Form Items

  var parentID = ``;

  var _formItems = $JSON;

  var itemsGrouping = _formGroups.ItemsGrouping;

  $(`#ContentHeader`).html(_formItems.Label);

  let PasswordOBJ = [];
  $.each(_formItems.FormItems, function (index, formItem) {
    itemsGrouping
      ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
      : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);

    //#region set old fdm to new fdm for update version
    let x = local.filter((x) => x.RowKey == formItem.ForeignKey);

    if (formItem.SystemID == "undefined" || formItem.SystemID == undefined) {
      if (x.length) formItem.SystemID = x[0].SystemID;
    }

    if (
      formItem.VariableID == "undefined" ||
      formItem.VariableID == undefined
    ) {
      if (x.length) formItem.VariableID = x[0].VariableID;
    }

    if (x.length) formItem.Nullable = x[0].Nullable;

    //#endregion
    switch (formItem.DataType) {
      case `String`:
      case `LatinString`:
      case `LocalString`:
      case `Computed`:
        RenderTextBox(formItem, parentID, formItem.ActivityID);
        break;
      case `Text`:
        RenderTextArea(formItem, parentID);
        break;
      case `BigInteger`:
      case `Integer`:
      case `Money`:
        RenderNumberBox(formItem, parentID);
        break;
      case `Time`:
        RenderTimeBox(formItem, parentID);
        break;
      case `Date`:
        RenderDateBox(formItem, parentID);
        break;
      case `DateTime`:
        RenderDateTimeBox(formItem, parentID);
        break;
      case `Boolean`:
        RenderCheckBox(formItem, parentID);
        break;
      case `Password`:
        PasswordOBJ.push(formItem);
        if (PasswordOBJ.length == 2) {
          RenderPasswordBox("oldItem", PasswordOBJ, parentID);
          PasswordOBJ = [];
        }
        break;
      case `File`:
      case `Image`:
        RenderFileBox(formItem.DataType, formItem, parentID);
        break;
      // case `Image`:
      //   RenderImage(formItem.DataType, formItem, parentID);
      //   break;
      case `Enum`:
      case `System`:
        RenderSelectBox(formItem, parentID, formItem.ActivityID);
        break;
      case `Table`:
        RenderTableBox(formItem, parentID, formItem.ActivityID);
        break;
        case `SelectiveTable`:
          RenderSelectiveTableBox(formItem, parentID, formItem.ActivityID);
          break;
      case "Agreement":
        RenderAgreement(formItem, parentID);
        break;
      case "Sms":
        RenderSms(formItem, parentID);
        break;
      case "FacilityBox":
        RenderFacilities(formItem, parentID);
        break;
      case "TimingBox":
        RenderTimingbox(formItem, parentID);
        break;
      default:
        break;
    }
  });
}

//***end items

function RenderAgreement(itemObj, parentID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    UnitToDisplay,
    Name,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;
  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    txtBackgroundColor,
    txtfontsize = "14px",
    txtBorderColor,
    txtFontFamily,
    txtColor,
  } = Style;
  let placeholder = ``;
  let toggle = ``;
  let itemContent =
    toggle +
    `<div style="${
      Visibility == `true` ? `` : ``
    }" class="form-group noDrop" draggable="true"  ondragstart="Drag(event)" ondragend="Dragend(event)" ` +
    `id="form-group-${FormItemID}" foreignkey="${ForeignKey}" fixlabel="${FixLabel}"  onmousedown="Form_Group_Prop(id)" disabled><div style="padding: 10px;
       "><label class="form-item-lbl noDrop  lbl" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};" ` +
    `id="form-group-lbl-${FormItemID}">${Label} ${
      UnitToDisplay != undefined ? UnitToDisplay : ``
    }</label><div class="input-group" ><div style="width: 100%;"><textarea datatype="${DataType}"
        enumtypeid="${EnumTypeID}"  visibility="${
      Visibility == "" ? "false" : Visibility
    }"  IsRequired="false" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" 
        inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   style="border:1px solid #ccc;border-radius:5px !important;background-color:${txtBackgroundColor};font-size:${txtfontsize};border-color:${txtBorderColor};
        font-family:${txtFontFamily};color:${txtColor};height:170px;" title="${
      _reportID == null ? Name : ``
    }" class="form-control form-input noDrop"  ` +
    `id="form-item-${FormItemID}" placeholder="${placeholder}" oninput="this.setAttribute('defaultvalue', this.value)" value="${DefaultValue}">${DefaultValue}</textarea></div></div></div>`;

  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")} ${
      UnitToDisplay != undefined ? UnitToDisplay : ``
    }</label>`;

  itemContent += `<div class="Del_FormGroup" onclick="Del_FormGroup(this)" ><span><img class="ImgIcon" src="data:image/png;base64,${$DELICON}"/></span></div>`;

  if (SubTextVisible || (Description != `` && Description != null))
    itemContent += `<small class="text-muted">${Description}</small>`;

  itemContent += `</div>`;
  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}

function RenderFacilities(itemObj, parentID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    UnitToDisplay,
    Name,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;

  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    txtBackgroundColor,
    txtfontsize = "14px",
    txtBorderColor,
    txtFontFamily,
    txtColor,
  } = Style;
  let placeholder = ``;
  let toggle = ``;

  let itemContent =
    toggle +
    `<div style="${
      Visibility == `true` ? `` : ``
    }" class="form-group noDrop" draggable="true"  ondragstart="Drag(event)" ondragend="Dragend(event)" ` +
    `id="form-group-${FormItemID}" foreignkey="${ForeignKey}" fixlabel="${FixLabel}"  onmousedown="Form_Group_Prop(id)" disabled><div style="padding: 10px;
         "><label class="form-item-lbl noDrop  lbl" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};" ` +
    `id="form-group-lbl-${FormItemID}">${Label} ${
      UnitToDisplay != undefined ? UnitToDisplay : ``
    }</label><div class="input-group" ><div style="width: 100%;"><table datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${
      Visibility == "" ? "false" : Visibility
    }"
           IsRequired="false" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula = "${Formula}" variableid = "${VariableID}" systemid = "${SystemID}"  inputtype = "${InputType}"
           inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}  class="form-control form-input noDrop tableFacilities" id="form-item-${FormItemID}">
          <thead><tr><th>ردیف</th><th>نوع</th><th>تعداد استفاده در ماه</th><th>تعداد مجاز ماهانه</th><th>توضیحات</th></tr>
          </thead><tbody><tr><td>1</td><td></td><td></td><td></td><td></td></tr>
          </tbody></table></div></div></div>`;

  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")} ${
      UnitToDisplay != undefined ? UnitToDisplay : ``
    }</label>`;

  itemContent += `<div class="Del_FormGroup" onclick="Del_FormGroup(this)" ><span><img class="ImgIcon" src="data:image/png;base64,${$DELICON}"/></span></div>`;

  if (SubTextVisible || (Description != `` && Description != null))
    itemContent += `<small class="text-muted">${Description}</small>`;

  itemContent += `</div>`;
  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}
function RenderTimingbox(itemObj, parentID) {
  let {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    UnitToDisplay,
    Name,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;

  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    txtBackgroundColor,
    txtfontsize = "14px",
    txtBorderColor,
    txtFontFamily,
    txtColor,
  } = Style;

  let placeholder = ``;
  let toggle = ``;
  let itemContent =
    toggle +
    `<div style="${
      Visibility == `true` ? `` : ``
    }" class="form-group noDrop" draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)"` +
    `id="form-group-${FormItemID}" foreignkey="${ForeignKey}" fixlabel="${FixLabel}" onmousedown ="Form_Group_Prop(id)"><label class="form-item-lbl noDrop lbl" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};" ` +
    `id="form-group-lbl-${FormItemID}">${Label} ${
      UnitToDisplay != undefined ? UnitToDisplay : ``
    }</label><div class="input-group" ></div ><div datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${
      Visibility == "" ? "false" : Visibility
    }" IsRequired="${
      IsRequired == "" ? "false" : IsRequired
    }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   title="${
      _reportID == null ? Name : ``
    }" class="form-control form-input noDrop" ` +
    `id="form-item-${FormItemID}" placeholder="${placeholder}" style=" padding-top: 10px;display: grid ;grid-template-columns: repeat(3, 1fr) ; gap: 10px ; height: 105px !important;background-color:${txtBackgroundColor};font-size:${txtfontsize};border-color:${txtBorderColor};font-family:${txtFontFamily};color:${txtColor}" >`;

  let Times = [
    { Label: "Time 1" },
    { Label: "Time 2" },
    { Label: "Time 3" },
    { Label: "Time 4" },
    { Label: "Time 5" },
    { Label: "Time 6" },
    { Label: "..." },
  ];
  for (let i = 0; i < Times.length; i++) {
    itemContent += `
    <div id="Times${Times[i].StartTime}" style="font-size: 13px; margin-right: 25px; margin-bottom: 2% ; cursor : default ;">
          <input type="radio" style = "margin-left:5px;">${Times[i].Label}
          </div>`;
  }

  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint">${(Hint ??= "")} ${
      UnitToDisplay != undefined ? UnitToDisplay : ``
    }</label>`;

  itemContent += `</div><div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,${$DELICON}"/></span></div>`;

  if (SubTextVisible || (Description != `` && Description != null))
    itemContent += `<small class="text-muted">${Description}</small>`;

  itemContent += `</div>`;
  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  //show properties

  Form_Group_Prop(`form-group-${FormItemID}`);
}
function RenderSms(itemObj, parentID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    Name,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;
  const { lblFontFamily, lblfontsize, lblColor } = Style;
  try {
    let itemContent =
      `<div class="form-group noDrop" draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" style="` +
      (Visibility == `true` ? ` ` : ``) +
      `" id="form-group-` +
      FormItemID +
      `"  foreignkey="${ForeignKey}" fixlabel="${FixLabel}"  onmousedown="Form_Group_Prop(id)"><div class="checkbox  noDrop"><input datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${
        Visibility == "" ? "false" : Visibility
      }"  IsRequired="false" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" checked disabled formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only='false'   class="noDrop"  type="checkbox"  title="` +
      Name +
      `" id="form-item-` +
      FormItemID +
      `" />&nbsp;` +
      ` <label class="form-item-lbl noDrop lbl" id="form-group-lbl-` +
      FormItemID +
      `"style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};" class="input-checkbox-label">` +
      Label +
      `</label></div>`;

    itemContent +=
      `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
      `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")}</label>`;
    itemContent +=
      `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
      $DELICON +
      `"/></span></div>`;

    if (SubTextVisible)
      itemContent += `<small class="text-muted">` + Description + `</small>`;

    itemContent += `</div>`;
    $(parentID).hasClass("PasteElement")
      ? $(parentID).replaceWith(itemContent)
      : $(parentID).append(itemContent);
  } catch (e) {
    // raiseError(e, "#form-group-" + itemObj.FormItemID);

    return;
  }
  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}

function RenderTextBox(itemObj, parentID) {
  let {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    UnitToDisplay,
    Name,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;

  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    txtBackgroundColor,
    txtfontsize = "14px",
    txtBorderColor,
    txtFontFamily,
    txtColor,
  } = Style;

  let placeholder = ``;
  let toggle = ``;
  let itemContent =
    toggle +
    `<div style="${
      Visibility == `true` ? `` : ``
    }" class="form-group noDrop" draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)"` +
    `id="form-group-${FormItemID}" foreignkey="${ForeignKey}" fixlabel="${FixLabel}" onmousedown ="Form_Group_Prop(id)"><label class="form-item-lbl noDrop lbl" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};" ` +
    `id="form-group-lbl-${FormItemID}">${Label} ${
      UnitToDisplay != undefined ? UnitToDisplay : ``
    }</label><div class="input-group" ><div class="input-group-addon"><span class="glyphicon glyphicon-edit">` +
    `</span ></div ><input datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${
      Visibility == "" ? "false" : Visibility
    }" IsRequired="${
      IsRequired == "" ? "false" : IsRequired
    }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   title="${
      _reportID == null ? Name : ``
    }" class="form-control form-input noDrop" ` +
    `id="form-item-${FormItemID}" placeholder="${placeholder}" style="background-color:${txtBackgroundColor};font-size:${txtfontsize};border-color:${txtBorderColor};font-family:${txtFontFamily};color:${txtColor}" ></div>`;

  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint">${(Hint ??= "")} ${
      UnitToDisplay != undefined ? UnitToDisplay : ``
    }</label>`;

  itemContent += `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,${$DELICON}"/></span></div>`;

  if (SubTextVisible || (Description != `` && Description != null))
    itemContent += `<small class="text-muted">${Description}</small>`;

  itemContent += `</div>`;
  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  //show properties

  Form_Group_Prop(`form-group-${FormItemID}`);
}

function titlePopup(id) {
  let div =
    '<div id="myModal" class="modal" >' +
    '<div id="modalPopUp" class="modal-content">' +
    "</div></div>";
  $("#content").append(div);

  $("#myModal").css("display", "block");
  $("#modalPopUp").css("width", "500px");

  let item = "";
  item += `<div id="Title" style="font-size:14px;"><span class="" style=""></span>${formResources.get(
    "inserttitle"
  )}</div>`;
  item += `<div id="mainPopup" style="border-bottom:1px solid #ccc"><div class="divPopup"><label class="lblPopup lbl">${formResources.get(
    "fixLabel"
  )}</label><input id="input1" oninput="oninputPop(id)" type="text" class="txtPopup" onkeypress="return submitOk(event,${id})" /></div></div>`;
  item += `<div><button id="btnPopup" class="btn btn-primary btn_submint_exit" onclick="btnPopup(${id})">${formResources.get(
    "insert"
  )}</button>`;
  item += `<button id="btnPopup" class="btn btn-light btn_submint_exit" onclick="btnCancel(${id})" style="margin:0px 5px;">${formResources.get(
    "cancel"
  )}</button></div>`;
  item += `</div>`;
  $(`#modalPopUp`).append(item);
  $(`#input1`).focus();
}
function submitOk(ev, id) {
  if (ev.keyCode == 13) btnPopup(id);
}

function insertPopup(event, id) {
  if (event.keyCode == 13) btnPopup(id);
}
function oninputPop(id) {
  if ($(`#` + id).val() == "") {
    $(`#` + id).css("border", "1px solid red");
    $(`#` + id).css("border-radius", "2px");
  } else {
    $(`#` + id).css("color", "#000");
    $(`#` + id).css("border", "1px solid #ccc");
  }
}

function btnPopup(id) {
  let Enable = true;
  if ($(`#input1`).val() == "") {
    $(`#input1`).css("border", "1px solid red");
    $(`#input1`).css("border-radius", "2px");
  } else {
    const value = $(`#input1`).val();
    let local = (localStorage_Variables = JSON.parse(
      localStorage.getItem("Variables" + $ProcessID)
    ));
    for (let i in local) {
      if (value == local[i].Label) {
        $(`#input1`).val("");
        $(`#input1`).attr("placeholder", formResources.get("repeat_title"));
        $(`#input1`).css("border", "1px solid red");
        Enable = false;
      }
    }

    let formElem = $(`.form-group`);
    for (let i = 0; i < formElem.length; i++) {
      if (value == $(formElem[i]).attr("fixlabel")) {
        if ("form-group-" + id != $(formElem[i]).attr("id")) {
          $(`#input1`).val("");
          $(`#input1`).attr("placeholder", formResources.get("repeat_title"));
          $(`#input1`).css("border", "1px solid red");
          Enable = false;
        }
      }
    }

    if (Enable) {
      $(`#myModal`).remove();
      $(`#form-group-` + id).attr("fixlabel", value);
      $(`#form-group-lbl-` + id).text(value);
      $(`#FixLabel`).val(value);
      $(`#textlbl`).val(value);
    }
  }

  let getAllInput = $(`[systemid]`).not(".DataProcessElement");
  let temArr = [];
  for (let i = 0; i < getAllInput.length; i++) {
    temArr.push($(getAllInput[i]).attr("systemid").slice(3));
  }
  let LastSystemID = temArr.sort((a, b) => a - b);

  LastSystemID = "Val" + LastSystemID.at(-1);
  try {
    saveDesign(false, false);
  } finally {
    const localSystemID = localStorage.getItem("LastSystemID" + $ProcessID);
    if (LastSystemID > localSystemID) {
      localStorage.setItem("LastSystemID" + $ProcessID, LastSystemID);
    }
  }
  //todo
}

function btnCancel(id) {
  $(`#myModal`).remove();
  $(`#SettingFieldChild`).empty();
  $(`#SettingField i`).removeClass("rotate fa-rotate-90");
  $(`#form-group-` + id).remove();
}
function RenderTextArea(itemObj, parentID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    UnitToDisplay,
    Name,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;
  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    txtBackgroundColor,
    txtfontsize = "14px",
    txtBorderColor,
    txtFontFamily,
    txtColor,
  } = Style;
  let placeholder = ``;
  let toggle = ``;
  let itemContent =
    toggle +
    `<div style="${
      Visibility == `true` ? `` : ``
    }" class="form-group noDrop" draggable="true"  ondragstart="Drag(event)" ondragend="Dragend(event)" ` +
    `id="form-group-${FormItemID}" foreignkey="${ForeignKey}" fixlabel="${FixLabel}"  onmousedown="Form_Group_Prop(id)" disabled><label class="form-item-lbl noDrop  lbl" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};" ` +
    `id="form-group-lbl-${FormItemID}">${Label} ${
      UnitToDisplay != undefined ? UnitToDisplay : ``
    }</label><div class="input-group" ><div class="input-group-addon"><span class="glyphicon glyphicon-edit">` +
    `</span ></div ><textarea datatype="${DataType}" enumtypeid="${EnumTypeID}"  visibility="${
      Visibility == "" ? "false" : Visibility
    }"  IsRequired="${
      IsRequired == "" ? "false" : IsRequired
    }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   style="background-color:${txtBackgroundColor};font-size:${txtfontsize};border-color:${txtBorderColor};font-family:${txtFontFamily};color:${txtColor};height:170px;" title="${
      _reportID == null ? Name : ``
    }" class="form-control form-input noDrop"  ` +
    `id="form-item-${FormItemID}" placeholder="${placeholder}"></textarea></div>`;

  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")} ${
      UnitToDisplay != undefined ? UnitToDisplay : ``
    }</label>`;

  itemContent += `<div class="Del_FormGroup" onclick="Del_FormGroup(this)" ><span><img class="ImgIcon" src="data:image/png;base64,${$DELICON}"/></span></div>`;

  if (SubTextVisible || (Description != `` && Description != null))
    itemContent += `<small class="text-muted">${Description}</small>`;

  itemContent += `</div>`;
  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}

function RenderNumberBox(itemObj, parentID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;
  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    txtBackgroundColor,
    txtfontsize = "14px",
    txtBorderColor,
    txtFontFamily,
    txtColor,
  } = Style;
  let itemContent =
    `<div style="` +
    (Visibility == `true` ? `` : ``) +
    `" class="form-group noDrop" draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" id="form-group-` +
    FormItemID +
    `" foreignkey="${ForeignKey}" fixlabel="${FixLabel}" onmousedown="Form_Group_Prop(id)"><label class="form-item-lbl noDrop  lbl"  id="form-group-lbl-${FormItemID}" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};">${Label}</label>` +
    `<div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-edit"></span></div><input datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${
      Visibility == "" ? "false" : Visibility
    }" IsRequired="${
      IsRequired == "" ? "false" : IsRequired
    }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   type="number" class="form-control form-input noDrop" style="background-color:${txtBackgroundColor};font-size:${txtfontsize};border-color:${txtBorderColor};font-family:${txtFontFamily};color:${txtColor};height:38px;margin:0px" id="form-item-` +
    FormItemID +
    `" ></div>`;

  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")}</label>`;

  itemContent +=
    `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
    $DELICON +
    `"/></span></div>`;

  if (SubTextVisible) {
    itemContent += `<small class="text-muted">` + Description + `</small>`;
  }
  itemContent += `</div>`;
  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  if (InputType == "MoneyBox") {
    let elem = $(`#form-item-from-${FormItemID}`);
    elem.prev().children().attr("class", "glyphicon glyphicon-euro");
  }

  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}

function RenderTimeBox(itemObj, parentID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    DefaultValChecked,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;

  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    txtBackgroundColor,
    txtfontsize = "14px",
    txtBorderColor,
    txtFontFamily,
    txtColor,
  } = Style;
  try {
    let itemContent =
      `<div draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" style="` +
      (Visibility == `true` ? `` : ``) +
      `" class="form-group noDrop"  id="form-group-` +
      FormItemID +
      `"  foreignkey="${ForeignKey}" fixlabel="${FixLabel}"  onmousedown="Form_Group_Prop(id)"><label class="form-item-lbl noDrop lbl"  id="form-group-lbl-${FormItemID}" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};">` +
      Label +
      `</label><div class="input-group"><div id="picker-` +
      FormItemID +
      `" data-mdpersiandatetimepickershowing="false" title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker="" style="cursor: pointer;" class="input-group-addon" data-mddatetimepicker="true" data-targetselector="#form-item-` +
      FormItemID +
      `" data-trigger="click"  data-placement="auto" data-englishnumber="true" ><span class="glyphicon glyphicon-time"></span></div><input  defaultvalChecked="${DefaultValChecked}" datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${
        Visibility == "" ? "false" : Visibility
      }" IsRequired="${
        IsRequired == "" ? "false" : IsRequired
      }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   class="form-control form-input noDrop" id="form-item-` +
      FormItemID +
      `" placeholder="` +
      `" data-trigger="click"  data-placement="auto" data-englishnumber="true" dir="ltr" style="background-color:${txtBackgroundColor};font-size:${txtfontsize};border-color:${txtBorderColor};font-family:${txtFontFamily};color:${txtColor};"></div>`;

    itemContent +=
      `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
      `id="form-group-lbl-${FormItemID}-hint">${(Hint ??= "")}</label>`;

    itemContent +=
      `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
      $DELICON +
      `"/></span></div>`;

    if (SubTextVisible)
      itemContent += `<small class="text-muted">` + Description + `</small>`;
    itemContent += `</div>`;
    $(parentID).hasClass("PasteElement")
      ? $(parentID).replaceWith(itemContent)
      : $(parentID).append(itemContent);

    //show properties
    Form_Group_Prop(`form-group-${FormItemID}`);
  } catch (e) {
    // raiseError(e, `#form-group-` + itemObj.FormItemID);

    return;
  }
}
function RenderDateBox(itemObj, parentID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    DefaultValChecked,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;
  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    txtBackgroundColor,
    txtfontsize = "14px",
    txtBorderColor,
    txtFontFamily,
    txtColor,
  } = Style;
  let placeholder = ``;

  let itemContent =
    `<div draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" style="` +
    (Visibility == `true` ? ` ` : ``) +
    `" class="form-group noDrop"  id="form-group-` +
    FormItemID +
    `"  foreignkey="${ForeignKey}" fixlabel="${FixLabel}" onmousedown="Form_Group_Prop(id)"><label class="form-group-lbl noDrop lbl"  id="form-group-lbl-${FormItemID}" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};">` +
    Label +
    `</label><div class="input-group"><div id="picker-` +
    FormItemID +
    `" data-mdpersiandatetimepickershowing="false" title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker=""` +
    ` style="cursor: pointer;" class="input-group-addon" data-mddatetimepicker="true" data-targetselector="#form-item-` +
    FormItemID +
    `" data-trigger="click"  data-placement="auto" data-englishnumber="true" ><span class="glyphicon glyphicon-calendar"></span></div><input  datatype="${DataType}" enumtypeid="${EnumTypeID}"  defaultvalChecked="${DefaultValChecked}" visibility="${
      Visibility == "" ? "false" : Visibility
    }"  IsRequired="${
      IsRequired == "" ? "false" : IsRequired
    }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   type="text" class="form-control form-input noDrop"  id="form-item-` +
    FormItemID +
    `" placeholder="` +
    placeholder +
    `" data-mdpersiandatetimepickershowing="false" title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker="" data-mddatetimepicker="true" data-targetselector="#form-item-` +
    FormItemID +
    `" data-trigger="click"  data-placement="auto" data-englishnumber="true" dir="ltr"></div>`;

  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")}</label>`;

  itemContent +=
    `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
    $DELICON +
    `"/></span></div>`;

  if (SubTextVisible) {
    itemContent += `<small class="text-muted">` + Description + `</small>`;
  }

  itemContent += `</div>`;

  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  let pickerID = `#picker-` + FormItemID;

  let itemInputID = `#form-item-` + FormItemID;

  // if (Width != ``) {
  //   $(itemInputID).css(`width`, Width);
  // }

  $(itemInputID).css(`text-align`, `left`);

  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}

function RenderDateTimeBox(itemObj, parentID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    DefaultValChecked,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;
  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    txtBackgroundColor,
    txtfontsize = "14px",
    txtBorderColor,
    txtFontFamily,
    txtColor,
  } = Style;
  let placeholder = ``;

  let itemContent =
    `<div draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" style="` +
    (Visibility == `true` ? ` ` : ``) +
    `" class="form-group noDrop"  id="form-group-` +
    FormItemID +
    `"  foreignkey="${ForeignKey}" fixlabel="${FixLabel}" onmousedown="Form_Group_Prop(id)"><label class="form-group-lbl noDrop lbl"  id="form-group-lbl-${FormItemID}" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};">` +
    Label +
    `</label><div class="input-group"><div id="picker-` +
    FormItemID +
    `" data-mdpersiandatetimepickershowing="false" title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker=""` +
    ` style="cursor: pointer;" class="input-group-addon" data-mddatetimepicker="true" data-targetselector="#form-item-` +
    FormItemID +
    `" data-trigger="click"  data-placement="auto" data-englishnumber="true" ><span class="glyphicon glyphicon-calendar"></span></div><input datatype="${DataType}" enumtypeid="${EnumTypeID}"  defaultvalChecked="${DefaultValChecked}" visibility="${
      Visibility == "" ? "false" : Visibility
    }"  IsRequired="${
      IsRequired == "" ? "false" : IsRequired
    }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   type="text"  class="form-control form-input noDrop"  id="form-item-` +
    FormItemID +
    `" placeholder="` +
    placeholder +
    `" data-mdpersiandatetimepickershowing="false" title="" data-original-title="" data-mdpersiandatetimepickerselecteddatetime="{&quot;Year&quot;:1393,&quot;Month&quot;:10,&quot;Day&quot;:9,&quot;Hour&quot;:0,&quot;Minute&quot;:0,&quot;Second&quot;:0}" data-mdpersiandatetimepicker="" data-mddatetimepicker="true" data-targetselector="#form-item-` +
    FormItemID +
    `" data-trigger="click"  data-placement="auto" data-englishnumber="true" dir="ltr"></div>`;

  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")}</label>`;

  itemContent +=
    `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
    $DELICON +
    `"/></span></div>`;

  if (SubTextVisible) {
    itemContent += `<small class="text-muted">` + Description + `</small>`;
  }

  itemContent += `</div>`;

  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  let pickerID = `#picker-` + FormItemID;

  let itemInputID = `#form-item-` + FormItemID;

  // if (Width != ``) {
  //   $(itemInputID).css(`width`, Width);
  // }

  $(itemInputID).css(`text-align`, `left`);

  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}

function RenderCheckBox(itemObj, parentID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    Name,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;
  const { lblFontFamily, lblfontsize, lblColor } = Style;
  try {
    let itemContent =
      `<div class="form-group noDrop" draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" style="` +
      (Visibility == `true` ? ` ` : ``) +
      `" id="form-group-` +
      FormItemID +
      `"  foreignkey="${ForeignKey}" fixlabel="${FixLabel}"  onmousedown="Form_Group_Prop(id)"><div class="checkbox  noDrop"><input datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${
        Visibility == "" ? "false" : Visibility
      }"  IsRequired="${
        IsRequired == "" ? "false" : IsRequired
      }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   class="noDrop"  type="checkbox"  title="` +
      Name +
      `" id="form-item-` +
      FormItemID +
      `" />&nbsp;` +
      ` <label class="form-item-lbl noDrop lbl" id="form-group-lbl-` +
      FormItemID +
      `"style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};" class="input-checkbox-label">` +
      Label +
      `</label></div>`;

    itemContent +=
      `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
      `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")}</label>`;

    itemContent +=
      `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
      $DELICON +
      `"/></span></div>`;

    if (SubTextVisible)
      itemContent += `<small class="text-muted">` + Description + `</small>`;

    itemContent += `</div>`;
    $(parentID).hasClass("PasteElement")
      ? $(parentID).replaceWith(itemContent)
      : $(parentID).append(itemContent);
  } catch (e) {
    // raiseError(e, "#form-group-" + itemObj.FormItemID);

    return;
  }
  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}

// function RenderPasswordBox(itemObj) {
//   let {
//     _index,
//     FormItemID,
//     ForeignKey,
//     Description,
//     SubTextVisible,
//     Style,
//       DataType,
//EnumTypeID,
//  EntityTypeID,
// InputType,InputCount,
//   Nullable,
//   } = itemObj;

//   let {
//     lblFontFamily,
//     lblfontsize,
//     lblColor,
//     txtBackgroundColor,
//     txtfontsize="14px",
//     txtBorderColor,
//     txtFontFamily,
//     txtColor,
//   } = Style;
//   try {
//     let placeholder = ``;
//     let itemContent =
//       `<div class="form-group noDrop"  id="form-group-${FormItemID}"  foreignkey="${ForeignKey}" fixlabel="${FixLabel}" ` +
//       `  draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" ` +
//       `  onmousedown="Form_Group_Prop(id)"><label class="form-item-lbl noDrop lbl" ` +
//       `id="form-group-lbl-${FormItemID}" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};">` +
//       `${
//         _index == 0
//           ? formResources.get("password")
//           : formResources.get("repeat")
//       }</label>` +
//       `<div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></div><input datatype="${DataType}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   type="password"  class="form-control form-input noDrop"  id="form-item-` +
//       FormItemID +
//       `" placeholder="` +
//       placeholder +
//       ` " style="background-color:${txtBackgroundColor}font-size:${txtfontsize};;border-color:${txtBorderColor};font-family:${txtFontFamily};color:${txtColor};"></div><div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
//       $DELICON +
//       `"/></span></div></div>`;

//     if (SubTextVisible)
//       itemContent += `<small class="text-muted">` + Description + `</small>`;

//     itemContent += `</div>`;

//     // $(parentID).hasClass("PasteElement")
//     //   ? $(parentID).replaceWith(itemContent)
//     //   : $(parentID).append(itemContent);

//     let itemInputID = `#form-item-` + FormItemID;

//     if (Width != ``) $(itemInputID).css(`width`, Width);

//     $(itemInputID).val(``);
//     return itemContent

//   } catch (e) {
//     return;
//   }
//show properties
//Form_Group_Prop(`form-group-${FormItemID}`);
// }
// function RenderPasswordBox(oldAndnew, obj, parentID) {
//   let itemObj = obj[0];
//   let itemObj2 = obj[1];
//   if (itemObj2) {
//     itemObj2.Repeat = true;
//     if (oldAndnew == "newItem")
//       itemObj2.Label = formResources.get("repeat") + " " + itemObj2.Label;
//   }
//   try {
//     let placeholder = ``;
//     let itemContent =
//       `<div class="form-group noDrop"  id="form-group-${itemObj.FormItemID}"  foreignkey="${itemObj.ForeignKey}" ` +
//       `  draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" ` +
//       `  onmousedown="Form_Group_Prop(id)"><label class="form-item-lbl noDrop lbl" ` +
//       `id="form-group-lbl-${itemObj.FormItemID}" style="font-family:${itemObj.Style.lblFontFamily};font-size:${itemObj.Style.lblfontsize};color:${itemObj.Style.lblColor};">${itemObj.Label}</label>` +
//       `<div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></div><input datatype="${itemObj.DataType}" Enum="${itemObj.EnumTypeID}" Entity="${itemObj.EntityTypeID}" formula="${itemObj.Formula}" inputtype="${itemObj.InputType}" nullable=${itemObj.Nullable}  type="password" class="form-control form-input noDrop"  id="form-item-` +
//       itemObj.FormItemID +
//       `" placeholder="` +
//       placeholder +
//       ` " style="background-color:${itemObj.Style.txtBackgroundColor}font-size:${itemObj.Style.txtfontsize};border-color:${itemObj.Style.txtBorderColor};font-family:${itemObj.Style.txtFontFamily};color:${itemObj.Style.txtColor};"></div><div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
//       $DELICON +
//       `"/></span></div></div>`;
//     //repeat
//     itemContent +=
//       `<div class="form-group noDrop" id="form-group-` +
//       itemObj2.FormItemID +
//       `"  foreignkey="${itemObj2.ForeignKey}" ` +
//       `  draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" ` +
//       `  onmousedown="Form_Group_Prop(id)"><label class="form-item-lbl noDrop lbl"  ` +
//       `id = "form-group-lbl-${itemObj2.FormItemID}-1" style ="font-family:${itemObj2.Style.lblFontFamily};font-size:${itemObj2.Style.lblfontsize};color:${itemObj2.Style.lblColor};" >` +
//       itemObj2.Label +
//       `</label><div class="input-group"><div class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></div><input datatype="${itemObj2.DataType}" Enum="${itemObj2.EnumTypeID}" Entity="${itemObj2.EntityTypeID}" formula="${itemObj2.Formula}" inputtype="${itemObj2.InputType}" nullable=${itemObj2.Nullable}  type="password" class="form-control form-input noDrop"  id="form-item-` +
//       itemObj2.FormItemID +
//       `" placeholder="` +
//       placeholder +
//       `" style="background-color:${itemObj2.Style.txtBackgroundColor};font-size:${itemObj2.Style.txtfontsize};border-color:${itemObj2.Style.txtBorderColor};font-family:${itemObj2.Style.txtFontFamily};color:${itemObj2.Style.txtColor};"></div><div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
//       $DELICON +
//       `"/></span></div>`;

//     if (itemObj.SubTextVisible)
//       itemContent +=
//         `<small class="text-muted">` + itemObj.Description + `</small>`;

//     itemContent += `</div>`;

//     $(parentID).hasClass("PasteElement")
//       ? $(parentID).replaceWith(itemContent)
//       : $(parentID).append(itemContent);

//     if (itemObj.Style.Width != `` || itemObj2.Style.Width != ``) {
//       $(`#form-item-` + itemObj.FormItemID).css(`width`, itemObj.Style.Width);
//       $(`#form-item-` + itemObj2.FormItemID).css(`width`, itemObj2.Style.Width);
//     }

//     $(`#form-item-` + itemObj.FormItemID).val(``);
//     $(`#form-item-` + itemObj2.FormItemID).val(``);
//   } catch (e) {
//     return;
//   }
//   //show properties
//   Form_Group_Prop(`form-group-${FormItemID}`);
// }

function RenderFileBox(type, itemObj, parentID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    Name,
    Description,
    SubTextVisible,
    Style,
    DataType = type == "File" ? "FileBrowser" : "ImageBox",
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;

  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    txtBackgroundColor,
    txtBorderColor,
  } = Style;

  try {
    let itemContent =
      `<div style="` +
      (Visibility == `true` ? ` ` : ``) +
      `" class="form-group noDrop" draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)"  id="form-group-` +
      FormItemID +
      `"  foreignkey="${ForeignKey}" fixlabel="${FixLabel}" data-item-name="` +
      Name +
      `"  onmousedown="Form_Group_Prop(id)"><label class="form-item-lbl noDrop  lbl"  id="form-group-lbl-${FormItemID}" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};">` +
      Label +
      `</label><div tabindex=""500" class=""><input type="file" datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${
        Visibility == "" ? "false" : Visibility
      }"  IsRequired="${
        IsRequired == "" ? "false" : IsRequired
      }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   class="form-control form-input noDrop  file"  data-show-preview="false" data-show-remove="false" data-show-upload="false"  id="form-item-` +
      FormItemID +
      `"style="background-color:${txtBackgroundColor};border-color:${txtBorderColor};"></div>`;

    itemContent +=
      `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
      `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")}</label>`;

    itemContent +=
      `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
      $DELICON +
      `"/></span></div>`;

    if (SubTextVisible)
      itemContent += `<small class="text-muted">` + Description + `</small>`;

    itemContent += `</div>`;

    $(parentID).hasClass("PasteElement")
      ? $(parentID).replaceWith(itemContent)
      : $(parentID).append(itemContent);

    $("input[type=file]").fileinput();
  } catch (e) {
    // raiseError(e, "#form-group-" + itemObj.FormItemID);
    return;
  }

  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}

function RenderSelectBox(itemObj, parentID, ActivityID) {
  let {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    Description,
    SubTextVisible,
    Style,
    Events,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;

  Events ??= [];
  let _event =
    typeof Events == "object"
      ? JSON.stringify(Events)
      : Events.replaceAll('"', "&quot;");

  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    txtBackgroundColor,
    txtfontsize = "14px",
    txtFontFamily,
    txtColor,
  } = Style;

  let itemContent =
    `<div style="${
      Visibility == `true` ? ` ` : ``
    }"  class="form-group noDrop"  draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" ` +
    `id = "form-group-${FormItemID}" foreignkey="${ForeignKey}" fixlabel="${FixLabel}"  onmousedown="Form_Group_Prop(id)"><label class="form-item-lbl lbl noDrop"  ` +
    `id="form-group-lbl-${FormItemID}" for="form-item-${FormItemID}" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};">${Label}</label>` +
    `<div class="input-group" ><div class="input-group-addon"><span class="glyphicon glyphicon-check"></span></div><select datatype="${DataType}" enumtypeid="${
      EnumTypeID == "" || EnumTypeID == "add"
        ? $(`#EnumID option:first-child`).val() == "undefined"
          ? 0
          : $(`#EnumID option:first-child`).val()
        : EnumTypeID
    }" visibility="${Visibility == "" ? "false" : Visibility}"  IsRequired="${
      IsRequired == "" ? "false" : IsRequired
    }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}"  variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" events="${_event}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   ${
      Visibility == `Disabled` ? `disabled` : ``
    } ` +
    `class="form-control form-input noDrop" type="select" ondragover = "allowDrop(event)" id = "form-item-${FormItemID}" style="background-color:${txtBackgroundColor};font-size:${txtfontsize};font-family:${txtFontFamily};color:${txtColor};height:40px;"></select></div>`;
  if (SubTextVisible)
    itemContent += `<small class="text-muted">${Description}</small>`;

  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")}</label>`;

  itemContent +=
    `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
    $DELICON +
    `"/></span></div></div>`;

  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}

function RenderTableBox(itemObj, parentID, ActivityID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;

  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    tblHead_backgroundColor,
    tblHead_fontFamily,
    tblHead_fontSize,
    tblHead_Color,
    tblBody_fontFamily,
    tblBody_fontSize,
    tblBody_backgroundColor,
    tblBody_Color,
  } = Style;

  let itemContent =
    `<div style="${
      Visibility == `true` ? ` ` : ``
    }"  class="form-group noDrop" draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" ` +
    `id = "form-group-${FormItemID}" foreignkey="${ForeignKey}" fixlabel="${FixLabel}"  onmousedown="Form_Group_Prop(id)"><label class="form-item-lbl lbl noDrop"  ` +
    `id="form-group-lbl-${FormItemID}" for="form-item-${FormItemID}" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};">${Label}</label>` +
    `<div class="input-group">
    <table datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${
      Visibility == "" ? "false" : Visibility
    }"  IsRequired="${
      IsRequired == "" ? "false" : IsRequired
    }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}"
    variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly} 
    read-only=${Readonly}   ${Visibility == `Disabled` ? `disabled` : ``} 
     class="table  table-bordered table-hover form-input noDrop" ondragover = "allowDrop(event)" id="form-item-${FormItemID}" 
     style=""><thead id="thead-${FormItemID}" style="background-color:${tblHead_backgroundColor};font-size:${tblHead_fontSize};font-family:${tblHead_fontFamily};color:${tblHead_Color};"></thead>` +
    `<tbody id="tbody-${FormItemID}" style="background-color:${tblBody_backgroundColor};font-size:${tblBody_fontSize};font-family:${tblBody_fontFamily};color:${tblBody_Color};"></tbody></table></div>`;
  if (SubTextVisible)
    itemContent += `<small class="text-muted">${Description}</small>`;

  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")}</label>`;

  itemContent +=
    `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
    $DELICON +
    `"/></span></div></div>`;

  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  let newVariable = JSON.parse(localStorage.getItem("Variables" + $ProcessID));
  newVariable ??= [];

  $JSON.Variables = newVariable;

  //get header array

  let ArrayHeader = [];
  $JSON.Variables.filter((x) => x.SystemID == SystemID)[0].Columns.map(
    (value) =>
      ArrayHeader.push({
        ID: value.SubTableID,
        Lbl: value.Label,
        ColWidth: value.Style.ColWidth,
        ColHeight: value.Style.ColHeight,
      })
  );

  //thead
  let thead = `<tr><th style="width:40px;text-align: center;padding:5px">${formResources.get(
    "row"
  )}</th>`;

  for (let i in ArrayHeader) {
    thead += `<th  style="width:${ArrayHeader[i].ColWidth}px;height:${ArrayHeader[i].ColHeight}px;text-align: center;padding:5px">${ArrayHeader[i].Lbl}</th>`;
  }
  thead += `</tr>`;
  $(`#thead-${FormItemID}`).append(thead);

  //tbody
  let tbody = `<tr><td style="text-align: center;">1</td>`;
  for (let k in ArrayHeader) tbody += `<td style="text-align: center;"></td>`;
  tbody += `</tr>`;
  $(`#tbody-${FormItemID}`).append(tbody);

  var thHeight = $(`#form-item-${FormItemID} th:first`).height();
  $(`#form-item-${FormItemID} th`).resizable({
    handles: "e",
    minHeight: thHeight,
    maxHeight: thHeight,
    minWidth: 40,
    resize: function (event, ui) {
      var sizerID = "#" + $(event.target).attr("id") + "-sizer";
      $(sizerID).width(ui.size.width);
    },
  });

  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}
function RenderSelectiveTableBox(itemObj, parentID, ActivityID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    Description,
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;

  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    tblHead_backgroundColor,
    tblHead_fontFamily,
    tblHead_fontSize,
    tblHead_Color,
    tblBody_fontFamily,
    tblBody_fontSize,
    tblBody_backgroundColor,
    tblBody_Color,
  } = Style;

  let itemContent =
    `<div style="${
      Visibility == `true` ? ` ` : ``
    }"  class="form-group noDrop" draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" ` +
    `id = "form-group-${FormItemID}" foreignkey="${ForeignKey}" fixlabel="${FixLabel}"  onmousedown="Form_Group_Prop(id)"><label class="form-item-lbl lbl noDrop"  ` +
    `id="form-group-lbl-${FormItemID}" for="form-item-${FormItemID}" style="font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};">${Label}</label>` +
    `<div class="input-group">
    <table datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${
      Visibility == "" ? "false" : Visibility
    }"  IsRequired="${
      IsRequired == "" ? "false" : IsRequired
    }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}"
    variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly} 
    read-only=${Readonly}   ${Visibility == `Disabled` ? `disabled` : ``} 
     class="table  table-bordered table-hover form-input noDrop" ondragover = "allowDrop(event)" id="form-item-${FormItemID}" 
     style=""><thead id="thead-${FormItemID}" style="background-color:${tblHead_backgroundColor};font-size:${tblHead_fontSize};font-family:${tblHead_fontFamily};color:${tblHead_Color};"></thead>` +
    `<tbody id="tbody-${FormItemID}" style="background-color:${tblBody_backgroundColor};font-size:${tblBody_fontSize};font-family:${tblBody_fontFamily};color:${tblBody_Color};"></tbody></table></div>`;
  if (SubTextVisible)
    itemContent += `<small class="text-muted">${Description}</small>`;

  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint"> ${(Hint ??= "")}</label>`;

  itemContent +=
    `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
    $DELICON +
    `"/></span></div></div>`;

  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  let newVariable = JSON.parse(localStorage.getItem("Variables" + $ProcessID));
  newVariable ??= [];

  $JSON.Variables = newVariable;

  //get header array

  let ArrayHeader = [];
  $JSON.Variables.filter((x) => x.SystemID == SystemID)[0].Columns.map(
    (value) =>
      ArrayHeader.push({
        ID: value.SubTableID,
        Lbl: value.Label,
        ColWidth: value.Style.ColWidth,
        ColHeight: value.Style.ColHeight,
      })
  );

  //thead
  let thead = `<tr><th style="width:40px;text-align: center;padding:5px">${formResources.get(
    "row"
  )}</th>`;

  for (let i in ArrayHeader) {
    thead += `<th  style="width:${ArrayHeader[i].ColWidth}px;height:${ArrayHeader[i].ColHeight}px;text-align: center;padding:5px">${ArrayHeader[i].Lbl}</th>`;
  }
  thead += `</tr>`;
  $(`#thead-${FormItemID}`).append(thead);

  //tbody
  let tbody = `<tr><td style="text-align: center;">1</td>`;
  for (let k in ArrayHeader) tbody += `<td style="text-align: center;"></td>`;
  tbody += `</tr>`;
  $(`#tbody-${FormItemID}`).append(tbody);

  var thHeight = $(`#form-item-${FormItemID} th:first`).height();
  $(`#form-item-${FormItemID} th`).resizable({
    handles: "e",
    minHeight: thHeight,
    maxHeight: thHeight,
    minWidth: 40,
    resize: function (event, ui) {
      var sizerID = "#" + $(event.target).attr("id") + "-sizer";
      $(sizerID).width(ui.size.width);
    },
  });

  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}

function RenderImage(type, itemObj, parentID) {
  const {
    Visibility,
    IsRequired,
    FormItemID,
    ForeignKey,
    FixLabel,
    Label,
    Hint,
    Description = "",
    SubTextVisible,
    Style,
    DataType,
    EnumTypeID,
    DefaultValue,
    EntityTypeID,
    Formula,
    InputType,
    InputCount,
    Nullable,
    Readonly,
    VariableID,
    SystemID,
  } = itemObj;
  const {
    lblFontFamily,
    lblfontsize,
    lblColor,
    img_width,
    img_height,
    img_borderradius,
    groupimg_position,
    groupimg_display,
    groupimg_textalign,
  } = Style;
  let itemContent =
    `<div style="${
      Visibility == `true` ? ` ` : ``
    }"  class="form-group noDrop" draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" ` +
    `id = "form-group-${FormItemID}" foreignkey="${ForeignKey}" fixlabel="${FixLabel}"  onmousedown="Form_Group_Prop(id)">` +
    `<div id="input-group-img" class="input-group" style="border-left:${groupimg_position} !important;display:${groupimg_display};text-align:${groupimg_textalign}">`;

  //
  // input type="file" datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${Visibility == "" ? "false" : Visibility}"  IsRequired="${IsRequired == "" ? "false" : IsRequired}" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable=${Nullable} read-only=${Readonly}   class="form-control form-input noDrop  file"  data-show-preview="false" data-show-remove="false" data-show-upload="false"  id="form-item-` +
  //     FormItemID +
  //     `"style="background-color:${txtBackgroundColor};border-color:${txtBorderColor};"
  //

  itemContent += ` <img ${Visibility == `Disabled` ? `disabled` : ``}
    class="form-input noDrop" ondragover = "allowDrop(event)"  datatype="${DataType}" enumtypeid="${EnumTypeID}" visibility="${
    Visibility == "" ? "false" : Visibility
  }"  IsRequired="${
    IsRequired == "" ? "false" : IsRequired
  }" defaultvalue="${DefaultValue}" entitytypeid="${EntityTypeID}" formula="${Formula}" variableid="${VariableID}" systemid="${SystemID}"  inputtype="${InputType}" inputcount="${InputCount}" nullable="${Nullable}" read-only="${Readonly}"
    data-show-preview="false" data-show-remove="false" data-show-upload="false"  id="form-item-${FormItemID}"  style="width: ${img_width};height:${img_height};border-radius:${img_borderradius};" src="data:image/png;base64,${
    $VARIABLE_PNG[10]
  }"></img>`;
  itemContent += `</div><label class="form-item-lbl lbl noDrop" 
    id="form-group-lbl-${FormItemID}" for="form-item-${FormItemID}"  style="margin-top:5px;font-family:${lblFontFamily};font-size:${lblfontsize};color:${lblColor};">${Label}</label><small class="text-muted">${Description}</small>`;
  itemContent +=
    `<label class="form-item-lbl-hint noDrop lbl" style="font-size:13px;color:rgb(33 37 41 / 68%);margin-top:10px;" ` +
    `id="form-group-lbl-${FormItemID}-hint">${(Hint ??= "")}</label>`;

  itemContent +=
    `<div class="Del_FormGroup" onclick="Del_FormGroup(this)"><span><img class="ImgIcon" src="data:image/png;base64,` +
    $DELICON +
    `"/></span></div></div>`;

  $(parentID).hasClass("PasteElement")
    ? $(parentID).replaceWith(itemContent)
    : $(parentID).append(itemContent);

  //parent css
  $(parentID).css("text-align", groupimg_textalign);

  //show properties
  Form_Group_Prop(`form-group-${FormItemID}`);
}
