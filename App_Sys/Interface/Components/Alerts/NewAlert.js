function newAlertAction(parentID, _objKey) {
  $("#newAlertBtn").on("click", function () {
    let modal = `<div class="modal" id="NewAlert" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel">
            <div class="modal-dialog modal-dialog-scrollable" role="document" style="height: 290px;min-width: 0 !important;width: 500px !important;margin-top: 190px;">
              <div class="modal-content">

                <div class="Incident-box-header with-border">
                  <h3 class="box-title" style="color: white;margin:10px">
                    ${$$Lang == "Fa" ? "افزودن Alert" : "Add New Alert"}
                  </h3>
                </div>

                <div class="modal-body" style="overflow: hidden;">
                  <form class="form-horizontal" id="Form_NewAlert" style="height: 700px;">
                    <div class="box-body">
                      <div class="row form-group-box" style="border: 0; margin-bottom: 0 !important;">
                        <div class="col-md-12" id="form-group-body-text-input-left">
                        <label for="ESID" class="control-label" style="margin-bottom: 5px;color: #6a7a8c;font-family: 'IRANSansWeb' !important;">
                          Document ID
                        </label>
                        <div class="input-group" style="margin-bottom: 15px;">
                          <div class="input-group-addon">
                              <i class="glyphicon glyphicon-edit"></i>
                            </div>
                            <input type="text" class="form-control form-input" id="ESID" dir="ltr">
                          </div>
                        </div>
                      </div>

                      <span id="Error_NewAlert" class="${$$Lang == "Fa" ? "pull-right" : "pull-left"
      } message-form-error"></span>
                    </div>
                  </form>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn btn-form-submit" id="submit_NewAlert">
                    ${$$Lang == "Fa" ? "ثبت" : "Submit"}
                  </button>
                  <button type="button" class="btn btn-default btn-form-cancel" id="cancel_NewAlert" data-dismiss="modal">
                    ${$$Lang == "Fa" ? "بستن" : "Close"}
                  </button>
                </div>

              </div>
            </div>
          </div>`;

    $("body").append(modal);

    $(`#NewAlert`).show();

    // Fetch form items

    // _data = new aData(6220005, null, null, "");
    // let data = _data.getList();
    // // Sort by RowIndex first (if you want, otherwise just by RowIndex)
    // data.sort((a, b) => a.RowIndex - b.RowIndex);

    // data.forEach((item) => {
    //   const label = $$Lang == "Fa" ? item.Label : item.Name;
    //   const dir = $$Lang == "Fa" ? "rtl" : "ltr";
    //   const container =
    //     item.ColumnIndex == 0
    //       ? $("#form-group-body-text-input-left")
    //       : $("#form-group-body-text-input-right");

    //   let inputHTML = `
    //       <label for="${item.Name}" class="control-label" style="margin-bottom: 5px;color: #6a7a8c;font-family: 'IRANSansWeb' !important;">
    //         ${label}
    //       </label>
    //       <div class="input-group" style="margin-bottom: 15px;">
    //         <div class="input-group-addon">
    //           <i class="glyphicon glyphicon-edit"></i>
    //         </div>`;
    //   if (item.Name === "SupportGroup") {
    //     inputHTML += `<select id="${item.Name}" class="select2 form-input form-control ">
    //                       <option class="bs-title-option" value="">Optional</option>
    //                       <option value="Forensic">Forensic (Alert Analysis)</option>
    //                       <option value="ServiceDesk">ServiceDesk (Remote Request)</option>
    //                     </select>`;
    //   } else if (item.Name === "SeverityLevel") {
    //     inputHTML += `<select id="${item.Name}" class="select2 form-input form-control ">
    //               <option value="YellowAlert" Selected>Yellow Alert</option>
    //               <option value="OrangeAlert" Selected>Orange Alert</option>
    //               <option value="RedAlert" Selected>Red Alert</option>
    //               <option value="BlackAlert" Selected>Black Alert</option>
    //           </select>`;
    //   } else if (item.Name === "EventDate") {
    //     inputHTML += `
    //       <input
    //         type="text"
    //         class="form-control form-input"
    //         id="${item.Name}"
    //         data-mdpersiandatetimepickershowing="true"
    //         title=""
    //         data-original-title=""
    //         data-mdpersiandatetimepicker=""
    //         data-mddatetimepicker="true"
    //         data-targetselector="#${item.Name}"
    //         data-trigger="click"
    //         data-placement="top"
    //         data-englishnumber="true"
    //         dir="ltr"
    //         data-enabletimepicker="true"
    //         data-inputmask='"mask": "x/m/d h:s"'
    //         style="text-align: left;"
    //         aria-describedby="popover877868"
    //       />`;
    //   } else if (item.Name === "Description") {
    //     inputHTML += `
    //         <textarea style="width: 751px;height: 84px;"
    //           class="form-control form-input"
    //           id="${item.Name}"
    //           dir="${dir}"
    //           ${item.IsReadOnly == "True" ? "readonly" : ""}
    //         ></textarea>`;
    //   } else if (item.Name === "PadvishServerID") {
    //     inputHTML += `<select id="${item.Name}" class="select2 form-input form-control ">`;
    //     _data = new aData(6220006, null, null, "");
    //     let data = _data.getList();
    //     data.forEach((server) => {
    //       inputHTML += `<option value="${server.PadvishServerID}" Selected>${server.Label}</option>`;
    //     });

    //     inputHTML += `</select>`;
    //   } else if (item.Name === "AlertQueryID") {
    //     inputHTML += `<select id="${item.Name}" class="select2 form-input form-control ">`;
    //     _data = new aData(6220007, null, null, "");
    //     let data = _data.getList();
    //     data.forEach((query) => {
    //       inputHTML += `<option value="${query.AlertQueryID}" Selected>${query.Label}</option>`;
    //     });
    //     inputHTML += `</select>`;
    //   } else {
    //     inputHTML += `
    //         <input
    //           type="text"
    //           class="form-control form-input"
    //           id="${item.Name}"
    //           dir="${dir}"
    //           ${item.IsReadOnly == "True" ? "readonly" : ""}
    //         />`;
    //   }

    //   inputHTML += `</div>`;
    //   container.append(inputHTML);
    // });

    // // Initialize date pickers and input masks after inputs added
    // $(".select2").select2();
    // EnableMdDateTimePickers();
    // $("[data-inputmask]").inputmask();
    // // Handle cancel button
    // // $(document)
    // //   .off("click", `#cancel_${modalID}`)

    $(`#cancel_NewAlert`).on("click", function () {
      $(`#NewAlert`).hide();
      $(`#NewAlert`).remove();
    });

    // Handle Submit button click - collect all inputs to JSON
    // $(document)
    //   .off("click", `#submit_${modalID}`)
    $(`#submit_NewAlert`).on("click", function () {
      const formID = `#Form_NewAlert`;
      let formData = {};

      let isValid = true;
      let missingFields = [];

      $(`${formID} .form-input`).each(function () {
        const input = $(this);
        const id = input.attr("id");
        const val = input.val();

        if (
          input.is("input[type='text']") ||
          input.is("textarea") ||
          input.is("select")
        ) {
          // Check required fields
          if (
            (id === "MatchHash" || id === "EventDate") &&
            (!val || val.trim() === "")
          ) {
            isValid = false;

            $(`#` + id).css("border-color", "red");
            missingFields.push(id);
            return; // Skip assigning this field
          }

          formData[id] = val;
        }
      });

      // Show alert if required fields are missing
      if (!isValid) {
        $(`#Error_NewAlert`).text(
          "Please fill in the following required fields:\n" +
          missingFields.join(", ")
        );
        return; // Stop further processing or AJAX submit
      }

      formData["IncidentID"] = _objKey;
      console.log(formData);

      // You can do AJAX submit here or any other processing
      $loading.show();
      $.ajax({
        url: "../../App_Sys/Services/CustomActivity.asmx/CreateNewAlert",
        type: "POST",
        contentType: "application/json",
        async: true,
        data: JSON.stringify({ alertObj: JSON.stringify(formData) }),
        success: function (response) {
          var result = response.d || "";
          if (result.toLowerCase().indexOf("duplicate key") !== -1) {
            alert("Error : Duplicated MatchHash");
            return;
          }
          $(`#NewAlert`).hide();
          $(`#NewAlert`).remove();

          loadAlert(parentID, _objKey);
        },
        error: function (xhr, status, error) {
          console.error("Error Fetching Form Items:", error);
        },
      });
    });
  });
}