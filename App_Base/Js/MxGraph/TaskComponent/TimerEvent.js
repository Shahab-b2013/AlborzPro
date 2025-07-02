function TimerEvent(graph, type) {
  $("body").append(
    '<div id="Timer_Modal" class="modal"><div id="Timer_ID" class="modal-content" style="width:770px;top:-15px;"></div></div>'
  );
  $("#Timer_Modal").css("display", "block");

  let mainDiv =
    `<span class="glyphicon glyphicon-time"></span><label class="" style="font-size:17px;font-weight: 700;">${mxResources.get(
      type == "TimerIntermediate" ? "TimerIntermediate" : "TimerStart2"
    )}</label>` +
    '<hr style="border-Top: 2px solid #ccc;"/>' +
    `<div class="head_activi"><label class="radioLbl">${mxResources.get(
      "Settime"
    )}</label></div>
      <div id="mainDIv">`;

  if (type == "TimerStart") {
    mainDiv += `<label for="DataTime" style="margin-top:5px; width:35px;">${mxResources.get(
      "StartTime"
    )}</label>
      <input type="DataTime" id="DataTime" class="number" />
      </br>`;

    mainDiv += `<label for="repeat" style="margin-top:5px; width:35px;">${mxResources.get(
      "repeat"
    )}</label>
      <input type="number" id="repeat" class="number" min="0" value="0" />
      </br>`;
  }
  mainDiv +=
    `<div >
    <div id="rowtime" style="display: flex;"><label for="number" style="width:35px;">${mxResources.get(
      type == "TimerStart" ? "Every" : "Timer"
    )}</label>
      <input type="number" id="number" class="number" min="1" value="1" />
      <select  id="selectTime" class="selectTime"  >
      <option value="Second">${mxResources.get("Second")}</option>
      <option value="MINUTE">${mxResources.get("Minute")}</option>
      <option value="HURS">${mxResources.get("Hurs")}</option>
      <option value="DAY">${mxResources.get("Day")}</option>
      <option value="WEEK">${mxResources.get("Week")}</option>
      <option value="MONTH">${mxResources.get("Month")}</option>
      </select>
      </div>
      <div style="display:flex;align-items: center;"><input type="checkbox" id="checkbox1" style="position:absolute;margin-top: 13px;"/><label for="checkbox1" style="margin: 5px 15px">${mxResources.get(
        "Runoutsideworkinghours"
      )}</label></div>` +
    `<div style="display:flex;align-items: center;"><input type="checkbox" id="checkbox2" style="position:absolute;margin-top: 7px;"/><label for="checkbox2" style="margin:0px 15px 2px 15px">${mxResources.get(
      "Runoutsidetheworkcalendar"
    )}</label></div>` +
    "</div></div>";
  $(`#Timer_ID`).append(mainDiv);

  $(`#Timer_ID`).append(
    `<button id="btn_primary" class="btn btn-primary" style="width: 70px;" >${mxResources.get(
      "btnPrimary"
    )}</button>`
  );

  $(`#Timer_ID`).append(
    `<button id="btn_exit" class="btn btn btn-light" style="width: 70px;">${mxResources.get(
      "btnCancel"
    )}</button>`
  );

  $(`#DataTime`).val(currentDateTime());

  //save
  $(`#btn_primary`).on("click", () => {
    isValue = _SLA.filter((x) => x.ID == +graph.getSelectionCell().id);
    if (isValue.length > 0) _SLA.splice(_SLA.indexOf(isValue[0]), 1);
    let _weekDays = {};
    if ($(`#selectTime`).val() == "WEEK") {
      _weekDays = {
        Saturday: $(`#Saturday`).is(":checked"),
        Sunday: $(`#Sunday`).is(":checked"),
        Monday: $(`#Monday`).is(":checked"),
        Tuesday: $(`#Tuesday`).is(":checked"),
        Wednesday: $(`#Wednesday`).is(":checked"),
        Thursday: $(`#Thursday`).is(":checked"),
        Friday: $(`#Friday`).is(":checked"),
      };
    }

    let _monthDays = null;
    if ($(`#selectTime`).val() == "MONTH") _monthDays = +$(`#monthdays`).val();

    _SLA.push({
      ID: +graph.getSelectionCell().id,
      StartDateTime: $(`#DataTime`).val(),
      Repeat: +$(`#repeat`).val(),
      ResolutionTimes: +$(`#number`).val(),
      ResolutionType: $(`#selectTime`).val(),
      WeekDays: _weekDays,
      MonthDay: _monthDays,
      BOption0: $(`#checkbox1`).is(":checked"),
      BOption6: $(`#checkbox2`).is(":checked"),
    });

    $(`#Timer_Modal`).remove();
  });
  //exit
  $(`#btn_exit`).on("click", () => $(`#Timer_Modal`).remove());

  //date picker
  $("#DataTime").MdPersianDateTimePicker({
    targetTextSelector: "#DataTime",
    targetDateSelector: "#DataTime",
  });

  //show week day
  function WEEKDAYS() {
    return `<div id="weekday" style="display:flex;align-items: center;margin-top: 10px;background-color: #faebd73d;">
        <input type="checkbox" id="Saturday" />
        <label for="Saturday" class="week" >${mxResources.get(
          "Saturday"
        )}</label>
        <input type="checkbox" id="Sunday" />
        <label for="Sunday" class="week">${mxResources.get("Sunday")}</label>
        <input type="checkbox" id="Monday"/>
        <label for="Monday" class="week" >${mxResources.get("Monday")}</label>
        <input type="checkbox" id="Tuesday"/>
        <label for="Tuesday" class="week">${mxResources.get("Tuesday")}</label>
        <input type="checkbox" id="Wednesday"/>
        <label for="Wednesday" class="week">${mxResources.get(
          "Wednesday"
        )}</label>
        <input type="checkbox" id="Thursday"/>
        <label for="Thursday" class="week">${mxResources.get(
          "Thursday"
        )}</label>
        <input type="checkbox" id="Friday"/>
        <label for="Friday" class="week">${mxResources.get("Friday")}</label>
        </div>`;
  }

  function MonthDAYS() {
    let opt;
    for (let i = 1; i <= 31; i++) opt += `<option value="${i}">${i}</option>`;

    return ` <label id="monthdayslbl" for="monthdays" style="width:35px;">${mxResources.get(
      "inDay"
    )}</label><select id="monthdays" class="selectTime" style="width:65px">${opt}</select><br>`;
  }

  $(`#selectTime`).on("change", (e) => {
    if ($(e.target).val() == "WEEK" && type == "TimerStart") {
      $(`#checkbox1`).parent().before(WEEKDAYS());
    } else {
      $(`#weekday`).remove();
    }
  });
  $(`#selectTime`).on("change", (e) => {
    if ($(e.target).val() == "MONTH" && type == "TimerStart") {
      $(`#rowtime`).append(MonthDAYS());
    } else {
      $(`#monthdays`).remove();
      $(`#monthdayslbl`).remove();
    }
  });

  //ONload

  isValueSLA = _SLA.filter((x) => x.ID == +graph.getSelectionCell().id);
  if (isValueSLA.length) {
    $(`#DataTime`).val(isValueSLA[0].StartDateTime);
    $(`#repeat`).val(isValueSLA[0].Repeat);
    $(`#number`).val(isValueSLA[0].ResolutionTimes);
    $(`#selectTime`).val(isValueSLA[0].ResolutionType);
    $(`#checkbox1`).prop("checked", isValueSLA[0].BOption0 ? true : false);
    $(`#checkbox2`).prop("checked", isValueSLA[0].BOption6 ? true : false);

    if (isValueSLA[0].ResolutionType == "WEEK" && type == "TimerStart") {
      $(`#checkbox1`).parent().before(WEEKDAYS());
      $(`#Saturday`).prop(
        "checked",
        isValueSLA[0].WeekDays.Sunday ? true : false
      );
      $(`#Sunday`).prop(
        "checked",
        isValueSLA[0].WeekDays.Sunday ? true : false
      );
      $(`#Monday`).prop(
        "checked",
        isValueSLA[0].WeekDays.Monday ? true : false
      );
      $(`#Tuesday`).prop(
        "checked",
        isValueSLA[0].WeekDays.Tuesday ? true : false
      );
      $(`#Wednesday`).prop(
        "checked",
        isValueSLA[0].WeekDays.Wednesday ? true : false
      );
      $(`#Thursday`).prop(
        "checked",
        isValueSLA[0].WeekDays.Thursday ? true : false
      );
      $(`#SatFridayurday`).prop(
        "checked",
        isValueSLA[0].WeekDays.Friday ? true : false
      );
    }

    if (isValueSLA[0].ResolutionType == "MONTH" && type == "TimerStart") {
      $(`#selectTime`).after(MonthDAYS());
      $(`#monthdays`).val(isValueSLA[0].MonthDay);
    }
  }
}

//current date time
function currentDateTime() {
  let today = new Date();
  let CurrentDate = today.toLocaleDateString("fa-IR");
  let CurrentTime = today.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return CurrentDate + " " + CurrentTime;
}
