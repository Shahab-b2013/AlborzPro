/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.3.1.0*/
/* Release Ferdos.BPMS*/

`use strict`;
var $JSON;
var $GROUPS_ARRAY = [];
var $ITEMS_ARRAY = [];
var $ALLOW_DROP_TRUE;
let formItem;
let parentID;

function Drop(ev) {
  //New Row(Group)
  if (
    $(ev.target).hasClass("NewRow") &&
    $(ev.target).prop("tagName") != "TD" &&
    $(ev.target).prop("tagName") != "TH"
  ) {
    $(ev.target).attr("id", `form-group-${FormGroupBoxsID_Generator()}`);
    $GROUPS_ARRAY.push({
      FormGroupBoxID: +ev.target.id.replaceAll("form-group-", ""),
      FormID: +_pageKey,
      Name: "",
      Label: "",
      GroupIndex: "",
      GroupDisplayMode: "GroupWithBox",
      ColumnLayout: "",
      ColumnWidth: "default",
      Visibility: "",
      Enabled: true,
      Version: "custom",
      Description: "",
    });
  }
  if (
    !$(ev.target).hasClass(`noDrop`) &&
    $(ev.target).prop("tagName") != "TD" &&
    $(ev.target).prop("tagName") != "TH"
  ) {
    const ItemType = $(`#${ev.dataTransfer.getData(`text`)}`).attr(`type`);
    //create element
    switch (ItemType) {
      case `String`:
      case `LatinString`:
      case `LocalString`:
      case `Computed`:
        TextboxFns(ev, ItemType);
        break;
      case `Text`:
        TextareaFns(ev, ItemType);
        break;
      case `Label`:
        LabelFns(ev, ItemType);
        break;
      case `BigInteger`:
      case `Integer`:
        NumberFns(ev, ItemType);
        break;
      case `Time`:
        TimeFns(ev, ItemType);
        break;
      case `Date`:
        DateFns(ev, ItemType);
        break;
      case `DateTime`:
        DateTimeFns(ev, ItemType);
        break;
      case `Boolean`:
        CheckboxFns(ev, ItemType);
        break;
      case `Money`:
        MoneyFns(ev, ItemType);
        break;
      case `Password`:
        PasswordFns(ev, ItemType);
        break;
      case `File`:
      case `Image`:
        FileFns(ev, ItemType);
        break;
      // ImageFns(ev, ItemType);
      // break;
      case `Enum`:
      case `System`:
        SelectFns(ev, ItemType);
        break;
      case `Row`:
        GroupFns(ev);
        break;
      case `Table`:
        TableFns(ev, $(`#${ev.dataTransfer.getData(`text`)}`).attr("rowkey"));
        break;
      case `SelectiveTable`:
        SelectiveTableFns(
          ev,
          $(`#${ev.dataTransfer.getData(`text`)}`).attr("rowkey")
        );
        break;
      case `Sms`:
        SmsFns(ev, ItemType);
        break;
      case `Agreement`:
        AgreementFns(ev, ItemType);
        break;
      case `FacilityBox`:
        FacilitiesFns(ev, ItemType);
        break;
      case `TimingBox`:
        AmentityTimesFns(ev, ItemType);
      default:
        // move element
        if ($(`#${ev.dataTransfer.getData("text")}`).hasClass("form-group")) {
          let elementGroup = $(`#${ev.dataTransfer.getData("text")}`).clone();
          if ($(ev.target).hasClass("form-group-body")) {
            if (elementGroup) $(`#${ev.dataTransfer.getData("text")}`).remove();

            $(ev.target).append(elementGroup);
          } else if ($(ev.target).hasClass("PasteElement")) {
            if (elementGroup) $(`#${ev.dataTransfer.getData("text")}`).remove();
            $(ev.target).replaceWith(elementGroup);
          }
        }
        break;
    }
    $(`.form-group-body , .form-group-mbody`).css(`border`, ``);
  }
}
//SystemID generator
function SystemIDGenerator() {
  let id;
  if (localStorage.getItem("LastSystemID" + $ProcessID)) {
    let LastSystemID = localStorage.getItem("LastSystemID" + $ProcessID);
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

  return id;
}

function FormItem(ev, ItemType) {
  const _FormItemID = FormItemID_Generator();

  let variable = [];
  if (localStorage.getItem("Variables" + $ProcessID)) {
    variable = JSON.parse(
      localStorage.getItem("Variables" + $ProcessID)
    ).filter(
      (x) =>
        x.RowKey == +$(`#${ev.dataTransfer.getData(`text`)}`).attr("rowkey")
    );
  }

  let _Nullable;
  if (variable.length) {
    _Nullable =
      variable[0].Nullable == undefined ? false : variable[0].Nullable;
  } else {
    _Nullable = false;
  }
  function inputtype(type) {
    let outputType;
    switch (type) {
      case "String":
      case "LocalString":
      case "LatinString":
      case "Integer":
      case "BigInteger":
      case "Money":
      case "Computed":
        outputType = "TextBox";
        break;
      case "Text":
        outputType = "TextArea";
        break;
      case "Date":
        outputType = "DateBox";
        break;
      case "Time":
        outputType = "TimeBox";
        break;
      case "File":
      case "Image":
        outputType = "FileBrowse";

        break;
      // case "Image":
      //   outputType = "Image";
      //   break;
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
      case "Table":
        outputType = "Table";
        break;
      case "SelectiveTable":
        outputType = "SelectiveTable";
        break;
      case "Sms":
        outputType = "Sms";
        break;
      case "Agreement":
        outputType = "Paraghraph";
        break;
      case "FacilityBox":
        outputType = "FacilityBox";
        break;
      case "TimingBox":
        outputType = "TimingBox";
        break;
      default:
        break;
    }
    return outputType;
  }

  function InputCountGenerator(type) {
    let InputCount;
    switch (type) {
      case "Table":
      case "SelectiveTable":
        InputCount = "List";
        break;
      default:
        InputCount = "Single";
        break;
    }
    return InputCount;
  }
  let object = {
    FormItemID: _FormItemID,
    ActivityParamID: 0,
    ActionControlID: 0,
    SystemID:
      $(`#${ev.dataTransfer.getData("text")}`).attr("systemid") != undefined
        ? $(`#${ev.dataTransfer.getData("text")}`).attr("systemid")
        : SystemIDGenerator(),
    VariableID:
      $(`#${ev.dataTransfer.getData("text")}`).attr("variableid") != undefined
        ? $(`#${ev.dataTransfer.getData("text")}`).attr("variableid")
        : parseInt(
            localStorage.getItem("LastSystemID" + $ProcessID).match(/\d+/)[0]
          ),
    Name: $(`#${ev.dataTransfer.getData("text")} p`).html(),
    Label: $(`#${ev.dataTransfer.getData("text")} p`).html(),
    Hint: "",
    InputType: inputtype($(`#${ev.dataTransfer.getData("text")}`).attr("type")),
    InputCount:
      $(`#${ev.dataTransfer.getData("text")}`).attr("inputcount") != undefined
        ? $(`#${ev.dataTransfer.getData("text")}`).attr("inputcount")
        : InputCountGenerator(
            $(`#${ev.dataTransfer.getData("text")}`).attr("type")
          ),
    DataType:
      $(`#${ev.dataTransfer.getData("text")}`).attr("type") != undefined
        ? $(`#${ev.dataTransfer.getData("text")}`).attr("type")
        : "",
    DefaultValue:
      $(`#${ev.dataTransfer.getData("text")}`).attr("defaultvalue") != undefined
        ? $(`#${ev.dataTransfer.getData("text")}`).attr("defaultvalue")
        : "",
    EnumTypeID:
      $(`#${ev.dataTransfer.getData("text")}`).attr("enumtypeid") != undefined
        ? $(`#${ev.dataTransfer.getData("text")}`).attr("enumtypeid")
        : "",
    EntityTypeID:
      $(`#${ev.dataTransfer.getData("text")}`).attr("entitytypeid") != undefined
        ? $(`#${ev.dataTransfer.getData("text")}`).attr("entitytypeid")
        : "",
    Formula:
      $(`#${ev.dataTransfer.getData("text")}`).attr("formula") != undefined
        ? $(`#${ev.dataTransfer.getData("text")}`).attr("formula")
        : "",
    Nullable: _Nullable,
    Readonly: false,
    ParamIndex: 0,
    IsRequired: true,
    IsReadOnly: false,
    FormID: +_pageKey,
    ParamName: "",
    EntityAttributeID: 0,
    Repeat: false,
    ColumnIndex: $(ev.target).hasClass(`PasteElement`)
      ? +$(ev.target).parent().attr("id").split("-")[4]
      : +ev.target.id.split("-")[4],
    Width: "",
    ActionOnChange: "",
    Visibility: true,
    ParentName: "",
    ParentName2: "",
    FormGroupBoxID: $(ev.target).hasClass(`PasteElement`)
      ? +$(ev.target).parent().parent().attr("id").split("-")[2]
      : +$(ev.target).parent().attr("id").split("-")[2],
    EnumTypeIDID: "0",
    UnitToDisplay: "",
    _reportID: 0,
    Description: "",
    SubTextVisible: false,
    DisplayMode: "Vertical",
    ActivityID: $JSON.ActivityID,
    ItemsGrouping: $JSON.ItemsGrouping,
    ForeignKey:
      $(`#${ev.dataTransfer.getData(`text`)}`)
        .parent()
        .attr("id") == "DataProcessChild"
        ? +$(`#${ev.dataTransfer.getData(`text`)}`).attr("rowkey")
        : +localStorage.getItem("LastRowkey"),
    FixLabel: $(`#${ev.dataTransfer.getData("text")}`).attr("fixlabel"),
    Style: {
      lblFontFamily: "",
      lblColor: "",
      txtBackgroundColor: "",
      txtBorderColor: "",
      txtFontFamily: "",
      txtColor: "",
    },
    Events: [],
  };

  //LastRowkey ++
  $(`#${ev.dataTransfer.getData(`text`)}`)
    .parent()
    .attr("id") != "DataProcessChild"
    ? +localStorage.setItem(
        "LastRowkey",
        +localStorage.getItem("LastRowkey") + 1
      )
    : "";

  $ITEMS_ARRAY.push(object);
  return object;
}

//Disable DataProcessChild Items after drop
function DataProcessChild(ev, bool) {
  let parId = $(`#${ev.dataTransfer.getData("text")}`)
    .parent()
    .attr("id");
  if (parId == `DataProcessChild`) {
    if (bool) {
      // remove foreignKey in Disable_Items
      for (let j in Disable_Items)
        if (
          Disable_Items[j].ForeignKey ==
          +$(`#${ev.dataTransfer.getData("text")}`).attr("rowkey")
        )
          Disable_Items.splice(j, 1);

      $(`#${ev.dataTransfer.getData("text")}`).css("pointer-events", "auto");
      $(`#${ev.dataTransfer.getData("text")} p`).css("color", "#000");
    } else {
      Disable_Items.push({
        ForeignKey: +$(`#${ev.dataTransfer.getData("text")}`).attr("rowkey"),
      });
      $(`#${ev.dataTransfer.getData("text")}`).css("pointer-events", "none");
      $(`#${ev.dataTransfer.getData("text")} p`).css("color", "#ccc");
    }
  }
}

function TextboxFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);

  const formItem = FormItem(ev, ItemType);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      if ($JSON.ItemsGrouping) {
        parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`;
      } else {
        parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`;
      }
    }

    RenderTextBox(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}
function AgreementFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }

    RenderAgreement(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function FacilitiesFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);

    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }
    RenderFacilities(formItem, parentID);
    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function AmentityTimesFns(ev, ItemType) {
  DataProcessChild(ev, false);

  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);

    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }

    RenderTimingbox(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function SmsFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    let formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
      arentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`;
    }
    RenderSms(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
    console.log(formItem);
  }
}

function TextareaFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }

    RenderTextArea(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function LabelFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }

    RenderLabel(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function NumberFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }
    RenderNumberBox(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function TimeFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }
    RenderTimeBox(formItem, parentID);
    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function DateFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);

    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }

    RenderDateBox(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function DateTimeFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }

    RenderDateTimeBox(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function CheckboxFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    let formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
      arentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`;
    }
    RenderCheckBox(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function MoneyFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }
    RenderNumberBox(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function PasswordFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    let formItem = [];
    formItem.push(FormItem(ev, ItemType));
    formItem.push(FormItem(ev, ItemType));

    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem[0].FormGroupBoxID}-${formItem[0].ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem[0].FormID}-${formItem[0].ColumnIndex}`);
    }

    RenderPasswordBox("newItem", formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function FileFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }

    RenderFileBox(ItemType, formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function SelectFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }
    RenderSelectBox(formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function GroupFns(ev) {
  if ($(ev.target).hasClass(`NewRow`)) {
    $(ev.target).attr("class", "row form-group-box");
    $(ev.target).attr("ondrop", "");
    $(ev.target).html("");
    let id = ev.target.id.replaceAll("form-group-", "");
    $(ev.target).append(
      `<div class="col-lg-2 col-md-2 group-info noDrop" ondragover="allowDrop(event)" id="group-info-${id}" ` +
        `onclick="GroupProp(this)"><h4 class="group-title">${formResources.get(
          "defaultbox"
        )}<br/></h4></div>` +
        `<div class="col-md-8 col-sm-12  col-xs-12 form-group-body"  ondrop="Drop(event)" ondragover="allowDrop(event)"` +
        `id="form-group-body-${id}-0"></span></div><div class="col-md-1 noDrop" ondragover="allowDrop(event)" id="miniDiv-1${id}" ` +
        `onclick="GroupProp(this)"></div>${Group_Btn(ev.target.id)}`
    );
  }
}

function TableFns(ev, rowkey, ItemType) {
  DataProcessChild(ev, false);

  const formItem = FormItem(ev, ItemType);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      if ($JSON.ItemsGrouping) {
        parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`;
      } else {
        parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`;
      }
    }
    RenderTableBox(formItem, parentID, "");

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}
function SelectiveTableFns(ev, rowkey, ItemType) {
  DataProcessChild(ev, false);

  const formItem = FormItem(ev, ItemType);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      if ($JSON.ItemsGrouping) {
        parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`;
      } else {
        parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`;
      }
    }
    RenderSelectiveTableBox(formItem, parentID, "");

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

function ImageFns(ev, ItemType) {
  //Disable DataProcessChild Items after drop
  DataProcessChild(ev, false);
  if (
    $(ev.target).hasClass(`form-group-body`) ||
    $(ev.target).hasClass(`form-group-mbody`) ||
    $(ev.target).hasClass(`PasteElement`)
  ) {
    const formItem = FormItem(ev, ItemType);
    if ($(ev.target).hasClass(`PasteElement`)) {
      parentID = ev.target;
    } else {
      $JSON.ItemsGrouping
        ? (parentID = `#form-group-body-${formItem.FormGroupBoxID}-${formItem.ColumnIndex}`)
        : (parentID = `#form-group-mbody-${formItem.FormID}-${formItem.ColumnIndex}`);
    }

    RenderImage(ItemType, formItem, parentID);

    if ($(`#form-group-${formItem.FormItemID}`).attr("fixlabel") == "")
      titlePopup(formItem.FormItemID);
  }
}

/*
 *  functions
 * */
function allowDrop(ev) {
  ev.stopPropagation();
  if ($ALLOW_DROP_TRUE) {
    ev.preventDefault();
    if (!$(".NewRow").length) {
      if ($(ev.target).hasClass(`form-group-body`))
        if ($(`#${ev.target.id}`).children().length == 0)
          $(`#${ev.target.id}`).css(`border`, `2px dashed #ccc`);

      if ($(ev.target).hasClass("form-group")) {
        $(".PasteElement").remove();
        if (!$(`#${ev.target.id} .PasteElement`).length) {
          // if (ev.target.id != localStorage.getItem("itemID")) {
          $(ev.target).before(
            `<div class="PasteElement" ondragover="allowDrop(event)">${formResources.get(
              "drophere"
            )}</div>`
          );
          $(ev.target).after(
            `<div class="PasteElement" ondragover="allowDrop(event)">${formResources.get(
              "drophere"
            )}</div>`
          );
          // }
        }
      }
    }
  }
}

function Drag(ev) {
  // localStorage.setItem("itemID", ev.target.id);
  if (ev.target.id) ev.dataTransfer.setData(`text`, ev.target.id);
  if ($(ev.target).attr("type") == "Row") {
    if ($("#content").children().length) {
      let rows = $(".row");
      for (let i = 0; i < rows.length; i++) {
        i == 0
          ? $(rows[i]).before(
              `<div id="" class="NewRow" ondragover="allowDrop(event)" ondrop="Drop(event)">${formResources.get(
                "boxdrophere"
              )}</div>`
            ) &&
            $(rows[i]).after(
              `<div id="" class="NewRow" ondragover="allowDrop(event)" ondrop="Drop(event)">${formResources.get(
                "boxdrophere"
              )}</div>`
            )
          : $(rows[i]).after(
              `<div id="" class="NewRow" ondragover="allowDrop(event)" ondrop="Drop(event)">${formResources.get(
                "boxdrophere"
              )}</div>`
            );
      }
    } else {
      $("#content").append(
        `<div id="" class="NewRow" ondragover="allowDrop(event)" ondrop="Drop(event)">${formResources.get(
          "boxdrophere"
        )}</div>`
      );
    }
  }

  if ($(ev.target).hasClass("form-group")) {
    $(".PasteElement").remove();
    setTimeout(() => {
      $(ev.target).after(
        `<div class="PasteElement" ondragover="allowDrop(event)"  >${formResources.get(
          "drophere"
        )}</div>`
      );
    }, 1);
  }
}

function Dragend(ev) {
  $(".NewRow").remove();
  $(".PasteElement").remove();
}

function Dragleave(ev) {
  $(`.form-group-body , .form-group-mbody`).css(`border`, ``);
}

function Group_Btn(GroupId) {
  const btn =
    `<div onclick=" GroupProp(this)" id="${GroupId}-rowBtnGroup" class="rowBtnGroup col-md-1" style="" ">` +
    `<span style="width: 33px;height: 32px;margin:0px 1px;color:#000" class="btn btn-light glyphicon glyphicon-trash" data-placement="auto" ` +
    ` onclick = "DeleteGroup(this);"` +
    `id=${GroupId}movedown></span >` +
    `<span style="width: 33px;height: 32px;margin:0px 1px;color:#000" class="btn btn-light glyphicon glyphicon-arrow-up"  data-placement="auto"` +
    ` onclick="GroupMoveUp(event);"` +
    `id=${GroupId}moveup></span>` +
    `<span style="width: 33px;height: 32px;margin:0px 1px;color:#000" class="btn btn-light glyphicon glyphicon-arrow-down" data-placement="auto"` +
    ` onclick="GroupMoveDown(event);"` +
    `id=${GroupId}movedown></span >` +
    `</div>`;

  return btn;
}

/*
 *Del Item
 */
function Del_FormGroup(item) {
  let Enabled = true;
  let isUsedSelect = [];
  let selects = $(`.form-input`);
  for (let i = 0; i < selects.length; i++) {
    if ($(selects[i]).attr("inputtype") == "SelectBox") {
      // let getEvent = JSON.parse($(selects[i]).attr("events"));
      let getEvent = "[]";
      if (getEvent != "[]") {
        for (let j = 0; j < getEvent.length; j++) {
          for (let k = 0; k < getEvent[j].actions.length; k++) {
            const getInputID = $(item)
              .parent()
              .attr("id")
              .replaceAll("group", "item");
            if (
              getEvent[j].actions[k].target ==
              $(`#` + getInputID).attr("systemid")
            ) {
              Enabled = false;
              isUsedSelect.push($(selects[i]).parent().prev().text());
            }
          }
        }
      }
    }
  }
  isUsedSelect = [...new Set(isUsedSelect)];

  if (Enabled) {
    let name;
    if ($(item).prev().prev().attr("id") == "input-group-img") {
      name = $(item).prev().html();
    } else {
      name = $(item).prev().prev().prev().text();
      if ($(item).prev().prev().hasClass("checkbox")) {
        name = $(item).prev().prev().text();
      }
    }

    swal({
      title: `${name} !`,
      text: formResources.get("suredelete"),
      icon: `warning`,
      buttons: {
        confirm: `${formResources.get("ok")}`,
        cancel: `${formResources.get("cancel")}`,
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        //prop closed
        $(`#SettingFieldChild`).empty();
        const id = $(item).parent().attr(`id`);
        $(`#SettingField i`).removeClass("fa-rotate-90");

        //foreignKey for disable dataProcess item
        let RowKeyForeig = +$(`#${id}`).attr("ForeignKey");

        let items = $(".DataProcessElement");
        for (let i = 0; i < items.length; i++) {
          if ($(items[i]).attr("rowkey") == RowKeyForeig) {
            $(`#${items[i].id}`).css("pointer-events", "auto");
            $(`#${items[i].id} p`).css("color", "#000");
            // remove foreignKey in Disable_Items
            for (let j in Disable_Items)
              if (Disable_Items[j].ForeignKey == RowKeyForeig)
                Disable_Items.splice(j, 1);
          }
        }

        $(`#${id}`).remove();
        //If it was a password
        if ($(`#${id}-rep`)) $(`#${id}-rep`).remove();
        if ($(id.split("-") > 2))
          if (id.split("-")[3] == "rep")
            $(`#${id.replaceAll("-rep", "")}`).remove();
      }
    });
  } else {
    let Label = "";
    for (let i = 0; i < isUsedSelect.length; i++) {
      Label += "- " + isUsedSelect[i] + "\n";
    }
    swal(
      `${formResources.get("usedVariable")}` +
        `
     ${Label}`,
      {
        icon: "warning",
        buttons: {
          confirm: `${formResources.get("ok")}`,
        },
      }
    );
  }
}

/*
 *Del Row(Group)
 */
function DeleteGroup(item) {
  const parentId = $(item).parent().parent().attr(`id`);
  const col_4_0 = $(`#${parentId}`).children().eq(1);
  const col_4_1 = $(`#${parentId}`).children().eq(3);
  //isItem
  let isCol_4 = false;
  if (col_4_0.hasClass(`col-md-4`)) {
    if (col_4_0.children().length == 0 && col_4_1.children().length == 0)
      isCol_4 = true;
  } else {
    if (col_4_0.children().length == 0) isCol_4 = true;
  }
  let name = $(item).parent().parent().children().eq(0).text();
  if (isCol_4) {
    swal({
      title: `${name} !`,
      text: formResources.get("suredelete"),
      icon: `warning`,
      buttons: {
        confirm: `${formResources.get("ok")}`,
        cancel: `${formResources.get("cancel")}`,
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        $(`#SettingFieldChild`).empty();
        if ($(`#content`).children().length > 1) {
          $(`#${parentId}`).remove();
          $(`#SettingField i`).removeClass("fa-rotate-90");

          //Del rows form $GROUPS_ARRAY
          let rowIndex = $GROUPS_ARRAY.indexOf(
            $GROUPS_ARRAY.filter(
              (x) => x.FormGroupBoxID == parentId.split("-")[2]
            )[0]
          );
          $GROUPS_ARRAY.splice(rowIndex, 1);

          SettingChild_empty();
        } else {
          swal({
            title: formResources.get("warning"),
            text: formResources.get("rowislast"),
            icon: `error`,
            buttons: {
              text: formResources.get("close"),
            },
            dangerMode: true,
          });
        }
      }
    });
  } else {
    swal({
      title: formResources.get("warning"),
      text: `${formResources.get("box")} ${name} ! ${formResources.get(
        "isItems"
      )}`,
      icon: `error`,
      buttons: {
        text: formResources.get("close"),
      },
      dangerMode: true,
    });
  }
}
function GroupMoveUp(event) {
  let div1 = $(event.target).parent().parent().attr("id");
  let div2 = $(`#${div1}`).prev().attr("id");
  if (!$(`#${div1}`).prev().length == 0) {
    let div1_clone = $(`#${div1}`).clone();
    let div2_clone = $(`#${div2}`).clone();
    $(`#${div1}`).replaceWith(div2_clone);
    $(`#${div2}`).replaceWith(div1_clone);
  }
}

function GroupMoveDown(event) {
  let div1 = $(event.target).parent().parent().attr("id");
  let div2 = $(`#${div1}`).next().attr("id");
  if ($(`#${div1}`).next().length !== 0) {
    let div1_clone = $(`#${div1}`).clone();
    let div2_clone = $(`#${div2}`).clone();
    $(`#${div2}`).replaceWith(div1_clone);
    $(`#${div1}`).replaceWith(div2_clone);
  }
}

function Export() {
  //Items
  let getElements, getId, getColumnIndex, getFormGroupBoxID;
  getElements = $("#content .form-group");
  $ITEMS_ARRAY = [];

  let localVar =
    JSON.parse(localStorage.getItem("Variables" + $ProcessID)) || [];

  getElements.map((index, item) => {
    getFormGroupBoxID = +$(item).parent().parent().attr("id").split("-")[2];
    getColumnIndex = +$(item).parent().attr("id").split("-")[4];
    getId = +item.id.split("-")[2];

    const _Visibility =
      $(`#form-item-${getId}`).attr("visibility") == "undefined" ||
      $(`#form-item-${getId}`).attr("visibility") == ""
        ? undefined
        : $(`#form-item-${getId}`).attr("visibility") == "true"
        ? true
        : false;

    const _Nullable =
      $(`#form-item-${getId}`).attr("nullable") == "undefined"
        ? undefined
        : $(`#form-item-${getId}`).attr("nullable");

    const _Readonly =
      $(`#form-item-${getId}`).attr("read-only") == "undefined"
        ? undefined
        : $(`#form-item-${getId}`).attr("read-only");

    const _IsReadonly =
      $(`#form-item-${getId}`).attr("read-only") == "undefined"
        ? undefined
        : $(`#form-item-${getId}`).attr("read-only");

    const _IsRequired =
      $(`#form-item-${getId}`).attr("isrequired") == "true" ? true : false;

    //change information items
    let _obj = {
      FormID: +_pageKey,
      FormItemID: getId,
      Label: $(`#${item.id} .lbl`).eq(0).html(),
      Hint: $(`#${item.id} .form-item-lbl-hint`).eq(0).html(),
      Name: $(`#${item.id} .lbl`).eq(0).html(),
      ParamIndex: index,
      InputType: $(`#form-item-${getId}`).attr("inputtype"),
      InputCount: $(`#form-item-${getId}`).attr("inputcount"),
      DefaultValue: $(`#form-item-${getId}`).attr("defaultvalue"),
      DefaultValChecked:
        $(`#form-item-${getId}`).attr("defaultvalChecked") == undefined
          ? ""
          : $(`#form-item-${getId}`).attr("defaultvalChecked"),
      Visibility: _Visibility == undefined ? true : _Visibility,
      DataType: $(`#form-item-${getId}`).attr("datatype"),
      SystemID: $(`#form-item-${getId}`).attr("systemid"),
      VariableID: $(`#form-item-${getId}`).attr("variableid"),
      EntityTypeID:
        $(`#form-item-${getId}`).attr("datatype") == "System" ||
        $(`#form-item-${getId}`).attr("datatype") == "Table" ||
        $(`#form-item-${getId}`).attr("datatype") == "SelectiveTable"
          ? $(`#form-item-${getId}`).attr("entitytypeid")
          : "",
      Formula:
        $(`#form-item-${getId}`).attr("datatype") == "Computed"
          ? $(`#form-item-${getId}`).attr("formula")
          : "",
      EnumTypeID:
        $(`#form-item-${getId}`).attr("datatype") == "Enum"
          ? $(`#form-item-${getId}`).attr("enumtypeid")
          : "",
      Nullable: _Nullable == undefined ? false : _Nullable,
      Readonly: _Readonly == undefined ? false : _Readonly,
      IsReadOnly: _IsReadonly == undefined ? false : _IsReadonly,
      IsRequired: _IsRequired == undefined ? true : _IsRequired,
      ColumnIndex: getColumnIndex,
      FormGroupBoxID: getFormGroupBoxID,
      ActivityParamID: getId,
      ForeignKey: +$(`#form-group-${getId}`).attr("foreignkey"),
      FixLabel: $(`#form-group-${getId}`).attr("fixlabel"),
      Style: {
        lblFontFamily: $(`#${item.id} .lbl`).eq(0).css("font-family"),
        lblfontsize: $(`#${item.id} .lbl`).eq(0).css("font-size"),
        lblColor: $(`#${item.id} .lbl`).eq(0).css("color"),
        txtBackgroundColor: $(`#form-item-${getId}`).css("background-color"),
        txtBorderColor: $(`#form-item-${getId}`).css("border-color"),
        txtFontFamily: $(`#form-item-${getId}`).css("font-family"),
        txtfontsize: $(`#form-item-${getId}`).css("font-size"),
        txtColor: $(`#form-item-${getId}`).css("color"),
        tblHead_backgroundColor: $(`#form-item-${getId} thead`).css(
          "background-color"
        ),
        tblHead_fontFamily: $(`#form-item-${getId} thead`).css("font-family"),
        tblHead_fontSize: $(`#form-item-${getId} thead`).css("font-size"),
        tblHead_Color: $(`#form-item-${getId} thead`).css("color"),
        tblBody_backgroundColor: $(`#form-item-${getId} tbody`).css(
          "background-color"
        ),
        tblBody_fontFamily: $(`#form-item-${getId} tbody`).css("font-family"),
        tblBody_fontSize: $(`#form-item-${getId} tbody`).css("font-size"),
        tblBody_Color: $(`#form-item-${getId} tbody`).css("color"),
        img_width:
          $(`#form-item-${getId}`).prop("tagName") == "IMG"
            ? $(`#form-item-${getId}`).css("width")
            : undefined,
        img_height:
          $(`#form-item-${getId}`).prop("tagName") == "IMG"
            ? $(`#form-item-${getId}`).css("height")
            : undefined,
        img_borderradius:
          $(`#form-item-${getId}`).prop("tagName") == "IMG"
            ? $(`#form-item-${getId}`).css("border-radius")
            : undefined,
        groupimg_position:
          $(`#form-item-${getId}`).prop("tagName") == "IMG"
            ? $(`#form-item-${getId}`).parent().css("border-left")
            : undefined,
        groupimg_display:
          $(`#form-item-${getId}`).prop("tagName") == "IMG"
            ? $(`#form-item-${getId}`).parent().css("display")
            : undefined,
        groupimg_textalign:
          $(`#form-item-${getId}`).prop("tagName") == "IMG"
            ? $(`#form-item-${getId}`).parent().css("text-align")
            : undefined,
      },
    };

    if ($(`#form-item-${getId}`).attr("InputType") == "SelectBox") {
      Object.assign(_obj, {
        Events: $(`#form-item-${getId}`).attr("events"),
      });
    }
    $ITEMS_ARRAY.push(_obj);

    //process variables update
    let _VarItems = [];
    _VarItems = localVar.filter(
      (x) =>
        x.RowKey == +$(`#form-item-${getId}`).parents().eq(1).attr("foreignkey")
    );
    console.log(_VarItems[0])
    if (_VarItems.length) {
      _VarItems[0].DataType = _obj.DataType;
      _VarItems[0].InputType = _obj.InputType;
      _VarItems[0].InputCount = _obj.InputCount;
      _VarItems[0].DefaultValue = _obj.DefaultValue;
      _VarItems[0].Nullable = _obj.Nullable == "false" ? false : true;
      _VarItems[0].EntityTypeID = +_obj.EntityTypeID;
      _VarItems[0].EnumTypeID = +_obj.EnumTypeID;
      _VarItems[0].Formula = _obj.Formula;
      _VarItems[0].Readonly = _obj.Readonly == "false" ? false : true;
      _VarItems[0].Hint = _obj.Hint;
      _VarItems[0].DefaultValue = _obj.DefaultValue;
      _VarItems[0].DefaultValChecked =
        _obj.DefaultValChecked == "false" ? false : true;
      _VarItems[0].ColumnIndex = _obj.ColumnIndex;
      _VarItems[0].FormGroupBoxID = _obj.FormGroupBoxID;
      _VarItems[0].Style = _obj.Style;

      //if Table
      if (
        _VarItems[0].DataType == "Table" ||
        _VarItems[0].DataType == "SelectiveTable"
      ) {
        _VarItems[0].Columns = _VarItems[0].Columns;
        for (let j = 1; j <= _VarItems[0].Columns.length; j++) {
          _VarItems[0].Columns[j - 1].Style.ColWidth = $(
            $(`#form-item-${getId} th`)[j]
          ).css("width");
          _VarItems[0].Columns[j - 1].Style.ColHeight = $(
            $(`#form-item-${getId} th`)[j]
          ).css("height");
        }
      }
    }
  });

  localStorage.setItem("Variables" + $ProcessID, JSON.stringify(localVar));

  $ITEMS_ARRAY.sort((elem1, elem2) => elem1.ParamIndex - elem2.ParamIndex);
  //Rows(Groups)
  $GROUPS_ARRAY = [];
  let getRow = $("#content .row");
  getRow.map((index, item) => {
    //Group default
    let _columnLayout = "";
    switch ($(`#${item.id} .form-group-body`).length) {
      case 1:
        _columnLayout = "OnceColumn";
        break;
      case 2:
        _columnLayout = "TwoColumn";
        break;
      case 3:
        _columnLayout = "ThreeColumn";
        break;
    }

    $GROUPS_ARRAY.push({
      FormGroupBoxID: +item.id.split("-")[2],
      FormID: +_pageKey,
      Name: $(`#${item.id} h4`).text(),
      Label: $(`#${item.id} h4`).text(),
      GroupIndex: index,
      GroupDisplayMode: "GroupWithBox",
      ColumnLayout: _columnLayout,
      ColumnWidth: "default",
      Visibility: true,
      Enabled: true,
      Version: "custom",
      Description: "",
    });
  });
  $JSON.ProcessID = +$ProcessID;
  $JSON.Label = localStorage.getItem("formLabel" + _pageKey);
  $JSON.FormID = +_pageKey;
  $JSON.FormItems = [];
  $JSON.FormGroupBoxs = [];
  $JSON.FormItems.push(...$ITEMS_ARRAY);
  $JSON.FormGroupBoxs.push(...$GROUPS_ARRAY);
  $JSON.Variables = JSON.parse(localStorage.getItem("Variables" + $ProcessID));

  return JSON.stringify($JSON);
}

ExportFile = () => {
  try {
    const filename = `Form-${_pageKey}.fdm`;
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
  } catch (error) {
    swal(`${formResources.get("errorconnection")}`, { icon: "warning" });
  }
};
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
    ${formResources.get("jsonsuport")}</span>`;
    $("#open_div").append(input_file);
    let Open_btn = `<input type="button" id="open_btn" class="btn btn-primary" value="${formResources.get(
      "open"
    )}" onclick="openDialog()" style="background-color: #3a5ba0;padding-bottom: 20px;width:70px;margin-bottom:5px;font-size: 13px;height:35px" Disabled />`;
    $("#open_btn_Div").append(Open_btn);
    let cancel_btn = `<input type="button" id="cancel_btn" class="btn btn-light" value="${formResources.get(
      "cancel"
    )}" style="margin-right:5px;width:70px;margin-bottom:5px;font-size: 13px;height:35px" onclick="HideModal()">`;
    $("#open_btn_Div").append(cancel_btn);
  }
}

function openDialog() {
  let input = document.getElementById("file-input").files[0];
  if (input) {
    $(`#open_btn`).removeAttr("Disabled");
    var reader = new FileReader();
    reader.onload = function (e) {
      RenderJson(e.target.result);

      setTimeout(() => {
        $JSON.FormID == +_pageKey;
        FormView($JSON);

        let str = localStorage
          .getItem("formLabel" + _pageKey)
          .replaceAll("&nbsp;", " ");
        const _length = str.split("<br");

        for (let i = 0; i < _length.length - 1; i++) {
          let a = str.indexOf("<");
          let b = str.indexOf(">");
          str = str.slice(0, a) + str.slice(b + 1);
        }

        $(`#page-header b`)
          .text(" " + formResources.get("designform") + "  ")
          .append(`<b style="font-weight:bold">${str}</b>`);
      }, 100);
    };
    reader.readAsText(input);
  }
}

function Import_CS(json) {
  RenderJson(json);
}

var $FormItemID;
var $FormGroupBoxID;
var ref = "";

async function RenderJson(json) {
  $JSON = JSON.parse(json);

  $("#content").empty();

  //Set ITEMS_ARRAY
  $ITEMS_ARRAY = [...$JSON.FormItems];
  $ITEMS_ARRAY.sort((one, two) => one.FormItemID - two.FormItemID);

  //Set GROUPS_ARRAY
  $GROUPS_ARRAY = [...$JSON.FormGroupBoxs];
  $GROUPS_ARRAY.sort((one, two) => one.FormGroupBoxID - two.FormGroupBoxID);

  // set FormItemID && FormGroupBoxID
  $FormItemID = $ITEMS_ARRAY.length
    ? $ITEMS_ARRAY.slice(-1)[0].FormItemID + 1 + ""
    : +($JSON.FormID + "00");
  $FormGroupBoxID = $GROUPS_ARRAY.length
    ? $GROUPS_ARRAY.slice(-1)[0].FormGroupBoxID + ""
    : +$JSON.FormID + "0";

  await Sidebar($JSON);

  await DataProcess_UI($JSON);

  $JSON.FormID = +_pageKey;

  FormView($JSON);

  let str = localStorage
    .getItem("formLabel" + _pageKey)
    .replaceAll("&nbsp;", " ");
  const _length = str.split("<br");

  for (let i = 0; i < _length.length - 1; i++) {
    let a = str.indexOf("<");
    let b = str.indexOf(">");
    str = str.slice(0, a) + " " + str.slice(b + 1);
  }

  $(`#page-header b`)
    .text(" " + formResources.get("designform") + "  ")
    .append(`<b style="font-weight:bold">${str}</b>`);
}

function ShowBtn() {
  $("#open_btn").removeAttr("Disabled");
}

//form modal edit
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

function HideModal() {
  $("#myModal").remove();
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
}

function Exit() {
  saveDesign(false);
  setTimeout(() => {
    window.open("", "_self").close();
  }, 1000);
}

// (function () {
//   setInterval(() => {
//     if (localStorage.getItem("Saveinterval") == "true") {
//       //اگه چیز جدید واسه Refاومد بروززسانی کن
//     }
//   }, 1000);
// })();
