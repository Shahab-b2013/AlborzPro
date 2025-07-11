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
           
            MoveToTbl(val)

          

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
