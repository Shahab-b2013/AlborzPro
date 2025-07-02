/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.6.0.0*/
/* Release Ferdos.BPMS*/

function Sidebar() {
  /*
   **New Field UI
   */
  $(`#NewFieldChild`).remove();
  $(`#NewField`).after(`<div class="sideBarChild" id="NewFieldChild"></div>`);
  let item = $NewField_PNG;
  for (let i in item) {
    if (Object.keys(item[i])[0] != "Table" && Object.keys(item[i])[0] != "SelectiveTable") {
      let item_Icon = `<div id="NewFieldID_${i}" class="DataProcessElement" fixlabel="" type="${
        Object.keys(item[i])[0]
      }" draggable="true" ondragstart="Drag(event)" ondragend="Dragend(event)" style="display: flex;align-items: center;height: 35px;">

      <img class="noDrop" draggable="false" src="data:image/png;base64,${
        Object.values(item[i])[0]
      }" `;
      item_Icon += `style="height:20px;width:20px;"></img><p id="" style="margin:0px 5px" changelang="${
        Object.values(item[i])[1]
      }">${formResources.get(Object.values(item[i])[1])}</div>`;
      $(`#NewFieldChild`).append(item_Icon);
    }
  }
  $(`#NewFieldChild`).hide();
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
}

var Disable_Items;
var _localStorage;
let localStorage_Variables;
function DataProcess_UI($JSON) {
  Disable_Items = $JSON.FormItems;
  $(`#NewFieldChild`).show();
  $(`#DataProcessChild`).remove();
  $(`#DataProcess`).after(
    `<div class="sideBarChild" id="DataProcessChild"></div>`
  );
  dataProcessItems();

  $(`#DataProcessChild`).hide();

  function dataProcessItems() {
    if ($("#content .form-group").length > 0)
      Disable_Items = $("#content .form-group");

    //set variables to localstorage
    localStorage_Variables = JSON.parse(
      localStorage.getItem("Variables" + $ProcessID)
    );

    $(`#DataProcessChild`).empty();
    let count = 0;
    let item_Icon;

    // Add search input at the top of #DataProcessChild
    $(`#DataProcessChild`).prepend(
      `<div style="display:flex;align-items: center;"><i style="position:absolute;right:10px;" class="fa fa-search"></i>
          <input type="text" id="searchSideBar" placeholder="جستجو..." style="padding-left:30px;padding-right:30px;" class="form-control input-sm"></div>`
    );
    // Attach event listener to the search input field
    $("#searchSideBar").on("input", function () {
      let searchTerm = $(this).val().toLowerCase();

      // Filter the <p> elements based on the search term
      $("#DataProcessChild .sideBarValues").each(function () {
        let text = $(this).text().toLowerCase();
        if (text.includes(searchTerm)) {
          $(this).parent().show(); // Show the parent <div> if text matches
        } else {
          $(this).parent().hide(); // Hide the parent <div> if text does not match
        }
      });
    });

    for (const j in localStorage_Variables) {
      item_Icon =
        `<div id="DataProcessID_${count}" class="DataProcessElement" inputcount="${localStorage_Variables[j].InputCount}" type="${localStorage_Variables[j].DataType}" systemid="${localStorage_Variables[j].SystemID}" enumtypeid="${localStorage_Variables[j].EnumTypeID}" entitytypeid="${localStorage_Variables[j].EntityTypeID}" formula="${localStorage_Variables[j].Formula}" draggable="true" rowkey="${localStorage_Variables[j].RowKey}" fixlabel="${localStorage_Variables[j].Label}" ondragstart="Drag(event)" ondragend="Dragend()" style="display: flex;align-items: center;">` +
        `<img class="noDrop" draggable="false" src="data:image/png;base64,`;
      switch (localStorage_Variables[j].DataType) {
        case `Text`:
        case `String`:
        case `LocalString`:
        case `LatinString`:
        case `Computed`:
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
        case `Password`:
          item_Icon += $VARIABLE_PNG[4];
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
        case `File`:
          item_Icon += $VARIABLE_PNG[8];
          break;
        case `Table`:
          item_Icon += $VARIABLE_PNG[9];
          break;
          case `SelectiveTable`:
            item_Icon += $VARIABLE_PNG[16];
            break;
  
        case `Image`:
          item_Icon += $VARIABLE_PNG[10];
          break;
        case `System`:
        case `Enum`:
          item_Icon += $VARIABLE_PNG[11];
          break;
        case `Sms`:
          item_Icon += $VARIABLE_PNG[12];
          break;
        case `Agreement`:
          item_Icon += $VARIABLE_PNG[13];
          break;
        case `FacilityBox`:
          item_Icon += $VARIABLE_PNG[14];
          break;
        case `TimingBox`:
          item_Icon += $VARIABLE_PNG[15];
          break;

        default:
          break;
      }
      item_Icon += `" style="height:20px;width:20px"></img><p class="sideBarValues" id="" style="margin:8px 5px 2px 5px" changelang="${localStorage_Variables[j].Label}">${localStorage_Variables[j].Label}</p></div>`;

      $(`#DataProcessChild`).append(item_Icon);
      if ($("#content .form-group").length > 0) {
        for (let i = 0; i < $("#content .form-group").length; i++) {
          if (
            $("#content .form-group").eq(i).attr("foreignkey") ==
            localStorage_Variables[j].RowKey
          ) {
            $(`#DataProcessID_${count}`).css("pointer-events", "none");
            $(`#DataProcessID_${count} p`).css("color", "#ccc");
          }
        }
      } else {
        if (
          Disable_Items.filter(
            (x) => x.ForeignKey == localStorage_Variables[j].RowKey
          ).length
        ) {
          $(`#DataProcessID_${count}`).css("pointer-events", "none");
          $(`#DataProcessID_${count} p`).css("color", "#ccc");
        }
      }
      count++;
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
}

ResourceFunct();
