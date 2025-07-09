function addAction(parentID, _objKey) {
  $("#AddToBtn").on("click", function () {
    $loading.show();

    const promise = new Promise((resolve, reject) => {
      let _data = new aData(6220002, null, _objKey, "", true);

      let timer = setInterval(() => {
        let value = _data.getList();
        if (value && value.length > 0) {
          clearInterval(timer);
          resolve(value);
        }
      }, 1);
    });

    $(".FooterMessage").remove();

    promise.then((val) => {
      $loading.hide();

      FilterOptBtn(_objKey);

      AlertTbl(val);

      $("#alertAddBtn").click(function () {
        let alertList = $(".mergeCheckbox:checked")
          .map(function () {
            return +this.id.split("_")[1];
          })
          .get();

        if (alertList.length > 0) {
          $loading.show();
          $.ajax({
            type: "POST",
            url: "../../App_Sys/Services/CustomActivity.asmx/AddMoveToIncident",
            data: JSON.stringify({
              currentIncidentID: _objKey,
              alertIDs: alertList.join(","),
              comment: "",
              actionn: "Add",
            }),
            async: true,
            contentType: "application/json; charset=utf-8",
            success: function () {
              $("#alertModal").remove();
              loadAlert(parentID, _objKey);
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
  });
}
