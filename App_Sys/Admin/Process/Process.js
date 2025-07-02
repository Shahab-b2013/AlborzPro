/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.2.0*/
/* Release Ferdos.BPMS*/

var mxCellArr = [];

var VariableUI = {
  //*UI
  List_Modal: {
    id: "ProcessData_AddTable",
    title: "dataprocess",
    Table: {
      id: "ProcessData_Table",
      widht: 1500,
      Thead: {
        Used: "Used",
        SystemID: "SystemID",
        Label: "Label",
        DataType: "DataType",
        EntityTypeID: "EntityTypeID",
        EnumTypeID: "EnumTypeID",
        InputCount: "InputCount",
        Nullable: "Nullable",
        IsDefault: "IsDefault",
      },
    },
  },
  Item_Modal: {
    id: "ProcessData_AddItems",
    title: "addnewdata",
    Add_Items: {
      id: "ProcessData_Items",
      widht: 645,
      Items: [
        //textbox
        new Object_Constractor(
          "item_1",
          "textBox",
          "text",
          "Label",
          "Label",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //dropdown
        new Object_Constractor(
          "item_3",
          "dropDown",
          "dropdown",
          "DataType",
          "DataType",
          [
            new Option_Constractor("LocalString", "LocalString"),
            new Option_Constractor("LatinString", "LatinString"),
            new Option_Constractor("String", "String"),
            new Option_Constractor("Text", "Text"),
            new Option_Constractor("Integer", "Integer"),
            new Option_Constractor("BigInteger", "BigInteger"),
            new Option_Constractor("Time", "Time"),
            new Option_Constractor("Date", "Date"),
            new Option_Constractor("DateTime", "DateTime"),
            new Option_Constractor("Boolean", "Boolean"),
            new Option_Constractor("Money", "Money"),
            new Option_Constractor("File", "File"),
            new Option_Constractor("Image", "Image"),
            new Option_Constractor("System", "System"),
            new Option_Constractor("Computed", "Computed"),
            new Option_Constractor("Enum", "Enum"),
            new Option_Constractor("Table", "Table"),
            new Option_Constractor("SelectiveTable", "SelectiveTable"),
            new Option_Constractor("Sms", "Sms"),
            new Option_Constractor("Agreement", "Agreement"),
            new Option_Constractor("FacilityBox", "FacilityBox"),
            new Option_Constractor("TimingBox", "TimingBox"),
          ],
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //dropdown
        new Object_Constractor(
          "item_5",
          "dropDown",
          "dropdown",
          "EntityTypeID",
          "Entity",
          [new Option_Constractor("", "")],
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //textarea
        new Object_Constractor(
          "item_6",
          "textarea",
          "textarea",
          "Computed",
          "formula",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        new Object_Constractor(
          "item_7",
          "dropDown",
          "dropdown",
          "EnumTypeID",
          "EnumType",
          [new Option_Constractor("", "")],
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //dropdown
        new Object_Constractor(
          "item_2",
          "dropDown",
          "dropdown",
          "InputCount",
          "InputCount",
          [
            new Option_Constractor("Single", "Single"),
            new Option_Constractor("Array", "Array"),
            new Option_Constractor("List", "List"),
          ],
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //checkBox
        new Object_Constractor(
          "item_4",
          "checkBox",
          "checkbox",
          "Nullable",
          "Nullable",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        new Object_Constractor(
          "item_13",
          "checkBox",
          "checkbox",
          "IsDefault",
          "IsDefault",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
      ],
    },
  },

  //*DATA
  MainArray: [],
  TemporaryArray: [],

  //*COMMAND
  Insert: function (_ID, _GID, _RowKey, _Systemid, _Columns = []) {
    let arr = [];
    let id, value;

    Items_Array.forEach((item2) => {
      id = item2.id;
      value = $("#" + id).val();
      //Create obj
      arr.push(["GeneralId", _GID]);
      arr.push(["VariableID", parseInt(_Systemid.match(/\d+/)[0])]);
      if (value == "Table" || value == "SelectiveTable") {
        arr.push(["Columns", _Columns]);
        arr.push(["TableID", _RowKey]);
      }
      arr.push(["RowKey", _RowKey]);

      if (item2.variableExp == "Label") {
        arr.push(["Name", value]);
        arr.push(["Label", value]);
        arr.push(["SystemID", _Systemid]);
      } else if (item2.variableExp == "DataType") {
        arr.push(["DataType", value]);
        arr.push(["InputType", inputtype(value)]);
      } else if (item2.variableExp == "InputCount") {
        arr.push(["InputCount", value]);
      } else if (item2.variableExp == "EntityTypeID") {
        $(`#item_5`).parent().css("display") == "flex"
          ? arr.push(["EntityTypeID", +value])
          : arr.push(["EntityTypeID", 0]);
      } else if (item2.variableExp == "Computed") {
        $(`#item_6`).parent().css("display") == "flex"
          ? arr.push(["Formula", value])
          : arr.push(["Formula", ""]);
      } else if (item2.variableExp == "EnumTypeID") {
        $(`#item_7`).parent().css("display") == "flex"
          ? arr.push(["EnumTypeID", +value])
          : arr.push(["EnumTypeID", 0]);
      } else if (item2.variableExp == "Nullable") {
        arr.push([
          "Nullable",
          +$("#" + id).prop("checked") == 0 ? false : true,
        ]);
      } else if (item2.variableExp == "IsDefault") {
        arr.push([
          "IsDefault",
          +$("#" + id).prop("checked") == 0 ? false : true,
        ]);
      }

      arr.push(["MinValueLenght", ""]);
      arr.push(["MaxValueLenght", ""]);
      arr.push(["MinValue", ""]);
      arr.push(["MaxValue", ""]);
      arr.push(["Version", ""]);
      arr.push(["Description", ""]);
    });

    function inputtype(type) {
      let outputType;
      switch (type) {
        case "String":
        case "LocalString":
        case "LatinString":
        case "Integer":
        case "BigInteger":
        case "Money":
          outputType = "TextBox";
          break;
        case "Computed":
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
          outputType = "Agreement";
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
    //*OBJECT
    const obj = Object.fromEntries(arr);
    this.TemporaryArray.push(obj);
    this.TemporaryArray.sort((a, b) => a.GeneralId - b.GeneralId);
    localStorage.setItem("LastSystemID" + _pageKey, _Systemid);
  },
};

var DocumentUI = {
  //*UI
  List_Modal: {
    id: "Doc_AddTable",
    title: "Processoutputdocumentation",
    Table: {
      id: "Doc_Table",
      widht: 1200,
      Thead: {
        Name: "Name",
        DocImg: "DocImg",
        ImgSize: "ImgSize",
        ActivityID: "ActivityID",
        // ViewAccessID: "ViewAccessID",
        // DownloadAccessID: "DownloadAccessID",
        Details: "Details",
      },
    },
  },
  Item_Modal: {
    id: "Doc_AddItems",
    title: "addnewdoc",
    Add_Items: {
      id: "Doc_Items",
      widht: 618,
      Items: [
        //textbox
        new Object_Constractor(
          "item_1",
          "textBox",
          "text",
          "Label",
          "Name",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //borwsebox
        new Object_Constractor(
          "item_2",
          "fileBox",
          "file",
          "Label",
          "DocImg",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //dropdown
        new Object_Constractor(
          "item_4",
          "dropDown",
          "dropdown",
          "StateID",
          "ImgSize",
          [
            new Option_Constractor("A4", "A4"),
            new Option_Constractor("A5", "A5"),
          ],
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //dropdown
        new Object_Constractor(
          "item_10",
          "dropDown",
          "dropdown",
          "ActivityID",
          "ActivityID",
          [
            [new Option_Constractor("", "")],
            new Label_Constractor("label", ""),
          ],
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //dropdown
        // new Object_Constractor(
        //   "item_11",
        //   "dropDown",
        //   "dropdown",
        //   "ViewAccessID",
        //   "ViewAccessID",
        //   [
        //     [new Option_Constractor("", "")],
        //     new Label_Constractor("label", ""),
        //   ],
        //   new Label_Constractor("label", ""),
        //   "display:inline;"
        // ),
        // //dropdown
        // new Object_Constractor(
        //   "item_12",
        //   "dropDown",
        //   "dropdown",
        //   "DownloadAccessID",
        //   "DownloadAccessID",
        //   [
        //     [new Option_Constractor("", "")],
        //     new Label_Constractor("label", ""),
        //   ],
        //   new Label_Constractor("label", ""),
        //   "display:inline;"
        // ),
        //textbox
        new Object_Constractor(
          "item_3",
          "textarea",
          "textarea",
          "DocDetails",
          "Details",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
      ],
    },
  },

  //*DATA
  MainArray: [],
  TemporaryArray: [],

  //*COMMAND
  Insert: function (_ID, GID, RowKey) {
    _ID = +RowKey + Math.round((500 + +_pageKey) * 10000);
    //*OBJECT
    let id,
      _Name,
      _DocImgSrc,
      _DocImgName,
      _DocImgSize,
      _DocActivityID,
      _Details;
    let _DocViewAccess = [];
    let _DocDownloadAccess = [];
    for (let i in Items_Array) {
      id = Items_Array[i].id;

      if (i == 0) {
        _Name = $("#" + id).val();
      } else if (i == 1) {
        _DocImgSrc = imageUploaded_URL[0];
        _DocImgName = imageUploaded_URL[1];
      } else if (i == 2) {
        _DocImgSize = $("#" + id).val();
      } else if (i == 3) {
        _DocActivityID = $("#" + id).val();
      }
      // else if (i == 4) {
      //   _DocViewAccess.push([...$("#" + id).val()]);
      // } else if (i == 5) {
      //   _DocDownloadAccess.push([...$("#" + id).val()]);
      // }
      else if (i == 4) {
        _Details = $("#" + id).val();
      }
    }

    let arr = [];
    arr.push(["GeneralId", GID]);
    arr.push(["RowKey", RowKey]);
    arr.push(["DocumentID", _ID]);
    arr.push(["Name", _Name]);
    arr.push(["Label", _Name]);
    arr.push(["ImgSrc", _DocImgSrc]);
    arr.push(["ImgName", _DocImgName]);
    arr.push(["ImgSize", _DocImgSize]);
    arr.push(["ActivityID", _DocActivityID]);
    // arr.push(["ViewAccessID", _DocViewAccess]);
    // arr.push(["DownloadAccessID", _DocDownloadAccess]);
    arr.push(["Details", _Details]);

    const obj = Object.fromEntries(arr);
    this.TemporaryArray.push(obj);
    this.TemporaryArray.sort((a, b) => a.GeneralId - b.GeneralId);
  },
};

var Conditions = {
  //*UI
  List_Modal: {
    id: "Condition_AddTable",
    title: "conditions",
    Table: {
      id: "Condition_Table",
      widht: 900,
      Thead: {
        Name: "Label",
        OutgoingEID: "nextLevel",
        StateID: "state",
      },
    },
  },
  Item_Modal: {
    id: "Condition_AddItems",
    title: "addnewconditions",
    Add_Items: {
      id: "Condition_Items",
      widht: 615,
      Items: [
        //textbox
        new Object_Constractor(
          "item_1",
          "textBox",
          "text",
          "Label",
          "Label",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //dropdownDynamic
        new Object_Constractor(
          "item_2",
          "dropdownDynamic",
          "dropdownDynamic",
          "OutgoingEID",
          "nextLevel",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //textarea
        new Object_Constractor(
          "item_3",
          "textarea",
          "textarea",
          "Conditions",
          "lblconditions",
          "",
          new Label_Constractor("label", ""),
          "display:inline;resize: vertical;"
        ),
        //dropdown
        new Object_Constractor(
          "item_8",
          "dropDown",
          "dropdown",
          "StateID",
          "state",
          [new Option_Constractor("", "")],
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //dropdown
        new Object_Constractor(
          "item_9",
          "dropDown",
          "dropdown",
          "Access",
          "executionaccess",
          [new Option_Constractor("", "")],
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
      ],
    },
  },

  //*DATA
  MainArray: [],
  TemporaryArray: [],

  //*COMMAND
  Insert: function (_ID, GID, RowKey) {
    let arr = [];
    let Obj_Names = [
      "Name",
      "Label",
      "Conditions",
      "OutgoingEID",
      "StateID",
      "Access",
    ];
    let id, value;

    //get id Items dynamic from Items_Array
    arr.push(["GeneralId", GID]);
    arr.push(["RowKey", RowKey]);
    if (localStorage.getItem("Gateway") != null)
      arr.push(["OwnerEID", +localStorage.getItem("Gateway")]);
    arr.push(["Lang", "sql"]);

    let ArrVal = [];
    Obj_Names.forEach((item, index) => {
      Items_Array.forEach((item2) => {
        if (item2.variableExp == item) {
          id = item2.id;
          if (id != null) {
            item == "Access"
              ? (ArrVal = $("#" + id).val())
              : (value = $("#" + id).val());
          }
          value = isNaN(+value) ? value : +value;
          //*OBJECT
          if (index == 1) {
            arr.push([Obj_Names[index], value]);
            arr.push([Obj_Names[index - 1], value]);
          } else {
            if (item == "OutgoingEID") {
              arr.push([Obj_Names[index], value]);
            } else if (item == "Access") {
              arr.push([Obj_Names[index], ArrVal]);
            } else {
              arr.push([Obj_Names[index], value]);
            }
          }
        }
      });
    });
    const obj = Object.fromEntries(arr);
    this.TemporaryArray.push(obj);
    this.TemporaryArray.sort((a, b) => a.GeneralId - b.GeneralId);
  },
};

var SubTableUI = {
  //*UI
  List_Modal: {
    id: "SubTable_AddTable",
    title: "datatable",
    Table: {
      id: "SubTable_Table",
      widht: 1100,
      Thead: {
        Name: "Label",
        DataType: "DataType",
        EntityTypeID: "EntityTypeID",
        EnumTypeID: "EnumTypeID",
        Nullable: "Nullable",
        ShowInList: "ShowInList",
      },
    },
  },
  Item_Modal: {
    id: "SubTable_AddItems",
    title: "addnewdatatable",
    Add_Items: {
      id: "SubTable_Items",
      widht: 615,
      Items: [
        //textbox
        new Object_Constractor(
          "item_1",
          "textBox",
          "text",
          "Label",
          "Label",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //dropdown
        new Object_Constractor(
          "item_3",
          "dropDown",
          "dropdown",
          "DataType",
          "datatype",
          [
            new Option_Constractor("LocalString", "LocalString"),
            new Option_Constractor("LatinString", "LatinString"),
            new Option_Constractor("String", "String"),
            new Option_Constractor("Text", "Text"),
            new Option_Constractor("Integer", "Integer"),
            new Option_Constractor("BigInteger", "BigInteger"),
            new Option_Constractor("Time", "Time"),
            new Option_Constractor("Date", "Date"),
            new Option_Constractor("DateTime", "DateTime"),
            new Option_Constractor("Boolean", "Boolean"),
            new Option_Constractor("Money", "Money"),
            new Option_Constractor("System", "System"),
            // new Option_Constractor("Computed", "Computed"),
            new Option_Constractor("Enum", "Enum"),
            new Option_Constractor("File", "File"),
          ],
          new Label_Constractor("label", ""),
          "display:inline;"
        ),

        new Object_Constractor(
          "item_5",
          "dropDown",
          "dropdown",
          "EntityTypeID",
          "Entity",
          [new Option_Constractor("", "")],
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //textarea
        new Object_Constractor(
          "item_6",
          "textarea",
          "textarea",
          "Computed",
          "formula",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        new Object_Constractor(
          "item_7",
          "dropDown",
          "dropdown",
          "EnumTypeID",
          "EnumType",
          [new Option_Constractor("", "")],
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //checkBox
        new Object_Constractor(
          "item_4",
          "checkBox",
          "checkbox",
          "Nullable",
          "Nullable",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
        //checkBox
        new Object_Constractor(
          "item_8",
          "checkBox",
          "checkbox",
          "ShowInList",
          "ShowInList",
          "",
          new Label_Constractor("label", ""),
          "display:inline;"
        ),
      ],
    },
  },

  //*DATA
  MainArray: [],
  TemporaryArray: [],

  //*COMMAND
  Insert: function (
    _ID,
    GID,
    _RowKey = +localStorage.getItem("CurrentRowKey"),
    _SystemID
  ) {
    let arr = [];
    const Obj_Names = [
      "Name",
      "Label",
      "Nullable",
      "MinValueLenght",
      "MaxValueLenght",
      "MinValue",
      "MaxValue",
      "DataType",
      "Version",
      "EntityTypeID",
      "Computed",
      "EnumTypeID",
      "Nullable",
      "Description",
      "EnumID",
      "ShowInList",
    ];
    let id, value;

    //get id Items dynamic from Items_Array
    Obj_Names.forEach((item, index) => {
      Items_Array.forEach((item2) => {
        if (item2.variableExp == item) {
          id = item2.id;
          if (id != null)
            index == 2
              ? (value = $("#" + id).prop("checked"))
              : (value = $("#" + id).val());

          //Create obj
          arr.push(["GeneralId", GID]);
          arr.push(["SubTableID", _ID]);
          arr.push(["RowKey", _RowKey]);
          arr.push(["TableID", _RowKey]);
          if (index == 1) {
            arr.push([Obj_Names[index - 1], value]);
            arr.push([Obj_Names[index], value]);
          } else if (index == 7) {
            arr.push([Obj_Names[index], value]);
          } else if (index == 8) {
            arr.push([Obj_Names[index], value]);
          } else if (item2.variableExp == "EntityTypeID") {
            $(`#item_5`).parent().css("display") == "flex"
              ? arr.push(["EntityTypeID", +value])
              : arr.push(["EntityTypeID", 0]);
          } else if (item2.variableExp == "Computed") {
            $(`#item_6`).parent().css("display") == "flex"
              ? arr.push(["Formula", value])
              : arr.push(["Formula", ""]);
          } else if (item2.variableExp == "EnumTypeID") {
            $(`#item_7`).parent().css("display") == "flex"
              ? arr.push(["EnumTypeID", +value])
              : arr.push(["EnumTypeID", 0]);
          } else if (item2.variableExp == "Nullable") {
            arr.push([
              "Nullable",
              +$("#" + id).prop("checked") == 0 ? false : true,
            ]);
          } else if (item2.variableExp == "ShowInList") {
            arr.push([
              "ShowInList",
              +$("#" + id).prop("checked") == 0 ? false : true,
            ]);
          } else {
            arr.push([Obj_Names[index], value]);
          }

          arr.push(["MinValueLenght", ""]);
          arr.push(["MaxValueLenght", ""]);
          arr.push(["MinValue", ""]);
          arr.push(["MaxValue", ""]);
          arr.push(["Version", ""]);
          arr.push(["Description", ""]);
          arr.push(["EnumID", ""]);
          arr.push(["disabled", false]);
          arr.push(["Style", { ColWidth: "auto", ColHeight: "10px" }]);
        }
      });
    });

    //*OBJECT
    let obj = Object.fromEntries(arr);
    this.TemporaryArray.push(obj);
    this.TemporaryArray.sort((a, b) => a.GeneralId - b.GeneralId);
    //insert vairable columns in table
    InsertColumnsTotable(this.TemporaryArray, _SystemID);
  },
};

function Object_Constractor(
  id,
  clas,
  type,
  variableExp,
  title,
  options,
  label,
  style
) {
  this.id = id;
  this.class = clas;
  this.type = type;
  this.variableExp = variableExp;
  this.title = title;
  this.label = label;
  this.options = options;
  this.style = style;
}
function Option_Constractor(id, label) {
  this.id = id;
  this.label = label;
}
function Label_Constractor(clas, style) {
  this.class = clas;
  this.style = style;
}
function InsertColumnsTotable(_TemporaryArray, _SystemID) {
  function CheckObj(obj) {
    return (
      (obj.InputType == "Table" || obj.InputType == "SelectiveTable") &&
      obj.SystemID == _SystemID
    );
  }
  let _var = VariableUI.TemporaryArray.find(CheckObj);
  if (_var != undefined) {
    _var.Columns = _TemporaryArray;
  } else {
    alert("object not found");
  }
}
