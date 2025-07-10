var ColorArchive = "";
var StartdateArchive = "";
var EnddateArchive = "";
  let lastInstance = 0;
function Filter(id, activeBtnIds, _objKey) {
  var startDate = "1300/01/01";
  var endDate;
  var color;

  if (id == "alertDateFilter") {
    if ($(`#alertDate`).length) {
      if ($(this).attr("instanceId") !== lastInstance) {
        $("#alertStartDate, #alertEndDate").val("").text("");
        $("#alertColorFilter").val("");
      }
      $(`#alertDate`).show();
    } else {
      let modal = `<div class="modal" id="alertDate" tabindex="-1" role="dialog" style="z-index: 10000;" >
            <div class="modal-dialog modal-dialog-scrollable" role="document" style="margin-top: 10%;">
              <div class="modal-content" style="width: 700px;">

                <div class="Incident-box-header with-border">
                  <h3 class="box-title" style="color: white;margin:10px">
                    ${$$Lang == "Fa" ? "افزودن فیلتر" : "Add Filter"}
                  </h3>
                </div>

                <div class="modal-body">
                  <form class="form-horizontal" id="Form_alertDate">
                    <div class="box-body">
                      <div class="row form-group-box" style="border: 0; margin-bottom: 0 !important;">
                        <div class="col-md-5" id="form-group-body-text-input-left">
                          <label for="alertStartDate" class="control-label" style="margin-bottom: 5px;color: #6a7a8c;font-family: 'IRANSansWeb' !important;">
                            Start Date
                          </label>
                          <div class="input-group" style="margin-bottom: 15px;">
                            <div class="input-group-addon">
                              <i class="glyphicon glyphicon-edit"></i>
                            </div>
                            <input 
                            type="text" 
                            class="form-control form-input" 
                            id="alertStartDate" 
                            data-mdpersiandatetimepickershowing="true" 
                            title="" 
                            data-original-title="" 
                            data-mdpersiandatetimepicker="" 
                            data-mddatetimepicker="true" 
                            data-targetselector="#alertStartDate" 
                            data-trigger="click" 
                            data-placement="auto" 
                            data-englishnumber="true" 
                            dir="ltr" 
                            data-enabletimepicker="true" 
                            data-inputmask='"mask": "x/m/d"' 
                            style="text-align: left;" 
                            aria-describedby="popover877868"
                            />
                          </div>
                          <label for="alertColorFilter" class="control-label" style="margin-bottom: 5px;color: #6a7a8c;font-family: 'IRANSansWeb' !important;">
                            Alert Color
                          </label>
                          <div class="input-group" style="margin-bottom: 15px;">
                            <div class="input-group-addon">
                              <i class="glyphicon glyphicon-edit"></i>
                            </div>
                            <select id="alertColorFilter" class="select2" style="width: 180px;border: 1px solid #d2d6de;height: 33px;border-radius: 0 5px 5px 0;text-align: right;background-color: white">
                              <option value="" selected></option>
                              <option value="YellowAlert">Yellow</option>
                              <option value="OrangeAlert">Orange</option>
                              <option value="RedAlert">Red</option>
                              <option value="BlackAlert">Black</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-5" id="form-group-body-text-input-right">
                          <label for="alertEndDate" class="control-label" style="margin-bottom: 5px;color: #6a7a8c;font-family: 'IRANSansWeb' !important;">
                            End Date
                          </label>
                          <div class="input-group" style="margin-bottom: 15px;">
                            <div class="input-group-addon">
                              <i class="glyphicon glyphicon-edit"></i>
                            </div>
                            <input 
                              type="text" 
                              class="form-control form-input" 
                              id="alertEndDate" 
                              data-mdpersiandatetimepickershowing="true" 
                              title="" 
                              data-original-title="" 
                              data-mdpersiandatetimepicker="" 
                              data-mddatetimepicker="true" 
                              data-targetselector="#alertEndDate" 
                              data-trigger="click" 
                              data-placement="auto" 
                              data-englishnumber="true" 
                              dir="ltr" 
                              data-enabletimepicker="true" 
                              data-inputmask='"mask": "x/m/d"' 
                              style="text-align: left;" 
                              aria-describedby="popover877868"
                            />
                          </div>
                        </div>
                      </div>

                      <span id="Error_alertDate" class="${
                        $$Lang == "Fa" ? "pull-right" : "pull-left"
                      } message-form-error"></span>
                    </div>
                  </form>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn btn-form-submit" id="submit_alertDate">
                    ${$$Lang == "Fa" ? "ثبت" : "Submit"}
                  </button>
                  <button type="button" class="btn btn-default btn-form-cancel" id="cancel_alertDate" data-dismiss="modal">
                    ${$$Lang == "Fa" ? "بستن" : "Close"}
                  </button>
                </div>

              </div>
            </div>
          </div>`;

      $("body").append(modal);
      EnableMdDateTimePickers();
      $("[data-inputmask]").inputmask();
      $(`#alertDate`).show();
      lastInstance = _objKey;
    }

    $(`#submit_alertDate`)
      .off("click")
      .on("click", function () {
        $(`#searchBtn`).val("");
        startDate = $(`#alertStartDate`).val();
        endDate = $(`#alertEndDate`).val();
        color = $(`#alertColorFilter`).val();
        ColorArchive = color.split("Alert")[0];
        StartdateArchive = startDate;
        EnddateArchive = endDate;
        if (startDate > endDate && endDate !== "") {
          $(`#Error_alertDate`).text("Input Date Is Invalid.");
          return;
        } else {
          $(`#Error_alertDate`).text("");
        }

        $loading.show();
        $.ajax({
          type: "POST",
          url: "../../App_Sys/Services/CustomActivity.asmx/GetFilteredAlerts",
          data: JSON.stringify({
            ids: activeBtnIds.join(","),
            startDate: startDate,
            endDate: endDate,
            instanceId: _objKey.toString(),
            color: color,
          }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response) {
            let alerts = JSON.parse(response.d);
            $("#MessageTable").remove();
            AlertTbl(alerts);
            $("#alertDate").hide();
            $loading.hide();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error("Ajax Error:", jqXHR.responseText);
            alert("Error:\n" + jqXHR.responseText);
          },
        });
      });

    $(`#cancel_alertDate`)
      .off("click")
      .on("click", function () {
        $(`#alertDate`).hide();
        $(`#alertDate`).remove();
      });
  } else {
    $loading.show();
    console.log(ColorArchive);
    console.log(StartdateArchive);
    console.log(EnddateArchive);
    $.ajax({
      type: "POST",
      url: "../../App_Sys/Services/CustomActivity.asmx/GetFilteredAlerts",
      data: JSON.stringify({
        ids: activeBtnIds.join(","),
        startDate: activeBtnIds.includes("alertDateFilter")
          ? StartdateArchive
          : "",
        endDate: activeBtnIds.includes("alertDateFilter") ? EnddateArchive : "",
        instanceId: _objKey.toString(),
        color: activeBtnIds.includes("alertDateFilter") ? ColorArchive : "",
      }),
      async: true,
      contentType: "application/json; charset=utf-8",
      success: function (response) {
        let alerts = JSON.parse(response.d);
        $(`#MessageTable`).remove();
        AlertTbl(alerts);
        $loading.hide();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Error => " + JSON.stringify(jqXHR));
      },
    });
  }
}

function FilterOptBtn(_objKey) {
  const Modal = `
    <div class="modal" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel">
      <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="Incident-box-header with-border">
            <h3 class="Incident-box-title">View Incidents</h3>
            <div class="Incident-box-tools pull-right">
              <button type="button" id="closeBtnModal2" onclick="$('#alertModal').remove()"><i class="fa fa-times"></i></button>
            </div>
          </div>
          <div class="modal-header col-md-12" style="display:flex;align-items:flex-start;margin-top:10px">
            <div>
              <h5 class="modal-title" id="alertModalLabel" style="word-wrap:anywhere">Selected Alerts Into Incident: ${_objKey}</h5>
            </div>
          </div>
          <div class="rightDiv">

            <button type="button" id="alertDateFilter" instanceId="${_objKey}" 
            class="btn btn-secondary input-sm custom-input AlertLimited" 
            data-label="Filter" style="margin-right:5px;">
            <i class="fa fa-filter" style="font-size:medium"></i> Filter 
            </button>

             <button type="button" id="ViewAll" 
             class="btn btn-secondary input-sm custom-input AlertLimited" 
             data-label="View All">
             <i class="fa fa-eye-slash" style="font-size:medium;"></i> View All
             </button>

              <button type="button" id="ThisServer" 
              class="btn btn-primary input-sm custom-input AlertLimited" 
              data-label="This Server">
              <i class="fa fa-eye-slash" style="font-size:medium;"></i> This Server
              </button>

         
               <button type="button" id="ThisCustomer" 
               class="btn btn-secondary input-sm custom-input AlertLimited" 
               data-label="This Customer">
               <i class="fa fa-eye-slash" style="font-size:medium;"></i> This Customer
               </button>

               <button type="button" id="ThisWeek" 
               class="btn btn-primary input-sm custom-input AlertLimited" 
               data-label="This Week">
               <i class="fa fa-eye-slash" style="font-size:medium;"></i> This Week
               </button>


            <input type="text" id="searchBtn" onkeyup="SearchFNC('searchBtn', MessageTable)" placeholder="Search ..." class="form-control input-sm custom-input">
            <label style="right:95px">Show</label>
            <select id="rowsPerPageSelect" class="form-control input-sm custom-input">
             <option value="10">10 </option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <label style="right:15px">Records</label>

          </div>
          <div class="modal-body" style="padding-bottom: 0px;padding-top: 0px;">
            <form>
              <fieldset id="alertTBL"></fieldset>
            </form>
          </div>
          <div class="modal-footer">
            <div id="loadingIcon">Loading... <img src="App_Res/Images/Incident/loading.gif" alt="Loading"></div>
            <button type="button" class="btn btn-sm btnClass" id="alertAddBtn">Add</button>
            <button type="button" class="btn btn-sm btnClass" onclick="$('#alertModal').remove()">Close</button>
          </div>
        </div>
      </div>
    </div>`;

  $("body").append(Modal);

  $(".AlertLimited").click(function () {
    const $btn = $(this);
    const label = $btn.data("label");
    const isViewAll = label === "View All";

    if (isViewAll) {
      // ❗ غیرفعال‌سازی همه دکمه‌ها به جز View All
      $(".AlertLimited").each(function () {
        const $otherBtn = $(this);
        const otherLabel = $otherBtn.data("label");

        if (!$otherBtn.is($btn)) {
          $otherBtn.removeClass("btn-primary").addClass("btn-secondary");
          $otherBtn.html(
            `<i class="fa fa-eye-slash" style="font-size: medium"></i> ${otherLabel}`
          );
        }
      });

      // فعال‌سازی View All
      $btn.removeClass("btn-secondary").addClass("btn-primary");
      $btn.html(`<i class="fa fa-eye" style="font-size: medium"></i> ${label}`);

      // پاک‌سازی فیلتر و سرچ
      if ($("#alertDate").length) {
        $("#alertStartDate, #alertEndDate").val("").text("");
      }
      $("#searchBtn").val("");

      // ✅ فقط اجرای aData برای View All
      const queryCode = 6220009;
      $loading.show();

      const AlertLimitedPromise = new Promise((resolve, reject) => {
        _data = new aData(queryCode, null, _objKey, "", true);
        let timer = setInterval(() => {
          let value = _data.getList();
          if (value && value.length > 0) {
            clearInterval(timer);
            resolve(value);
          }
        }, 1);
      });

      AlertLimitedPromise.then((val) => {
        $loading.hide();
        $("#MessageTable").remove();
        AlertTbl(val);
      });

      return; // پایان حالت View All
    }

    // Toggle دکمه‌های غیر View All
    const isActive = $btn.hasClass("btn-primary");

    if (isActive) {
      $btn.removeClass("btn-primary").addClass("btn-secondary");
      $btn.html(
        `<i class="fa fa-eye-slash" style="font-size: medium"></i> ${label}`
      );
    } else {
      $btn.removeClass("btn-secondary").addClass("btn-primary");
      $btn.html(`<i class="fa fa-eye" style="font-size: medium"></i> ${label}`);
    }

    // ❗ غیرفعال کردن View All
    const $viewAllBtn = $(".AlertLimited[data-label='View All']");
    $viewAllBtn.removeClass("btn-primary").addClass("btn-secondary");
    $viewAllBtn.html(
      `<i class="fa fa-eye-slash" style="font-size: medium"></i> View All`
    );

    // ✅ اجرای Filter با دکمه‌های فعال غیر از View All
    const activeBtnIds = $(".AlertLimited.btn-primary")
      .not("[data-label='View All']")
      .map(function () {
        return $(this).attr("id");
      })
      .get();

    if (activeBtnIds.length) Filter($btn.attr("id"), activeBtnIds, _objKey);
  });
}

function toggleDiv(_alertID) {
  $(`#${_alertID}`)
    .parents("tr") // go up to the parent row
    .next() // select the next row
    .toggleClass("hidden"); // toggle the visibility class

  $(`#${_alertID}`).toggleClass("glyphicon-minus glyphicon-plus");

  if ($(`#${_alertID}`).hasClass("glyphicon-minus")) {
    AlertDetails(_alertID);
  } else {
    $(`#` + _alertID.replaceAll("Btn", "s")).empty();
  }
}
