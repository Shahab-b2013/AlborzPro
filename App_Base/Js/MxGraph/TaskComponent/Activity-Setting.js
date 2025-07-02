/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.5.0.0*/
/* Release Ferdos.BPMS*/

function Activity_Setting(graph) {
  //UI
  $("body").append(
    '<div id="Activity_Setting" class="modal"><div id="Activity_Setting_ID" class="modal-content" style=""></div></div>'
  );
  $("#Activity_Setting").css("display", "block");

  let mainDiv =
    `<span class="fa fa-gear"></span><label   class="" style="font-size:17px;font-weight: 700;">` +
    mxResources.get("TaskSettings") +
    `</label>` +
    '<hr style="border-Top: 2px solid #ccc;"/>' +
    `<div id="currentPositionDiv" style="border:1px solid #ccc;padding:7px 5px;display: block;align-items: center;border-radius: 3px;"><div><label>` +
    mxResources.get("currentPosition") +
    `</label><select id="currentPosition" class="selectF"></select></div></div>` +
    `<hr style="border-Top: 2px solid #ccc;">` +
    `<div class="head_activi"><label class="radioLbl">` +
    mxResources.get("DoTheActivity") +
    `</label></div>` +
    '<div id="mainDIv">' +
    `<div class="divSelectF"><label  >` +
    mxResources.get("MainCartable") +
    `</label><select id="select1" class="selectF" ></select></div>` +
    `<div class="divSelectF" style="display:none">
    <select id="select2" class="selectF" ></select ></div>` +
    `<div class="divSelectF" style="display:none"><input type="checkbox" id="checkbox1" /><label for="checkbox1">` +
    mxResources.get("Theabilitytoinsertactivityfollow-upsinseveralstages") +
    `</label></div>` +
    `<div class="divSelectF" style="display:none"><input type="checkbox" id="checkbox2" /><label for="checkbox2">` +
    mxResources.get("Abilitytosuspendactivity") +
    `</label></div>` +
    `<div class="divSelectF" style="display:none"><input type="checkbox" id="checkbox3" /><label for="checkbox3">` +
    mxResources.get("Theabilitytodelegate(refer)theactivitytoothers") +
    `</label></div>` +
    `<div class="divSelectF" style="display:none"><input type="checkbox" id="checkbox4" /><label for="checkbox4">` +
    mxResources.get("TheabilitytochangetheactivitySLAbythuser") +
    `</label></div>` +
    `<div class="divSelectF" style="display:none"><input type="checkbox" id="checkbox5" /><label for="checkbox5">` +
    mxResources.get("Theabilitytoreturntheactivitytotheteammanager") +
    `</label></div>` +
    `</div>`;
  $(`#Activity_Setting_ID`).append(mainDiv);

  $(`#Activity_Setting_ID`).append(
    `<button id="btn_primary" class="btn btn-primary " style="width: 70px;" >${mxResources.get(
      "btnPrimary"
    )}</button>`
  );

  $(`#Activity_Setting_ID`).append(
    `<button id="btn_exit" class="btn btn btn-light" style="width: 70px;">${mxResources.get(
      "btnCancel"
    )}</button>`
  );
  //options
  let item = $JSON_IMPORTED.ProcessModel;
  let opt;
  if (item) {
    if (item.SysCartables) {
      //default
      // $(`#select1`).append(
      //   `<option value="0">${mxResources.get("processesForms")}</option>`
      // );
      // $(`#select2`).append(
      //   `<option value="0">${mxResources.get("withoutSubstitute")}</option>`
      // );
      //new set
      for (let i in item.SysCartables)
        opt += `<option value="${item.SysCartables[i].ID}">${item.SysCartables[i].Label}</option>`;
      $(`#select1`).append(opt);
      $(`#select2`).append(opt);

      opt = "";
      if (item.FlowStates)
        for (let i in item.FlowStates)
          opt += `<option value="${item.FlowStates[i].ID}">${item.FlowStates[i].Label}</option>`;
      $(`#currentPosition`).append(opt);
    }
  }

  //Action
  let isValue;
  $(`#btn_primary`).on("click", () => {
    try {
      if (
        $(`#select1`).val() != null &&
        $(`#select2`).val() != null &&
        $(`#currentPosition`).val() != null &&
        $(`#select1`).val() != undefined &&
        $(`#select2`).val() != undefined &&
        $(`#currentPosition`).val() != undefined
      ) {
        isValue = _CurrentPosition.filter(
          (x) => x.ID == +graph.getSelectionCell().id
        );
        if (isValue.length)
          _CurrentPosition.splice(_CurrentPosition.indexOf(isValue[0]), 1);

        _CurrentPosition.push({
          ID: +graph.getSelectionCell().id,
          value: $(`#currentPosition`).val(),
        });

        isValue = _Setting.filter((x) => x.ID == +graph.getSelectionCell().id);
        if (isValue.length) _Setting.splice(_Setting.indexOf(isValue[0]), 1);

        isValue = _Cartabele.filter(
          (x) => x.ID == +graph.getSelectionCell().id
        );
        if (isValue.length)
          _Cartabele.splice(_Cartabele.indexOf(isValue[0]), 1);

        _Cartabele.push({
          ID: +graph.getSelectionCell().id,
          AssignedCartabeleID: +$(`#select1`).val(),
          DefaultCartabeleID: +$(`#select2`).val(),
        });

        _Setting.push({
          ID: +graph.getSelectionCell().id,
          BOption1: $(`#checkbox1`).is(":checked"),
          BOption2: $(`#checkbox2`).is(":checked"),
          BOption3: $(`#checkbox3`).is(":checked"),
          BOption4: $(`#checkbox4`).is(":checked"),
          BOption5: $(`#checkbox5`).is(":checked"),
        });
        $(`#Activity_Setting`).remove();
        // swal(
        //   `${mxResources.get("Successfulregistration")}`,
        //   `${mxResources.get("registrationsuccessfully")}`,
        //   "success",
        //   {
        //     button: `${mxResources.get("ok")}`,
        //   }
        // );
      } else {
        $(`.alert`).remove();
        if ($(`#select1`).val() == null || $(`#select1`).val() == undefined) {
          $(`#select2-select1-container`).parent().css("border-color", "red");
          $(`#mainDIv`).append(
            `<span class="alert" style="color:red;font-size: 12px;display:block;">${mxResources.get(
              "nullMainCartable"
            )}</span>`
          );
        }

        if ($(`#select2`).val() == null || $(`#select2`).val() == undefined) {
          $(`#select2-select2-container`).parent().css("border-color", "red");
        }

        if (
          $(`#currentPosition`).val() == null ||
          $(`#currentPosition`).val() == undefined
        ) {
          $(`#select2-currentPosition-container`)
            .parent()
            .css("border-color", "red");

          $(`#currentPositionDiv`).append(
            `<span class="alert" style="color:red;font-size: 12px;display:block;">${mxResources.get(
              "nullcurrentPosition"
            )}</span>`
          );
        }
      }
    } catch (error) {
      swal(error.message, { icon: "warning" });
    }
  });

  //btn
  $(`#btn_exit`).on("click", () => $(`#Activity_Setting`).remove());

  //ONload
  isValue = _Setting.filter((x) => x.ID == +graph.getSelectionCell().id);
  if (isValue.length) {
    $(`#checkbox1`).prop("checked", isValue[0].BOption1 ? true : false);
    $(`#checkbox2`).prop("checked", isValue[0].BOption2 ? true : false);
    $(`#checkbox3`).prop("checked", isValue[0].BOption3 ? true : false);
    $(`#checkbox4`).prop("checked", isValue[0].BOption4 ? true : false);
    $(`#checkbox5`).prop("checked", isValue[0].BOption5 ? true : false);
  }
  isValue = _Cartabele.filter((x) => x.ID == +graph.getSelectionCell().id);
  if (isValue.length) {
    $(`#select1`).val(
      isValue[0].AssignedCartabeleID == 0
        ? $(`#select1 option:first`).val()
        : isValue[0].AssignedCartabeleID
    );
    $(`#select2`).val(
      isValue[0].DefaultCartabeleID == 0
        ? $(`#select2 option:first`).val()
        : isValue[0].DefaultCartabeleID
    );
  }
  isValue = _CurrentPosition.filter(
    (x) => x.ID == +graph.getSelectionCell().id
  );
  if (isValue.length) {
    $(`#currentPosition`).val(isValue[0].value);
  }

  //Dropdown select2 component
  $(".selectF").select2();
}
