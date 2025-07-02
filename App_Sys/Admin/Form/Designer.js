/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.1.0.0*/
/* Release Ferdos.BPMS*/

"use strict";

function renderDesigner(designJson) {
  Import_CS(designJson);
}

function saveDesign(_alert, disabled) {
  if ($(`#FixLabel`).val() != "") {
    //call process saveDesign for
    //save variables
    //
    let VariableARR = [];
    if (localStorage.getItem("Variables" + $ProcessID))
      VariableARR = JSON.parse(localStorage.getItem("Variables" + $ProcessID));
    let _thisVariables = [];

    let items = $(`.form-group`);

    for (let i = 0; i < items.length; i++) {
      let id = $(items[i]).attr("id").replaceAll("group", "item");
      if (
        VariableARR.filter((x) => x.RowKey == +$(items[i]).attr("foreignkey"))
          .length == 0
      ) {
        //insert
        VariableARR.push({
          VariableID: +$(`#${id}`).attr("variableid"),
          RowKey: +$(items[i]).attr("foreignkey"),
          Name: $(items[i]).attr("fixlabel"),
          Label: $(items[i]).attr("fixlabel"),
          SystemID: $(`#${id}`).attr("systemid"),
          MaxValue: "",
          MaxValueLenght: "",
          MinValue: "",
          MinValueLenght: "",
          DataType: $(`#${id}`).attr("datatype"),
          Description: "",
          InputType: $(`#${id}`).attr("inputtype"),
          InputCount: $(`#${id}`).attr("InputCount"),
          EntityTypeID:
            $(`#${id}`).attr("datatype") == "System"||
            $(`#${id}`).attr("datatype") == "Table"
              ? $(`#${id}`).attr("entitytypeid") == ""
                ? "0"
                : $(`#${id}`).attr("entitytypeid")
              : "0",
          EnumTypeID:
            $(`#${id}`).attr("datatype") == "Enum"
              ? $(`#${id}`).attr("enumtypeid") == ""
                ? "0"
                : $(`#${id}`).attr("enumtypeid")
              : "0",
          Formula:
            $(`#${id}`).attr("datatype") == "Computed"
              ? $(`#${id}`).attr("formula") == ""
                ? ""
                : $(`#${id}`).attr("formula")
              : "",

          IsDefault: false,

          Nullable:
            $(`#${id}`).attr("nullable").toLowerCase() == "true" ? true : false,
          Version: "",
        });
      }

      localStorage.setItem(
        "Variables" + $ProcessID,
        JSON.stringify(VariableARR)
      );
    }

    //prop disable
    if (disabled) {
      $(`#EnumID`).prop("disabled", true);

      $(`#DataType`).prop("disabled", true);
    
      $(`#EntityID`).prop("disabled", true);

      $(`#InputCount`).prop("disabled", true);
      $(`#FixLabel`).prop("disabled", true);
      $(`#Readonly`).prop("disabled", true);
      $(`#ComputedID`).prop("disabled", true);
    }
    //save
    var _export = Export();
    var data = new FormData();
    data.append("design", _export);
    data.append("id", +_pageKey);
    var $Form = new fdExecutor(data, _alert);
    $Form.submit(data);

 

    localStorage.setItem("Saveinterval", true);
  } else {
    if ($(`#FixLabel`).val() == "") {
      $(`#FixLabel`).css("border", "1px solid red");
      $(`#FixLabel`).css("border-radius", "2px");
    }

    if ($(`#textlbl`).val() == "") {
      $(`#textlbl`).css("border", "1px solid red");
      $(`#textlbl`).css("border-radius", "2px");
    }

    swal(`${formResources.get("titleisempty")}`, { icon: "warning" });
  }
}
