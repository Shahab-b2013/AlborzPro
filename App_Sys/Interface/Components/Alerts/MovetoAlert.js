function moveToAction(parentID, _objKey) {
  $("#MoveToBtn").on("click", function () {

    let alertList = $(".generalCheckbox:checked")
      .map(function () {
        return +this.id.split("_")[1];
      })
      .get();

    if (alertList.length > 0) {
      $(`.FooterMessage`).remove();

      $loading.show();
      $.ajax({
        type: "POST",
        url: "../../App_Sys/Services/CustomActivity.asmx/GetFiltered",
        data: JSON.stringify({
          ids: "ThisServer,ThisWeek",
          startDate: "",
          endDate: "",
          instanceId: _objKey.toString(),
          color: "",
          mode: "MoveTo",
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
          $loading.hide();
          FilterOptBtn("MoveTo", _objKey);
          let val = JSON.parse(response.d);

          if (val.length > 0 && val[0].hasOwnProperty("IncidentID")) {
            //   let tmpIncidentsList = val;
            MoveToTbl(val)

            // let strMessageTh = `<th scope="row"></th>`;
            // let strMessageTd = "";

            // for (const key in tmpIncidentsList[0]) {
            //   if (
            //     key != "ObjKey" &&
            //     key != "requestDate" &&
            //     key != "requestToken"
            //   ) {
            //     if (key == "Color") {
            //       strMessageTh += `<th style="width: 0px;"></th>`;
            //     } else {
            //       strMessageTh += `<th>${key}</th>`;
            //     }
            //   }
            // }

            // tmpIncidentsList.map((item, index) => {//todo
            //   let indexId = item["IncidentID"];
            //   strMessageTd += `<tr class="trHover"><td><input type="radio" id="unmergeRadio_${indexId}" name="incidentRadio" class="unmergeRadio"></td>`;

            //   for (const key in item) {
            //     if (
            //       key != "ObjKey" &&
            //       key != "requestDate" &&
            //       key != "requestToken"
            //     ) {
            //       if (key == "Color") {
            //         let IncidentColor = "";
            //         if (item[key].replaceAll("Alert", "") == "Yellow") {
            //           IncidentColor = "AttentionFlag15";
            //         } else if (item[key].replaceAll("Alert", "") == "Orange") {
            //           IncidentColor = "AttentionFlag16";
            //         } else if (item[key].replaceAll("Alert", "") == "Red") {
            //           IncidentColor = "AttentionFlag17";
            //         } else if (item[key].replaceAll("Alert", "") == "Black") {
            //           IncidentColor = "AttentionFlag18";
            //         }

            //         strMessageTd += `<td><img src="App_Res/Images/Page/24/${IncidentColor}.png" style="width:35px; height:50px"> </td>`;
            //       } else {
            //         let tmpStr = item[key];
            //         if (typeof tmpStr === "string" && tmpStr.includes("/Date("))
            //           strMessageTd += `<td class="ellipsis">${hasDateInStr(
            //             tmpStr
            //           )}</td>`;
            //         else strMessageTd += `<td class="ellipsis">${tmpStr}</td>`;
            //       }
            //     }
            //   }

            //   strMessageTd += `</tr>`;
            // });

            // let incidentTbl = `<table id="MessageTable" class="table-bordered gridList incidentTable"><tr>${strMessageTh}</tr>${strMessageTd}</table>`;

            //   let Modal = `<div class="modal" id="IncidentModal" tabindex="-1" role="dialog" aria-labelledby="IncidentModalLabel">
            // <div class="modal-dialog modal-dialog-scrollable" role="document">
            //     <div class="modal-content">
            //     <div class="Incident-box-header with-border" >
            //                         <h3 class="Incident-box-title" id="" >View Alerts</h3>
            //                         <div class="Incident-box-tools pull-right">
            //                             <button type="button" class="" id="closeBtnModal2" data-dismiss="modal" aria-label="Close" onclick="$('#IncidentModal').remove()"><i class="fa fa-times"></i></button>
            //                         </div>
            //                         </div>

            //         <div class="modal-header" style="padding-left: 12px !important">
            //             <h5 class="modal-title" id="IncidentModalLabel">Selected Target Incident</h5>                   
            //         </div>
            //             <div class="rightDiv" style="height: 20px;">
            //             <input type="text" id="searchBtn" onkeyup="SearchFNC('searchBtn' , MessageTable)" placeholder="Search ..." title="Search from Table" class="form-control input-sm custom-input"
            //             style="top: 87px !important;right: 18px !important;">
            //             </div>
            //             <div class="modal-body">
            //             <form>
            //                 <fieldset id="alertTBL">  

            //                 </fieldset>
            //             </form>
            //         </div>
            //         <div class="modal-footer">
            //             <div id="loadingIcon">Loading... <img src="App_Res/Images/Incident/loading.gif" alt="Loading"></div>
            //             <button type="button" class="btn btn-sm btnClass" id="incidentAddBtn" style="border-color": "#ddd" >Add</button>
            //             <button type="button" class="btn btn-sm btnClass" data-dismiss="modal" onclick="$('#IncidentModal').remove()">Close</button>
            //         </div>
            //     </div>
            // </div>
            //          </div>`;

            //   $(`body`).append(Modal);
            // FilterOptBtn("MoveTo", _objKey)
            // $("#alertTBL").append(incidentTbl);

            $("#alertModal").css("display", "block");
          } else {
            $(`.FooterMessage`).remove();
            $(`#boxFooterModal1`).append(
              `<span class="FooterMessage">*No more incidents were found for this customer</span>`
            );
          }

          $(`#alertMoveToBtn`).click(function () {
            let IncidentCheckbox = $(".unmergeRadio:checked")
              .map(function () {
                return +this.id.split("_")[1];
              })
              .get();

            if (IncidentCheckbox.length > 0) {
              $loading.show();
              $.ajax({
                type: "POST",
                url: "../../App_Sys/Services/CustomActivity.asmx/AddMoveToIncident",
                data: JSON.stringify({
                  currentIncidentID: IncidentCheckbox[0],
                  alertIDs: alertList.join(","),
                  comment: "",
                  actionn: "MoveTo",
                }),
                async: true,
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                  $("#alertModal").remove();

                  loadAlert(parentID, _objKey);
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
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("Ajax Error:", jqXHR.responseText);
          alert("Error:\n" + jqXHR.responseText);
        },
      });


      $(`.FooterMessage`).remove();

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
}
