/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.1.0.0*/
/* Release Ferdos.BPMS*/

function Sidebar() {
  /*
   **Properties UI
   */
  $(`#SettingField`).after(
    `<div class="sideBarChild" id="SettingFieldChild" style="display:block;"></div>`
  );

  $(`.geTitle`).on("click", (e) => {
    let elementID;

    if ($(e.target).attr("class") == "geTitle") {
      elementID = e.target.id;
    } else {
      elementID = $(e.target).parent().attr("id");
    }
    $(`#${elementID} i`).toggleClass("fa-rotate-90");

    let current = $(`#${elementID}`).next().css("display");

    if (elementID != "SettingField")
      $(`.geTitle:not('#SettingField') i`).removeClass("fa-rotate-90");

    if (elementID != "SettingField")
      $(`.sideBarChild:not('#SettingFieldChild')`).hide();

    if (current == "block") {
      $(`#${elementID}`).next().hide();
      $(`#${elementID} i`).removeClass("fa-rotate-90");
    } else {
      $(`#${elementID}`).next().show();
      $(`#${elementID} i`).addClass("fa-rotate-90");
    }

    const rgba2hex = (rgba) =>
      `#${rgba
        .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
        .slice(1)
        .map((n, i) =>
          (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
            .toString(16)
            .padStart(2, "0")
            .replace("NaN", "")
        )
        .join("")}`;
    $("body").append(
      '<input type="checkbox" id="geTitleChecked" style="display:none;" checked>'
    );

    if (_Lang == "Fa") {
      $(`.geTitle`).css("border-left", "3px solid #2a3f54");
      $(`#${elementID}`).css(
        "borderLeft",
        `3px solid ${rgba2hex($("#geTitleChecked").css("color"))} `
      );
    } else {
      $(`.geTitle`).css("border-right", "3px solid #2a3f54");
      $(`#${elementID}`).css(
        "borderRight",
        `3px solid ${rgba2hex($("#geTitleChecked").css("color"))} `
      );
    }

    $("#geTitleChecked").remove();
  });
  ProcessUserItems();
}

function ProcessUserItems() {
  $.ajax({
    type: "POST",
    url: "../../App_Sys/Services/Admin/Document.asmx/GetUserTasksInfo",
    data: JSON.stringify({ processId: $ProcessID }),
    contentType: "application/json; charset=utf-8",
    async: false,
    dataType: "json",
    success: function (data) {
      // Parse the response data
      const items = JSON.parse(data.d);
      // Remove existing child and create new container
      $(`#ProcessUserChild`).remove();
      $(`#ProcessUsers`).after(
        `<div class="sideBarChild" id="ProcessUserChild"></div>`
      );

      // Add elements based on the labels data
      const $container = $("#ProcessUserChild");

      // Example: Add each label as a span element
      if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          $container.append(`<div id="ProcessUserID_${i}" class="Signature ProcessUsersElemet" type="Signature" systemid="${item.ActivityID}"  draggable="true" rowkey="${i}" ondragstart="Drag(event)" style="display: flex;align-items: center;">
                  <img class="noDrop" draggable="false" src="data:image/png;base64,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" style="height:25px;width:25px"/>
                  <p style="margin: 8px 5px 2px 5px;">امضای ${item.Label}</p>
              </div>`);
        }
      } else {
        alert("No Process User found");
      }

      // Show the container
      $container.hide();

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
      console.log(jqXHR);
    },
  });
}

function dataProcessItems() {
  //set variables to localstorage
  localStorage_Variables = JSON.parse(
    localStorage.getItem("Variables" + $ProcessID)
  );
  $(`#DataProcessChild`).remove();
  $(`#DataProcess`).after(
    `<div class="sideBarChild" id="DataProcessChild"></div>`
  );

  //Icon
  let item_Icon;
  let item = localStorage_Variables;

  //Rows
  for (let i in item) {
    if (item[i].DataType != "File" && item[i].DataType != "Password") {
      item_Icon =
        `<div id="DataProcessID_${i}" class="DataProcessElement" type="${item[i].DataType}" systemid="${item[i].SystemID}" draggable="true" rowkey="${item[i].RowKey}" ondragstart="Drag(event)" style="display: flex;align-items: center;">` +
        `<img class="noDrop" draggable="false" src="data:image/png;base64,`;
      switch (item[i].DataType) {
        case `Text`:
        case `String`:
        case `LocalString`:
        case `LatinString`:
        case `System`:
          item_Icon += $VARIABLE_PNG[0];
          break;
        case `BigInteger`:
        case `Integer`:
        case `Number`:
          item_Icon += $VARIABLE_PNG[1];
          break;
        case `Boolean`:
          item_Icon += $VARIABLE_PNG[2];
          break;
        case `Money`:
          item_Icon += $VARIABLE_PNG[3];
          break;
        case `Time`:
          item_Icon += $VARIABLE_PNG[5];
          break;
        case `Date`:
          item_Icon += $VARIABLE_PNG[6];
          break;
        case `DateTime`:
          item_Icon += $VARIABLE_PNG[7];
          break;
        case `Table`:
          item_Icon += $VARIABLE_PNG[9];
          break;
        case `Image`:
          item_Icon += $VARIABLE_PNG[10];
          break;
        case `Enum`:
        case `Computed`:
          item_Icon += $VARIABLE_PNG[11];
          break;
        default:
          break;
      }
      item_Icon += `" style="height:20px;width:20px"></img><p id="" style="margin: 8px 5px 2px 5px;">${item[i].Label}</div>`;
      $(`#DataProcessChild`).append(item_Icon);
    }
  }

  //DataProcessChild arrow icon down
  $(`#DataProcessChild`).show();
}

function dataclick() {
  if ($(`#DataProcessChild`).css(`display`) == `none`) {
    $(`#DataProcessChild`).show();
  } else {
    $(`#DataProcessChild`).hide(20);
  }
}

//Data process Refresh
setInterval(() => {
  if (
    JSON.stringify(localStorage_Variables) !=
    localStorage.getItem("Variables" + $ProcessID)
  )
    dataProcessItems();
}, 100);
