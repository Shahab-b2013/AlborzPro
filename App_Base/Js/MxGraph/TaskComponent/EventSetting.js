/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.5.0.0*/
/* Release Ferdos.BPMS*/

function EventSetting(graph) {
  //UI
  $("body").append(
    '<div id="Event_Setting" class="modal"><div id="Event_Setting_ID" class="modal-content" style=""></div></div>'
  );
  $("#Event_Setting").css("display", "block");

  let mainDiv =
    `<span class="fa fa-gear"></span><label for="" class="" style="font-size:17px;font-weight: 700;">` +
    mxResources.get("eventSetting") +
    `</label>` +
    '<hr style="border-Top: 2px solid #ccc;"/>' +
    `<div id="currentPositionDiv" style="border:1px solid #ccc;padding:7px 5px;display: block;align-items: center;border-radius: 3px;margin-bottom:10px;"><div><label>` +
    mxResources.get("endPosition") +
    `</label><select id="currentPosition" class="selectF"></select></div></div>`;

  mainDiv += `<div style="border-top: 1px solid #ccc;padding-top: 5px;margin-top:15px;"><button id="btn_primary" class="btn btn-primary " style="width: 70px;" >${mxResources.get(
    "btnPrimary"
  )}</button><button id="btn_exit" class="btn btn btn-light" style="width: 70px;">${mxResources.get(
    "btnCancel"
  )}</button></div>`;

  $(`#Event_Setting_ID`).append(mainDiv);

  //options
  let item = $JSON_IMPORTED.ProcessModel;
  let opt;
  if (item) {
    opt = "";
    if (item.FlowStates)
      for (let i in item.FlowStates)
        opt += `<option value="${item.FlowStates[i].ID}">${item.FlowStates[i].Label}</option>`;

    $(`#currentPosition`).append(opt);
  }

  //Action
  let isValue;
  if (getType(graph.getSelectionCell().style) == "EndEvent")
    $(`#currentPosition`).val(100);

  $(`#btn_primary`).on("click", () => {
    try {
      if (
        $(`#currentPosition`).val() != null &&
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

        $(`#Event_Setting`).remove();
      } else {
        $(`.alert`).remove();

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

  $(`#btn_exit`).on("click", () => $(`#Event_Setting`).remove());

  //OnLoad
  isValue = _CurrentPosition.filter(
    (x) => x.ID == +graph.getSelectionCell().id
  );
  if (isValue.length) {
    $(`#currentPosition`).val(isValue[0].value);
  }

  //Dropdown select2 component
  $(".selectF").select2();
}
