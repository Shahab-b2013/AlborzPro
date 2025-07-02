/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.5.0.0*/
/* Release Ferdos.BPMS*/

function Activity_SLA(graph) {
  //UI
  $("body").append(
    '<div id="SLA_activi_Modal" class="modal"><div id="SLA_activi_ID" class="modal-content" style="width:780px;top:-15px;"></div></div>'
  );
  $("#SLA_activi_Modal").css("display", "block");

  let mainDiv =
    `<span class="glyphicon glyphicon-time"></span><label   class="" style="font-size:17px;font-weight: 700;">${mxResources.get(
      "TaskSLA"
    )}</label>
    <hr style="border-Top: 2px solid #ccc;"/>
    <div class="head_activi">
    <label class="radioLbl">${mxResources.get("Settime")}</label></div>

    <div id="mainDIv">
    <label for="number" style="margin-top:5px">${mxResources.get(
      "Timer"
    )}</label><input type="number" id="number" class="number" min="0" value="0" style="width:90px" />` +
    `<select  id="selectTime" class="selectTime" ><option value="MINUTE">${mxResources.get(
      "Minute"
    )}</option><option value="HURS">${mxResources.get(
      "Hurs"
    )}</option><option value="DAY">${mxResources.get(
      "Day"
    )}</option></select></br>
    <div style="display:flex;align-items: center;"><input type="checkbox" id="checkbox1" style="position:absolute;margin-top: 13px;"/><label for="checkbox1" style="margin: 5px 15px">${mxResources.get(
      "Runoutsideworkinghours"
    )}</label></div>` +
    `<div style="display:flex;align-items: center;"><input type="checkbox" id="checkbox2" style="position:absolute;margin-top: 7px;"/><label for="checkbox2" style="margin:0px 15px 2px 15px">${mxResources.get(
      "Runoutsidetheworkcalendar"
    )}</label></div>
    </div>

    <div class="head_activi">
    <label class="radioLbl">${mxResources.get(
      "Supervisory levels"
    )}</label></div>

    <div id="my-group-box">
    <fieldset id="my-group-box-fieldset">
    <legend>${mxResources.get("activitymonitoringLevel1")}</legend>
    </div>
    </fieldset>`;

  $(`#SLA_activi_ID`).append(mainDiv);
  F1("my-group-box-fieldset");

  //btn
  $(`#SLA_activi_ID`).append(
    `<button id="btn_primary" class="btn btn-primary " style="width: 70px;" >${mxResources.get(
      "btnPrimary"
    )}</button>`
  );

  $(`#SLA_activi_ID`).append(
    `<button id="btn_exit" class="btn btn btn-light" style="width: 70px;">${mxResources.get(
      "btnCancel"
    )}</button>`
  );

  //Action
  Activity_Action();

  let isValueSLA;
  let isValueAssign;
  $(`#btn_primary`).on("click", () => {
    //save sla
    isValueSLA = _SLA.filter((x) => x.ID == +graph.getSelectionCell().id);
    if (isValueSLA.length > 0) _SLA.splice(_SLA.indexOf(isValueSLA[0]), 1);

    _SLA.push({
      ID: +graph.getSelectionCell().id,
      ResolutionTimes: +$(`#number`).val(),
      ResolutionType: $(`#selectTime`).val(),
      BOption0: $(`#checkbox1`).is(":checked"),
      BOption6: $(`#checkbox2`).is(":checked"),
    });

    //save assign
    let bool = true;
    try {
      isValueAssign = _AssignmentOBJ.filter(
        (x) => x.ID == +graph.getSelectionCell().id
      );
      if (isValueAssign.length > 0) 
        _AssignmentOBJ.splice(_AssignmentOBJ.indexOf(isValueAssign[0]), 1);
      
      let Obj = {
        ID: +graph.getSelectionCell().id,
        Type: "Individual",
        AssignedUserID: 0,
        AssignedTeamID: 0,
        AssignedPositionID: 0,
        DefaultUserID: 0,
        DefaultTeamID: 0,
        DefaultPositionID: 0,
        AssignmentProcedureID: 0,
        AssignedVariableID: 0,
      };

      if ($(`#radio5`)[0].checked) {
        if ($(`#select1`).val() == undefined) {
          alertBox("select1");
          bool = false;
        } else {
          Obj.AssignedUserID = +$(`#select1`).val();
        }
      } else if ($(`#radio6`)[0].checked) {
        if ($(`#select3`).val() == undefined) {
          alertBox("select3");
          bool = false;
        } else {
          Obj.AssignedPositionID = +$(`#select3`).val();
        }
      } else if ($(`#radio7`)[0].checked) {
        if ($(`#select5`).val() == undefined) {
          alertBox("select5");
          bool = false;
        } else {
          Obj.AssignedTeamID = +$(`#select5`).val();
          // Obj.DefaultTeamID = +$(`#select6`).val();
        }
      } else if ($(`#radio8`)[0].checked) {
        if ($(`#select55`).val() == undefined) {
          alertBox("select55");
          bool = false;
        } else {
          Obj.AssignedVariableID = +$(`#select55`).val();
        }
      }

      function alertBox(itemID) {
        $(`#` + itemID)
          .parent()
          .append(
            `<div style="padding:5px"><span style="color:red;font-size:12px">${mxResources.get(
              "listisempty"
            )}</span></div>`
          );
      }
      //check allow insert
      if (bool) {
        _AssignmentOBJ.push(Obj);
        $(`#SLA_activi_Modal`).remove();
      }
    } catch (error) {
      swal(error.message, { icon: "warning" });
    }
  });

  //btn
  $(`#btn_exit`).on("click", () => $(`#SLA_activi_Modal`).remove());

  //ONload
  //sla
  isValueSLA = _SLA.filter((x) => x.ID == +graph.getSelectionCell().id);
  if (isValueSLA.length) {
    $(`#number`).val(isValueSLA[0].ResolutionTimes);
    $(`#selectTime`).val(isValueSLA[0].ResolutionType);
    $(`#checkbox1`).prop("checked", isValueSLA[0].BOption0 ? true : false);
    $(`#checkbox2`).prop("checked", isValueSLA[0].BOption6 ? true : false);

    //assignment
    isValueAssign = _AssignmentOBJ.filter(
      (x) => x.ID == +graph.getSelectionCell().id
    );
    $(`#radio1`).prop("checked", true);
    show_hide("F1", "F2", "F3", "F4");

    if (isValueAssign.length) {
      if (isValueAssign[0].AssignedUserID != "") {
        $(`#radio5`).prop("checked", true);
        show_hide("F1_1", "F1_2", "F1_3", "F1_4");
        $(`#select1`).val(isValueAssign[0].AssignedUserID);
        $(`#select2`).val(isValueAssign[0].DefaultUserID);
      } else if (isValueAssign[0].AssignedPositionID != "") {
        $(`#radio6`).prop("checked", true);
        show_hide("F1_2", "F1_1", "F1_3", "F1_4");
        $(`#select3`).val(isValueAssign[0].AssignedPositionID);
        // $(`#select4`).val( isValueAssign[0].DefaultPositionID);
      } else if (isValueAssign[0].AssignedTeamID != "") {
        $(`#radio7`).prop("checked", true);
        show_hide("F1_3", "F1_1", "F1_2", "F1_4");
        $(`#select5`).val(isValueAssign[0].AssignedTeamID);
        $(`#select6`).val(isValueAssign[0].DefaultTeamID);
      } else if (isValueAssign[0].AssignedVariableID != "") {
        $(`#radio8`).prop("checked", true);
        show_hide("F1_4", "F1_1", "F1_2", "F1_3");
        $(`#select55`).val(isValueAssign[0].AssignedVariableID);
      }
    } else {
      let Obj = {
        ID: +graph.getSelectionCell().id,
        Type: "Individual",
        AssignedUserID: 0,
        AssignedTeamID: 0,
        AssignedPositionID: 0,
        DefaultUserID: 0,
        DefaultTeamID: 0,
        DefaultPositionID: 0,
        AssignmentProcedureID: 0,
        AssignedVariableID: 0,
      };
    }
  }
}


