/* Code File(Amnpardaz Software Co. Copyright 2025 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.0.0*/

function Sidebar() {
  //chart icons
  $(`#DataProcessChild`).remove();
  $(`#DataProcess`).after(
    `<div class="sideBarChild" id="DataProcessChild"></div>`
  );

  let items = imgObject;
  for (const i in items) {
    let item_Icon =
      `<div id="DataProcessID_${i}" class="DataProcessElement" type="${Object.keys(
        items[i]
      )}" draggable="true" ondragstart="dragstart(event)" ondragend="Dragend(event)" style="display: flex;align-items: center;" >` +
      `<img class="noDrop" draggable="false" onmouseover='(event)=>event.target.style="cursor:grabbing"' src="data:image/png;base64,` +
      Object.values(items[i]);

    item_Icon += `" style="height:20px;width:20px"></img><p id="" style="margin: 8px 5px 2px 5px;" changelang="${Object.keys(
      items[i]
    )}"></p></div>`;
    $(`#DataProcessChild`).append(item_Icon);
  }

  $(`#SettingField`).after(
    `<div class="sideBarChild" id="SettingFieldChild" style="display:block;"></div>`
  );

  //setting icons
  for (const i in Settings) {
    let Accesses =
      `<div id="SettingID${i}" class="DataProcessElement" draggable="false" style="display: flex;align-items: center;cursor:pointer" onclick="Accesses(event)">` +
      `<img class="noDrop" draggable="false" src="data:image/png;base64,${Object.values(
        Settings[i]
      )}" `;
    Accesses += `style="height:20px;width:20px;"></img><p id="" style="margin:5px 5px 2px 5px" changelang="${Object.keys(
      Settings[i]
    )}"></p></div>`;
    $(`#SettingFieldChild`).append(Accesses);
  }

  let arrows = $(".geTitle i").get();
  arrows.forEach((item) => {
    if (_Lang == "Fa") {
      if ($(item).hasClass("fa-rotate-90")) {
        $(".geTitle").css("borderLeft", "3px solid var(--A2)");
      } else {
        $(".geTitle").css("borderLeft", "0");
      }
    } else {
      if ($(item).hasClass("fa-rotate-90")) {
        $(".geTitle").css("borderRight", "3px solid var(--A2)");
      } else {
        $(".geTitle").css("borderRight", "0");
      }
    }
  });

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

    if (_Lang == "Fa") {
      let arrow = $(`#${elementID} i`).get(0);
      if ($(arrow).hasClass("fa-rotate-90")) {
        $(`#${elementID}`).css("borderLeft", "3px solid var(--A2)");
      } else {
        $(`#${elementID}`).css("borderLeft", "0");
      }
    } else {
      let arrow = $(`#${elementID} i`).get(0);
      if ($(arrow).hasClass("fa-rotate-90")) {
        $(`#${elementID}`).css("border-right", "3px solid var(--A2)");
      } else {
        $(`#${elementID}`).css("border-right", "0");
      }
    }
  });
}
