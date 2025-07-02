/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.1.0*/
/* Release Ferdos.BPMS*/

function Activity_Schedule(graph) {
  // Check if the main modal already exists
  if ($("#Activity_Schedule").length === 0) {
    // UI for the main modal
    $("body").append(
      '<div id="Activity_Schedule" class="modal"><div id="Activity_Schedule_ID" class="modal-content" style="width: 750px;"></div></div>'
    );
  }
  $("#Activity_Schedule").css("display", "block");

  // Main content with table
  let mainDiv =
    `<span class="fa-solid fa-business-time"></span><label class="" style="font-size:17px;font-weight: 700;">` +
    mxResources.get("Activity_Schedule") +
    `</label>` +
    '<hr style="border-Top: 2px solid #ccc;"/>' +
    `<div class="head_activi"><label class="radioLbl">${mxResources.get("activityPeriod")}</label></div>` +
    `<div id="mainDiv" style="padding: 7px 10px 15px 10px;">` +
    `<button id="addRow" class="btn btn-primary" style="text-align: center;width: 80px;height: 32px;padding-top: 2px;
    margin-bottom: 11px;">${mxResources.get("add")}</button>` +
    `<table id="activityTable" class="table table-bordered"><thead style="background: #ededed;text-align: center;"><tr>` +
    `<th>${mxResources.get("startDate")}</th>` +
    `<th>${mxResources.get("startTime")}</th>` +
    `<th>${mxResources.get("finishDate")}</th>` +
    `<th>${mxResources.get("finishTime")}</th>` +
    `<th>${mxResources.get("operationsID")}</th></tr></thead><tbody>` +
    `</tbody><tfoot style="background: #f9f9f9;"></tfoot></table>` +
    `</div>`;

  // Append mainDiv to the modal content
  if ($("#Activity_Schedule_ID").children().length === 0) {
    $(`#Activity_Schedule_ID`).append(mainDiv);

    // Add buttons
    $(`#Activity_Schedule_ID`).append(
      `<button id="btn_primary_Schedule" class="btn btn-primary" style="width: 70px;">${mxResources.get(
        "btnPrimary"
      )}</button>`
    );

    $(`#Activity_Schedule_ID`).append(
      `<button id="btn_exit_Schedule" class="btn btn-light" style="width: 70px;">${mxResources.get(
        "btnCancel"
      )}</button>`
    );
  }

  // Load existing data for the selected ID when modal is opened
  loadActivityData(graph);

  // Check if the input modal already exists
  if ($("#inputModal").length === 0) {
    let inputModal =
      `<div id="inputModal" class="modal" style="display:none;">` +
      `<div id="modal-content" class="modal-content" style="width: 600px;padding: 15px 20px 20px 20px;">` +
      `<i class="fa-regular fa-calendar-plus" style="position: absolute;font-size: 18px;top: 10px;"></i>` +
      `<h3 style="margin-top: 0px;padding-left: 30px; font-family: 'IRANSansWeb';margin-right: 30px;font-size: 17px;margin-bottom: 15px;font-weight: bold;">${mxResources.get(
        "DateTimeAdd"
      )}</h3>` +
      `<div style="padding: 8px;border-top: 1px solid #d5d5d5;border-bottom: 1px solid #d5d5d5;display: flex;flex-wrap: wrap;gap: 15px;">` +
      // Start Date with Calendar Icon (RTL)
      `<div style="flex: 1 0 45%; position: relative;" dir="rtl">` +
      `<label class="float-right m-top-12">${mxResources.get(
        "startDate"
      )}</label>` +
      `<div class="input-group">` +
      `<input data-jdp type="text" dir="ltr" id="input1" class="ScheduleInput" style="padding-right: 30px;" />` +
      `<span class="scheduleIcon" style="position: absolute;">` +
      `<i class="fa-duotone fa-solid fa-calendar-days" style="font-size: 14px;color:var(--A1)"></i>` +
      `</span>` +
      `</div>` +
      `</div>` +
      // Start Time with Clock Icon (RTL)
      `<div style="flex: 1 0 45%; position: relative;" dir="rtl">` +
      `<label class="float-right m-top-12">${mxResources.get(
        "startTime"
      )}</label>` +
      `<div class="input-group">` +
      `<input type="text" dir="ltr" id="input2" class="ScheduleInput" data-inputmask="'mask': '99:99'" style="padding-right: 30px;" />` +
      `<span class="scheduleIcon" style="position: absolute;">` +
      `<i class="fa-solid fa-timer" style="font-size: 14px;color:var(--A1)"></i>` +
      `</span>` +
      `</div>` +
      `</div>` +
      // Finish Date with Calendar Icon (RTL)
      `<div style="flex: 1 0 45%; position: relative;" dir="rtl">` +
      `<label class="float-right m-top-12">${mxResources.get(
        "finishDate"
      )}</label>` +
      `<div class="input-group">` +
      `<input data-jdp type="text" dir="ltr" id="input3" class="ScheduleInput" style="padding-right: 30px;" />` +
      `<span class="scheduleIcon" style="position: absolute;">` +
      `<i class="fa-duotone fa-solid fa-calendar-days" style="font-size: 14px;color:var(--A1)"></i>` +
      `</span>` +
      `</div>` +
      `</div>` +
      // Finish Time with Clock Icon (RTL)
      `<div style="flex: 1 0 45%; position: relative;" dir="rtl">` +
      `<label class="float-right m-top-12">${mxResources.get(
        "finishTime"
      )}</label>` +
      `<div class="input-group">` +
      `<input type="text" dir="ltr" id="input4" class="ScheduleInput" data-inputmask="'mask': '99:99'" style="padding-right: 30px;" />` +
      `<span class="scheduleIcon" style="position: absolute;color:var(--A1)">` +
      `<i class="fa-solid fa-timer" style="font-size: 14px;"></i>` +
      `</span>` +
      `</div>` +
      `</div>` +
      `</div>` + // Close the flex container div
      `<button id="saveRow" class="btn btn-primary" style="margin-top: 10px;">${mxResources.get(
        "save"
      )}</button>` +
      `<button id="cancelModal" class="btn btn-light" style="width: 55px;margin-top: 10px;">${mxResources.get(
        "cancel"
      )}</button>` +
      `</div></div>`;

    // Append the input modal to the body
    $("body").append(inputModal);

    // Apply input mask to time inputs
    $("input[data-inputmask]").inputmask();
  }

  Schedule_btn(graph);

  // Event handler to show the input modal when "+" icon is clicked
  $("#addRow")
    .off("click")
    .on("click", function () {
      $("#inputModal").css("display", "block");
      $("#inputModal input").val("");
      jalaliDatepicker.startWatch({
        minDate: "attr",
        maxDate: "attr",
      });
    });

  // Unified event handler to save a new or edited row
  $("#saveRow")
    .off("click")
    .on("click", function () {
      const col1 = $("#input1").val();
      const col2 = $("#input2").val();
      const col3 = $("#input3").val();
      const col4 = $("#input4").val();

      // Validate input fields
      if (!col1 || !col2 || !col3 || !col4) {
        alert("Please fill in all fields.");
        return;
      }

      const row = $(this).data("edit-row");

      if (row) {
        // Update existing row
        row.find("td").eq(0).text(col1);
        row.find("td").eq(1).text(col2);
        row.find("td").eq(2).text(col3);
        row.find("td").eq(3).text(col4);

        // Clear the data attribute
        $(this).removeData("edit-row");
      } else {
        // Append a new row
        $("#activityTable tbody").append(
          `<tr><td>${col1}</td><td>${col2}</td><td>${col3}</td><td>${col4}</td>` +
            `<td style="position: relative;"><span class="fa fa-edit edit-row"></span>` +
            `<span class="fa-duotone fa-solid fa-trash remove-row" style="cursor:pointer; color: red;"></span></td></tr>`
        );
      }

      // Hide the input modal and clear fields
      $("#inputModal").css("display", "none");
      $("#input1").val("");
      $("#input2").val("");
      $("#input3").val("");
      $("#input4").val("");
    });

  // Event handler to remove a row when the remove icon is clicked
  $("#activityTable").on("click", ".remove-row", function () {
    let rowToRemove = $(this).closest("tr");

    swal({
      title: mxResources.get("areyousure"),
      icon: "warning",
      buttons: {
        cancel: mxResources.get("no"),
        confirm: {
          text: mxResources.get("yes"),
          value: true,
        },
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        rowToRemove.remove(); // Remove the closest row after confirmation
      }
    });
  });

  // Event handler to edit a row when the edit icon is clicked
  $("#activityTable").on("click", ".edit-row", function () {
    const row = $(this).closest("tr");
    const col1 = row.find("td").eq(0).text(); // Start Date
    const col2 = row.find("td").eq(1).text(); // Start Time
    const col3 = row.find("td").eq(2).text(); // Finish Date
    const col4 = row.find("td").eq(3).text(); // Finish Time

    // Populate the input fields with current row data
    $("#input1").val(col1); // Start Date
    $("#input2").val(col2); // Start Time
    $("#input3").val(col3); // Finish Date
    $("#input4").val(col4); // Finish Time

    // Re-initialize the date picker for the input fields after setting the values
    jalaliDatepicker.startWatch({
      minDate: "attr",
      maxDate: "attr",
    });

    // Show the input modal
    $("#inputModal").css("display", "block");

    // Set a data attribute to the row for editing
    $("#saveRow").data("edit-row", row);
  });

  // Event handler to cancel and close the main modal
  $("#btn_exit_Schedule")
    .off("click")
    .on("click", function () {
      $("#Activity_Schedule").css("display", "none");
      $("#inputModal").css("display", "none");
    });

  // Event handler to cancel and close the input modal
  $("#cancelModal")
    .off("click")
    .on("click", function () {
      $("#inputModal").css("display", "none");
    });
}

function loadActivityData(graph) {
  let selectedId = +graph.getSelectionCell().id; // Ensure the ID is a number
  // Find the existing schedule object based on the selected ID
  let existingSchedule = _ScheduleOBJ.find((x) => x.ID === selectedId);

  // Check if the existing schedule exists and has AccessTiming data
  if (
    existingSchedule &&
    existingSchedule.AccessTiming &&
    existingSchedule.AccessTiming.length > 0
  ) {
    // Clear any existing rows in the table
    $("#activityTable tbody").empty();

    // Populate the table with existing data
    existingSchedule.AccessTiming.forEach((item) => {
      let startHourFormatted = convertMinutesToTime(item.startHour);
      let finishHourFormatted = convertMinutesToTime(item.finishHour);

      $("#activityTable tbody").append(
        `<tr>
          <td>${item.startDate}</td>
          <td>${startHourFormatted}</td>
          <td>${item.finishDate}</td>
          <td>${finishHourFormatted}</td>
          <td style="position: relative;">
            <span class="fa fa-edit edit-row"></span>
            <span class="fa-duotone fa-solid fa-trash remove-row" style="cursor:pointer; color: red;"></span>
          </td>
        </tr>`
      );
    });
  } else {
    // Clear any existing rows in the table
    $("#activityTable tbody").empty();
  }
}

// Helper function to convert minutes back to time
function convertMinutesToTime(minutes) {
  let hours = Math.floor(minutes / 60);
  let mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`; // Format as HH:MM
}

function Schedule_btn(graph) {
  $(`#btn_primary_Schedule`).on("click", () => {
    // Get the current ID from the selected cell
    let selectedId = +graph.getSelectionCell().id;

    // Create the object to hold the ID and AccessTiming
    let Obj = {
      ID: selectedId,
      AccessTiming: [],
    };

    // Iterate over each row in the table body
    $("#activityTable tbody tr").each(function () {
      let startHour = $(this).find("td").eq(1).text(); // Start time
      let finishHour = $(this).find("td").eq(3).text(); // Finish time

      // Convert time to minutes
      let startTimeInMinutes = convertTimeToMinutes(startHour);
      let finishTimeInMinutes = convertTimeToMinutes(finishHour);

      let rowData = {
        startDate: $(this).find("td").eq(0).text(), // First column
        startHour: startTimeInMinutes, // Store as minutes
        finishDate: $(this).find("td").eq(2).text(), // Third column
        finishHour: finishTimeInMinutes, // Store as minutes
      };

      Obj.AccessTiming.push(rowData); // Push rowData directly to AccessTiming
    });

    // Update or add the schedule in the main object
    let existingIndex = _ScheduleOBJ.findIndex((x) => x.ID === selectedId);
    if (existingIndex > -1) {
      _ScheduleOBJ[existingIndex] = Obj;
    } else {
      _ScheduleOBJ.push(Obj);
    }

    // Close the modal after saving
    $("#Activity_Schedule").css("display", "none");
  });
}

// Helper function to convert time to minutes
function convertTimeToMinutes(time) {
  let [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes; // Convert to total minutes
}
