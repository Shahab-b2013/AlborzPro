function customReportView() {
  const modal = $(`
<div class="modal modal-primary in" id="exportModal" style="display: block; padding-right: 17px;">
  <div class="modal-dialog" style="width:700px !important">
    <div style="width: 700px;" class="modal-content">
      <div class="box box-solid" id="pageBoxExportModal">
        <div style="background: var(--A1);" class="box-header with-border">
          <h3 style="color: white;" class="box-title">فایل خروجی کارسنجی</h3>
        </div>
        <form class="form-horizontal" id="exportForm">
          <div class="box-body" id="boxBodyExportModal" style="margin-bottom: -50px;">
            <!-- First row: شماره پرسنلی and نام فایل with col-md-1 gap -->
            <div class="row form-group-box">
              <div class="col-md-5" id="form-group-body-text-input">
                <div class="form-group" id="form-group-text-input">
                  <label for="reportTitle">عنوان فایل</label>
                  <div class="input-group">
                    <div class="input-group-addon">
                      <i class="glyphicon glyphicon-check"></i>
                    </div>
                    <input type="text" id="reportTitle" class="form-control form-input" />
                  </div>
                </div>
              </div>
              <div class="col-md-1"></div> <!-- Gap between the inputs -->
              <div class="col-md-5" id="form-group-body-emp-id">
                <div class="form-group" id="form-group-emp-id">
                  <label for="employee-id">شماره پرسنلی</label>
                  <div class="input-group">
                    <div class="input-group-addon">
                      <i class="glyphicon glyphicon-user"></i>
                    </div>
                    <input type="text" id="employee-id" class="form-control form-input" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Second row: Month dropdown alone -->
            <div class="row form-group-box">
              <div class="col-md-5" id="form-group-body-month">
                <div class="form-group" id="form-group-month">
                  <label for="jalali-months">ماه</label>
                  <div class="input-group">
                    <div class="input-group-addon">
                      <i class="glyphicon glyphicon-calendar"></i>
                    </div>
                    <select id="jalali-months" class="form-control form-input" style="text-align: left; direction: ltr;">
                      <option value="1">فروردین</option>
                      <option value="2">اردیبهشت</option>
                      <option value="3">خرداد</option>
                      <option value="4">تیر</option>
                      <option value="5">مرداد</option>
                      <option value="6">شهریور</option>
                      <option value="7">مهر</option>
                      <option value="8">آبان</option>
                      <option value="9">آذر</option>
                      <option value="10">دی</option>
                      <option value="11">بهمن</option>
                      <option value="12">اسفند</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Third row: Start and End days next to each other with col-md-1 gap -->
            <div class="row form-group-box">
              <div class="col-md-5" id="form-group-body-start-date">
                <div class="form-group" id="form-group-start">
                  <label for="start-day">روز شروع</label>
                  <div class="input-group">
                    <div class="input-group-addon">
                      <i class="glyphicon glyphicon-calendar"></i>
                    </div>
                    <select id="start-day" class="form-control form-input" style="text-align: left; direction: ltr;"></select>
                  </div>
                </div>
              </div>
              <div class="col-md-1"></div> <!-- Gap between the inputs -->
              <div class="col-md-5" id="form-group-body-end-date">
                <div class="form-group" id="form-group-end">
                  <label for="end-day">روز پایان</label>
                  <div class="input-group">
                    <div class="input-group-addon">
                      <i class="glyphicon glyphicon-calendar"></i>
                    </div>
                    <select id="end-day" class="form-control form-input" style="text-align: left; direction: ltr;"></select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h5 class="message-form-success" id="smessageExport"></h5>
          <h5 class="message-form-error" id="emessageExport"></h5>
        </form>
        <div class="box-footer" id="boxFooterExportModal">
          <button type="submit" id="Export_submitBtn" class="btn btn-form-submit">تایید</button>
          <button type="button" id="cancelBtnExport" style="width: 100px;" class="btn btn-default btn-form-cancel">لغو</button>
        </div>
      </div>
    </div>
  </div>
</div>

`);

  const getDaysInMonth = (month, year) => {
    // Jalali month lengths
    const monthLengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    // Adjust for leap years
    if (month === 12 && isLeapJalaaliYear(year)) {
      return 30;
    }
    return monthLengths[month - 1];
  };

  const populateDaysDropdown = (dropdown, days) => {
    dropdown.empty();
    for (let i = 1; i <= days; i++) {
      dropdown.append(`<option value="${i}">${i}</option>`);
    }
  };

  $("body").append(modal);

  var today = new Date();
  var jalaliToday = toJalaali(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );
  $("#reportTitle").val("کارکرد ماهانه");
  $("#jalali-months").val(10);

  const startDayDropdown = $("#start-day");
  const endDayDropdown = $("#end-day");
  const updateDays = () => {
    const selectedMonth = parseInt($("#jalali-months").val());
    const daysInMonth = getDaysInMonth(selectedMonth, jalaliToday.jy);
    populateDaysDropdown(startDayDropdown, daysInMonth);
    populateDaysDropdown(endDayDropdown, daysInMonth);
    $("#end-day").val("30").trigger("change");
  };
  $(document).ready(() => {
    $("#jalali-months").select2();
    startDayDropdown.select2();
    endDayDropdown.select2();
    updateDays(); // Populate days based on initial month
  });

  $("#jalali-months").on("change", updateDays);
  //Set end day default value to 25

  // Show the modal
  modal.show();

  // Close modal on close button
  modal.find(".close-btn").on("click", () => {
    modal.fadeOut(() => modal.remove());
  });

  // Handle Cancel button click
  modal.find("#cancelBtnExport").on("click", (e) => {
    e.preventDefault();
    modal.remove();
  });

  // Handle form submission
  modal.find("#Export_submitBtn").on("click", (e) => {
    e.preventDefault();

    const loadingSpinner = $(
      `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`
    );
    $("body").append(loadingSpinner);

    // Position the spinner at the center of the page
    loadingSpinner.css({
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 9999,
    });

    const employeeID =
      modal.find("#employee-id").val() == undefined ||
      modal.find("#employee-id").val() == ""
        ? 0
        : modal.find("#employee-id").val();
    console.log(employeeID);
    const year = jalaliToday.jy;
    const reportID = 1;
    const StartMonth = modal.find("#jalali-months").val();
    const EndMonth = StartMonth; // Assuming the same month for simplicity
    const StartDay = modal.find("#start-day").val();
    const EndDay = modal.find("#end-day").val();
    let title =
      $("#reportTitle").val() +
      " ( " +
      $("#jalali-months").find("option:selected").text() +
      " " +
      year +
      " )";

    // Combine with current jalali year
    const startDate = `${year}-${StartMonth.padStart(
      2,
      "0"
    )}-${StartDay.padStart(2, "0")}`;
    const endDate = `${year}-${EndMonth.padStart(2, "0")}-${EndDay.padStart(
      2,
      "0"
    )}`;

    const reportIntervalParams = JSON.stringify({
      EmployeeID: employeeID,
      StartDate: startDate,
      EndDate: endDate,
      ReportID: reportID,
      Title: title,
    });

    $.ajax({
      type: "POST",
      url: "../../App_Sys/Services/CustomActivity.asmx/GenerateCostumReport",
      data: JSON.stringify({ reportInterval: reportIntervalParams }), // Wrap the object in another JSON object
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        swal({
          title: "گزارش مورد نظر با موفقیت ساخته شد.",
          icon: "success",
          buttons: { confirm: "تایید" },
        });
        jQuery.redirect(
          "App_Sys/Utilities/File.Downloader.aspx",
          { id: 5051402, code: data.d, requestToken: genResponseToken() },
          "POST",
          "_blank"
        );
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX error:", textStatus, errorThrown);
        console.log(jqXHR);
        swal({
          title: "خطا در ساخت گزارش",
          icon: "error",
          buttons: { confirm: "تایید" },
        });
      },
      complete: function () {
        // Remove loading spinner
        loadingSpinner.remove();
      },
    });

    // Close the modal
    modal.remove();
  });
}
