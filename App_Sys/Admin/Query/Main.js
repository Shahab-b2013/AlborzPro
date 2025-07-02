/* Code File(Amnpardaz Software Co. Copyright 2023 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 3.6.0.0*/
/* Release Ferdos.BPMS*/

var TABLE_NAME = "";
var JSON_DATA = {};
var COLUMN_ID = "";
var SELECT_TABLES = [];
var SELECT_TABLES_En = [];
var TABLES_ORGINAL_NAME = [];
var SELECT_JOINS = [];
var SELECT_JOINS_En = [];
var SELECT_COLUMNS = [];
var SELECT_COLUMNS_En = [];
var LABEL_GRAPH = [];
var TABLE_X = 0;
var TABLE_Y = 0;
var COLUMNS_DIV = [];
var SQL_RESULT = "";
var JSON_OUTPUT = [];
var JOIN_TYPE = "LEFT OUTER JOIN";

var PAGE_ID = 0;
var graph;
var model;
var editor;

// Program starts here. Creates a sample graph in the
// DOM node with the specified ID. This function is invoked
// from the onLoad event handler of the document (see below).
function main(container, outline, toolbar, sidebar, status) {
  // Checks if the browser is supported
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is not supported.
    mxUtils.error("Browser is not supported!", 200, false);
  } else {
    // Specifies shadow opacity, color and offset
    mxConstants.SHADOW_OPACITY = 0.5;
    mxConstants.SHADOWCOLOR = "#C0C0C0";
    mxConstants.SHADOW_OFFSET_X = 5;
    mxConstants.SHADOW_OFFSET_Y = 6;

    // Table icon dimensions and position
    mxSwimlane.prototype.imageSize = 20;
    mxSwimlane.prototype.imageDx = 16;
    mxSwimlane.prototype.imageDy = 4;

    // Changes swimlane icon bounds
    mxSwimlane.prototype.getImageBounds = function (x, y, w, h) {
      return new mxRectangle(
        x + this.imageDx,
        y + this.imageDy,
        this.imageSize,
        this.imageSize
      );
    };

    // Defines an icon for creating new connections in the connection handler.
    // This will automatically disable the highlighting of the source vertex.
    mxConnectionHandler.prototype.connectImage = new mxImage(
      mxBasePath + "/images/relation-one-to-one-or-many-icon.png",
      20,
      20
    );

    // Prefetches all images that appear in colums
    // to avoid problems with the auto-layout
    var keyImage = new Image();
    keyImage.src = mxBasePath + "/images/key.png";

    var plusImage = new Image();
    plusImage.src = mxBasePath + "/images/plus.png";

    var checkImage = new Image();
    checkImage.src = mxBasePath + "/images/check.png";

    // Workaround for Internet Explorer ignoring certain CSS directives
    if (mxClient.IS_QUIRKS) {
      document.body.style.overflow = "hidden";
      new mxDivResizer(container);
      // new mxDivResizer(outline);
      new mxDivResizer(toolbar);
      new mxDivResizer(sidebar);
      // new mxDivResizer(status);
    }

    // Creates the graph inside the given container. The
    // editor is used to create certain functionality for the
    // graph, such as the rubberband selection, but most parts
    // of the UI are custom in this example.
    editor = new mxEditor();
    graph = editor.graph;
    model = graph.model;

    // Disables some global features
    graph.setConnectable(true);
    graph.setCellsDisconnectable(false);
    graph.setCellsCloneable(true);
    graph.swimlaneNesting = false;
    graph.dropEnabled = true;

    // Does not allow dangling edges
    graph.setAllowDanglingEdges(false);

    // Forces use of default edge in mxConnectionHandler
    graph.connectionHandler.factoryMethod = null;

    // Only tables are resizable
    graph.isCellResizable = function (cell) {
      // return this.isSwimlane(cell);
    };

    // Only tables are movable
    graph.isCellMovable = function (cell) {
      return this.isSwimlane(cell);
    };

    // Sets the graph container and configures the editor
    editor.setGraphContainer(container);
    var config = mxUtils
      .load(mxBasePath + "/editors/config/keyhandler-minimal.xml")
      .getDocumentElement();
    editor.configure(config);

    // Configures the automatic layout for the table columns
    editor.layoutSwimlanes = true;
    editor.createSwimlaneLayout = function () {
      var layout = new mxStackLayout(this.graph, false);
      layout.fill = true;
      layout.resizeParent = true;

      // Overrides the function to always return true
      layout.isVertexMovable = function (cell) {
        return true;
      };

      return layout;
    };

    // Text label changes will go into the name field of the user object
    graph.model.valueForCellChanged = function (cell, value) {
      if (value.name != null) {
        return mxGraphModel.prototype.valueForCellChanged.apply(
          this,
          arguments
        );
      } else {
        var old = cell.value.name;
        cell.value.name = value;
        return old;
      }
    };

    // Columns are dynamically created HTML labels
    graph.isHtmlLabel = function (cell) {
      return !this.isSwimlane(cell) && !this.model.isEdge(cell);
    };

    // Edges are not editable
    graph.isCellEditable = function (cell) {
      return !this.model.isEdge(cell);
    };

    // Returns the name field of the user object for the label
    graph.convertValueToString = function (cell) {
      if (cell.value != null && cell.value.name != null) {
        return cell.value.name;
      }

      return mxGraph.prototype.convertValueToString.apply(this, arguments); // "supercall"
    };

    // // Returns the type as the tooltip for column cells
    graph.getTooltip = function (state) {
      // let tmpSelectCell= editor.graph.getSelectionCell();
      if (this.isHtmlLabel(state.cell)) {
        return "Type: " + state.cell.value.type;
      } else if (this.model.isEdge(state.cell)) {
        var source = this.model.getTerminal(state.cell, true);
        var parent = this.model.getParent(source);
        // return parent.value.name + "." + source.value.name;
        return null;
      }

      return mxGraph.prototype.getTooltip.apply(this, arguments); // "supercall"
    };

    // Creates a dynamic HTML label for column fields
    graph.getLabel = function (cell) {
      if (cell.style == "table") {
        TABLE_NAME = getIdByTableLabel(cell.value.name);
      }
      // getIdByTableLabelFA(cell.value.name);
      //create checkbox
      if (this.isHtmlLabel(cell)) {
        var label = "";
        LABEL_GRAPH = [];
        LABEL_GRAPH = graph;
        let itemId = TABLE_NAME + "-" + cell.value.defaultValue;
        label +=
          '<input type="checkbox" id="Chk_' +
          itemId +
          '" name="Chk_' +
          itemId +
          '" class="CheckClass"/>&nbsp;';

        if (cell.value.primaryKey) {
          label += `<img title="Primary Key" src="${mxBasePath}/images/key.png" width="16" height="16" align="top">&nbsp;`;
        } else {
          label += `<img src="${mxBasePath}/images/spacer.gif" width="16" height="1">&nbsp;`;
        }
        let tmpColCell = cell.value.name;
        let tmpTableCell = cell.parent.value;
        let resTableEn = getIdByTableLabel(tmpTableCell.name);
        let tmpColumnLabel = "";
        if (_Lang === "Fa") {
          tmpColumnLabel = getIdByColName(resTableEn, tmpColCell);
          return `<div class="div_Item">${label}<label id="Lbl_${itemId}" > ${mxUtils.htmlEntities(
            tmpColumnLabel,
            false
          )}</label></div>`;
        } else {
          return `<div class="div_Item">${label}<label id="Lbl_${itemId}" > ${mxUtils.htmlEntities(
            tmpColCell,
            false
          )}</label></div>`;
        }
      }
      //  tmpGraph.getModel().endUpdate();
      return mxGraph.prototype.getLabel.apply(this, arguments); // "supercall"
    };

    // Removes the source vertex if edges are removed
    graph.addListener(mxEvent.REMOVE_CELLS, function (sender, evt) {
      let parentTable = "";
      let boolTable = false;
      var cells = evt.getProperty("cells");
      for (var i = 0; i < cells.length; i++) {
        parentTable = "";
        var cell = cells[i];
        if (cell.style == "table") {
          boolTable = tableNameRemove(cell.value.name);
        } else if (cell.value != null) {
          break;
        } else {
          if (this.model.isEdge(cell)) {
            var terminal = this.model.getTerminal(cell, true);
            var parent = this.model.getParent(terminal);
            // مورد انتخاب شده ارتباط هستش
            if (cell.value == undefined || cell.value == null) {
            }
            if (cell.style == null || cell.style == undefined) {
              //حذف ارتباط بین جدول اتفاق افتاده
              //اینجا باید اسم جدول و ستون جستجو و از آرایه ی ارتباطات حذف بشن
              if (
                (cell.target.parent.value.name,
                cell.target.value.name,
                cell.source.parent.value.name,
                cell.source.value.name)
              ) {
                let tmpResaultDel = relationDelete(
                  cell.target.parent.value.name,
                  cell.target.value.name,
                  cell.source.parent.value.name,
                  cell.source.value.name
                );
              }
            }
          }
        }
      }
      //برای محکم کاری صحت آرایه ارتباط
      // جستجو بزنم روی آرایه ارتباط و ببینم که اگه اسم جدول در آرایه جداول وجود ندارد اون ریلیشن رو حذف کن
      for (let i = 0; i < SELECT_JOINS.length; i++) {
        let sourceTbl = SELECT_JOINS[i].SourceTable;
        let targetTbl = SELECT_JOINS[i].DestTable;
        tmpIsTable = tableTrust(sourceTbl, targetTbl);
        if (!tmpIsTable) {
          SELECT_JOINS.splice(i, 1);
          SELECT_JOINS_En.splice(i, 1);
        }
      }
    });

    // Disables drag-and-drop into non-swimlanes.
    graph.isValidDropTarget = function (cell, cells, evt) {
      return this.isSwimlane(cell);
    };

    // Installs a popupmenu handler using local function (see below).
    graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
      createPopupMenu(editor, graph, menu, cell, evt);
    };

    // Adds all required styles to the graph (see below)
    configureStylesheet(graph);

    //-Start------------------------------------------------دادن اسم جدول
    // Adds sidebar icon for the table object
    $(`#DataProcess`).after(
      `<div class="sideBarChild" id="DataProcessChild"></div>`
    );
    for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
      var tableObject = Object;
      if (_Lang === "Fa") {
        tableObject = new Table(JSON_DATA.RefTables[index].Label);
      } else {
        tableObject = new Table(JSON_DATA.RefTables[index].Name);
      }
      var table = new mxCell(
        tableObject,
        new mxGeometry(0, 0, 200, 28),
        "table"
      );

      table.setConnectable(false);
      table.setVertex(true);
      if (_Lang === "Fa") {
        table.value.name = JSON_DATA.RefTables[index].Label;
      } else {
        table.value.name = JSON_DATA.RefTables[index].Name;
      }
      COLUMN_ID = JSON_DATA.RefTables[index].Columns[0].Name;
      addSidebarIcon(graph, sidebar, table, index);
      // addSidebarIcon(graph, sidebar, table, "images/icons48/table.png");
      // Adds sidebar icon for the column object
      var columnObject = new Column("COLUMNNAME");
      var column = new mxCell(columnObject, new mxGeometry(0, 0, 0, 26));
      column.setVertex(true);
      column.setConnectable(true);
      // Adds primary key field into table
      for (let i = 0; i < JSON_DATA.RefTables[index].Columns.length; i++) {
        let firstColumn = column.clone();
        firstColumn.value.type = JSON_DATA.RefTables[index].Columns[i].Type;
        firstColumn.value.name = JSON_DATA.RefTables[index].Columns[i].Name;
        firstColumn.value.defaultValue =
          JSON_DATA.RefTables[index].Columns[i].ID;
        if (i == 0) {
          firstColumn.value.primaryKey = true;
          firstColumn.value.autoIncrement = true;
        } else {
          firstColumn.value.primaryKey = false;
          firstColumn.value.autoIncrement = false;
        }
        table.insert(firstColumn);
      }
    }
    //-END------------------------------------------------دادن اسم جدول
    // Adds child columns for new connections between tables
    graph.addEdge = function (edge, parent, source, target, index) {
      let tableSource = "";
      let columnSource = "";
      let tableTarget = "";
      let columnTarget = "";
      if (source.parent.value.name) tableSource = source.parent.value.name;
      if (source.value.name) columnSource = source.value.name;
      if (target.parent.value.name) tableTarget = target.parent.value.name;
      if (target.value.name) columnTarget = target.value.name;

      if (tableSource && columnSource && tableTarget && columnTarget) {
        let tmpIsTable = false;
        tmpIsTable = tableTrust(tableSource, tableTarget);
        if (tmpIsTable) {
          SELECT_JOINS.push({
            SourceTable: tableSource,
            SourceColumn: getIdByColName(tableSource, columnSource),
            SourceTableOrginal: getTblOrgNameByTableName(tableSource),
            DestTable: tableTarget,
            DestColumn: getIdByColName(tableTarget, columnTarget),
            DestTableOrginal: getTblOrgNameByTableName(tableTarget),
            Type: source.value.type,
            JoinType: JOIN_TYPE,
          });

          SELECT_JOINS_En.push({
            SourceTable: getIdByTableLabel(tableSource),
            SourceColumn: columnSource,
            SourceTableOrginal: getTblOrgNameByTableName(tableSource),
            DestTable: getIdByTableLabel(tableTarget),
            DestColumn: columnTarget,
            DestTableOrginal: getTblOrgNameByTableName(tableTarget),
            Type: source.value.type,
            JoinType: JOIN_TYPE,
          });

          // break;
        }
      }
      this.model.beginUpdate();
      try {
        return mxGraph.prototype.addEdge.apply(this, arguments); // "supercall"
      } finally {
        this.model.endUpdate();
      }
      return null;
    };

    // Creates a new DIV that is used as a toolbar and adds
    // toolbar buttons.
    var spacer = document.createElement("div");
    spacer.style.display = "inline";
    spacer.style.padding = "8px";

    // Defines export XML action
    editor.addAction("export", function (editor, cell) {
      var textarea = document.createElement("textarea");
      textarea.style.width = "400px";
      textarea.style.height = "400px";
      var enc = new mxCodec(mxUtils.createXmlDocument());
      var node = enc.encode(editor.graph.getModel());
      textarea.value = mxUtils.getPrettyXml(node);
      showModalWindow("XML", textarea, 410, 440);
    });

    // Creates the outline (navigator, overview) for moving
    // around the graph in the top, right corner of the window.
    // var outln = new mxOutline(graph, outline);

    // Fades-out the splash screen after the UI has been loaded.
    var splash = document.getElementById("splash");
    if (splash != null) {
      try {
        mxEvent.release(splash);
        mxEffects.fadeOut(splash, 100, true);
      } catch (e) {
        // mxUtils is not available (library not loaded)
        splash.parentNode.removeChild(splash);
      }
    }
  }
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

function showModalWindow(title, content, width, height) {
  var background = document.createElement("div");
  background.style.position = "absolute";
  background.style.left = "0px";
  background.style.top = "0px";
  background.style.right = "0px";
  background.style.bottom = "0px";
  background.style.background = "black";
  mxUtils.setOpacity(background, 50);
  document.body.appendChild(background);

  if (mxClient.IS_QUIRKS) {
    new mxDivResizer(background);
  }

  var x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
  var y = Math.max(
    10,
    (document.body.scrollHeight || document.documentElement.scrollHeight) / 2 -
      (height * 2) / 3
  );
  var wnd = new mxWindow(title, content, x, y, width, height, false, true);
  wnd.setClosable(true);

  // Fades the background out after after the window has been closed
  wnd.addListener(mxEvent.DESTROY, function (evt) {
    mxEffects.fadeOut(background, 50, true, 10, 30, true);
  });

  wnd.setVisible(true);
  return wnd;
}

function modalWindowExecute(title, content, width, height) {
  var background = document.createElement("div");
  background.style.position = "absolute";
  background.style.left = "0px";
  background.style.top = "0px";
  background.style.right = "0px";
  background.style.bottom = "0px";
  background.style.background = "black";
  mxUtils.setOpacity(background, 50);
  document.body.appendChild(background);

  if (mxClient.IS_QUIRKS) {
    new mxDivResizer(background);
  }

  var x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
  var y = Math.max(
    10,
    (document.body.scrollHeight || document.documentElement.scrollHeight) / 2 -
      (height * 2) / 3
  );
  var wnd = new mxWindow(title, content, x, y, width, height, false, true);
  wnd.setClosable(true);

  // Fades the background out after after the window has been closed
  wnd.addListener(mxEvent.DESTROY, function (evt) {
    mxEffects.fadeOut(background, 50, true, 10, 30, true);
  });

  wnd.setVisible(true);

  return wnd;
}

function addSidebarIcon(graph, sidebar, prototype, index) {
  var sidebarElement = "";

  sidebarElement = document.createElement("div");
  sidebarElement.setAttribute("id", "dataProcess" + index);
  sidebarElement.className = "DataProcessElement";
  sidebarElement.style =
    "display: flex;align-items: center;height: 35px;direction:rtl";

  let img = document.createElement("img");
  img.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABsklEQVR4nO2czW3DMAxGdeoeYm7doOlwPbVp6UyVoht0BIdrpHCbAEEOjR0qtn7eA3SQIRDSJ5GgTEAhAAAAAAAAZMvjy/dD7OxDdG/S2aHStpfONsNakwsY1d4zWOBhlqb2llzA4+4cVto/uW2pfUpnuzQzS2dvte3Xp5MYUnPanVA5cq91IuAMAka1r8GdrtnKedyiJ1BGxqKcx+HCThCwJAHjRUy51p/6fQl7swooFzHlWn/q9yXs4cJOELBkAWPG+d3YceSB/0AeOAPEwBYEjCNj1hL2ihBQMv0fOIuAUzL7WGL/7gJOyOylzH7+LhyJgc7N0IZjYKgcQUAfVd2Fm8sDJXENY/TciIH5QAxsuSbSXAyUxDWMm+dGDMwHYqAT8kAn5IFOcGEnCNiCgJE80LkZ2nAeuHjNQqmJ7DKrgVATiaXehW+l6RgYKkcQ0Ad3YSfchZ3gwk4Q0Ak1ESfURJzgwk4Q0Al5oBPyQCe4sBMEzFjAv2dPtv261pqI6P55WGNU69PM7Nx4Z5skj9p0BTS11+QCDs8hHUX8PYk1tqjWD+Ld5eknAAAAAACAkIofa1SbRAJI1ikAAAAASUVORK5CYII=";
  img.style = "height:20px;width:20px;";
  sidebarElement.appendChild(img);

  let p = document.createElement("p");
  p.style = "margin:0px 5px";
  p.innerHTML = prototype.value.name;
  sidebarElement.appendChild(p);
  // Function that is executed when the image is dropped on
  // the graph. The cell argument points to the cell under
  // the mousepointer if there is one.
  var funct = function (graph, evt, cell) {
    let boolExistTable = false;
    for (let i = 0; i < SELECT_TABLES.length; i++) {
      if (prototype.value.name == SELECT_TABLES[i]) {
        boolExistTable = true;
        break;
      }
    }
    if (!boolExistTable) {
      graph.stopEditing(false);

      var pt = graph.getPointForEvent(evt);

      var parent = graph.getDefaultParent();
      var model = graph.getModel();

      var isTable = graph.isSwimlane(prototype);
      var name = null;
      if (!isTable) {
        parent = cell;
        var pstate = graph.getView().getState(parent);
        if (parent == null || pstate == null) {
          mxUtils.alert("Drop target must be a table");
          return;
        }

        pt.x -= pstate.x;
        pt.y -= pstate.y;

        var columnCount = graph.model.getChildCount(parent) + 1;
        name = mxUtils.prompt(
          "Enter name for new column",
          "COLUMN" + columnCount
        );
      } else {
        var tableCount = 0;
        var childCount = graph.model.getChildCount(parent);
        for (var i = 0; i < childCount; i++) {
          if (!graph.model.isEdge(graph.model.getChildAt(parent, i))) {
            tableCount++;
          }
        }
        var name = prototype.value.name;
      }

      if (name != null) {
        var v1 = model.cloneCell(prototype);

        model.beginUpdate();
        try {
          v1.value.name = name;
          v1.geometry.x = pt.x;
          v1.geometry.y = pt.y;

          graph.addCell(v1, parent);
          //create table
          if (isTable) {
            v1.geometry.alternateBounds = new mxRectangle(
              0,
              0,
              v1.geometry.width,
              v1.geometry.height
            );
            //  H_
            if (_Lang === "Fa") {
              v1.children[0].value.name = setIdByTableLabel(name);
            } else {
              v1.children[0].value.name = setIdByTableName(name);
            }
            tableNameSave(name);
          }
        } finally {
          model.endUpdate();
        }
        graph.setSelectionCell(v1);
      }
    }
  };

  document.getElementById("DataProcessChild").appendChild(sidebarElement);
  var dragImage = sidebarElement.cloneNode(true);
  var ds = mxUtils.makeDraggable(sidebarElement, graph, funct, dragImage);
  // Creates the image which is used as the drag icon (preview)
  // var dragImage = img.cloneNode(true);
  // var ds = mxUtils.makeDraggable(img, graph, funct, dragImage);

  // Adds highlight of target tables for columns
  ds.highlightDropTargets = true;
  ds.getDropTarget = function (graph, x, y) {
    if (graph.isSwimlane(prototype)) {
      return null;
    } else {
      var cell = graph.getCellAt(x, y); //todo
      if (graph.isSwimlane(cell)) {
        return cell;
      } else {
        var parent = graph.getModel().getParent(cell);
        if (graph.isSwimlane(parent)) {
          return parent;
        }
      }
    }
  };
}

function startdrag(ev) {
  ev.dataTransfer.setData("Text", ev.target.id);
}

function dragging(ev) {
  document.getElementById("JSON_DATA").innerHTML =
    "The p element is being dragged";
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("Text");
  ev.target.appendChild(document.getElementById(data));
  document.getElementById("JSON_DATA").innerHTML = "The p element was dropped";
}

function columnConnection(graph, sidebar, prototype, image) {
  var tmplabel = document.createElement("label");
  tmplabel.innerHTML = prototype.value.name;
  let cell = graph.getSelectionCell();
  let evt = window.event;
  // Function that is executed when the image is dropped on
  // the graph. The cell argument points to the cell under
  // the mousepointer if there is one.
  var functLable = function (graph, evt, cell) {
    let boolExistTable = false;
    for (let i = 0; i < SELECT_TABLES.length; i++) {
      if (prototype.value.name == SELECT_TABLES[i]) {
        boolExistTable = true;
        break;
      }
    }
    if (!boolExistTable) {
      graph.stopEditing(false);

      var pt = graph.getPointForEvent(evt);

      var parent = graph.getDefaultParent();
      var model = graph.getModel();

      var isTable = graph.isSwimlane(prototype);
      var name = null;

      parent = cell;
      var pstate = graph.getView().getState(parent);
      if (parent == null || pstate == null) {
        mxUtils.alert("Drop target must be a table");
        return;
      }

      pt.x -= pstate.x;
      pt.y -= pstate.y;

      var columnCount = graph.model.getChildCount(parent) + 1;
      name = mxUtils.prompt(
        "Enter name for new column",
        "COLUMN" + columnCount
      );
    } else {
      var tableCount = 0;
      var childCount = graph.model.getChildCount(parent);

      for (var i = 0; i < childCount; i++) {
        if (!graph.model.isEdge(graph.model.getChildAt(parent, i))) {
          tableCount++;
        }
      }
      // H
      var name = prototype.value.name;
    }

    if (name != null) {
      var v1 = model.cloneCell(prototype);

      model.beginUpdate();
      try {
        v1.value.name = name;
        v1.geometry.x = pt.x;
        v1.geometry.y = pt.y;

        graph.addCell(v1, parent);

        if (isTable) {
          v1.geometry.alternateBounds = new mxRectangle(
            0,
            0,
            v1.geometry.width,
            v1.geometry.height
          );
          //  H_
          if (_Lang === "Fa") {
            v1.children[0].value.name = setIdByTableLabel(name);
          } else {
            v1.children[0].value.name = setIdByTableName(name);
          }
          tableNameSave(name);
        }
      } finally {
        model.endUpdate();
      }
      graph.setSelectionCell(v1);
    }
  };

  // sidebar.appendChild(sidebarElement);
  let dragImage1 = tmplabel.cloneNode(true);
  let ds1 = mxUtils.makeDraggable(tmplabel, graph, functLable, dragImage1);
  // Creates the image which is used as the drag icon (preview)
  // var dragImage = img.cloneNode(true);
  // var ds = mxUtils.makeDraggable(img, graph, funct, dragImage);

  // Adds highlight of target tables for columns
  ds1.highlightDropTargets = true;
  ds1.getDropTarget = function (graph, x, y) {
    if (graph.isSwimlane(prototype)) {
      return null;
    } else {
      var cell = graph.getCellAt(x, y);
      if (graph.isSwimlane(cell)) {
        return cell;
      } else {
        var parent = graph.getModel().getParent(cell);
        if (graph.isSwimlane(parent)) {
          return parent;
        }
      }
    }
  };
}

function configureStylesheet(graph) {
  var style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  // style[mxConstants.STYLE_FONTCOLOR] = "#000000";
  style[mxConstants.STYLE_FONTSIZE] = "11";
  style[mxConstants.STYLE_FONTSTYLE] = 0;
  style[mxConstants.STYLE_SPACING_LEFT] = "4";
  style[mxConstants.STYLE_IMAGE_WIDTH] = "48";
  style[mxConstants.STYLE_IMAGE_HEIGHT] = "48";
  graph.getStylesheet().putDefaultVertexStyle(style);

  style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
  style[mxConstants.STYLE_GRADIENTCOLOR] = "#41B9F5";
  style[mxConstants.STYLE_FILLCOLOR] = "#8CCDF5";
  style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = "#ffffff";
  style[mxConstants.STYLE_STROKECOLOR] = "#1B78C8";
  style[mxConstants.STYLE_FONTCOLOR] = "#000000";
  style[mxConstants.STYLE_STROKEWIDTH] = "2";
  style[mxConstants.STYLE_STARTSIZE] = "28";
  style[mxConstants.STYLE_VERTICAL_ALIGN] = "middle";
  style[mxConstants.STYLE_FONTSIZE] = "12";
  style[mxConstants.STYLE_FONTSTYLE] = 1;
  style[mxConstants.STYLE_IMAGE] = mxBasePath + "/images/icons48/table.png";
  style[mxConstants.STYLE_SHADOW] = 1;
  graph.getStylesheet().putCellStyle("table", style);

  style = graph.stylesheet.getDefaultEdgeStyle();
  style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "#FFFFFF";
  style[mxConstants.STYLE_STROKEWIDTH] = "2";
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
}

// Function to create the entries in the popupmenu
function createPopupMenu(editor, graph, menu, cell, evt) {
  if (cell != null && cell.parent.style != "table") {
    if (graph.isHtmlLabel(cell)) {
      // menu.addItem("Properties",mxBasePath+ "/editors/images/properties.gif", function () {
      //   editor.execute("properties", cell);
      // });
      // menu.addSeparator();
    }
    menu.addItem(
      `${queryResources.get("Delete")}`,
      mxBasePath + "/images/delete2.png",
      function () {
        editor.execute("delete", cell);
      }
    );

    // menu.addSeparator();

    // menu.addItem("Undo", mxBasePath + "/images/undo.png", function () {
    //   editor.execute("undo", cell);
    // });

    // menu.addItem("Redo", mxBasePath + "/images/redo.png", function () {
    //   editor.execute("redo", cell);
    // });
    // menu.addSeparator();

    // menu.addItem("Show SQL", mxBasePath + "/images/export1.png", function () {
    //   editor.execute("showSql", cell);
    // });
  }
}

function createSql(graph) {
  var sql = [];
  var parent = graph.getDefaultParent();
  var childCount = graph.model.getChildCount(parent);

  for (var i = 0; i < childCount; i++) {
    var child = graph.model.getChildAt(parent, i);

    if (!graph.model.isEdge(child)) {
      sql.push("CREATE TABLE IF NOT EXISTS " + child.value.name + " (");

      var columnCount = graph.model.getChildCount(child);

      if (columnCount > 0) {
        for (var j = 0; j < columnCount; j++) {
          var column = graph.model.getChildAt(child, j).value;
          sql.push("\n    " + column.name + " " + column.type);
          if (column.notNull) {
            sql.push(" NOT NULL");
          }

          if (column.primaryKey) {
            sql.push(" PRIMARY KEY");
          }

          if (column.autoIncrement) {
            sql.push(" AUTOINCREMENT");
          }

          if (column.unique) {
            sql.push(" UNIQUE");
          }

          if (column.defaultValue != null) {
            sql.push(" DEFAULT " + column.defaultValue);
          }

          sql.push(",");
        }

        sql.splice(sql.length - 1, 1);
        sql.push("\n);");
      }

      sql.push("\n");
    }
  }

  return sql.join("");
}

//ایجاد دستور تی اسکیوال جهت نمایش خروجی
function createT_Sql(graph) {
  //جای سورس و تارگت عوض بشه
  let selectJoin = [];
  var sql = [];
  var parent = graph.getDefaultParent();
  var childCount = graph.model.getChildCount(parent);
  let sqlRes = "";
  let tmpParentTbl = "";
  let tblName = "";
  let finalArray =[];
  if (SELECT_JOINS_En.length > 0) selectJoin.push(...SELECT_JOINS_En);
  if (SELECT_COLUMNS_En.length > 0) {
    for (let index = 0; index < SELECT_COLUMNS_En.length; index++) {
      let colName = "";
      if (SELECT_COLUMNS_En[index].Table) {
        tblName = SELECT_COLUMNS_En[index].Table;
        if (SELECT_COLUMNS_En[index].Column) {
          colName = SELECT_COLUMNS_En[index].Column;
          if (index == 0) {
            sql.push("SELECT    ");
          } else {
            sql.push("   ");
          }
          sql.push(getTblOrgNameByTableName(tblName) + "." + colName);
        }
      }

      if (index + 1 < SELECT_COLUMNS_En.length) sql.push(", \n");
    }
    sql.push("    FROM ");
    if (selectJoin.length > 0) {
      let parentValue = [];
      for (let index = 0; index < selectJoin.length; index++) {
        tmpParentTbl = selectJoin[index].SourceTable;
        if (tmpParentTbl) {
          parentValue.push(tmpParentTbl);
        }
      }

      if (parentValue.length === 1) {
        sql.push(
          " " +
            getTblOrgNameByTableName(parentValue[0]) +
            "\n" +
            JOIN_TYPE +
            " " +
            getTblOrgNameByTableName(selectJoin[0].DestTable) +
            "\n    ON " +
            getTblOrgNameByTableName(selectJoin[0].SourceTable) +
            "." +
            selectJoin[0].SourceColumn +
            " = " +
            getTblOrgNameByTableName(selectJoin[0].DestTable) +
            "." +
            selectJoin[0].DestColumn
        );
      } else if (parentValue.length > 1) {
        let repeatParentTables = SearchMaxDuplicate(parentValue);
        if (repeatParentTables.length == 0) {
          //اینجا حالتیه که حداقل 2 تا ارتباط داره و جداول والدش تکراری نیست
          let tmpResaultStr = uniqueParent(parentValue, selectJoin, sql);
          if (tmpResaultStr) {
            sql = tmpResaultStr;
          }
        } else if (repeatParentTables.length == 1) {
          //اینجا حالتیه که حداقل 2 تا ارتباط داره و جداول والدش یه دونست و تکراری هست
          //اینجا جداول والد تکراری رو گرفتم، حالا باید جوینشو بصورت رشته ای ، در خروجی بسازم و نمایش بدم

          //*-*-*-*-*-*-*-**--*-*-*-*-*-**-*--*-*-*-*-*-*-*جدید_شروع
          let ResultArray = rootFinder(selectJoin);
          selectJoin.unshift(...ResultArray);
          let tmpDestTblRoot = ResultArray[0].DestTable;
          let tmpSourceTblRoot = ResultArray[0].SourceTable;
          //حذف مقادیر تکراری
          finalArray =deleteRepeatJoin(selectJoin) 
          selectJoin = finalArray;
          parentValue = [];
          selectJoin.map(function (elem) {
            parentValue.push(elem.SourceTable);
          });
          //*-*-*-*-*-*-*-**--*-*-*-*-*-**-*--*-*-*-*-*-*-*جدید_پایان
          let tmpResaultStr = uniqueRepeatParent(parentValue, selectJoin, sql);
          if (tmpResaultStr) {
            sql = tmpResaultStr;
          }
        } else {
          //اینجا حالتیه که حداقل 2 تا ارتباط داره و جداول والد تکراریش چنتا هست
          let tmpselectJoin = [...selectJoin];
          let ResultArray = rootFinder(tmpselectJoin);
          let tmpDestTblRoot = "";
          let tmpSourceTblRoot = "";
          let tmpDestColRoot = "";
          let tmpSourceColRoot = "";
          let newFinalArray = [];
          let singleRoot = false;
          //باید بگم اگر والد یکی بود ٍ جدول مقصد رو به عنوان شی بعدی در آرایه قرار بده
          if (ResultArray.length === 1) {
            tmpDestTblRoot = ResultArray[0].DestTable;
            tmpSourceTblRoot = ResultArray[0].SourceTable;
            tmpDestColRoot = ResultArray[0].DestColumn;
            tmpSourceColRoot = ResultArray[0].SourceColumn;
            singleRoot = true;
          } else {
            singleRoot = false;
          }
          tmpselectJoin.unshift(...ResultArray);
          //حذف مقادیر تکراری
          finalArray = deleteRepeatJoin(tmpselectJoin);
          if (singleRoot) {
            finalArray?.map((elem) => {
              if (
                elem.SourceTable == tmpSourceTblRoot &&
                elem.DestTable == tmpDestTblRoot &&
                elem.SourceColumn == tmpSourceColRoot &&
                elem.DestColumn == tmpDestColRoot
              ) {
                //در اینجا می خوام یه تابعی رو کال کنم که مرتب سازی مسیر جداول رو انجام بده
                newFinalArray = sortSelectJoin(finalArray);
                newFinalArray = [
                  ...addAfterMatchingSource(
                    newFinalArray,
                    newFinalArray[newFinalArray.length - 1]
                  ),
                ];
                finalArray = [...deleteRepeatJoin(newFinalArray)];
              }
            });
          }
          selectJoin = finalArray;
          parentValue = [];
          selectJoin.map(function (elem) {
            parentValue.push(elem.SourceTable);
          });
          let tmpResaultStr = uniqueRepeatParents(parentValue, selectJoin, sql);
          if (tmpResaultStr) {
            sql = tmpResaultStr;
          }
        }
      }
    } else if (selectJoin.length == 0) {
      let selectedTable = [];
      let boolExistTable = false;
      for (let index = 0; index < SELECT_COLUMNS_En.length; index++) {
        for (let item = 0; item < selectedTable.length; item++) {
          if (selectedTable[item] == SELECT_COLUMNS_En[index].Table) {
            boolExistTable = true;
            break;
          }
        }
        if (!boolExistTable) {
          selectedTable.push(SELECT_COLUMNS_En[index].Table);
        }
      }
      for (let index = 0; index < selectedTable.length; index++) {
        if (SELECT_COLUMNS_En[index].Table) {
          tblName = SELECT_COLUMNS_En[index].Table;
          sql.push(" " + getTableNameByName(tblName));
        }
        if (index + 1 < selectedTable.length) sql.push(" CROSS JOIN ");
      }
    }
    SQL_RESULT = sql.join("").split("\n").join(" ");
  }
  return sql.join("");
}

function SearchMaxDuplicate(listArray) {
  let repeatNames = [];
  let repeatCount = 0;

  for (let i = 0; i < listArray.length; i++) {
    let count = 0;
    for (let k = 0; k < listArray.length; k++) {
      let Atest = listArray[k];
      let Btest = listArray[i];
      if (listArray[i] == listArray[k]) {
        count++;
      }
    }

    if (count > 1) {
      if (repeatNames.length == 0) {
        let Ctest = listArray[i] + ":" + count;
        repeatNames.push({ id: listArray[i], count: count });
        repeatCount += count;
      } else {
        let boolExistTable = false;
        for (let index = 0; index < repeatNames.length; index++) {
          if (repeatNames[index].id == listArray[i]) {
            boolExistTable = true;
          }
        }
        if (!boolExistTable) {
          let Ctest = listArray[i] + ":" + count;
          repeatNames.push({ id: listArray[i], count: count });
          repeatCount += count;
        }
      }
    }
  }
  return repeatNames;
}

// Defines the column user object
function Column(name) {
  this.name = name;
  this.QuryDel = false;
}

Column.prototype.type = "TEXT";

Column.prototype.defaultValue = null;

Column.prototype.primaryKey = false;

Column.prototype.autoIncrement = false;

Column.prototype.notNull = false;

Column.prototype.unique = false;

Column.prototype.clone = function () {
  return mxUtils.clone(this);
};

// Defines the table user object
function Table(name) {
  this.name = name;
}

Table.prototype.clone = function () {
  return mxUtils.clone(this);
};

//اسم جدول مورد نظر را بررسی می کند
function tableTrust(sourceValue, targetValue) {
  let boolSourceTable = false;
  let boolTargetTable = false;
  for (let index = 0; index < SELECT_TABLES.length; index++) {
    if (SELECT_TABLES[index] == sourceValue) {
      boolSourceTable = true;
      break;
    }
  }
  for (let index = 0; index < SELECT_TABLES.length; index++) {
    if (SELECT_TABLES[index] == targetValue) {
      boolTargetTable = true;
      break;
    }
  }

  if (boolSourceTable && boolTargetTable) {
    return true;
  } else {
    return false;
  }
}

// برچسب جدول را گرفته و شناسه ی جدول مورد نظر را بر می گرداند
function setIdByTableLabel(tableName) {
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    if (JSON_DATA.RefTables[index].Label === tableName) {
      return JSON_DATA.RefTables[index].Columns[0].Name;
    } else if (JSON_DATA.RefTables[index].Name === tableName) {
      return JSON_DATA.RefTables[index].Columns[0].Name;
    }
  }
}

// نام جدول را گرفته و شناسه ی جدول مورد نظر را بر می گرداند
function setIdByTableName(tableName) {
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    if (JSON_DATA.RefTables[index].Name === tableName) {
      return JSON_DATA.RefTables[index].Columns[0].Name;
    }
  }
}

//ذخیره ی جدول به آرایه ی جداول موجود
function tableNameSave(tableName) {
  let boolExist = false;
  for (let index = 0; index < SELECT_TABLES.length; index++) {
    if (SELECT_TABLES[index] == tableName) {
      boolExist = true;
      break;
    }
  }
  if (!boolExist) {
    SELECT_TABLES.push(tableName);
    let tmptblName = getIdByTableLabel(tableName);
    SELECT_TABLES_En.push(tmptblName);
    TABLES_ORGINAL_NAME.push(getTblOrgNameByTableName(tmptblName));
  }
}

//حذف جدول انتخابی ازآرایه ی جداول موجود
function tableNameRemove(tableName) {
  let boolExist = false;
  for (let index = 0; index < SELECT_TABLES.length; index++) {
    if (SELECT_TABLES[index] == tableName) {
      boolExist = true;
      SELECT_TABLES.splice(index, 1);
      SELECT_TABLES_En.splice(index, 1);
      TABLES_ORGINAL_NAME.splice(index, 1);
      break;
    }
  }
  return boolExist;
}

//حذف ریلیشن انتخابی ازآرایه ی ریلیشن موجود
function relationDelete(
  parentTableName,
  parentColumnName,
  childTableName,
  childColumnName
) {
  // Source=child
  // Dest=parent
  let boolExist = false;
  for (let index = 0; index < SELECT_JOINS.length; index++) {
    if (
      SELECT_JOINS[index].DestTable == parentTableName &&
      SELECT_JOINS[index].SourceTable == childTableName
    ) {
      if (SELECT_JOINS[index].SourceColumn == childColumnName) {
        if (SELECT_JOINS[index].DestColumn == parentColumnName) {
          boolExist = true;
          SELECT_JOINS.splice(index, 1);
          SELECT_JOINS_En.splice(index, 1);
          break;
        }
      }
    }
  }
  return boolExist;
}

//حذف ریلیشن انتخابی ازآرایه ی ریلیشن موجود
function relationRemove(tableName, columnName) {
  let boolExist = false;
  for (let index = 0; index < SELECT_JOINS.length; index++) {
    if (SELECT_JOINS[index].DestTable == tableName) {
      if (SELECT_JOINS[index].SourceColumn == columnName) {
        if (SELECT_JOINS[index].DestColumn == columnName) {
          boolExist = true;
          SELECT_JOINS.splice(index, 1);
          SELECT_JOINS_En.splice(index, 1);
          break;
        }
      }
    }
  }
}

// موقع حذف ریلیشن جدول والد رو بر می گردونه
function findParent(cell) {
  let tmpRes = "";
  let tmpCell = "";
  if (cell.source.style && cell.source.style == "table") {
    tmpCell = cell.source.value;
    if (tmpCell.name) {
      let boolExist = false;
      for (let tblIndex = 0; tblIndex < SELECT_TABLES.length; tblIndex++) {
        // باید از توی منبع اصلی جستجوش کنم
        // یا اینکه برم بگردم توی ریلیشن ها و بگم هر جایی که منبعش دارای چنین آی دی بود، اسم جدولشو بهم بده
        for (let index = 0; index < SELECT_JOINS.length; index++) {
          if (SELECT_JOINS[index].DestTable == SELECT_TABLES[tblIndex]) {
            // if (SELECT_JOINS[index].SourceColumn==tmpCell.name ) {
            if (SELECT_JOINS[index].DestColumn == tmpCell.name) {
              boolExist = true;
              SELECT_JOINS.splice(index, 1);
              SELECT_JOINS_En.splice(index, 1);
              tmpRes = SELECT_TABLES[tblIndex];
              break;
            }
            // }
          }
        }
      }
    }
  }
  return tmpRes;
}

//اینجا حالتیه که حداقل 2 تا ارتباط داره و جداول والد تکراریش چنتا هست
function multiRepeatParent(parentValue, selectJoin, sql) {
  let countInner = 0;
  let tmpJoin = "";
  let tmpDestTbl = "";
  let tmpDestCol = "";
  let tmpSourceTbl = "";
  let tmpSourceCol = "";
  let boolFirstParent = true;

  //*-*-*-*-*-*-*-*-*-*-*-*-*--*-**-*--*-**-*-
  // let tmpSelectJoin=[...selectJoin];
  let tmpSelectJoin = [];
  //من اگ بیام و ترتیب بندی کنم
  //parentValue رو
  //داخل رشته اسکیوال به درستی ، پوش میشه
  //من قراره روت اصلی رو پیدا کنم
  let tmpParentValue = [];
  let tmpChildValue = [];
  let tmpParentTbl_1 = "";
  let tmpParentTbl_2 = "";
  selectJoin.forEach((element) => {
    if (countInner == 0) {
      tmpParentTbl_1 = element.SourceTable;
    }
    selectJoin.map(function (elm) {
      if (tmpParentTbl_1 === elm.DestTable) {
        tmpChildValue.unshift(tmpParentTbl_1);
        boolFirstParent = false;
      }
    });
    if (boolFirstParent) {
      tmpSelectJoin.push(element);
      tmpParentValue.push(element.SourceTable);
    }
  });

  //اینجا حالتیه که حداقل 2 تا ارتباط داره و جداول والد تکراریش چنتا هست

  //*-*-*-*-*-*-*-*-*-*-*-*-*--*-**-*--*-**-*-
  //مابقی کدهای تابع قبلی :
  for (let j = 0; j < tmpselectJoin.length; j++) {
    tmpDestTbl = "";
    tmpDestCol = "";
    tmpSourceTbl = "";
    tmpSourceCol = "";
    tmpJoin = "";
    tmpSourceTbl = tmpselectJoin[j].DestTable;
    tmpSourceCol = tmpselectJoin[j].DestColumn;
    tmpDestTbl = tmpselectJoin[j].SourceTable;
    tmpDestCol = tmpselectJoin[j].SourceColumn;
    tmpJoin = tmpselectJoin[j].JoinType;

    if (countInner == 0 && tmpDestTbl) {
      sql.push(" " + getTblOrgNameByTableName(tmpDestTbl));
    }

    countInner += 1;
    for (let i = 0; i < parentValue.length; i++) {
      if (tmpDestTbl == parentValue[i]) {
        sql.push(
          "\n    " +
            tmpJoin +
            " " +
            getTblOrgNameByTableName(tmpSourceTbl) +
            "\n    ON " +
            getTblOrgNameByTableName(tmpDestTbl) +
            "." +
            tmpDestCol +
            " = " +
            getTblOrgNameByTableName(tmpSourceTbl) +
            "." +
            tmpSourceCol
        );
        parentValue.splice(i, 1);
        // index=-1;
        break;
      }
    }
  }

  return sql;
}

//*-*-*-*-*-*-*-*--*-*-**-*-*-
//حذف مقادیر تکراری در آرایه ی SelectJoin
//-------------------------------------
function deleteRepeatJoin(arrayJoin) {
  return arrayJoin.filter((value, index, self) => {
    return (
      index ===
      self.findIndex(
        (v) =>
          v.DestTable === value.DestTable &&
          v.SourceTable === value.SourceTable &&
          v.DestColumn === value.DestColumn &&
          v.SourceColumn === value.SourceColumn
      )
    );
  });
}
//بررسی عنصر آخر آرایه ی ارتباط در محل مناسب جهت مرتب سازی
//--------------------------------
function addAfterMatchingSource(arr, newItem) {
  const index = arr.findIndex(
    (item) => item.SourceTable === newItem.SourceTable
  );
  if (index === -1) {
    // اگر عنصری با SourceTable مشابه پیدا نشد، عنصر جدید را به انتهای آرایه اضافه کنید.
    arr.push(newItem);
  } else {
    // اگر عنصری با SourceTable مشابه پیدا شد، عنصر جدید را بعد از آن قرار دهید.
    arr.splice(index + 1, 0, newItem);
  }
  return arr;
}

//استفاده از الگوریتم dfs
//جهت مرتب سازی
function dfs(node, nodes_dict, visited, sorted_arr) {
  visited.add(node);
  sorted_arr.push(node);
  if (node in nodes_dict) {
    for (let child of nodes_dict[node]) {
      if (!visited.has(child)) {
        dfs(child, nodes_dict, visited, sorted_arr);
      }
    }
  }
}

//تابع مرتب سازی آرایه ی ارتباط
function sortSelectJoin(tmpArr) {
  let nodes_dict = {};
  for (let item of tmpArr) {
    if (!(item["SourceTable"] in nodes_dict)) {
      nodes_dict[item["SourceTable"]] = [];
    }
    nodes_dict[item["SourceTable"]].push(item["DestTable"]);
  }

  let visited = new Set();
  let sorted_arr = [];
  for (let node of Object.keys(nodes_dict)) {
    if (!visited.has(node)) {
      dfs(node, nodes_dict, visited, sorted_arr);
    }
  }

  let sorted_tmp_arr = [];
  let unsorted_tmp_arr = tmpArr.slice();
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    for (let item of unsorted_tmp_arr) {
      if (
        item["SourceTable"] == sorted_arr[i] &&
        item["DestTable"] == sorted_arr[i + 1]
      ) {
        sorted_tmp_arr.push(item);
        unsorted_tmp_arr.splice(unsorted_tmp_arr.indexOf(item), 1);
      }
    }
  }

  sorted_tmp_arr = sorted_tmp_arr.concat(unsorted_tmp_arr);

  return sorted_tmp_arr;
}
//*-*-*-*-*-*-*-*--*-*-**-*-*-

//پیدا کردن جدول ریشه
function rootFinder(RelationArray) {
  let rootName;
  const DestTables = RelationArray.map((relation) => relation.DestTable); // ساخت آرایه ای از همه‌ی فرزندان
  for (let i = 0; i < RelationArray.length; i++) {
    if (!DestTables.includes(RelationArray[i].SourceTable)) {
      rootName = RelationArray[i].SourceTable;
      break;
    }
  }
  // ساخت آرایه‌ای که تمامی فرزندان آن ریشه هستند
  const ResultArray = RelationArray.filter(
    (relation) => relation.SourceTable === rootName
  );
  // مرتب کردن آرایه‌ی نتیجه
  ResultArray.sort((a, b) => a.DestTable.localeCompare(b.DestTable));
  // if (ResultArray.length===1) {
  //   rootName = ResultArray[0].DestTable;

  // }

  return ResultArray;
}

//اینجا حالتیه که حداقل 2 تا ارتباط داره و جداول والدش یه دونست و تکراری هست
function uniqueRepeatParents(parent_Value, select_Join, sql) {
  let countInner = 0;
  let tmpJoin = "";
  let tmpDestTbl = "";
  let tmpDestCol = "";
  let tmpSourceTbl = "";
  let tmpSourceCol = "";
  let boolFirstParent = false;
  for (let j = 0; j < select_Join.length; j++) {
    tmpDestTbl = "";
    tmpDestCol = "";
    tmpSourceTbl = "";
    tmpSourceCol = "";
    tmpJoin = "";
    tmpSourceTbl = select_Join[j].DestTable;
    tmpSourceCol = select_Join[j].DestColumn;
    tmpDestTbl = select_Join[j].SourceTable;
    tmpDestCol = select_Join[j].SourceColumn;
    tmpJoin = select_Join[j].JoinType;

    if (countInner == 0 && tmpDestTbl)
      sql.push(" " + getTblOrgNameByTableName(tmpDestTbl));
    countInner += 1;
    for (let i = 0; i < parent_Value.length; i++) {
      if (tmpDestTbl == parent_Value[i]) {
        sql.push(
          "\n    " +
            tmpJoin +
            " " +
            getTblOrgNameByTableName(tmpSourceTbl) +
            "\n    ON " +
            getTblOrgNameByTableName(tmpDestTbl) +
            "." +
            tmpDestCol +
            " = " +
            getTblOrgNameByTableName(tmpSourceTbl) +
            "." +
            tmpSourceCol
        );
        parent_Value.splice(i, 1);
        // index=-1;
        break;
      }
    }
  }

  return sql;
}

//اینجا حالتیه که حداقل 2 تا ارتباط داره و جداول والدش یه دونست و تکراری هست
function uniqueRepeatParent(parentValue, selectJoin, sql) {
  let countInner = 0;
  let tmpJoin = "";
  let tmpDestTbl = "";
  let tmpDestCol = "";
  let tmpSourceTbl = "";
  let tmpSourceCol = "";
  let boolFirstParent = false;
  for (let j = 0; j < selectJoin.length; j++) {
    tmpDestTbl = "";
    tmpDestCol = "";
    tmpSourceTbl = "";
    tmpSourceCol = "";
    tmpJoin = "";
    tmpSourceTbl = selectJoin[j].DestTable;
    tmpSourceCol = selectJoin[j].DestColumn;
    tmpDestTbl = selectJoin[j].SourceTable;
    tmpDestCol = selectJoin[j].SourceColumn;
    tmpJoin = selectJoin[j].JoinType;

    if (countInner == 0 && tmpDestTbl)
      sql.push(" " + getTblOrgNameByTableName(tmpDestTbl));
    countInner += 1;
    for (let i = 0; i < parentValue.length; i++) {
      if (tmpDestTbl == parentValue[i]) {
        sql.push(
          "\n    " +
            tmpJoin +
            " " +
            getTblOrgNameByTableName(tmpSourceTbl) +
            "\n    ON " +
            getTblOrgNameByTableName(tmpDestTbl) +
            "." +
            tmpDestCol +
            " = " +
            getTblOrgNameByTableName(tmpSourceTbl) +
            "." +
            tmpSourceCol
        );
        parentValue.splice(i, 1);
        // index=-1;
        break;
      }
    }
  }

  return sql;
}

//اینجا حالتیه که حداقل 2 تا ارتباط داره و جداول والدش تکراری نیست
function uniqueParent(parentValue, selectJoin, sql) {
  let countInner = 0;
  let tmpJoin = "";
  let tmpDestTbl = "";
  let tmpDestCol = "";
  let tmpSourceTbl = "";
  let tmpSourceCol = "";
  for (let index = 0; index < parentValue.length; index++) {
    let boolFirstParent = false;
    for (let j = 0; j < selectJoin.length; j++) {
      tmpDestTbl = "";
      tmpDestCol = "";
      tmpSourceTbl = "";
      tmpSourceCol = "";
      tmpJoin = "";
      tmpSourceTbl = selectJoin[j].DestTable;
      tmpSourceCol = selectJoin[j].DestColumn;
      tmpDestTbl = selectJoin[j].SourceTable;
      tmpDestCol = selectJoin[j].SourceColumn;
      tmpJoin = selectJoin[j].JoinType;
      if (parentValue[index] == selectJoin[j].DestTable) {
        boolFirstParent = true;
        if (parentValue.length == 1) {
          for (let i = 0; i < selectJoin.length; i++) {
            if (parentValue[0] == selectJoin[i].SourceTable) {
              tmpSourceTbl = selectJoin[i].DestTable;
              tmpSourceCol = selectJoin[i].DestColumn;
              tmpDestTbl = selectJoin[i].SourceTable;
              tmpDestCol = selectJoin[i].SourceColumn;
              tmpJoin = selectJoin[i].JoinType;
              break;
            }
          }
        }
        break;
      }
    }
    if (boolFirstParent) {
      if (countInner == 0 && tmpDestTbl)
        sql.push(" " + getTblOrgNameByTableName(tmpDestTbl));
      countInner += 1;
      for (let i = 0; i < parentValue.length; i++) {
        if (tmpDestTbl == parentValue[i]) {
          sql.push(
            "\n    " +
              tmpJoin +
              " " +
              getTblOrgNameByTableName(tmpSourceTbl) +
              "\n    ON " +
              getTblOrgNameByTableName(tmpDestTbl) +
              "." +
              tmpDestCol +
              " = " +
              getTblOrgNameByTableName(tmpSourceTbl) +
              "." +
              tmpSourceCol
          );
          parentValue.splice(i, 1);
          index = -1;
          break;
        }
      }
    }
  }
  return sql;
}

//ایجاد فایل خروجی در پوشه دانلود ها
//----------------------------------------------ExportFile_Start
exportJsonFile = () => {
  const filename = `Query-${PAGE_ID}.fdm`;
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(Export())
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
//----------------------------------------------ExportFile_End

// نام جدول مورد نظر را می گیرد و نام اصلی جدول بر می گرداند
function getTableNameByName(tmpName) {
  let boolExistLabel = false;
  let sqlTableName = "";
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    if (JSON_DATA.RefTables[index].Name === tmpName) {
      boolExistLabel = true;
      sqlTableName = JSON_DATA.RefTables[index].TableName;
      break;
    }
  }
  if (boolExistLabel) {
    return sqlTableName;
  } else {
    return tmpName;
  }
}
// برچسب جدول مورد نظر را می گیرد و نام جدول بر می گرداند
function getIdByTableLabel(tableName) {
  let boolExistLabel = false;
  let tableNameEn = "";
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    if (JSON_DATA.RefTables[index].Label === tableName) {
      boolExistLabel = true;
      tableNameEn = JSON_DATA.RefTables[index].Name;
      break;
    }
  }
  if (boolExistLabel) {
    return tableNameEn;
  } else {
    return tableName;
  }
}

function getIdByTableLabelFA(tableName) {
  let tableNameFA;
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    if (JSON_DATA.RefTables[index].Name === tableName) {
      boolExistLabel = true;
      tableNameFA = JSON_DATA.RefTables[index].Label;
      break;
    }
  }
  return tableNameFA;
}

// نام ستون و نام جدول مورد نظر را می گیرد و شناسه ی نوع موجودیت در دیتا بیس را بر می گرداند
function getRefEntityAttributeID(tableName, colName) {
  let colEntityAttributeID = "";
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    if (JSON_DATA.RefTables[index].Name == tableName) {
      let tmpCol = JSON_DATA.RefTables[index].Columns;
      if (tmpCol) {
        for (let colIndex = 0; colIndex < tmpCol.length; colIndex++) {
          if (tmpCol[colIndex].Name == colName) {
            colEntityAttributeID =
              JSON_DATA.RefTables[index].Columns[colIndex].ID;
            break;
          }
        }
      }
    }
  }
  return colEntityAttributeID !== "" ||
    colEntityAttributeID !== null ||
    colEntityAttributeID !== "NULL"
    ? colEntityAttributeID
    : "NULL";
}

// نام ستون و نام جدول مورد نظر را می گیرد و شناسه ی ارتباط موجودیت در دیتا بیس را بر می گرداند
function getRefEntityID(tableName, colName) {
  let colRefEntityID = "";
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    if (JSON_DATA.RefTables[index].Name == tableName) {
      let tmpCol = JSON_DATA.RefTables[index].Columns;
      if (tmpCol) {
        for (let colIndex = 0; colIndex < tmpCol.length; colIndex++) {
          if (tmpCol[colIndex].Name == colName) {
            colRefEntityID =
              JSON_DATA.RefTables[index].Columns[colIndex].RefEntityID;
            break;
          }
        }
      }
    }
  }
  return colRefEntityID !== "" ||
    colRefEntityID !== null ||
    colRefEntityID !== "NULL"
    ? colRefEntityID
    : "NULL";
}

// نام ستون و نام جدول مورد نظر را می گیرد و شناسه ی نوع موجودیت در دیتا بیس را بر می گرداند
function getEnumTypeID(tableName, colName) {
  let colEnumTypeID = "";
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    if (JSON_DATA.RefTables[index].Name == tableName) {
      let tmpCol = JSON_DATA.RefTables[index].Columns;
      if (tmpCol) {
        for (let colIndex = 0; colIndex < tmpCol.length; colIndex++) {
          if (tmpCol[colIndex].Name == colName) {
            colEnumTypeID =
              JSON_DATA.RefTables[index].Columns[colIndex].EnumTypeID;
            break;
          }
        }
      }
    }
  }
  return colEnumTypeID !== "" ||
    colEnumTypeID !== null ||
    colEnumTypeID !== "NULL"
    ? colEnumTypeID
    : "NULL";
}

// نام ستون و نام جدول مورد نظر را می گیرد و نوع ستون در دیتا بیس را بر می گرداند
function getColumnType(tableName, colName) {
  let colType = "";
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    if (JSON_DATA.RefTables[index].Name == tableName) {
      let tmpCol = JSON_DATA.RefTables[index].Columns;
      if (tmpCol) {
        for (let colIndex = 0; colIndex < tmpCol.length; colIndex++) {
          if (tmpCol[colIndex].Name == colName) {
            colType = JSON_DATA.RefTables[index].Columns[colIndex].Type;
            break;
          }
        }
      }
    }
  }
  return colType != "" ? colType : "String";
}

// نام جدول مورد نظر را می گیرد و نام اصلی جدول در دیتا بیس را بر می گرداند
function getTblOrgNameByTableName(tableName) {
  let boolExistLabel = false;
  let tableOrginalName = "";
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    //if(JSON_DATA.RefTables[index].Name==tableName) return JSON_DATA.RefTables[index].Columns[0].Name;
    if (JSON_DATA.RefTables[index].Name === tableName) {
      boolExistLabel = true;
      tableOrginalName = JSON_DATA.RefTables[index].TableName;
      break;
    }
  }
  if (!boolExistLabel) {
    for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
      if (JSON_DATA.RefTables[index].Label === tableName) {
        boolExistLabel = true;
        tableOrginalName = JSON_DATA.RefTables[index].TableName;
        break;
      }
    }
  }
  return tableOrginalName !== "" ? tableOrginalName : null;
}

function Export() {
  SELECT_COLUMNS = [];
  SELECT_COLUMNS_En = [];
  var _Checkbox = document.querySelectorAll(".CheckClass");
  for (let index = 0; index < _Checkbox.length; index++) {
    let elementId = _Checkbox[index].id;
    let dashIndex = elementId.indexOf("-");
    let elementTable = elementId
      .substring(elementId.indexOf("_") + 1, dashIndex)
      .replace("Chk_", "");
    let element_ColName = "";
    if (document.getElementById(elementId).checked == true) {
      element_ColName = document
        .getElementById(elementId)
        .parentElement.textContent.replace(/\s+/g, "")
        .split(":")[0];
      let tmpColumnName = getNameByColLabel(elementTable, element_ColName);
      SELECT_COLUMNS.push({
        Column: element_ColName,
        Table: elementTable,
        TableLabel: getLabelByTableName(elementTable),
        ColumnLabel: getLabelCol(elementTable, element_ColName),
        TableOrginalName: getTblOrgNameByTableName(elementTable),
        Type: getColumnType(elementTable, tmpColumnName),
        EnumTypeID: getEnumTypeID(elementTable, tmpColumnName),
        RefEntityID: getRefEntityID(elementTable, tmpColumnName),
        EntityAttributeID: getRefEntityAttributeID(elementTable, tmpColumnName),
      });
      SELECT_COLUMNS_En.push({
        Column: tmpColumnName,
        Table: getIdByTableLabel(elementTable),
        TableLabel: getLabelByTableName(elementTable),
        ColumnLabel: getLabelCol(elementTable, tmpColumnName),
        TableOrginalName: getTblOrgNameByTableName(elementTable),
        Type: getColumnType(elementTable, tmpColumnName),
        EnumTypeID: getEnumTypeID(elementTable, tmpColumnName),
        RefEntityID: getRefEntityID(elementTable, tmpColumnName),
        EntityAttributeID: getRefEntityAttributeID(elementTable, tmpColumnName),
      });
    }
  }
  //create sql
  let OUTPUT;
  if (Object.keys(graph.model.cells).length > 2) {
    let sqlResult = createT_Sql(graph);
    if (sqlResult.length > 0) {
      //create xml
      var enc = new mxCodec(mxUtils.createXmlDocument());
      var node = enc.encode(editor.graph.getModel());
      let Xml = mxUtils.getPrettyXml(node);
      OUTPUT = {
        GraphModel: Xml,
        QueryModel: {
          ID: PAGE_ID,
          // Name: "@@Name",
          // Label: "@@Label",
          Name: JSON_DATA.QueryModel.Name,
          Label: JSON_DATA.QueryModel.Label,
          SelectTable: TABLES_ORGINAL_NAME,
          SelectColumn: SELECT_COLUMNS_En,
          SelectJoin: SELECT_JOINS_En,
          Query: SQL_RESULT,
        },
      };
    } else {
      mxUtils.alert(queryResources.get("Schemaisempty"));
    }
  } else {
    OUTPUT = {
      GraphModel: "<mxGraphModel></mxGraphModel>",
      QueryModel: {
        ID: PAGE_ID,
        Name: "",
        Label: "",
        SelectTable: [],
        SelectColumn: [],
        SelectJoin: [],
        Query: "",
      },
    };
  }
  return JSON.stringify(OUTPUT);
}

//  نام ستون مورد نظر را می گیرد و برچسب ستون بر می گرداند
function getIdByColName(tableName, colName) {
  let boolExistLabel = false;
  let colNameEn = "";
  let colNameFa = "";
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    if (JSON_DATA.RefTables[index].Name == tableName) {
      let tmpCol = JSON_DATA.RefTables[index].Columns;
      if (tmpCol) {
        for (let colIndex = 0; colIndex < tmpCol.length; colIndex++) {
          let tmpName = tmpCol[colIndex].Name;
          if (tmpName == colName) {
            boolExistLabel = true;
            colNameEn = JSON_DATA.RefTables[index].Columns[colIndex].Name;
            colNameFa = JSON_DATA.RefTables[index].Columns[colIndex].Label;
            break;
          }
        }
        if (boolExistLabel) break;
      }
    }
  }
  if (boolExistLabel) {
    return colNameFa;
  } else {
    return colName;
  }
}

//   برچسب ستون مورد نظر را می گیرد و نام ستون بر می گرداند
function getNameByColLabel(tableName, colLabel) {
  let boolExistLabel = false;
  let colNameEn = "";
  let tmpColLabel = colLabel.replace(/\s+/g, "");
  for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
    if (JSON_DATA.RefTables[index].Name == tableName) {
      let tmpCol = JSON_DATA.RefTables[index].Columns;
      if (tmpCol) {
        for (let colIndex = 0; colIndex < tmpCol.length; colIndex++) {
          let tmpLabel = tmpCol[colIndex].Label.replace(/\s+/g, "");
          if (tmpLabel === tmpColLabel) {
            boolExistLabel = true;
            colNameEn = JSON_DATA.RefTables[index].Columns[colIndex].Name;
            break;
          }
        }
        if (!boolExistLabel) {
          //اگر پیدا نشده بود
          for (let colIndex = 0; colIndex < tmpCol.length; colIndex++) {
            let tmpLabel = tmpCol[colIndex].Label;
            if (tmpLabel === colLabel) {
              boolExistLabel = true;
              colNameEn = JSON_DATA.RefTables[index].Columns[colIndex].Name;
              break;
            }
          }
          if (!boolExistLabel && colNameEn == "") {
            //احتمالا اسم ستون انگلیسی هستش
            for (let colIndex = 0; colIndex < tmpCol.length; colIndex++) {
              let tmpName = tmpCol[colIndex].Name;
              if (tmpName === colLabel) {
                boolExistLabel = true;
                colNameEn = tmpName;
                break;
              }
            }
          }
        }
      }
    }
  }
  //می خوام وقتی چیزی رو پیدا نکرد ، بیاد و بدون فاصله رو در نظر بگیره
  //و در آخر بیاد و اگر انگلیسی بود،اونم جستجو کنه
  return boolExistLabel ? colNameEn : colLabel;
}

//*-**--*-*-**-*-*--*-**--*-*-*-**--*-**--**--*-Test-start
//نام جدول را می گیرد و برچسب جدول را بر می گرداند
function getLabelByTableName(TblName) {
  let tblLabelFa = "";
  if (_Lang === "Fa") {
    for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
      if (JSON_DATA.RefTables[index].Name === TblName) {
        tblLabelFa = JSON_DATA.RefTables[index].Label;
        break;
      }
    }
  } else {
    tblLabelFa = TblName;
  }
  return tblLabelFa != "" ? tblLabelFa : TblName;
}

//نام جدول و نام ستون را می گیرد و برچسب ستون برا برمی گرداند
function getLabelCol(tableName, colName) {
  let colLabelFa = "";
  if (_Lang === "Fa") {
    // tmpColumnLabel = getIdByColName(resTableEn, tmpColCell);
    for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
      if (JSON_DATA.RefTables[index].Name == tableName) {
        let tmpCol = JSON_DATA.RefTables[index].Columns;
        if (tmpCol) {
          for (let colIndex = 0; colIndex < tmpCol.length; colIndex++) {
            if (tmpCol[colIndex].Name == colName) {
              colLabelFa = JSON_DATA.RefTables[index].Columns[colIndex].Label;
              break;
            }
          }
        }
      }
    }
  } else {
    colLabelFa = colName;
  }
  return colLabelFa != "" ? colLabelFa : colName;
}
//*-**--*-*-**-*-*--*-**--*-*-*-**--*-**--**--*-Test-end

function Import_CS(inputJson) {
  RenderJson(inputJson);
}

function RenderJson(inputJson1) {
  let inputJson = JSON.parse(inputJson1);

  JSON_DATA = inputJson;
  PAGE_ID = JSON_DATA.QueryModel.ID;
  TABLES_ORGINAL_NAME = inputJson.QueryModel.SelectTable;
  for (let i = 0; i < JSON_DATA.RefTables.length; i++) {
    for (let j = 0; j < inputJson.QueryModel.SelectTable.length; j++) {
      if (
        JSON_DATA.RefTables[i].TableName == inputJson.QueryModel.SelectTable[j]
      ) {
        SELECT_TABLES.push(JSON_DATA.RefTables[i].Label);
        SELECT_TABLES_En.push(JSON_DATA.RefTables[i].Name);
      }
    }
  }

  let _SelectJoin = inputJson.QueryModel.SelectJoin;
  SELECT_JOINS_En.push(..._SelectJoin);
  let obj;
  for (let i in _SelectJoin) {
    obj = {
      SourceTable: getLabelTable(_SelectJoin[i].SourceTable),
      SourceColumn: _SelectJoin[i].SourceColumn,
      SourceTableOrginal: getTblOrgNameByTableName(_SelectJoin[i].SourceTable),
      DestTable: getLabelTable(_SelectJoin[i].DestTable),
      DestColumn: _SelectJoin[i].DestColumn,
      DestTableOrginal: getTblOrgNameByTableName(_SelectJoin[i].DestTable),
      Type: _SelectJoin[i].Type,
      JoinType: _SelectJoin[i].JoinType,
    };
    SELECT_JOINS.push(obj);
  }

  function getLabelTable(TblName) {
    for (let index = 0; index < JSON_DATA.RefTables.length; index++) {
      if (JSON_DATA.RefTables[index].Name === TblName) {
        return JSON_DATA.RefTables[index].Label;
      }
    }
  }
  main(
    document.getElementById("graphContainer"),
    document.getElementById("outlineContainer"),
    document.getElementById("toolbarContainer"),
    document.getElementById("sidebarContainer"),
    document.getElementById("statusContainer")
  );

  //Pars xml
  let xml = inputJson.GraphModel;
  var doc = mxUtils.parseXml(xml);
  setGraphXml(doc.documentElement);
  //Generate checkbox ID && checked in UI
  let _array = inputJson.QueryModel.SelectColumn;
  for (let i = 0; i < _array.length; i++)
    $("#" + getCheckID(_array[i])).prop("checked", true);

  function setGraphXml(node) {
    var dec = new mxCodec(node.ownerDocument);

    if (node.nodeName == "mxGraphModel") {
      this.graph.model.beginUpdate();
      try {
        this.graph.model.clear();
        this.graph.view.scale = 1;

        dec.decode(node, this.graph.getModel());
      } finally {
        this.graph.model.endUpdate();
      }
    }
  }

  function getCheckID(item) {
    let checkID = "Chk_" + item.Table + "-" + getColID(item.Table, item.Column);
    return checkID;
  }

  function getColID(TblName, ColumnName) {
    for (let i in JSON_DATA.RefTables) {
      if (JSON_DATA.RefTables[i].Name == TblName) {
        for (let j in JSON_DATA.RefTables[i].Columns) {
          if (JSON_DATA.RefTables[i].Columns[j].Name == ColumnName)
            return JSON_DATA.RefTables[i].Columns[j].ID;
        }
      }
    }
  }
}

function ChangeLang() {
  if (_Lang == "Fa") {
    $(`#page-header span`).prop("class", "fa fa-angle-double-left");
    $(`#out a i`).addClass("fa-rotate-180");
    //باید در import code وارد شود
    var str = JSON_DATA.QueryModel.Label;
    $(`#page-header b`)
      .text(" " + queryResources.get("designquery") + "  ")
      .append(`<b style="font-weight:bold">${str}</b>`);
  } else if (_Lang == "En") {
    $(`.rotate`).attr("class", `fa fa-angle-right pull-right rotate`);
    $(`.rotate:first`).attr(
      "class",
      `fa fa-angle-right pull-right rotate fa-rotate-90`
    );
    $(`#page-header span`).prop("class", "fa fa-angle-double-right");

    var str = JSON_DATA.QueryModel.Name;
    $(`#page-header b`)
      .text(" " + queryResources.get("designquery") + "  ")
      .append(`<b style="font-weight:bold">${str}</b>`);
  }
}

function Exit() {
  saveDesign(false);
  setTimeout(() => {
    window.open("", "_self").close();
  }, 500);
}
