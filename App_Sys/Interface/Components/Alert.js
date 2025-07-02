function Alerts(tmpAlertList, parentID, _objKey) {
  $(`.alertListDiv`).remove();
  let data = tmpAlertList;
  let strMalware = "";
  let indexClientName = 0;

  if (tmpAlertList[0].hasOwnProperty("AlertID"))
    indexClientName = tmpAlertList.length;

  let strClientName = "";

  tmpAlertList.forEach((item, index) => {
    if (index === tmpAlertList.length - 1) {
      if (item.ClientName) {
        if (item.Malware != "-")
          strMalware += `<li class=""  style="margin-left: 8px;">${item.Malware}</li>`;

        strClientName += item.ClientName;
      }
    } else {
      if (item.ClientName) {
        if (item.Malware != "-")
          strMalware += `<li class="" style="margin-left: 8px;">${item.Malware},</li>`;

        strClientName += item.ClientName;
      }
    }
  });

  let tmpColorArray = [];
  tmpAlertList.forEach((element) => {
    if (element.Color != undefined) {
      if (element.Color != "")
        tmpColorArray.push(element.Color.replaceAll("Alert", ""));
    }
  });
  let tmpColor = "";

  const tmpHighestColor = getHighestSeverityColor(tmpColorArray);

  if (tmpHighestColor != undefined) {
    tmpColor = tmpHighestColor;
    data.Color = tmpHighestColor;
  } else {
    tmpColor = data.Color;
  }

  let strAlertTh = "";
  let strAlertTd = "";
  tmpColor === "Yellow"
    ? "text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;"
    : "";

  updateIncidentColor(_objKey, tmpColor);

  for (const key in tmpAlertList[0]) {
    if (key != "ObjKey" && key != "requestDate" && key != "requestToken") {
      if (key == "Color") {
        strAlertTh += `<th style="width: 150px;"><input id="Allalert" type="checkbox" style="display: flex;text-align: left;margin-left: 20px;cursor:pointer" ></th>`;
      } else {
        strAlertTh += `<th>${key}</th>`;
      }
    }
  }

  //Alert List
  tmpAlertList.map((item, index) => {
    let indexId = item["AlertID"];
    for (const key in item) {
      if (key !== "ObjKey" && key !== "requestDate" && key !== "requestToken") {
        if (key == "Color") {
          let tmpPenColor =
            item[key].replaceAll("Alert", "") == "Yellow" ? "Black" : "White";

          let AlertColor = "";
          if (item[key].replaceAll("Alert", "") == "Yellow") {
            AlertColor = "AttentionFlag19";
          } else if (item[key].replaceAll("Alert", "") == "Orange") {
            AlertColor = "AttentionFlag20";
          } else if (item[key].replaceAll("Alert", "") == "Red") {
            AlertColor = "AttentionFlag21";
          } else if (item[key].replaceAll("Alert", "") == "Black") {
            AlertColor = "AttentionFlag22";
          }

          strAlertTd += `<tr  class="trHover">
                <td style="color:${tmpPenColor}"> 
                <div class="alertItemDiv">
                <input type="checkbox" id="generalCheckbox_${indexId}" class="generalCheckbox"/>
                <i id="generalDetailBtn_${indexId}" class="expand-collapse-btn glyphicon glyphicon-plus details-control btn-grid" style="cursor: pointer;margin: 0px 20px !important" onclick="toggleDiv(id)"></i>
                <img src="App_Res/Images/Page/24/${AlertColor}.png"></div>
                </div>
                </td>`;
        } else {
          let tmpStr = item[key];
          if (typeof tmpStr === "string" && tmpStr.includes("/Date("))
            strAlertTd += `<td class="ellipsis">${hasDateInStr(tmpStr)}</td>`;
          else strAlertTd += `<td class="ellipsis">${tmpStr}</td>`;
        }
      }
    }
    strAlertTd += "</tr>";
    strAlertTd += `<tr class="hidden"><td colspan="8" id="generalDetails_${indexId}" class="AlertDetails"></td></tr>`;
  });

  let strAlertTbl = `<table id="alertTable" class="table-bordered gridList incidentTable"><tr>${strAlertTh}</tr>${strAlertTd}</table>`;

  let _alert = `
        <div class="alertListDiv">
            <div class="col-lg-12 col-md-12 col-sm-12" style="padding:0px !important">
                <ul class="list-group" style="margin:15px 0px 0px 0px">
                    ${strMalware}
                    <li class="" style="margin-left: 8px;margin-bottom: 8px;margin-top: 8px;"> on ${indexClientName} Clients: ${strClientName} </li>
                </ul> 
            </div>
            <div class="" id="tabItems">
                <ul class="list-group tableUl">    
                    <li>  <button type="button" id="newAlertBtn" class="btn btn-sm btnClass  ${
                      $HistoryIds[_objKey] != 6 ? "" : "hidden"
                    }" style="margin-left: 5px;" >New</button> 
                        <button type="button" id="AddToBtn" class="btn btn-sm btnClass  ${
                          $HistoryIds[_objKey] != 6 ? "" : "hidden"
                        }">Add</button> 
                        <button type="button" id="MoveToBtn" class="btn btn-sm btnClass ${
                          $HistoryIds[_objKey] != 6 ? "" : "hidden"
                        }">Move To</button> 
                        <button type="button" id="expandAllBtn" class="btn btn-sm btnClass">Expand All</button  > 
                        <input type="text" id="alertsInput" onkeyup="SearchFNC('alertsInput' , alertTable)" placeholder="Search ..." title="Search from Table" style="width: 150px;font-size: 13px;margin: 0 5px;float: right;height: 29px;" class="form-control input-sm custom-input"> 
                    </li>      

                    ${strAlertTbl}
                    </ul>  
                    </div> 
                  
        </div>`;

  $(`#` + parentID).append(_alert);

  $("#Allalert").on("change", function () {
    $(".generalCheckbox").prop("checked", this.checked);
  });

  $("#newAlertBtn").on("click", function () {
    let modal = `<div class="modal" id="NewAlert" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel">
            <div class="modal-dialog modal-dialog-scrollable" role="document">
              <div class="modal-content">

                <div class="Incident-box-header with-border">
                  <h3 class="box-title" style="color: white;margin:10px">
                    ${$$Lang == "Fa" ? "افزودن Alert" : "Add New Alert"}
                  </h3>
                </div>

                <div class="modal-body">
                  <form class="form-horizontal" id="Form_NewAlert" style="height: 700px;">
                    <div class="box-body">
                      <div class="row form-group-box" style="border: 0; margin-bottom: 0 !important;">
                        <div class="col-md-5" id="form-group-body-text-input-left"></div>
                        <div class="col-md-1"></div>
                        <div class="col-md-5" id="form-group-body-text-input-right"></div>
                      </div>

                      <span id="Error_NewAlert" class="${
                        $$Lang == "Fa" ? "pull-right" : "pull-left"
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

    _data = new aData(6220005, null, null, "");
    let data = _data.getList();
    // Sort by RowIndex first (if you want, otherwise just by RowIndex)
    data.sort((a, b) => a.RowIndex - b.RowIndex);

    data.forEach((item) => {
      const label = $$Lang == "Fa" ? item.Label : item.Name;
      const dir = $$Lang == "Fa" ? "rtl" : "ltr";
      const container =
        item.ColumnIndex == 0
          ? $("#form-group-body-text-input-left")
          : $("#form-group-body-text-input-right");

      let inputHTML = `
          <label for="${item.Name}" class="control-label" style="margin-bottom: 5px;color: #6a7a8c;font-family: 'IRANSansWeb' !important;">
            ${label}
          </label>
          <div class="input-group" style="margin-bottom: 15px;">
            <div class="input-group-addon">
              <i class="glyphicon glyphicon-edit"></i>
            </div>`;
      if (item.Name === "SupportGroup") {
        inputHTML += `<select id="${item.Name}" class="select2 form-input form-control ">
                          <option class="bs-title-option" value="">Optional</option>
                          <option value="Forensic">Forensic (Alert Analysis)</option>
                          <option value="ServiceDesk">ServiceDesk (Remote Request)</option>
                        </select>`;
      } else if (item.Name === "SeverityLevel") {
        inputHTML += `<select id="${item.Name}" class="select2 form-input form-control ">
                  <option value="YellowAlert" Selected>Yellow Alert</option>
                  <option value="OrangeAlert" Selected>Orange Alert</option>
                  <option value="RedAlert" Selected>Red Alert</option>
                  <option value="BlackAlert" Selected>Black Alert</option>
              </select>`;
      } else if (item.Name === "EventDate") {
        inputHTML += `
          <input 
            type="text" 
            class="form-control form-input" 
            id="${item.Name}" 
            data-mdpersiandatetimepickershowing="true" 
            title="" 
            data-original-title="" 
            data-mdpersiandatetimepicker="" 
            data-mddatetimepicker="true" 
            data-targetselector="#${item.Name}" 
            data-trigger="click" 
            data-placement="top" 
            data-englishnumber="true" 
            dir="ltr" 
            data-enabletimepicker="true" 
            data-inputmask='"mask": "x/m/d h:s"' 
            style="text-align: left;" 
            aria-describedby="popover877868"
          />`;
      } else if (item.Name === "Description") {
        inputHTML += `
            <textarea style="width: 751px;height: 84px;"
              class="form-control form-input"
              id="${item.Name}"
              dir="${dir}"
              ${item.IsReadOnly == "True" ? "readonly" : ""}
            ></textarea>`;
      } else if (item.Name === "PadvishServerID") {
        inputHTML += `<select id="${item.Name}" class="select2 form-input form-control ">`;
        _data = new aData(6220006, null, null, "");
        let data = _data.getList();
        data.forEach((server) => {
          inputHTML += `<option value="${server.PadvishServerID}" Selected>${server.Label}</option>`;
        });

        inputHTML += `</select>`;
      } else if (item.Name === "AlertQueryID") {
        inputHTML += `<select id="${item.Name}" class="select2 form-input form-control ">`;
        _data = new aData(6220007, null, null, "");
        let data = _data.getList();
        data.forEach((query) => {
          inputHTML += `<option value="${query.AlertQueryID}" Selected>${query.Label}</option>`;
        });
        inputHTML += `</select>`;
      } else {
        inputHTML += `
            <input
              type="text"
              class="form-control form-input"
              id="${item.Name}"
              dir="${dir}"
              ${item.IsReadOnly == "True" ? "readonly" : ""}
            />`;
      }

      inputHTML += `</div>`;
      container.append(inputHTML);
    });

    // Initialize date pickers and input masks after inputs added
    $(".select2").select2();
    EnableMdDateTimePickers();
    $("[data-inputmask]").inputmask();
    // Handle cancel button
    // $(document)
    //   .off("click", `#cancel_${modalID}`)

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

      // You can do AJAX submit here or any other processing
      $.ajax({
        url: "../../App_Sys/Services/CustomActivity.asmx/CreateNewAlert",
        type: "POST",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({ alertObj: JSON.stringify(formData) }),
        success: function (response) {
          var result = response.d || "";
          if (result.toLowerCase().indexOf("duplicate key") !== -1) {
            alert("Error : Duplicated MatchHash");
            return;
          }
          $(`#NewAlert`).hide();
          $(`#NewAlert`).remove();

          let _data = new aData(6220000, null, _objKey, "");
          _data = _data.getList();

          Alerts(_data, parentID, _objKey);

          $(`#btn-refresh`).click();
        },
        error: function (xhr, status, error) {
          console.error("Error Fetching Form Items:", error);
        },
      });
    });
  });

  let lastInstance = 0;
  //Add Button
  // $("#AddToBtn").on("click", function () {
  //   if ($(`#alertDate`).length) {
  //     $("#alertStartDate, #alertEndDate").val("").text("");
  //     $("#alertDateFilter")
  //       .removeClass("btn-primary")
  //       .addClass("btn-secondary");
  //   }
  //   let _data = "";
  //   let MessageMergeTo = [];

  //   _data = new aData(6220002, null, _objKey, "");
  //   MessageMergeTo = _data.getList();

  //   $(`.FooterMessage`).remove();

  //   let Modal = `<div class="modal" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel">
  //       <div class="modal-dialog modal-dialog-scrollable" role="document">
  //           <div class="modal-content">
  //           <div class="Incident-box-header with-border" >
  //                               <h3 class="Incident-box-title" id="" >View All Incidents Without [ ID ${_objKey} ]</h3>
  //                               <div class="Incident-box-tools pull-right">
  //                                   <button type="button" class="" id="closeBtnModal2" data-dismiss="modal" aria-label="Close" onclick="$('#alertModal').remove()"><i class="fa fa-times"></i></button>
  //                               </div>
  //                           </div>

  //               <div class="modal-header col-md-12" style="display: flex;align-items: flex-start;margin-top: 10px;padding-bottom: 5px !important;">
  //                   <div class="">
  //                   <h5 class="modal-title" id="alertModalLabel" style="overflow: hidden;word-wrap: anywhere">Selected Alerts Into Incident: ${_objKey}</h5></div>
  //                   </div>
  //                   <div class="rightDiv ">
  //                    <button type="text" id="alertDateFilter" instanceId="${_objKey}" class="btn btn-secondary input-sm custom-input" style="margin-right: 5px; color: #5c5c5c;">
  //                     <i class="fa fa-filter" style="font-size: medium"></i> Filter
  //                     </button>
  //                    <button type="text" id="ViewAll" class="btn btn-secondary input-sm custom-input AlertLimited" data-label="View All">
  //                     <i class="fa fa-eye-slash" style="font-size: medium;"></i> View All
  //                     </button>

  //                       <button type="text" id="ThisServer" class="btn btn-secondary input-sm custom-input AlertLimited" data-label="This Server">
  //                             <i class="fa fa-eye-slash" style="font-size: medium;"></i> This Server
  //                         </button>

  //                           <button type="text" id="ThisCustomer" class="btn btn-secondary input-sm custom-input AlertLimited" data-label="This Customer">
  //                             <i class="fa fa-eye-slash" style="font-size: medium;"></i> This Customer
  //                           </button>

  //                    <input type="text" id="myMessageInput" onkeyup="SearchFNC('myMessageInput' , MessageTable)" placeholder="Search ..." title="Search from Table" class="form-control input-sm custom-input">
  //                   </div>

  //               <div class="modal-body">
  //                   <form>
  //                       <fieldset id="alertTBL">

  //                       </fieldset>
  //                   </form>
  //               </div>
  //               <div class="modal-footer">
  //                   <div id="loadingIcon">Loading... <img src="App_Res/Images/Incident/loading.gif" alt="Loading"></div>
  //                   <button type="button" class="btn btn-sm btnClass" id="alertAddBtn" style="border-color": "#ddd" >Add</button>
  //                   <button type="button" class="btn btn-sm btnClass" data-dismiss="modal" onclick="$('#alertModal').remove()">Close</button>
  //               </div>
  //           </div>
  //       </div>
  //    </div>`;
  //   $(`body`).append(Modal);

  //   $(".AlertLimited").click(function () {
  //     const id = $(this).attr("id");

  //     if ($(`#alertDate`).length) {
  //       $("#alertStartDate, #alertEndDate").val("").text("");
  //       $("#alertDateFilter")
  //         .removeClass("btn-primary")
  //         .addClass("btn-secondary");
  //     }
  //     $(`#myMessageInput`).val("");
  //     const icon = $(this).find("i");

  //     icon.toggleClass("fa-eye fa-eye-slash");
  //     $(this).toggleClass("btn-primary btn-secondary");

  //     const isHidden = icon.hasClass("fa-eye-slash");
  //     $(this).html(
  //       `<i class="fa ${
  //         isHidden ? "fa-eye-slash" : "fa-eye"
  //       }" style="font-size: medium"></i> ${splitCamelCase(id)}`
  //     );

  //     if (!isHidden) {
  //       let activityID;
  //       if (id == "ThisWeek") {
  //         activityID = 6220009;
  //       } else if (id == "ThisServer") {
  //         activityID = 6220011;
  //       } else if (id == "ThisCustomer") {
  //         activityID = 6220012;
  //       }
  //       _data = new aData(activityID, null, _objKey, "");
  //       MessageMergeTo = _data.getList();

  //       $(`#MessageTable`).remove();
  //       AlertTbl(MessageMergeTo);
  //     } else {
  //       _data = new aData(6220002, null, _objKey, "");
  //       MessageMergeTo = _data.getList();

  //       $(`#MessageTable`).remove();
  //       AlertTbl(MessageMergeTo);
  //     }
  //   });

  //   function splitCamelCase(text) {
  //     return text.replace(/([a-z])([A-Z])/g, "$1 $2");
  //   }

  //   $(`#alertDateFilter`).click(function () {
  //     if ($(`#alertDate`).length) {
  //       if ($(this).attr("instanceId") !== lastInstance) {
  //         $("#alertStartDate, #alertEndDate").val("").text("");
  //         $("#alertDateFilter")
  //           .removeClass("btn-primary")
  //           .addClass("btn-secondary");
  //       }
  //       $(`#alertDate`).show();
  //     } else {
  //       let modal = `<div class="modal" id="alertDate" tabindex="-1" role="dialog" style="z-index: 10000;" >
  //           <div class="modal-dialog modal-dialog-scrollable" role="document" style="margin-top: 10%;">
  //             <div class="modal-content" style="width: 700px;">

  //               <div class="Incident-box-header with-border">
  //                 <h3 class="box-title" style="color: white;margin:10px">
  //                   ${$$Lang == "Fa" ? "افزودن فیلتر" : "Add Filter"}
  //                 </h3>
  //               </div>

  //               <div class="modal-body">
  //                 <form class="form-horizontal" id="Form_alertDate">
  //                   <div class="box-body">
  //                     <div class="row form-group-box" style="border: 0; margin-bottom: 0 !important;">
  //                       <div class="col-md-5" id="form-group-body-text-input-left">
  //                         <label for="alertStartDate" class="control-label" style="margin-bottom: 5px;color: #6a7a8c;font-family: 'IRANSansWeb' !important;">
  //                           Start Date
  //                         </label>
  //                         <div class="input-group" style="margin-bottom: 15px;">
  //                           <div class="input-group-addon">
  //                             <i class="glyphicon glyphicon-edit"></i>
  //                           </div>
  //                           <input
  //                           type="text"
  //                           class="form-control form-input"
  //                           id="alertStartDate"
  //                           data-mdpersiandatetimepickershowing="true"
  //                           title=""
  //                           data-original-title=""
  //                           data-mdpersiandatetimepicker=""
  //                           data-mddatetimepicker="true"
  //                           data-targetselector="#alertStartDate"
  //                           data-trigger="click"
  //                           data-placement="auto"
  //                           data-englishnumber="true"
  //                           dir="ltr"
  //                           data-enabletimepicker="true"
  //                           data-inputmask='"mask": "x/m/d"'
  //                           style="text-align: left;"
  //                           aria-describedby="popover877868"
  //                           />
  //                         </div>
  //                       </div>
  //                       <div class="col-md-1"></div>
  //                       <div class="col-md-5" id="form-group-body-text-input-right">
  //                         <label for="alertEndDate" class="control-label" style="margin-bottom: 5px;color: #6a7a8c;font-family: 'IRANSansWeb' !important;">
  //                           End Date
  //                         </label>
  //                         <div class="input-group" style="margin-bottom: 15px;">
  //                           <div class="input-group-addon">
  //                             <i class="glyphicon glyphicon-edit"></i>
  //                           </div>
  //                           <input
  //                             type="text"
  //                             class="form-control form-input"
  //                             id="alertEndDate"
  //                             data-mdpersiandatetimepickershowing="true"
  //                             title=""
  //                             data-original-title=""
  //                             data-mdpersiandatetimepicker=""
  //                             data-mddatetimepicker="true"
  //                             data-targetselector="#alertEndDate"
  //                             data-trigger="click"
  //                             data-placement="auto"
  //                             data-englishnumber="true"
  //                             dir="ltr"
  //                             data-enabletimepicker="true"
  //                             data-inputmask='"mask": "x/m/d"'
  //                             style="text-align: left;"
  //                             aria-describedby="popover877868"
  //                           />
  //                         </div>
  //                       </div>
  //                     </div>

  //                     <span id="Error_alertDate" class="${
  //                       $$Lang == "Fa" ? "pull-right" : "pull-left"
  //                     } message-form-error"></span>
  //                   </div>
  //                 </form>
  //               </div>

  //               <div class="modal-footer">
  //                 <button type="button" class="btn btn-form-submit" id="submit_alertDate">
  //                   ${$$Lang == "Fa" ? "ثبت" : "Submit"}
  //                 </button>
  //                 <button type="button" class="btn btn-default btn-form-cancel" id="cancel_alertDate" data-dismiss="modal">
  //                   ${$$Lang == "Fa" ? "بستن" : "Close"}
  //                 </button>
  //               </div>

  //             </div>
  //           </div>
  //         </div>`;

  //       $("body").append(modal);
  //       EnableMdDateTimePickers();
  //       $("[data-inputmask]").inputmask();
  //       $(`#alertDate`).show();
  //       lastInstance = _objKey;
  //     }
  //     $(`#submit_alertDate`).click(function () {
  //       $(`#myMessageInput`).val("");
  //       let startDate = $(`#alertStartDate`).val();
  //       let endDate = $(`#alertEndDate`).val();

  //       if (startDate > endDate) {
  //         $(`#Error_alertDate`).text("Input Date Is Invalid.");
  //         return;
  //       } else $(`#Error_alertDate`).text("");

  //       if ($(`#Export_Loding`).length) {
  //         return;
  //       } else {
  //         $(`body`)
  //           .append(`<div id="Export_Loding" class="modal modal-primary in" style="z-index: 9999999;background: rgba(0, 0, 0, 0.18);display:block">
  //              <div class="spinner-container">
  //                <div class="lds-ellipsis">
  //                  <div></div><div></div><div></div><div></div>
  //                </div>
  //              </div>
  //             </div>`);
  //       }

  //       $.ajax({
  //         type: "POST",
  //         url: "../../App_Sys/Services/CustomActivity.asmx/GetFilteredAlerts",
  //         data: JSON.stringify({
  //           startDate: startDate,
  //           endDate: endDate,
  //           instanceId: _objKey,
  //         }),
  //         // async: false,
  //         contentType: "application/json; charset=utf-8",
  //         success: function (response) {
  //           let aletrs = JSON.parse(response.d);
  //           $(`#MessageTable`).remove();
  //           AlertTbl(aletrs);
  //           $(`#Export_Loding`).remove();
  //           $(`#alertDate`).hide();
  //           $("#alertDateFilter").removeClass("btn-secondary");
  //           $("#alertDateFilter").addClass("btn-primary");
  //         },
  //         error: function (jqXHR, textStatus, errorThrown) {
  //           alert("Error => " + JSON.stringify(jqXHR));
  //         },
  //       });
  //     });

  //     $(`#cancel_alertDate`).click(function () {
  //       $(`#alertDate`).hide();
  //     });
  //   });

  //   $("#alertAddBtn").click(function () {
  //     let alertList = $(".mergeCheckbox:checked")
  //       .map(function () {
  //         return +this.id.split("_")[1];
  //       })
  //       .get();

  //     if (alertList.length > 0) {
  //       $.ajax({
  //         type: "POST",
  //         url: "../../App_Sys/Services/CustomActivity.asmx/AddMoveToIncident",
  //         data: JSON.stringify({
  //           currentIncidentID: _objKey,
  //           alertIDs: alertList.join(","),
  //           comment: "",
  //           actionn: "Add",
  //         }),
  //         async: false,
  //         contentType: "application/json; charset=utf-8",
  //         dataType: "json",
  //         success: function (data) {
  //           $("#alertModal").remove();

  //           let _data = new aData(6220000, null, _objKey, "");
  //           _data = _data.getList();

  //           Alerts(_data, parentID, _objKey);

  //           $(`#btn-refresh`).click();
  //         },
  //         error: function (err) {
  //           console.error("Error:", err);
  //         },
  //       });
  //     } else {
  //       $("#MergeBtn").css({
  //         "border-color": "red",
  //       });
  //     }
  //   });

  //   AlertTbl(MessageMergeTo);
  // });

  $("#AddToBtn").on("click", function () {
    if ($("#alertDate").length) {
      $("#alertStartDate, #alertEndDate").val("").text("");
      $("#alertDateFilter")
        .removeClass("btn-primary")
        .addClass("btn-secondary");
    }

    let _data = new aData(6220002, null, _objKey, "");
    let MessageMergeTo = _data.getList();

    $(".FooterMessage").remove();

    const Modal = `
    <div class="modal" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel">
      <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="Incident-box-header with-border">
            <h3 class="Incident-box-title">View All Incidents Without [ ID ${_objKey} ]</h3>
            <div class="Incident-box-tools pull-right">
              <button type="button" id="closeBtnModal2" onclick="$('#alertModal').remove()"><i class="fa fa-times"></i></button>
            </div>
          </div>
          <div class="modal-header col-md-12" style="display:flex;align-items:flex-start;margin-top:10px;padding-bottom:5px;">
            <div>
              <h5 class="modal-title" id="alertModalLabel" style="word-wrap:anywhere">Selected Alerts Into Incident: ${_objKey}</h5>
            </div>
          </div>
          <div class="rightDiv">
            <button type="text" id="alertDateFilter" instanceId="${_objKey}" class="btn btn-secondary input-sm custom-input" style="margin-right:5px;">
              <i class="fa fa-filter" style="font-size:medium"></i> Filter 
            </button>
            <button type="text" id="ViewAll" class="btn btn-secondary input-sm custom-input AlertLimited" data-label="View All">
              <i class="fa fa-eye-slash" style="font-size:medium;"></i> View All
            </button>
            <button type="text" id="ThisServer" class="btn btn-secondary input-sm custom-input AlertLimited" data-label="This Server">
              <i class="fa fa-eye-slash" style="font-size:medium;"></i> This Server
            </button>
            <button type="text" id="ThisCustomer" class="btn btn-secondary input-sm custom-input AlertLimited" data-label="This Customer">
              <i class="fa fa-eye-slash" style="font-size:medium;"></i> This Customer
            </button>
            <input type="text" id="myMessageInput" onkeyup="SearchFNC('myMessageInput', MessageTable)" placeholder="Search ..." class="form-control input-sm custom-input">
            <label style="right:95px">Show</label>
            <select id="rowsPerPageSelect" class="form-control input-sm custom-input">
             <option value="10">10 </option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <label style="right:15px">Records</label>

          </div>
          <div class="modal-body">
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

    AlertTbl(MessageMergeTo);

    // $(".AlertLimited").click(function () {
    //   const id = $(this).attr("id");

    //   $(".AlertLimited").each(function () {
    //     $(this).find("i").removeClass("fa-eye").addClass("fa-eye-slash");
    //     $(this).removeClass("btn-primary").addClass("btn-secondary");
    //     const text = splitCamelCase($(this).attr("id"));
    //     $(this).html(
    //       `<i class="fa fa-eye-slash" style="font-size: medium;"></i> ${text}`
    //     );
    //   });

    //   const icon = $(this).find("i");
    //   icon.removeClass("fa-eye-slash").addClass("fa-eye");
    //   $(this).removeClass("btn-secondary").addClass("btn-primary");
    //   $(this).html(
    //     `<i class="fa fa-eye" style="font-size: medium;"></i> ${splitCamelCase(
    //       id
    //     )}`
    //   );

    //   let activityID;
    //   if (id === "ViewAll") activityID = 6220009;
    //   else if (id === "ThisServer") activityID = 6220011;
    //   else if (id === "ThisCustomer") activityID = 6220012;

    //   let _data = new aData(activityID, null, _objKey, "");
    //   let MessageMergeTo = _data.getList();

    //   AlertTbl(MessageMergeTo);
    // });

    $("#ViewAll").click(function () {
      if ($(`#alertDate`).length) {
        $("#alertStartDate, #alertEndDate").val("").text("");
        $("#alertDateFilter")
          .removeClass("btn-primary")
          .addClass("btn-secondary");
      }
      $(`#myMessageInput`).val("");

      const icon = $(this).find("i");

      icon.toggleClass("fa-eye fa-eye-slash");
      $(this).toggleClass("btn-primary btn-secondary");

      const isHidden = icon.hasClass("fa-eye-slash");
      $(this).html(
        `<i class="fa ${
          isHidden ? "fa-eye-slash" : "fa-eye"
        }" style="font-size: medium"></i> View All`
      );

      if (!isHidden) {
        _data = new aData(6220009, null, _objKey, "");
        MessageMergeTo = _data.getList();

        $(`#MessageTable`).remove();

        AlertTbl(MessageMergeTo);
      } else {
        _data = new aData(6220002, null, _objKey, "");
        MessageMergeTo = _data.getList();

        $(`#MessageTable`).remove();
        AlertTbl(MessageMergeTo);
      }
    });

    function splitCamelCase(text) {
      return text.replace(/([a-z])([A-Z])/g, "$1 $2");
    }

    // دکمه افزودن
    $("#alertAddBtn").click(function () {
      let alertList = $(".mergeCheckbox:checked")
        .map(function () {
          return +this.id.split("_")[1];
        })
        .get();

      if (alertList.length > 0) {
        $.ajax({
          type: "POST",
          url: "../../App_Sys/Services/CustomActivity.asmx/AddMoveToIncident",
          data: JSON.stringify({
            currentIncidentID: _objKey,
            alertIDs: alertList.join(","),
            comment: "",
            actionn: "Add",
          }),
          contentType: "application/json; charset=utf-8",
          success: function () {
            $("#alertModal").remove();
            let _data = new aData(6220000, null, _objKey, "").getList();
            Alerts(_data, parentID, _objKey);
            $("#btn-refresh").click();
          },
          error: function (err) {
            console.error("Error:", err);
          },
        });
      } else {
        $("#MergeBtn").css({ "border-color": "red" });
      }
    });
  });

  //Move to Button
  $("#MoveToBtn").on("click", function () {
    let alertList = $(".generalCheckbox:checked")
      .map(function () {
        return +this.id.split("_")[1];
      })
      .get();

    if (alertList.length > 0) {
      $(`.FooterMessage`).remove();

      let _data = new aData(6220004, null, _objKey, "");
      _data = _data.getList();

      if (_data.length > 0 && _data[0].hasOwnProperty("IncidentID")) {
        let tmpIncidentsList = _data;

        let strMessageTh = `<th scope="row"></th>`;
        let strMessageTd = "";

        for (const key in tmpIncidentsList[0]) {
          if (
            key != "ObjKey" &&
            key != "requestDate" &&
            key != "requestToken"
          ) {
            if (key == "Color") {
              strMessageTh += `<th style="width: 0px;"></th>`;
            } else {
              strMessageTh += `<th>${key}</th>`;
            }
          }
        }

        tmpIncidentsList.map((item, index) => {
          let indexId = item["IncidentID"];
          strMessageTd += `<tr class="trHover"><td><input type="radio" id="unmergeRadio_${indexId}" name="incidentRadio" class="unmergeRadio"></td>`;

          for (const key in item) {
            if (
              key != "ObjKey" &&
              key != "requestDate" &&
              key != "requestToken"
            ) {
              if (key == "Color") {
                let IncidentColor = "";
                if (item[key].replaceAll("Alert", "") == "Yellow") {
                  IncidentColor = "AttentionFlag15";
                } else if (item[key].replaceAll("Alert", "") == "Orange") {
                  IncidentColor = "AttentionFlag16";
                } else if (item[key].replaceAll("Alert", "") == "Red") {
                  IncidentColor = "AttentionFlag17";
                } else if (item[key].replaceAll("Alert", "") == "Black") {
                  IncidentColor = "AttentionFlag18";
                }

                strMessageTd += `<td><img src="App_Res/Images/Page/24/${IncidentColor}.png" style="width:35px; height:50px"> </td>`;
              } else {
                let tmpStr = item[key];
                if (typeof tmpStr === "string" && tmpStr.includes("/Date("))
                  strMessageTd += `<td class="ellipsis">${hasDateInStr(
                    tmpStr
                  )}</td>`;
                else strMessageTd += `<td class="ellipsis">${tmpStr}</td>`;
              }
            }
          }

          strMessageTd += `</tr>`;
        });

        let incidentTbl = `<table id="MessageTable" class="table-bordered gridList incidentTable"><tr>${strMessageTh}</tr>${strMessageTd}</table>`;

        let Modal = `<div class="modal" id="IncidentModal" tabindex="-1" role="dialog" aria-labelledby="IncidentModalLabel">
        <div class="modal-dialog modal-dialog-scrollable" role="document">
            <div class="modal-content">
            <div class="Incident-box-header with-border" >
                                <h3 class="Incident-box-title" id="" >View All Incidents Without [ ID ${_objKey} ]</h3>
                                <div class="Incident-box-tools pull-right">
                                    <button type="button" class="" id="closeBtnModal2" data-dismiss="modal" aria-label="Close" onclick="$('#IncidentModal').remove()"><i class="fa fa-times"></i></button>
                                </div>
                                </div>

                <div class="modal-header">
                    <h5 class="modal-title" id="IncidentModalLabel">Selected Target Incident</h5>                   
                    <div class="rightDiv">
                    <label class="checkbox-label">
                    <button type="button" class="btn btn-sm" id="CreateNewIncidentBtn" disabled>New Incident</button>
                    </label> 
                    <input type="text" id="myMessageInput" onkeyup="SearchFNC('myMessageInput' , MessageTable)" placeholder="Search ..." title="Search from Table" class="form-control input-sm custom-input">                    </div>                    
                </div>
                <div class="modal-body">
                    <form>
                        <fieldset id="incidentTBL">  
                                                                           
                        </fieldset>
                    </form>
                </div>
                <div class="modal-footer">
                    <div id="loadingIcon">Loading... <img src="App_Res/Images/Incident/loading.gif" alt="Loading"></div>
                    <button type="button" class="btn btn-sm btnClass" id="incidentAddBtn" style="border-color": "#ddd" >Add</button>
                    <button type="button" class="btn btn-sm btnClass" data-dismiss="modal" onclick="$('#IncidentModal').remove()">Close</button>
                </div>
            </div>
        </div>
       </div>`;

        $(`body`).append(Modal);

        $("#incidentTBL").append(incidentTbl);

        $("#IncidentModal").css("display", "block");
      } else {
        $(`.FooterMessage`).remove();
        $(`#boxFooterModal1`).append(
          `<span class="FooterMessage">*No more incidents were found for this customer</span>`
        );
      }

      $("#incidentAddBtn").click(function () {
        let IncidentCheckbox = $(".unmergeRadio:checked")
          .map(function () {
            return +this.id.split("_")[1];
          })
          .get();

        if (IncidentCheckbox.length > 0) {
          $.ajax({
            type: "POST",
            url: "../../App_Sys/Services/CustomActivity.asmx/AddMoveToIncident",
            data: JSON.stringify({
              currentIncidentID: IncidentCheckbox[0],
              alertIDs: alertList.join(","),
              comment: "",
              actionn: "MoveTo",
            }),
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
              $("#IncidentModal").remove();

              let _data = new aData(6220000, null, _objKey, "");
              _data = _data.getList();

              Alerts(_data, parentID, _objKey);

              $(`#btn-refresh`).click();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              reject("Error => " + JSON.stringify(jqXHR));
            },
          });
        } else {
          $("#UnmergeBtn").css({
            "border-color": "red",
          });
        }
      });
    } else {
      $(`.FooterMessage`).remove();

      $(`#boxFooterModal1`).append(
        `<span class="FooterMessage">*Please select an alert to move to another incident.</span>`
      );

      $("#unmergeToBtn").css({
        "border-color": "#eda5ac",
      });
    }
  });

  $("#expandAllBtn").click(function () {
    const isExpanding = $(this).text().trim() === "Expand All";

    $(this).text(isExpanding ? "Collapse All" : "Expand All");

    $(".expand-collapse-btn").each(function () {
      $(this).trigger("click");
    });
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

function AlertDetails(_alertID) {
  const _data = new aData(6220001, null, +_alertID.split("_")[1], "");
  let tmp = _data.getList();

  const item = tmp[0];

  let html = `<ul class="list-group" style="margin-bottom:0px !important">`;

  const excludedKeys = new Set(["ObjKey", "requestDate", "requestToken"]);

  for (const [field, value] of Object.entries(item)) {
    if (excludedKeys.has(field)) continue;

    const isDate = isDateTime(value);
    const displayValue = isDate
      ? `${getTimeDifference(value)} (${hasDateInStr(value)})`
      : value;

    html += `
      <li class="smokeColor">
        <div class="titleValue">${field} :</div>${displayValue}
      </li>`;
  }

  html += `</ul>`;

  $(`#` + _alertID.replaceAll("Btn", "s")).append(html);
}

// function AlertTbl(MessageMergeTo) {
//   let strMessageTh = `<th scope="row"><input id="selectAll" type="checkbox" style="display: flex;text-align: left;margin: 4px 0px 0px 28px;cursor:pointer"/></th>`;
//   let strMessageTd = "";

//   // create TH
//   let thList = [];
//   let tdList = MessageMergeTo;

//   if (
//     MessageMergeTo.length > 0 &&
//     MessageMergeTo[0].hasOwnProperty("AlertID")
//   ) {
//     thList = MessageMergeTo;
//   } else {
//     thList = [
//       {
//         AlertID: 0,
//         ClientName: "",
//         ClientIP: "",
//         Malware: "",
//         ClientDate: "",
//         AlertDate: "",
//       },
//     ];
//   }

//   for (const key in thList[0]) {
//     if (key != "ObjKey" && key != "requestDate" && key != "requestToken") {
//       if (key != "Color") {
//         strMessageTh += `<th>${key}</th>`;
//       }
//     }
//   }
//   strAlertTd = "";

//   tdList.map((item, index) => {
//     let indexId = item["AlertID"];

//     //create TD
//     if (
//       Object.keys(item) != "ObjKey" &&
//       Object.keys(item) != "requestDate" &&
//       Object.keys(item) != "requestToken"
//     ) {
//       strAlertTd += `<tr  class="trHover">`;

//       for (const key in item) {
//         if (key != "ObjKey" && key != "requestDate" && key != "requestToken") {
//           if (key == "Color") {
//             let AlertColor = "";
//             if (item[key].replaceAll("Alert", "") == "Yellow") {
//               AlertColor = "AttentionFlag19";
//             } else if (item[key].replaceAll("Alert", "") == "Orange") {
//               AlertColor = "AttentionFlag20";
//             } else if (item[key].replaceAll("Alert", "") == "Red") {
//               AlertColor = "AttentionFlag21";
//             } else if (item[key].replaceAll("Alert", "") == "Black") {
//               AlertColor = "AttentionFlag22";
//             }

//             let tmpPenColor =
//               item[key].replaceAll("Alert", "") == "Yellow" ? "Black" : "White";

//             strAlertTd += `<td style="color:${tmpPenColor}">
//                 <div class="alertItemDiv">
//                 <input type="checkbox" id="mergeCheckbox_${indexId}" class="mergeCheckbox" name="mergeCheckbox_${indexId}" style="margin-left:0px"/>
//                 <i id="DetailBtn_${indexId}" class="expand-collapse-btn glyphicon glyphicon-plus details-control btn-grid" style="cursor: pointer;margin: 0px 20px !important" onclick="toggleDiv('DetailBtn_${indexId}')"></i>
//                 <img src="App_Res/Images/Page/24/${AlertColor}.png"></div>
//                 </div>
//                 </td>`;
//           } else {
//             let tmpStr = item[key];
//             if (typeof tmpStr === "string" && tmpStr.includes("/Date("))
//               strAlertTd += `<td class="ellipsis">${hasDateInStr(tmpStr)}</td>`;
//             else strAlertTd += `<td class="ellipsis">${tmpStr}</td>`;
//           }
//         }
//       }
//       strAlertTd += `</tr>`;
//     }

//     strAlertTd += `<tr class="hidden"><td colspan="10" id="Details_${indexId}" class="AlertDetails"></td></tr>`;
//   });

//   let alertTbl = `<table id="MessageTable" class="table-bordered gridList incidentTable"><tr>${strMessageTh}</tr>${strAlertTd}</table>`;

//   $("#alertTBL").append(alertTbl);

//   $("#selectAll").on("change", function () {
//     $(".mergeCheckbox").prop("checked", this.checked);
//   });

//   $("#alertModal").css("display", "block");
// }
function AlertTbl(MessageMergeTo) {
  let rowsPerPage = parseInt($("#rowsPerPageSelect").val()) || 10;
  let currentPage = 1;
  let searchQuery = "";

  function getFilteredData() {
    return MessageMergeTo.filter((item) => {
      return Object.values(item).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  function renderTablePage(page, filteredData) {
    $("#alertTBL").empty();
    let start = (page - 1) * rowsPerPage;
    let end = start + rowsPerPage;
    let pagedData = filteredData.slice(start, end);

    let strMessageTh = `<th scope="row">
      <input id="selectAll" type="checkbox" style="display: flex;text-align: left;margin: 4px 0px 0px 28px;cursor:pointer"/>
    </th>`;

    let thList =
      pagedData.length > 0
        ? pagedData
        : [
            {
              AlertID: 0,
              ClientName: "",
              ClientIP: "",
              Malware: "",
              ClientDate: "",
              AlertDate: "",
            },
          ];

    for (const key in thList[0]) {
      if (!["ObjKey", "requestDate", "requestToken", "Color"].includes(key)) {
        strMessageTh += `<th>${key}</th>`;
      }
    }

    let strAlertTd = "";
    pagedData.forEach((item) => {
      let indexId = item["AlertID"];
      strAlertTd += `<tr class="trHover">`;

      for (const key in item) {
        if (!["ObjKey", "requestDate", "requestToken"].includes(key)) {
          if (key === "Color") {
            let raw = item[key].replaceAll("Alert", "");
            let AlertColor =
              {
                Yellow: "AttentionFlag19",
                Orange: "AttentionFlag20",
                Red: "AttentionFlag21",
                Black: "AttentionFlag22",
              }[raw] || "";

            let tmpPenColor = raw === "Yellow" ? "Black" : "White";

            strAlertTd += `<td style="color:${tmpPenColor}">
              <div class="alertItemDiv">
                <input type="checkbox" id="mergeCheckbox_${indexId}" class="mergeCheckbox" />
                <i id="DetailBtn_${indexId}" class="expand-collapse-btn glyphicon glyphicon-plus details-control btn-grid"
                  style="cursor:pointer;margin:0px 20px;" onclick="toggleDiv('DetailBtn_${indexId}')"></i>
                <img src="App_Res/Images/Page/24/${AlertColor}.png">
              </div>
            </td>`;
          } else {
            let tmpStr = item[key];
            strAlertTd += `<td class="ellipsis">${
              typeof tmpStr === "string" && tmpStr.includes("/Date(")
                ? hasDateInStr(tmpStr)
                : tmpStr
            }</td>`;
          }
        }
      }

      strAlertTd += `</tr><tr class="hidden"><td colspan="10" id="Details_${indexId}" class="AlertDetails"></td></tr>`;
    });

    let tableHTML = `<table id="MessageTable" class="table-bordered gridList incidentTable">
      <tr>${strMessageTh}</tr>${strAlertTd}</table>`;

    $("#alertTBL").append(tableHTML);
    $("#selectAll").on("change", function () {
      $(".mergeCheckbox").prop("checked", this.checked);
    });

    renderPagination(filteredData);
  }

  function renderPagination(filteredData) {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (totalPages <= 1) {
      $("#pagination").remove();
      return;
    }

    let paginationHtml = "";

    // Prev button
    paginationHtml += `<button class="page-btn" data-page="${
      currentPage - 1
    }" ${currentPage === 1 ? "disabled" : ""}>Prev</button>`;

    const maxButtons = 7; // Total page buttons to display including first and last
    let startPage, endPage;

    if (totalPages <= maxButtons) {
      // If total pages less or equal maxButtons, show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than maxButtons pages

      // Always show first and last pages
      // Calculate start and end pages around currentPage to have maxButtons in total

      let middleButtons = maxButtons - 2; // excluding first and last pages

      // Calculate startPage and endPage centered around currentPage
      startPage = currentPage - Math.floor(middleButtons / 2);
      endPage = currentPage + Math.floor(middleButtons / 2);

      // Adjust if startPage less than 2
      if (startPage < 2) {
        startPage = 2;
        endPage = startPage + middleButtons - 1;
      }

      // Adjust if endPage greater than totalPages-1
      if (endPage > totalPages - 1) {
        endPage = totalPages - 1;
        startPage = endPage - middleButtons + 1;
      }
    }

    // Always show first page
    paginationHtml += `<button class="page-btn ${
      currentPage === 1 ? "active" : ""
    }" data-page="1">1</button>`;

    // Show left ellipsis if startPage > 2
    if (startPage > 2) {
      paginationHtml += `<span style="padding: 5px 10px;">...</span>`;
    }

    // Show pages from startPage to endPage
    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `<button class="page-btn ${
        i === currentPage ? "active" : ""
      }" data-page="${i}">${i}</button>`;
    }

    // Show right ellipsis if endPage < totalPages - 1
    if (endPage < totalPages - 1) {
      paginationHtml += `<span style="padding: 5px 10px;">...</span>`;
    }

    // Always show last page
    if (totalPages > 1) {
      paginationHtml += `<button class="page-btn ${
        currentPage === totalPages ? "active" : ""
      }" data-page="${totalPages}">${totalPages}</button>`;
    }

    // Next button
    paginationHtml += `<button class="page-btn" data-page="${
      currentPage + 1
    }" ${currentPage === totalPages ? "disabled" : ""}>Next</button>`;

    $("#pagination").remove();
    $("#alertTBL").append(
      `<div id="pagination"  class="pagination">${paginationHtml}</div>`
    );

    $(".page-btn").click(function () {
      const targetPage = parseInt($(this).data("page"));
      if (targetPage >= 1 && targetPage <= totalPages) {
        currentPage = targetPage;
        renderTablePage(currentPage, getFilteredData());
        renderPagination(getFilteredData()); // rerender pagination to update buttons
      }
    });
  }

  $("#myMessageInput")
    .off("keyup")
    .on("keyup", function () {
      searchQuery = $(this).val();
      currentPage = 1;
      renderTablePage(currentPage, getFilteredData());
    });

  $("#rowsPerPageSelect")
    .off("change")
    .on("change", function () {
      rowsPerPage = parseInt($(this).val());
      currentPage = 1;
      renderTablePage(currentPage, getFilteredData());
    });

  renderTablePage(currentPage, getFilteredData());
  $("#alertModal").css("display", "block");
}
