/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.1.0.0*/
/* Release Ferdos.BPMS*/

// Program starts here. Creates a sample graph in the
// DOM node with the specified ID. This function is invoked
// from the onLoad event handler of the document (see below).
var editor;
var graph;
var model;
var $RefEntities = [];
function main(container, outline, toolbar, sidebar, status) {
  // Checks if the browser is supported
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is not supported.
    mxUtils.error("Browser is not supported!", 200, false);
  } else {
    // Specifies shadow opacity, color and offset
    // mxConstants.SHADOW_OPACITY = 0.5;
    mxConstants.SHADOWCOLOR = "#d1d1d1";
    mxConstants.SHADOW_OFFSET_X = 3;
    mxConstants.SHADOW_OFFSET_Y = 3;
    mxConstants.DEFAULT_FONTFAMILY = "IRANSansWeb";
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
      mxBasePath + "images/connector.gif",
      16,
      16
    );

    // Prefetches all images that appear in colums
    // to avoid problems with the auto-layout
    var keyImage = new Image();
    keyImage.src = mxBasePath + "images/key.png";

    var plusImage = new Image();
    plusImage.src = mxBasePath + "images/plus.png";

    var checkImage = new Image();
    checkImage.src = mxBasePath + "images/check.png";

    // Workaround for Internet Explorer ignoring certain CSS directives
    if (mxClient.IS_QUIRKS) {
      document.body.style.overflow = "hidden";
      new mxDivResizer(container);
      new mxDivResizer(outline);
      new mxDivResizer(toolbar);
      new mxDivResizer(sidebar);
      new mxDivResizer(status);
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
    graph.setCellsDisconnectable(true);
    graph.setCellsCloneable(true);
    graph.swimlaneNesting = true;
    graph.dropEnabled = true;

    // Does not allow dangling edges
    graph.setAllowDanglingEdges(false);

    // Forces use of default edge in mxConnectionHandler
    // graph.connectionHandler.factoryMethod = null;

    // Only tables are resizable
    graph.isCellResizable = function (cell) {
      return false;
    };

    // Only tables are movable
    graph.isCellMovable = function (cell) {
      return this.isSwimlane(cell);
    };

    // Sets the graph container and configures the editor
    editor.setGraphContainer(container);
    var config = mxUtils
      .load(mxBasePath + "editors/config/keyhandler-minimal.xml")
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
      if (value.Name != null) {
        return mxGraphModel.prototype.valueForCellChanged.apply(
          this,
          arguments
        );
      } else {
        var old = cell.value.Name;
        cell.value.Name = value;
        return old;
      }
    };

    // Columns are dynamically created HTML labels
    graph.isHtmlLabel = function (cell) {
      return !this.isSwimlane(cell) && !this.model.isEdge(cell);
    };

    // Edges are not editable
    graph.isCellEditable = function (cell) {
      // return !this.model.isEdge(cell);
    };

    // Returns the name field of the user object for the label
    graph.convertValueToString = function (cell) {
      if (cell.value != null && cell.value.Name != null) {
        return cell.value.Name;
      }

      return mxGraph.prototype.convertValueToString.apply(this, arguments); // "supercall"
    };

    // Returns the type as the tooltip for column cells
    graph.getTooltip = function (state) {
      if (this.isHtmlLabel(state.cell)) {
        return (
          EntityResources.get("type") +
          ": " +
          GetType(state.cell.value.AttributeTypeID, "label")
        );
      } else if (this.model.isEdge(state.cell)) {
        var source = this.model.getTerminal(state.cell, true);
        var parent = this.model.getParent(source);
        let ret;
        if (parent.value)
          ret =
            EntityResources.get("systetitle") +
            ": " +
            parent.value.Label +
            "_" +
            state.cell.target.value.Label;
        return ret;
      }

      return mxGraph.prototype.getTooltip.apply(this, arguments); // "supercall"
    };

    // Creates a dynamic HTML label for column fields
    graph.getLabel = function (cell) {
      if (this.isHtmlLabel(cell)) {
        var label = "";
        if (cell.value.PrimaryKey) {
          label += `<img title="Primary Key" src="${mxBasePath}images/key.png" width="16" height="16" align="top">&nbsp;`;
        } else {
          label += `<img src="${mxBasePath}images/spacer.gif" width="16" height="1">&nbsp;`;
        }

        if (cell.value.AutoIncrement) {
          label += `<img title="Auto Increment" src="${mxBasePath}images/plus.png" width="16" height="16" align="top">&nbsp;`;
        } else if (cell.value.unique) {
          label += `<img title="Unique" src="${mxBasePath}images/check.png" width="16" height="16" align="top">&nbsp;`;
        } else {
          label += `<img src="${mxBasePath}images/spacer.gif" width="16" height="1">&nbsp;`;
        }

        if (cell.value.FK) {
          return `<div class="div_Item">${label}<label><span style="color:#0000ffa8;font-weight: bold;">&nbsp;(FK)&nbsp;</span> ${mxUtils.htmlEntities(
            cell.value.Name,
            false
          )} </label>&nbsp;&nbsp;</div>`;
        } else {
          return `<div class="div_Item">${label}<label> ${mxUtils.htmlEntities(
            cell.value.Name,
            false
          )}</label>&nbsp;&nbsp;</div>`;
        }
      }

      return mxGraph.prototype.getLabel.apply(this, arguments); // "supercall"
    };

    // Removes the source vertex if edges are removed
    graph.addListener(mxEvent.REMOVE_CELLS, function (sender, evt) {
      var cells = evt.getProperty("cells");

      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];

        if (this.model.isEdge(cell)) {
          var terminal = this.model.getTerminal(cell, true);
          var parent = this.model.getParent(terminal);
          this.model.remove(terminal);
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

    // Adds sidebar icon for the table object
    var tableObject = new Table("TABLENAME");
    var table = new mxCell(tableObject, new mxGeometry(0, 0, 250, 28), "table");

    table.setVertex(true);
    table.setConnectable(true);
    addSidebarIcon(
      graph,
      sidebar,
      table,
      mxBasePath + "images/icons48/table.png",
      "tableEntity"
    );

    // Adds sidebar icon for the column object
    var columnObject = new Column("Project");
    var column = new mxCell(columnObject, new mxGeometry(0, 0, 0, 26));

    column.setVertex(true);
    column.setConnectable(true);

    addSidebarIcon(
      graph,
      sidebar,
      column,
      mxBasePath + "images/icons48/column.png",
      "columnEntity"
    );

    // Adds primary key field into table
    var firstColumn = column.clone();

    firstColumn.value.Name = "ID";
    firstColumn.value.AttributeType = EntityResources.get("Integer");
    firstColumn.value.AttributeTypeID = 5;
    firstColumn.value.PrimaryKey = true;
    firstColumn.value.AutoIncrement = true;
    firstColumn.value.FK = false;
    firstColumn.style = "column";
    firstColumn.setConnectable(false);
    table.insert(firstColumn);

    // Adds child columns for new connections between tables
    graph.addEdge = function (edge, parent, source, target, index) {
      // Finds the primary key child of the target table

      // var primaryKey = null;
      // var childCount = this.model.getChildCount(target);

      let SourceIsTBL = source.parent.id == 1 ? true : false;

      let TargetIsTBL = target.parent.id == 1 ? true : false;

      if (SourceIsTBL == true && TargetIsTBL == true) {
        if (source.style == "table") {
          // for (var i = 0; i < childCount; i++) {
          //   var child = this.model.getChildAt(target, i);
          //   if (child.value.PrimaryKey) {
          //     primaryKey = child;
          //     break;
          //   }
          // }

          this.model.beginUpdate();
          try {
            var col1 = this.model.cloneCell(column);
            col1.value.Label = target.value.Label + "ID";
            col1.value.Name = target.value.Name;
            col1.value.AttributeType = "ForeignKey";
            col1.value.AttributeTypeID = 0;
            col1.value.FK = true;
            this.addCell(col1, source);
            col1.setConnectable(false);
            source = col1;
            target = target;

            return mxGraph.prototype.addEdge.apply(this, arguments); // "supercall"
          } finally {
            this.model.endUpdate();
          }
        }
      } else if (SourceIsTBL == false && TargetIsTBL == true) {
        if (source.parent.style == "table") {
          if (source.parent.id != target.parent.id) {
            this.model.beginUpdate();
            try {
              source.value.FK = true;
              source.value.FKc = true;
              source.value.AttributeType = "ForeignKey";
              source.value.AttributeTypeID = 0;
              source.setConnectable(false);
              return mxGraph.prototype.addEdge.apply(this, arguments); // "supercall"
            } finally {
              this.model.endUpdate();
              graph.refresh();
            }
          }
        }
      }
      // else if (SourceIsTBL == false && TargetIsTBL == false) {
      //   if (source.parent.id != target.parent.id) {
      //     this.model.beginUpdate();
      //     try {
      //       return mxGraph.prototype.addEdge.apply(this, arguments); // "supercall"
      //     } finally {
      //       this.model.endUpdate();
      //     }
      //   }
      // }
      // else if (SourceIsTBL == true && TargetIsTBL == false) {
      //   //ISparent relation

      //   if (source.id == target.parent.id) {
      //     // childCount = this.model.getChildCount(source);
      //     // for (var i = 0; i < childCount; i++) {
      //     //   var child = this.model.getChildAt(source, i);
      //     //   if (child.value.PrimaryKey) {
      //     //     primaryKey = child;
      //     //     break;
      //     //   }
      //     // }

      //     this.model.beginUpdate();
      //     try {
      //       col1 = this.model.cloneCell(column);
      //       col1.value.FK = true;
      //       col1.value.Label = target.parent.value.Label + "ID";
      //       col1.value.Name = target.parent.value.Name;
      //       col1.value.AttributeType = "ForeignKey";
      //       col1.value.AttributeTypeID = 0;
      //       this.addCell(col1, source);
      //       source = col1;
      //       target = target.parent;
      //       return mxGraph.prototype.addEdge.apply(this, arguments); // "supercall"
      //     } finally {
      //       this.model.endUpdate();
      //     }
      //   } else {
      // childCount = this.model.getChildCount(target.parent);
      // for (var i = 0; i < childCount; i++) {
      //   var child = this.model.getChildAt(target.parent, i);
      //   if (child.value.PrimaryKey) {
      //     primaryKey = child;
      //     break;
      //   }
      // }
      //   this.model.beginUpdate();
      //   try {
      //     col1 = this.model.cloneCell(column);
      //     col1.value.Label = target.parent.value.Label + "ID";
      //     col1.value.Name = target.parent.value.Name;
      //     col1.value.AttributeType = "ForeignKey";
      //     col1.value.AttributeTypeID = 0;
      //     col1.value.FK = true;
      //     this.addCell(col1, source);
      //     source = col1;
      //     target = target.parent;
      //     return mxGraph.prototype.addEdge.apply(this, arguments); // "supercall"
      //   } finally {
      //     this.model.endUpdate();
      //   }
      //  }
      // }
      return null;
    };

    // Creates a new DIV that is used as a toolbar and adds
    // toolbar buttons.
    var spacer = document.createElement("div");
    spacer.style.display = "inline";
    spacer.style.padding = "8px";

    // Defines a new export action
    editor.addAction("properties", function (editor, cell) {
      cell = graph.getSelectionCell();
      showProperties(graph, cell);
    });

    // Creates the outline (navigator, overview) for moving
    // around the graph in the top, right corner of the window.
    var outln = new mxOutline(graph, outline);

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

  //Foreignkey to sidebar
  $(sidebar).append(
    `<ul class="sidebarUL" onclick="ForeignKey()"><li><a style="margin-top:5px;cursor:pointer;"><img src="${mxBasePath}images/icons48/Foreignkey.png" style="width:39px;height:32px">
    <span id="foreignkey" class="centered">${EntityResources.get(
      "FKField"
    )}</span></a></li></ul>`
  );
}

function showModalWindow(title, cell, content, width, height) {
  let contentTBL = content.table;
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

  var wnd = new mxWindow(title, contentTBL, x, y, width, height, false, true);
  wnd.setClosable(true);

  // Fades the background out after after the window has been closed
  wnd.addListener(mxEvent.DESTROY, function (evt) {
    mxEffects.fadeOut(background, 50, true, 10, 30, true);
  });

  //action iscomputed for formula

  if (cell.value != null && cell.value != undefined)
    if (cell.value.IsComputed == 0) $(`#formulaid`).parent().parent().hide();

  $("#iscomputed").on("change", function () {
    if ($(this).is(":checked")) {
      $(`#formulaid`).parent().parent().show();
    } else {
      $(`#formulaid`).val("");
      $(`#formulaid`).parent().parent().hide();
    }
  });
  wnd.setVisible(true);

  return wnd;
}
var $prototype;
var $pt;
function addSidebarIcon(graph, sidebar, prototype, image, text) {
  // Function that is executed when the image is dropped on
  // the graph. The cell argument points to the cell under
  // the mousepointer if there is one.
  var funct = function (graph, evt, cell) {
    graph.stopEditing(false);

    var pt = graph.getPointForEvent(evt);

    var parent = graph.getDefaultParent();
    var isTable = false;

    if (cell) {
      if (cell.style == "table") {
        isTable = true;
        parent = cell;
      }
    }

    var pstate = graph.getView().getState(parent);

    if (prototype.style == "table") {
      if (parent.id != 1) {
        mxUtils.alert(EntityResources.get("Drop target must be a table"));
        return;
      }
    } else {
      if (cell) {
        if (cell.style == "tableFK") {
          mxUtils.alert(EntityResources.get("Drop target must be a table"));
          return;
        }
      } else if (parent.id == 1) {
        mxUtils.alert(EntityResources.get("Drop target must be a table"));
        return;
      }
    }

    pt.x -= pstate.x;
    pt.y -= pstate.y;

    $prototype = prototype;
    $parent = parent;
    $pt = pt;
    insertTblOrLbl(isTable, pt);

    function insertTblOrLbl(_isTable) {
      let title;
      let label;
      let sysname;

      if (_isTable) {
        title = EntityResources.get("InsertColumn");
        label = EntityResources.get("Enter name for new column");
        sysname = EntityResources.get("Enter systemName for new column");
      } else {
        title = EntityResources.get("InsertTable");
        label = EntityResources.get("Enter name for new table");
        sysname = EntityResources.get("Enter systemName for new table");
      }
      let div =
        '<div id="myModal" class="modal" >' +
        '<div id="modalPopUp" class="modal-content">' +
        "</div></div>";
      $("#graphContainer").append(div);

      $("#myModal").css("display", "block");
      $("#modalPopUp").css("width", "450px");

      //title
      let item = `<div id="Title" style="font-size:14px;" type="${
        prototype.style ? "table" : "column"
      }" >${title}</div>`;

      //lbl1
      item += `<label class="lbl" style="display: block;width: auto;margin-top:20px;">${label}</label>`;

      //input1
      item += `<div class="input-group"><input id="ElementLBL" type="text" class="txtPopup" onkeypress="return limetChar(event)"; style="border-radius: 0px;"></div>`;

      //lbl2
      item += `<label class="lbl" style="display: block;width: auto;margin-top:25px">${sysname}</label>`;
      //input2
      item += `<div class="input-group" ><input id="ElementNAME" type="text" class="txtPopup"  style="border-radius: 0px;" value="" onkeypress="return ValidateKey(event,${_isTable})"></div>`;
      item += `<small style="display: block;font-family: 'IRANSansWeb';" class="text-muted">English characters</small>`;

      //btn
      item += `<div style="border-top: 1px solid #ccc;padding-top: 5px;margin-top:45px;"><button id="" style="color:#fff" class="btn btn-primary btnPopup" onclick="IsOkElementName(${_isTable})" >${EntityResources.get(
        "insert"
      )} </button>`;
      item += `<button id="" class="btn btn-light btnPopup" onclick="ExitModal()" style="margin:0px 5px;">${EntityResources.get(
        "cancel"
      )}</button> </div>`;
      $(`#modalPopUp`).append(item);
      $(`#ElementLBL`).focus();
    }
  };

  // Creates the image which is used as the sidebar icon (drag source)
  var ul = document.createElement("ul");
  ul.className = "sidebarUL ";
  sidebar.appendChild(ul);

  var li = document.createElement("li");
  ul.appendChild(li);

  var a = document.createElement("a");
  a.style.marginTop = "5px";
  text == "tableEntity" || text == "columnEntity"
    ? (a.style.cursor = "default")
    : (a.style.cursor = "pointer");
  li.appendChild(a);

  var img = document.createElement("img");
  img.setAttribute("src", image);
  img.style.width = "39px";
  img.style.height = "32px";
  text == "tableEntity" || text == "columnEntity"
    ? (img.style.cursor = "move")
    : (img.style.cursor = "pointer");
  a.appendChild(img);

  var span1 = document.createElement("span");
  span1.textContent = EntityResources.get(text);
  span1.setAttribute("id", "tabaleIconTXT");
  span1.className = "centered";
  a.appendChild(span1);

  // Creates the image which is used as the drag icon (preview)
  var dragImage = img.cloneNode(true);
  var ds = mxUtils.makeDraggable(img, graph, funct, dragImage);

  // Adds highlight of target tables for columns
  ds.highlightDropTargets = true;
  ds.getDropTarget = function (graph, x, y) {
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
function ValidateKey(ev, isTable) {
  if (ev.keyCode == 13) IsOkElementName(isTable);

  var allowed =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890-";
  return allowed.indexOf(String.fromCharCode(ev.keyCode)) == -1 ? false : true;
}

function IsOkElementName(isTable) {
  let cell = {
    id: "",
    value: "",
    // style: isTable ? "" : null,
    parent: {
      id: $parent.id,
    },
  };
  if (
    LblAndName_isDuplicate(
      cell,
      document.getElementById("ElementNAME"),
      document.getElementById("ElementLBL")
    )
  ) {
    let name = $.trim($(`#ElementLBL`).val());
    let systemName = $.trim($(`#ElementNAME`).val());
    if (name != "" && systemName != "") {
      $(`#ElementLBL`).css("border-color", "#ccc");
      $(`#ElementNAME`).css("border-color", "#ccc");
      var model = graph.getModel();
      if (name != null) {
        var v1 = model.cloneCell($prototype);

        model.beginUpdate();

        try {
          v1.value.Name = name;
          v1.value.Label = systemName;
          v1.geometry.x = $pt.x;
          v1.geometry.y = $pt.y;

          graph.addCell(v1, $parent);

          if (!isTable) {
            v1.geometry.alternateBounds = new mxRectangle(
              0,
              0,
              v1.geometry.width,
              v1.geometry.height
            );

            v1.children[0].value.Name =
              _Lang == "Fa" ? "شناسه " + name : name + "ID ";
          }
        } finally {
          model.endUpdate();
        }

        graph.setSelectionCell(v1);
        ExitModal();
      }
    } else {
      name == ""
        ? $(`#ElementLBL`).css("border-color", "red")
        : $(`#ElementLBL`).css("border-color", "#ccc");

      systemName == ""
        ? $(`#ElementNAME`).css("border-color", "red")
        : $(`#ElementNAME`).css("border-color", "#ccc");
    }
  }
}

function ExitModal() {
  $("#myModal").remove();
}

function limetChar(event) {
  return $(event.target).val().length > 25 ? false : true;
}

function configureStylesheet(graph) {
  var style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_FONTCOLOR] = "#000000";
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
  style[mxConstants.STYLE_GRADIENTCOLOR] = "#156c7d38";
  style[mxConstants.STYLE_FILLCOLOR] = "#8CCDF5";
  style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = "#ffffff";
  style[mxConstants.STYLE_STROKECOLOR] = "#1B78C8";
  style[mxConstants.STYLE_FONTCOLOR] = "#000000";
  style[mxConstants.STYLE_STROKEWIDTH] = "2";
  style[mxConstants.STYLE_STARTSIZE] = "28";
  style[mxConstants.STYLE_ROUNDED] = true;

  style[mxConstants.STYLE_VERTICAL_ALIGN] = "middle";
  style[mxConstants.STYLE_FONTSIZE] = "12";
  style[mxConstants.STYLE_FONTSTYLE] = 1;
  style[mxConstants.STYLE_IMAGE] = mxBasePath + "images/icons48/table.png";
  // Looks better without opacity if shadow is enabled
  style[mxConstants.STYLE_SHADOW] = 1;
  style[mxConstants.STYLE_OPACITY] = "100";
  graph.getStylesheet().putCellStyle("table", style);

  style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
  style[mxConstants.STYLE_GRADIENTCOLOR] = "#156c7d38";
  style[mxConstants.STYLE_FILLCOLOR] = "#8CCDF5";
  style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = "#ffffff";
  style[mxConstants.STYLE_STROKECOLOR] = "#1B78C8";
  style[mxConstants.STYLE_FONTCOLOR] = "#000000";
  style[mxConstants.STYLE_STROKEWIDTH] = "2";
  style[mxConstants.STYLE_STARTSIZE] = "28";
  style[mxConstants.STYLE_ROUNDED] = true;

  style[mxConstants.STYLE_VERTICAL_ALIGN] = "middle";
  style[mxConstants.STYLE_FONTSIZE] = "12";
  style[mxConstants.STYLE_FONTSTYLE] = 1;
  style[mxConstants.STYLE_IMAGE] = mxBasePath + "images/icons48/table.png";
  // Looks better without opacity if shadow is enabled
  style[mxConstants.STYLE_SHADOW] = 1;
  style[mxConstants.STYLE_OPACITY] = "40";
  graph.getStylesheet().putCellStyle("tableFK", style);

  style = graph.stylesheet.getDefaultEdgeStyle();
  style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "#FFFFFF";
  style[mxConstants.STYLE_STROKEWIDTH] = "2";
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
}

// Function to create the entries in the popupmenu
function createPopupMenu(editor, graph, menu, cell, evt) {
  let Iscell = false;
  if (cell != null) {
    Iscell = true;
    if (
      cell.value == undefined ||
      (!cell.value.PrimaryKey && cell.value.FK != 1)
    ) {
      menu_pop(Iscell);
    }
  } else {
    menu_pop(Iscell);
  }
  function menu_pop(Iscell) {
    if (Iscell) {
      if (cell.style != "tableFK") {
        menu.addItem(
          EntityResources.get("settings"),
          mxBasePath + "editors/images/properties.gif",
          function () {
            editor.execute("properties", cell);
          }
        );

        menu.addSeparator();
      }

      menu.addItem(
        EntityResources.get("Delete"),
        mxBasePath + "images/delete2.png",
        function () {
          if (cell.source != null) {
            if (cell.source.value.FK != 1) {
              cell.source = null;
              cell.target = null;
            }
          }
          editor.execute("delete", cell);
        }
      );
      menu.addSeparator();
    }

    menu.addItem(
      EntityResources.get("zoomIn"),
      mxBasePath + "images/zoom_in.png",
      function () {
        graph.zoomIn();
      }
    );

    menu.addItem(
      EntityResources.get("zommOut"),
      mxBasePath + "images/zoom_out.png",
      function () {
        graph.zoomOut();
      }
    );

    menu.addSeparator();

    menu.addItem(
      EntityResources.get("Undo"),
      mxBasePath + "images/undo.png",
      function () {
        editor.execute("undo", cell);
      }
    );

    menu.addItem(
      EntityResources.get("Redo"),
      mxBasePath + "images/redo.png",
      function () {
        editor.execute("redo", cell);
      }
    );
  }
}

function Label(_cell, _elem) {
  if (
    !_cell.source.value.FKc &&
    (_cell.target.style == "table" || _cell.target.style == "tableFK")
  ) {
    return _elem.Label == undefined || _elem.Label == ""
      ? _cell.target.value.Name
      : _elem.Label;
  } else if (
    _cell.source.value.FKc &&
    (_cell.target.style == "table" || _cell.target.style == "tableFK")
  ) {
    return _cell.source.value.Name;
  } else {
    return _elem.Label == undefined || _elem.Label == ""
      ? _cell.target.parent.value.Name
      : _elem.Label;
  }
}

function Name(_cell, _elem) {
  if (
    !_cell.source.value.FKc &&
    (_cell.target.style == "table" || _cell.target.style == "tableFK")
  ) {
    return _elem.Name == undefined || _elem.Name == ""
      ? _cell.source.parent.value.Label + "_" + _cell.target.value.Label
      : _elem.Name;
  } else if (
    _cell.source.value.FKc &&
    (_cell.target.style == "table" || _cell.target.style == "tableFK")
  ) {
    return _cell.source.value.Label;
  } else {
    return _elem.Name == undefined || _elem.Name == ""
      ? _cell.source.parent.value.Label + "_" + _cell.target.parent.value.Label
      : _elem.Name;
  }
}

function addWord(_name) {
  if (_name) {
    if (_name.charAt(_name.length - 1).toUpperCase() == "Y") {
      return _name.slice(0, -1) + "ies";
    } else {
      return _name + "s";
    }
  } else {
    return _name;
  }
}

var $cell;
function showProperties(graph, cell) {
  $cell = cell;
  // Creates a form for the user object inside
  // the cell
  let form = new mxForm("properties");

  let NameField = null;
  let AttributeTypeIDField = null;
  let TypeField = null;
  let LabelField = null;
  let ReversLabelField = null;
  let DataNameField = null;
  let DataIdentityField = null;
  let PluralNameField = null;
  let PluralLabelField = null;
  let ViewEntryField = null;
  let CreateEntryField = null;
  let EntryPositionField = null;
  let EditComplexityField = null;
  let SourceMultiplicityField = null;
  let DestinationMultiplicityField = null;
  let EnumAttributeTypeField = null;
  let DefaultvalueField = null;
  let SubjectField = null;
  let SubSubjectField = null;
  let EsubjectField = null;
  let EsubSubjectField = null;
  let LsubjectField = null;
  let LsubSubjectField = null;
  let FormulaField = null;
  let EditImportanceField = null;
  let ViewImportanceField = null;
  let IdentitynameField = null;
  let HasModuleField = false;
  // let IspredefinedField = false;
  let RemovableField = false;
  let RestorableField = false;
  let EnableableField = false;
  let ModifiableField = false;
  let IsRecursiveField = false;
  let IsDependentField = false;
  let IsCardinalField = false;
  let IsBasicField = false;
  let NullableField = false;
  let IsSysAttributeField = false;
  let IsComputedField = false;
  let ValueIsUniqueField = false;
  let IsRelations = false;
  if (cell.style == "table") {
    Table(cell);
  } else if (cell.source != null && cell.target != null) {
    Relation(cell);
    IsRelations = true;
  } else {
    Column(cell);
  }
  var wnd = null;

  // Defines the function to be executed when the
  // OK button is pressed in the dialog
  var okFunction = function () {
    if (
      $.trim($(`#inputsystetitle`).val()) == "" ||
      $.trim($(`#inputtitle`).val()) == ""
    ) {
      $.trim($(`#inputsystetitle`).val()) == ""
        ? $(`#inputsystetitle`).css("border-color", "red")
        : $(`#inputsystetitle`).css("border-color", "#000");

      $.trim($(`#inputtitle`).val()) == ""
        ? $(`#inputtitle`).css("border-color", "red")
        : $(`#inputtitle`).css("border-color", "#000");
    } else {
      //isDuplicate lbl
      if (LblAndName_isDuplicate(cell, NameField, LabelField)) {
        var clone;
        if (IsRelations) {
          let oldRelation = $Relations.filter((x) => x.UiId == cell.id);
          if (oldRelation.length) {
            clone = oldRelation[0];
            if (LabelField) clone.Label = LabelField.value;
            if (NameField) clone.Name = NameField.value;
            if (TypeField) clone.Type = TypeField.value;
            if (ReversLabelField) clone.ReversLabel = ReversLabelField.value;
            if (DataIdentityField) clone.DataIdentity = DataIdentityField.value;

            if (TypeField.value == "Composition" && !clone.IsComposition) {
              ConnectionReverse([cell]);
              clone.IsComposition = true;
            }

            if (TypeField.value == "UniAssociation" && clone.IsComposition) {
              ConnectionReverse([cell]);
              clone.IsComposition = false;
            }

            if (TypeField.value == "BiAssociation" && clone.IsComposition) {
              ConnectionReverse([cell]);
              clone.IsComposition = false;
            }
          } else {
            let obj = { UiId: cell.id, IsComposition: false };
            clone = JSON.parse(JSON.stringify(obj));

            if (LabelField) clone.Label = LabelField.value;
            if (NameField) clone.Name = NameField.value;

            if (TypeField) clone.Type = TypeField.value;

            if (TypeField.value == "Composition" && !clone.IsComposition) {
              ConnectionReverse([cell]);
              clone.IsComposition = true;
            }

            if (TypeField.value == "UniAssociation" && clone.IsComposition) {
              ConnectionReverse([cell]);
              clone.IsComposition = false;
            }

            if (TypeField.value == "BiAssociation" && clone.IsComposition) {
              ConnectionReverse([cell]);
              clone.IsComposition = false;
            }

            if (ReversLabelField) clone.ReversLabel = ReversLabelField.value;
            if (DataIdentityField) clone.DataIdentity = DataIdentityField.value;
          }
        } else {
          clone = cell.value.clone();
          if (LabelField) clone.Name = LabelField.value;
          if (NameField) clone.Label = NameField.value;
          if (AttributeTypeIDField)
            clone.AttributeTypeID = +AttributeTypeIDField.value;
          if (AttributeTypeIDField)
            clone.AttributeType = $(
              $(AttributeTypeIDField)[0][AttributeTypeIDField.value]
            ).text();
        }

        if (IdentitynameField) clone.IdentityName = IdentitynameField.value;
        if (HasModuleField) clone.HasModule = HasModuleField.checked;
        if (DefaultvalueField) clone.Defaultvalue = DefaultvalueField.value;
        if (FormulaField)
          clone.Formula = FormulaField.value.replaceAll("'", '"');
        if (EntryPositionField) clone.EntryPosition = EntryPositionField.value;
        if (EditComplexityField)
          clone.EditComplexity = EditComplexityField.value;
        if (CreateEntryField) clone.CreateEntry = CreateEntryField.value;
        if (ViewEntryField) clone.ViewEntry = ViewEntryField.value;
        if (SubjectField) clone.Subject = SubjectField.value;
        if (SubSubjectField) clone.SubSubject = SubSubjectField.value;
        if (EsubjectField) clone.Esubject = EsubjectField.value;
        if (EsubSubjectField) clone.EsubSubject = EsubSubjectField.value;

        if (LsubjectField) clone.Lsubject = LsubjectField.value;
        if (LsubSubjectField) clone.LsubSubject = LsubSubjectField.value;

        if (EditImportanceField)
          clone.EditImportance = EditImportanceField.value;
        if (ViewImportanceField)
          clone.ViewImportance = ViewImportanceField.value;
        if (RemovableField) clone.Removable = RemovableField.checked;
        if (RestorableField) clone.Restorable = RestorableField.checked;
        if (EnableableField) clone.Enableable = EnableableField.checked;
        if (ModifiableField) clone.Modifiable = ModifiableField.checked;
        if (IsRecursiveField) clone.IsRecursive = IsRecursiveField.checked;
        if (IsDependentField) clone.IsDependent = IsDependentField.checked;
        if (IsCardinalField) clone.IsCardinal = IsCardinalField.checked;
        if (IsBasicField) clone.IsBasic = IsBasicField.checked;
        if (NullableField) clone.Nullable = NullableField.checked;
        if (IsSysAttributeField)
          clone.IsSysAttribute = IsSysAttributeField.checked;
        if (ValueIsUniqueField)
          clone.ValueIsUnique = ValueIsUniqueField.checked;
        if (IsComputedField) clone.IsComputed = IsComputedField.checked;
        if (EnumAttributeTypeField)
          clone.EnumTypeID = +EnumAttributeTypeField.value;

        if (DataNameField) clone.DataName = DataNameField.value;

        if (PluralNameField) clone.PluralName = PluralNameField.value;
        if (PluralLabelField) clone.PluralLabel = PluralLabelField.value;
        if (SourceMultiplicityField)
          clone.SourceMultiplicity = SourceMultiplicityField.value;
        if (DestinationMultiplicityField)
          clone.DestinationMultiplicity = DestinationMultiplicityField.value;

        if (IsRelations) {
          $Relations = $Relations.filter((x) => x.UiId != cell.id);
          $Relations.push(clone);
        } else {
          graph.model.setValue(cell, clone);
        }
        wnd.destroy();
      }
    }
  };

  function Relation(cell) {
    // Adds a field for the Relation
    let elem = {};
    for (let i in $Relations)
      if ($Relations[i].UiId == cell.id) elem = $Relations[i];

    LabelField = form.addText(
      EntityResources.get("title"),
      (elem.Label ??= Label(cell, elem)),
      "",
      "",
      "inputtitle"
    );
    $(LabelField).attr("onkeypress", "return limetChar(event)");

    NameField = form.addText(
      EntityResources.get("systetitle"),
      (elem.Name ??= Name(cell, elem)),
      "",
      "",
      "inputsystetitle"
    );
    $(NameField).attr("onkeypress", "return ValidateKey(event,false)");

    ReversLabelField = form.addText(
      EntityResources.get("reverslabel"),
      (elem.ReversLabel ??=
        cell.source.style != "table"
          ? cell.source.parent.value.Label
          : cell.source.value.Label),
      "",
      "",
      "reverslabel"
    );

    if (cell.target.style == "tableFK") {
      TypeField = form.addSelect(
        EntityResources.get("type"),
        [
          {
            ID: "UniAssociation",
            Label: "UniAssociation",
            Name: "UniAssociation",
          },
        ],
        "",
        "",
        "relationtype"
      );
      $(TypeField).val((elem.Type ??= "UniAssociation"));
    } else {
      TypeField = form.addSelect(
        EntityResources.get("type"),
        [
          {
            ID: "UniAssociation",
            Label: "UniAssociation",
            Name: "UniAssociation",
          },
          { ID: "Composition", Label: "Composition", Name: "Composition" },
          {
            ID: "BiAssociation",
            Label: "BiAssociation",
            Name: "BiAssociation",
          },
        ],
        "",
        "",
        "relationtype"
      );
      $(TypeField).val((elem.Type ??= "UniAssociation"));

      $(TypeField).on("change", (e) => {
        if ($(e.target).val() == "Composition") {
          if (cell.target.style == "table") {
            $(`#DataName`).val(
              addWord($ModelPrefix + "_" + cell.target.value.Label)
            );
            $(`#DataIdentity`).val(cell.source.parent.value.Label + "ID");
            $(`#sourcemultiplicity`).val(elem.DestinationMultiplicity);
            $(`#destinationmultiplicity`).val(elem.SourceMultiplicity);
          }
        } else if ($(e.target).val() == "UniAssociation") {
          if (cell.target.style == "table") {
            if (elem.IsComposition) {
              $(`#DataName`).val(
                addWord($ModelPrefix + "_" + cell.target.value.Label)
              );
              $(`#DataIdentity`).val(cell.source.parent.value.Label + "ID");

              $(`#sourcemultiplicity`).val(elem.DestinationMultiplicity);
              $(`#destinationmultiplicity`).val(elem.SourceMultiplicity);
            } else {
              $(`#DataName`).val(
                addWord($ModelPrefix + "_" + cell.source.parent.value.Label)
              );

              $(`#DataIdentity`).val(cell.target.value.Label + "ID");

              $(`#sourcemultiplicity`).val(elem.SourceMultiplicity);
              $(`#destinationmultiplicity`).val(elem.DestinationMultiplicity);
            }
          }
        } else if ($(e.target).val() == "BiAssociation") {
          if (cell.target.style == "table") {
            if (elem.IsComposition) {
              $(`#DataName`).val(addWord($ModelPrefix + "_" + elem.Name));
              $(`#DataIdentity`).val(elem.Name + "ID");

              $(`#sourcemultiplicity`).val(elem.DestinationMultiplicity);
              $(`#destinationmultiplicity`).val(elem.SourceMultiplicity);
            } else {
              $(`#DataName`).val(addWord($ModelPrefix + "_" + elem.Name));

              $(`#DataIdentity`).val(elem.Name + "ID");

              $(`#sourcemultiplicity`).val(elem.SourceMultiplicity);
              $(`#destinationmultiplicity`).val(elem.DestinationMultiplicity);
            }
          }
        } //todo
      });
    }

    DataNameField = form.addText(
      EntityResources.get("dataname"),
      (elem.DataName ??=
        $ModelPrefix +
        "_" +
        addWord(
          cell.source.style == undefined
            ? cell.source.parent.value.Label
            : cell.source.value.Label
        )),
      "",
      "",
      "DataName"
    );

    DataIdentityField = form.addText(
      EntityResources.get("FKField"),
      (elem.DataIdentity ??=
        Name(cell, elem).split("_")[1] == undefined
          ? Name(cell, elem) + "ID"
          : Name(cell, elem).split("_")[1] + "ID"),
      "",
      false,
      "DataIdentity"
    );

    PluralNameField = form.addText(
      EntityResources.get("pluralname"),
      (elem.PluralName ??= addWord(Name(cell, elem))),
      "",
      "",
      "pluralname"
    );
    $(PluralNameField).attr("onkeypress", "return ValidateKey(event,false)");

    PluralLabelField = form.addText(
      EntityResources.get("plurallabel"),
      (elem.PluralLabel ??= Label(cell, elem) + " ها"),
      "",
      "",
      "plurallabel"
    );

    SourceMultiplicityField = form.addSelect(
      EntityResources.get("sourcemultiplicity"),
      [
        { ID: "0-*", Label: "0-*", Name: "0-*" },
        { ID: "1-*", Label: "1-*", Name: "1-*" },
        { ID: "0-1", Label: "0-1", Name: "0-1" },
        { ID: "1-1", Label: "1-1", Name: "1-1" },
      ],
      "",
      "",
      "sourcemultiplicity"
    );
    $(SourceMultiplicityField).val((elem.SourceMultiplicity ??= "0-*"));

    DestinationMultiplicityField = form.addSelect(
      EntityResources.get("destinationmultiplicity"),
      [
        { ID: "0-*", Label: "0-*", Name: "0-*" },
        { ID: "1-*", Label: "1-*", Name: "1-*" },
        { ID: "0-1", Label: "0-1", Name: "0-1" },
        { ID: "1-1", Label: "1-1", Name: "1-1" },
      ],
      "",
      "",
      "destinationmultiplicity"
    );
    $(DestinationMultiplicityField).val(
      (elem.DestinationMultiplicity ??= "1-1")
    );
  }

  function Column(cell) {
    // Adds a field for the columnname
    LabelField = form.addText(
      EntityResources.get("title"),
      cell.value.Name,
      "",
      "",
      "inputtitle"
    );
    $(LabelField).attr("onkeypress", "return limetChar(event)");

    NameField = form.addText(
      EntityResources.get("systetitle"),
      cell.value.Label,
      "",
      "",
      "inputsystetitle"
    );

    $(NameField).attr("onkeypress", "return ValidateKey(event,false)");

    AttributeTypeIDField = form.addSelect(
      EntityResources.get("type"),
      $RefType,
      "",
      "",
      "attributetypeid"
    );
    $(AttributeTypeIDField).val(cell.value.AttributeTypeID);

    EnumAttributeTypeField = form.addSelect(
      EntityResources.get("enumtype"),
      $RefEnumType,
      "",
      "",
      "enumattributetype"
    );

    $(EnumAttributeTypeField).val((cell.value.EnumTypeID ??= 0));

    DefaultvalueField = form.addText(
      EntityResources.get("defaultvalue"),
      cell.value.Defaultvalue,
      "",
      "",
      "defaultvalue"
    );
    SubjectField = form.addText(
      EntityResources.get("subject"),
      cell.value.Subject,
      "",
      "",
      "subject"
    );

    EsubjectField = form.addText(
      EntityResources.get("esubject"),
      cell.value.Esubject,
      "",
      "",
      "esubject"
    );
    $(EsubjectField).attr("onkeypress", "return ValidateKey(event,false)");

    EditImportanceField = form.addSelect(
      EntityResources.get("editImportance"),
      [
        { ID: "Primary", Label: "Primary", Name: "Primary" },
        { ID: "Supplementary", Label: "Supplementary", Name: "Supplementary" },
      ],
      "",
      "",
      "",
      "editimportance"
    );
    $(EditImportanceField).val(
      cell.value.EditImportance == "" || cell.value.EditImportance == null
        ? "Primary"
        : cell.value.EditImportance
    );

    ViewImportanceField = form.addSelect(
      EntityResources.get("viewImportance"),
      [
        { ID: "Primary", Label: "Primary", Name: "Primary" },
        { ID: "Supplementary", Label: "Supplementary", Name: "Supplementary" },
      ],
      "",
      "",
      "",
      "viewimportance"
    );
    $(ViewImportanceField).val(
      cell.value.ViewImportance == "" || cell.value.ViewImportance == null
        ? "Primary"
        : cell.value.ViewImportance
    );
    inputJson;
    NullableField = form.addCheckbox(
      EntityResources.get("nullable"),
      cell.value.Nullable == 1 ? true : false,
      " Nullable"
    );

    IsSysAttributeField = form.addCheckbox(
      EntityResources.get("IsSysAttribute"),
      cell.value.IsSysAttribute == 1 ? true : false,
      "issysattribute"
    );

    ValueIsUniqueField = form.addCheckbox(
      EntityResources.get("ValueIsUnique"),
      cell.value.ValueIsUnique == 1 ? true : false,
      "valueisunique"
    );

    IsComputedField = form.addCheckbox(
      EntityResources.get("IsComputed"),
      cell.value.IsComputed == 1 ? true : false,
      "iscomputed"
    );

    FormulaField = form.addText(
      EntityResources.get("Formula"),
      (cell.value.Formula ??= null),
      "",
      "",
      "formulaid"
    );
  }

  function Table(cell) {
    // Adds a field for the columnname

    LabelField = form.addText(
      EntityResources.get("title"),
      (cell.value.Name ??= ""),
      "",
      "",
      "inputtitle"
    );
    $(LabelField).attr("onkeypress", "return limetChar(event)");

    NameField = form.addText(
      EntityResources.get("systetitle"),
      cell.value.Label,
      "",
      "",
      "inputsystetitle"
    );

    $(NameField).attr("onkeypress", "return ValidateKey(event,true)");

    DataNameField = form.addText(
      EntityResources.get("dataname"),
      (cell.value.DataName ??= addWord($ModelPrefix + "_" + cell.value.Label)),
      "",
      "",
      "dataname"
    );

    IdentitynameField = form.addText(
      EntityResources.get("identityname"),
      (cell.value.IdentityName ??= cell.value.Label + "ID"),
      "",
      "",
      "identityname"
    );

    PluralNameField = form.addText(
      EntityResources.get("pluralname"),
      (cell.value.PluralName ??= addWord(cell.value.Label)),
      "",
      "",
      "pluralname"
    );
    $(PluralNameField).attr("onkeypress", "return ValidateKey(event,false)");

    PluralLabelField = form.addText(
      EntityResources.get("plurallabel"),
      (cell.value.PluralLabel ??= cell.value.Name + " ها"),
      "",
      "",
      "plurallabel"
    );

    LsubjectField = form.addText(
      EntityResources.get("Subject"),
      (cell.value.Lsubject ??= inputJson.EntityModel.Label),
      "",
      "",
      "Subject"
    );

    LsubSubjectField = form.addText(
      EntityResources.get("SubSubject"),
      (cell.value.LsubSubject ??=
        _Lang == "Fa"
          ? EntityResources.get("Management") + " " + cell.value.Name
          : cell.value.Name + " " + EntityResources.get("Management")),
      "",
      "",
      "Subsubject"
    );

    SubjectField = form.addText(
      EntityResources.get("esubject"),
      (cell.value.Subject ??= inputJson.EntityModel.Name),
      "",
      "",
      "Esubject"
    );

    SubSubjectField = form.addText(
      EntityResources.get("eSubsubject"),
      (cell.value.SubSubject ??= cell.value.Label + "Management"),
      "",
      "",
      "eSubsubject"
    );

    ViewEntryField = form.addText(
      EntityResources.get("ViewEntry"),
      (cell.value.ViewEntry ??= cell.value.Name + " ها"),
      "",
      "",
      "Viewentry"
    );
    CreateEntryField = form.addText(
      EntityResources.get("CreateEntry"),
      (cell.value.CreateEntry ??= cell.value.Name + " جدید"),
      "",
      "",
      "createentry"
    );
    EntryPositionField = form.addText(
      EntityResources.get("EntryPosition"),
      (cell.value.EntryPosition ??= 0),
      "number",
      "",
      "entryposition"
    );

    EditComplexityField = form.addSelect(
      EntityResources.get("EditComplexity"),
      [
        { ID: "Low", Label: "Low", Name: "Low" },
        { ID: "High", Label: "High", Name: "High" },
      ],
      "",
      "",
      "",
      "editcomplexity"
    );
    $(EditComplexityField).val((cell.value.EditComplexity ??= "Low"));

    HasModuleField = form.addCheckbox(
      EntityResources.get("hasmodule"),
      cell.value.HasModule == 1 ? true : false,
      "hasmodule"
    );
    RemovableField = form.addCheckbox(
      EntityResources.get("removable"),
      cell.value.Removable == 1 ? true : false,
      "removable"
    );
    RestorableField = form.addCheckbox(
      EntityResources.get("restorable"),
      cell.value.Restorable == 1 ? true : false,
      "restorable"
    );
    EnableableField = form.addCheckbox(
      EntityResources.get("enableable"),
      cell.value.Enableable == 1 ? true : false,
      "enableable"
    );
    ModifiableField = form.addCheckbox(
      EntityResources.get("modifiable"),
      cell.value.Modifiable == 1 ? true : false,
      "modifiable"
    );
    IsRecursiveField = form.addCheckbox(
      EntityResources.get("IsRecursive"),
      cell.value.IsRecursive == 1 ? true : false,
      "isrecursive"
    );
    IsDependentField = form.addCheckbox(
      EntityResources.get("IsDependent"),
      cell.value.IsDependent == 1 ? true : false,
      "isdependent"
    );
    IsCardinalField = form.addCheckbox(
      EntityResources.get("isCardinal"),
      cell.value.IsCardinal == 1 ? true : false,
      "isCardinal"
    );

    IsBasicField = form.addCheckbox(
      EntityResources.get("IsBasic"),
      cell.value.IsBasic == 1 ? true : false,
      "isbasic"
    );
  }

  // Defines the function to be executed when the
  // Cancel button is pressed in the dialog
  var cancelFunction = function () {
    wnd.destroy();
  };

  var parent = graph.model.getParent(cell);
  var name;

  if (cell.value == undefined) {
    name = LabelField.value + "_" + EntityResources.get("relation");
  } else {
    if (parent.value == undefined) {
      name = cell.value.Name;
    } else {
      name = parent.value.Name + "_" + cell.value.Name;
    }
  }
  wnd = showModalWindow(
    name,
    cell,
    form,
    null,
    cell.style == "table" ? "575" : "auto"
  );
  form.addButtons(okFunction, cancelFunction);
  $(`#btnEntityOK`).text(EntityResources.get($(`#btnEntityOK`).text()));
  $(`#btnEntityCAL`).text(EntityResources.get($(`#btnEntityCAL`).text()));

  $(`#isdependent`).on("change", function () {
    if ($(this).is(":checked")) {
      $(`#hasmodule`).attr("checked", false);
    }
  });

  $(`#hasmodule`).on("change", function () {
    if ($(this).is(":checked")) {
      $(`#isdependent`).attr("checked", false);
    }
  });
}

function AddFKtoTable(cell) {
  var model = graph.model;
  this.model.beginUpdate();
  try {
    if (model.isEdge(cell)) {
      var trg = model.getTerminal(cell, false);
      var columnObject = new Column("Project");
      var column = new mxCell(columnObject, new mxGeometry(0, 0, 0, 26));
      column.setVertex(true);
      column.setConnectable(true);
      var col1 = model.cloneCell(column);
      col1.value.Label = cell.source.parent.value.Label + "ID";
      col1.value.Name = cell.source.parent.value.Name;
      col1.value.AttributeType = "ForeignKey";
      col1.value.AttributeTypeID = 0;
      col1.value.FK = true;
      col1.setConnectable(false);
      graph.addCell(col1, trg);
      return col1;
    }
  } finally {
    model.endUpdate();
    graph.refresh();
  }
}

var ConnectionReverse = function (cells) {
  var model = graph.model;

  var select = [];

  this.model.beginUpdate();
  try {
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];

      //insert FK to target table
      var trg = AddFKtoTable(cells[i]);

      if (model.isEdge(cell)) {
        var src = model.getTerminal(cell, true);

        model.setTerminal(cell, trg, true);
        model.setTerminal(cell, src.parent, false);

        //delete old FK
        DeleteSourceFK(src);

        var geo = model.getGeometry(cell);

        if (geo != null) {
          geo = geo.clone();

          if (geo.points != null) {
            geo.points.reverse();
          }

          var sp = geo.getTerminalPoint(true);
          var tp = geo.getTerminalPoint(false);

          geo.setTerminalPoint(sp, false);
          geo.setTerminalPoint(tp, true);
          model.setGeometry(cell, geo);

          select.push(cell);
        }
      }
    }
  } finally {
    model.endUpdate();
  }

  return select;
};

function DeleteSourceFK(src) {
  this.model.remove(src);
}

function LblAndName_isDuplicate(cell, NameField, LabelField) {
  let dropActType = $(`#Title`).attr("type");
  let cells = graph.getChildCells();
  for (let i in cells) {
    if (cells[i].id != (cell ? cell.id : null)) {
      if (
        cells[i].value != undefined &&
        (cell ? cell.value != undefined : cell == null)
      ) {
        //cell isTable
        let cellStyle = (cell.style ??= dropActType);

        if (cellStyle == "table") {
          if (cells[i].style == "table") {
            if (cells[i].id != (cell ? cell.id : null)) {
              if (cells[i].value.Name == LabelField.value) {
                swal(`${EntityResources.get("lblduplicate")}`, {
                  icon: "warning",
                });
                $(`#inputtitle`).css("border-color", "red");
                $(`#inputsystetitle`).css("border-color", "#000");
                return false;
              } else if (cells[i].style == "table") {
                $(`#inputtitle`).css("border-color", "#000");
                if (cells[i].value.Label == NameField.value) {
                  swal(`${EntityResources.get("nameduplicate")}`, {
                    icon: "warning",
                  });
                  $(`#inputsystetitle`).css("border-color", "red");
                  return false;
                }
              }
            }
          }
        } else {
          //cell isColumn
          if (cells[i].style == "table") {
            if (cells[i].id == cell.parent.id) {
              //search in childern
              for (let j in cells[i].children) {
                if (cells[i].children[j].id != cell.id) {
                  if (cells[i].children[j].value) {
                    if (cells[i].children[j].value.Label == NameField.value) {
                      swal(`${EntityResources.get("nameduplicate")}`, {
                        icon: "warning",
                      });
                      $(`#inputsystetitle`).css("border-color", "red");
                      $(`#inputtitle`).css("border-color", "#000");

                      return false;
                    }

                    if (cells[i].children[j].value.Name == LabelField.value) {
                      swal(`${EntityResources.get("lblduplicate")}`, {
                        icon: "warning",
                      });
                      $(`#inputtitle`).css("border-color", "red");
                      $(`#inputsystetitle`).css("border-color", "#000");

                      return false;
                    }
                  }
                }
              }
            }
          } else {
            //isRelations

            if ($(`#Title`).attr("type") != undefined) {
              if (cells[i].id != cell.id) {
                if (cells[i].style != "tableFK") {
                  if (cells[i].target.value.Name == $(`#inputtitle`).val()) {
                    swal(`${EntityResources.get("lblduplicate")}`, {
                      icon: "warning",
                    });
                    $(`#inputtitle`).css("border-color", "red");
                    $(`#inputsystetitle`).css("border-color", "#000");
                    return false;
                  } else {
                    $(`#inputtitle`).css("border-color", "#000");

                    if (
                      cells[i].source.parent.value.Label +
                        "_" +
                        cells[i].target.value.Label ==
                      $(`#inputsystetitle`).val()
                    ) {
                      swal(`${EntityResources.get("nameduplicate")}`, {
                        icon: "warning",
                      });
                      $(`#inputsystetitle`).css("border-color", "red");
                      return false;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return true;
}
// Defines the column user object

function ForeignKey() {
  $(`#graphContainer`).append(
    `<div id="myModal" class="modal" ><div id="formModal" class="modal-content" ><div id="contentM"></div></div></div>`
  );

  $(`#contentM`).append(
    `<div id="headerAddtable"><img id="addtablekey" src="${mxBasePath}images/icons48/Foreignkey.png"></img><span id="addtablespan">${EntityResources.get(
      "Addtable"
    )}</span></div>
     <div id="bodyAddtable">
     <div id="selectdivAddtable"><span>${EntityResources.get(
       "tables"
     )}</span><select id="selectAddtable" multiple></select></div>
     <div id="bottomAddtable">
     <button class="btnAddtable" onclick="AddFK()">${EntityResources.get(
       "add"
     )}</button>
     <button class="btnAddtable" onclick="ExitModal()">${EntityResources.get(
       "close"
     )}</button>
     </div>
     </div>`
  );

  //$RefEntities
  $.ajax({
    type: "POST",
    url: "../../App_Sys/Services/Admin/Entity.asmx/GetEntities",
    data: "",
    contentType: false,
    async: false,
    dataType: "xml",
    processData: false,

    error: function (jqXHR, textStatus, errorThrown) {
      alert(JSON.stringify(jqXHR));
      return;
    },
    success: function (data) {
      $RefEntities = JSON.parse(
        data.getElementsByTagName("string")[0].childNodes[0].nodeValue
      );
    },
  });

  //getID tableFK from ui
  let cells = graph.getChildCells();
  let _isTableFK = [];
  _isTableFK = cells.filter((x) => x.style == "tableFK" || x.style == "table");

  //add to select list
  for (let i = 0; i < $RefEntities.length; i++) {
    let bool = false;
    for (let j = 0; j < _isTableFK.length; j++)
      if ($RefEntities[i].Name == _isTableFK[j].value.Label) bool = true;

    if (!bool) {
      $(`#selectAddtable`).append(
        `<option style="margin:2px" value="${$RefEntities[i].ID}">${
          _Lang == "Fa" ? $RefEntities[i].Label : $RefEntities[i].Name
        }</option>`
      );
    }
  }
}

AddFK = function () {
  let _tables = $(`#selectAddtable`).val();

  for (let i = 0; i < _tables.length; i++) {
    var tableObject = new Table("TABLENAME");
    var table = new mxCell(
      tableObject,
      new mxGeometry(0, 0, 250, 28),
      "tableFK"
    );

    table.setVertex(true);
    table.setConnectable(true);
    var columnObject = new Column("COLUMN");
    var column = new mxCell(columnObject, new mxGeometry(0, 0, 0, 26));
    column.setVertex(true);
    column.setConnectable(true);

    // Adds primary key field into table
    var firstColumn = column.clone();
    firstColumn.value.Name = "ID";
    firstColumn.value.AttributeType = EntityResources.get("Integer");
    firstColumn.value.AttributeTypeID = 5;
    firstColumn.value.PrimaryKey = true;
    firstColumn.value.AutoIncrement = true;
    firstColumn.value.FK = false;
    firstColumn.style = "column";
    firstColumn.setConnectable(false);
    table.insert(firstColumn);

    //style
    let style = new Object();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    style[mxConstants.STYLE_GRADIENTCOLOR] = "#156c7d38";
    style[mxConstants.STYLE_FILLCOLOR] = "#8CCDF5";
    style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = "#ffffff";
    style[mxConstants.STYLE_STROKECOLOR] = "#1B78C8";
    style[mxConstants.STYLE_FONTCOLOR] = "#000000";
    style[mxConstants.STYLE_STROKEWIDTH] = "2";
    style[mxConstants.STYLE_STARTSIZE] = "28";
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = "middle";
    style[mxConstants.STYLE_FONTSIZE] = "12";
    style[mxConstants.STYLE_FONTSTYLE] = 1;
    style[mxConstants.STYLE_IMAGE] = mxBasePath + "images/icons48/table.png";
    // Looks better without opacity if shadow is enabled
    style[mxConstants.STYLE_OPACITY] = "40";

    style[mxConstants.STYLE_SHADOW] = 1;
    graph.getStylesheet().putCellStyle("tableFK", style);

    let LblArr = [];
    LblArr = $RefEntities.filter((x) => x.ID == _tables[i]);
    let SysArr = [];
    SysArr = $RefEntities.filter((x) => x.ID == _tables[i]);
    let name = LblArr.length ? LblArr[0].Label : _tables[i];
    let systemName = SysArr.length ? SysArr[0].Name : _tables[i];
    var model = graph.getModel();
    if (name != null) {
      var v1 = model.cloneCell(table);
      model.beginUpdate();

      try {
        v1.value.Name = name;
        v1.value.Label = systemName;
        v1.geometry.x = 100 + i * 300;
        v1.geometry.y = 200;
        graph.addCell(v1, graph.getDefaultParent());
        v1.geometry.alternateBounds = new mxRectangle(
          0,
          0,
          v1.geometry.width,
          v1.geometry.height
        );
        v1.children[0].value.Name =
          _Lang == "Fa" ? "شناسه " + name : name + "ID ";
      } finally {
        model.endUpdate();
      }

      graph.setSelectionCell(v1);
    }

    $(`#selectAddtable option[value='${_tables[i]}']`).remove();
  }
};

function Column(Label) {
  this.Label = Label + "ID";
}

Column.prototype.Name = null;
Column.prototype.AttributeType = EntityResources.get("Integer");
Column.prototype.AttributeTypeID = 5;
Column.prototype.Formula = null;
Column.prototype.IsIdentity = true;
Column.prototype.Defaultvalue = null;
Column.prototype.Subject = null;
Column.prototype.Esubject = null;
Column.prototype.EditImportance = "Primary";
Column.prototype.ViewImportance = "Primary";
Column.prototype.Nullable = false;
Column.prototype.IsSysAttribute = false;
Column.prototype.IsComputed = false;
Column.prototype.ValueIsUnique = false;
Column.prototype.EnumTypeID = 0;
Column.prototype.HasModule = true;
Column.prototype.SourceMultiplicity = "0-*";
Column.prototype.DestinationMultiplicity = "1-1";
Column.prototype.IdentitynameField = null;

Column.prototype.clone = function () {
  return mxUtils.clone(this);
};

// Defines the table user object
function Table(Label) {
  this.Label = Label;
}
Table.prototype.Name = null;
Table.prototype.DataName = null;
Table.prototype.IdentityName = null;
Table.prototype.HasModule = true;
Table.prototype.PluralName = null;
Table.prototype.Removable = true;
Table.prototype.Restorable = true;
Table.prototype.Enableable = true;
Table.prototype.Modifiable = true;
Table.prototype.IsRecursive = false;
Table.prototype.IsDependent = false;
Table.prototype.IsCardinal = false;
Table.prototype.IsBasic = false;
Table.prototype.Lsubject = null;
Table.prototype.LsubSubject = null;
Table.prototype.Subject = null;
Table.prototype.SubSubject = null;
Table.prototype.ViewEntry = null;
Table.prototype.CreateEntry = null;
Table.prototype.EntryPosition = 0;
Table.prototype.EditComplexity = "Low";

Table.prototype.clone = function () {
  return mxUtils.clone(this);
};

function Import_CS(designJson) {
  RenderJson(designJson);
}

var $Relations = [];
var $RefType = [];
var $RefEnumType = [];
var $ModelPrefix;

function RenderJson(json) {
  //get data model

  main(
    document.getElementById("graphContainer"),
    document.getElementById("outlineContainer"),
    "",
    document.getElementById("sidebarContainer"),
    document.getElementById("statusContainer")
  );

  inputJson = JSON.parse(json);
  $ModelPrefix = inputJson ? inputJson.EntityModel.TablePrefix : "";

  $(`#page-header b`)
    .text(" " + EntityResources.get("designentity") + "  ")
    .append(
      `<b style="font-weight:bold">${
        inputJson ? inputJson.EntityModel.Label : ""
      }</b>`
    );

  //Pars xml
  let xml = inputJson ? inputJson.GraphModel : "";

  var doc = mxUtils.parseXml(xml);
  setGraphXml(doc.documentElement);

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
    $Relations = inputJson.EntityModel.EntityRelations.length > 0
    ? inputJson.EntityModel.EntityRelations.EntityRelation
    : [];

  //$RefEnumType

  $.ajax({
    type: "POST",
    url: "../../App_Sys/Services/Admin/Entity.asmx/GetEnumTypes",
    data: "",
    contentType: false,
    async: false,
    dataType: "xml",
    processData: false,

    error: function (jqXHR, textStatus, errorThrown) {
      alert(JSON.stringify(jqXHR));
      return;
    },
    success: function (data) {
      let _none = { ID: "0", Label: "بدون لیست", Name: "None" };
      $RefEnumType = JSON.parse(
        data.getElementsByTagName("string")[0].childNodes[0].nodeValue
      );
      $RefEnumType.unshift(_none);
    },
  });

  //$RefType

  $.ajax({
    type: "POST",
    url: "../../App_Sys/Services/Admin/Entity.asmx/GetAttributeTypes",
    data: "",
    contentType: false,
    async: false,
    dataType: "xml",
    processData: false,
    error: function (jqXHR, textStatus, errorThrown) {
      alert(JSON.stringify(jqXHR));
      return;
    },
    success: function (data) {
      $RefType = JSON.parse(
        data.getElementsByTagName("string")[0].childNodes[0].nodeValue
      );
    },
  });
}

function GetType(ID, nameORlbl) {
  let item = [];
  item = $RefType.filter((x) => x.ID == ID);

  return item.length
    ? nameORlbl == "name"
      ? item[0].Name
      : item[0].Label
    : ID;
}
function GetEnumType(ID, nameORlbl) {
  let item = [];
  item = $RefEnumType.filter((x) => x.ID == ID);

  return item.length
    ? nameORlbl == "name"
      ? item[0].Name
      : item[0].Label
    : "null";
}

function Export() {
  let _EntityAttribute = [];
  let _EntityPlusFK = [];
  let enc = new mxCodec(mxUtils.createXmlDocument());
  let node = enc.encode(editor.graph.getModel());
  let xml = mxUtils.getPrettyXml(node);
  let cells = graph.getChildCells();

  //EntitiesID Generator
  function ENTITYID() {
    let id = _pageKey + "00";
    return () => {
      return id++;
    };
  }
  var _ENTITYID = ENTITYID();

  //EntitiesID Generator
  function RELATIONID() {
    let id = _pageKey + "00";
    return () => {
      return id++;
    };
  }
  var _RELATIONID = RELATIONID();

  let _Entity = [];
  let _AllRelations = [];
  for (let i in cells) {
    if (cells[i].style == "table") {
      //** */

      //ATTRIBUTES

      let TBLID = _ENTITYID();

      function ATTRIBUTEID() {
        let id = TBLID + "00";
        return () => {
          return id++;
        };
      }
      let _ATTRIBUTEID = ATTRIBUTEID();

      _EntityAttribute = [];
      $.ajax({
        type: "POST",
        url: "../../App_Sys/Services/Admin/Entity.asmx/GetEntities",
        data: "",
        contentType: false,
        async: false,
        dataType: "xml",
        processData: false,

        error: function (jqXHR, textStatus, errorThrown) {
          alert(JSON.stringify(jqXHR));
          return;
        },
        success: function (data) {
          $RefEntities = JSON.parse(
            data.getElementsByTagName("string")[0].childNodes[0].nodeValue
          );
        },
      });
      for (let j in cells[i].children) {
        let item = cells[i].children[j];
        if (item.value) {
          if (item.value.PrimaryKey) {
            _EntityAttribute.push({
              Id: _ATTRIBUTEID(),
              UiId: cells[i].children[j].id,
              Name: cells[i].value.Label + "ID ",
              Label:
                _Lang == "Fa"
                  ? "شناسه " + cells[i].value.Name
                  : cells[i].value.Name + "ID ",
              AttributeType: GetType(item.value.AttributeTypeID, "name"),
              AttributeTypeID: item.value.AttributeTypeID,
              EnumTypeID: item.value.EnumTypeID,
              EnumType: GetEnumType(item.value.EnumTypeID, "name"),
              IsIdentity: true,
              SmartTags: {
                EditImportance: item.value.EditImportance,
                ViewImportance: item.value.ViewImportance,
              },
              DefaultValue: null,
            });
          } else {
            let refEnt = [];
            if (item.value.FK) {
              refEnt = $RefEntities.filter((x) => x.Name == item.value.Name);
            }

            let EntityAttributeObj = {
              Id: _ATTRIBUTEID(),
              UiId: cells[i].children[j].id,
              Name: item.value.Label,
              Label: item.value.Name,
              AttributeTypeID: item.value.AttributeTypeID,
              AttributeType: GetType(item.value.AttributeTypeID, "name"),
              EnumTypeID: item.value.EnumTypeID,
              EnumType: GetEnumType(item.value.EnumTypeID, "name"),
              Nullable: item.value.Nullable == 1 ? true : false,
              IsSysAttribute: item.value.IsSysAttribute == 1 ? true : false,
              IsComputed: item.value.IsComputed == 1 ? true : false,
              Formula: item.value.Formula,
              ValueIsUnique: item.value.ValueIsUnique == 1 ? true : false,
              // RefEntityID: refEnt.length ? +refEnt[0].ID : 0,
              SmartTags: {
                Subject: item.value.Subject,
                ESubject: item.value.Esubject,
                EditImportance: item.value.EditImportance,
                ViewImportance: item.value.ViewImportance,
              },
            };

            if (
              item.value.Defaultvalue != null &&
              item.value.Defaultvalue != ""
            )
              EntityAttributeObj.DefaultValue = item.value.Defaultvalue;

            _EntityAttribute.push(EntityAttributeObj);
            // } else {
            if (item.value.FK) {
              //add fk attribute without export fk attribute
              _EntityPlusFK.push({
                UiId: cells[i].children[j].id,
                EntityId: TBLID,
                EntityName: cells[i].value.Label,
              });
            }
          }
        } else if (!item.value) {
          //add relation subEntities
          cells.push(item);
        }
      }

      //ENTITIES
      let EntityObj = {
        _attributes: { title: cells[i].value.Label },
        Id: TBLID,
        UiId: cells[i].id,
        Name: cells[i].value.Label,
        Label: cells[i].value.Name,
        DataName: (cells[i].value.DataName ??= addWord(
          $ModelPrefix + "_" + cells[i].value.Label
        )),
        IdentityName: (cells[i].value.IdentityName ??=
          cells[i].value.Label + "ID"),
        PluralName: (cells[i].value.PluralName ??= addWord(
          cells[i].value.Label
        )),
        PluralLabel: (cells[i].value.PluralLabel ??=
          cells[i].value.Name + " ها"),
        Version: "custom",
        HasModule: cells[i].value.HasModule == 1 ? true : false,
        Removable: cells[i].value.Removable == 1 ? true : false,
        Restorable: cells[i].value.Restorable == 1 ? true : false,
        Enableable: cells[i].value.Enableable == 1 ? true : false,
        Modifiable: cells[i].value.Modifiable == 1 ? true : false,
        IsRecursive: cells[i].value.IsRecursive == 1 ? true : false,
        IsBasic: cells[i].value.IsBasic == 1 ? true : false,
        IsCardinal: cells[i].value.IsCardinal == 1 ? true : false,
        IsDependent: cells[i].value.IsDependent == 1 ? true : false,
        SmartTags:
          cells[i].value.IsDependent == 1
            ? {
                IsDependent: true,
              }
            : {
                Lsubject: (cells[i].value.LSubject ??=
                  inputJson.EntityModel.Label),
                Subject: (cells[i].value.Subject ??=
                  inputJson.EntityModel.Name),
                LsubSubject: (cells[i].value.LsubSubject ??=
                  _Lang == "Fa"
                    ? EntityResources.get("Management") +
                      " " +
                      cells[i].value.Name
                    : cells[i].value.Name +
                      " " +
                      EntityResources.get("Management")),
                SubSubject: (cells[i].value.SubSubject ??=
                  cells[i].value.Label + "Management"),
                EditComplexity: cells[i].value.EditComplexity,
                ViewEntry: (cells[i].value.ViewEntry ??=
                  cells[i].value.Name + " ها"),
                CreateEntry: (cells[i].value.CreateEntry ??=
                  cells[i].value.Name + " جدید"),
                EntryPosition: +cells[i].value.EntryPosition,
              },

        Attributes: {
          EntityAttribute: _EntityAttribute,
        },
        Relations: {
          Relation: [],
        },
      };

      //Module
      if (cells[i].value.HasModule == 1) {
        EntityObj.Module = {
          Id: TBLID,
          Name: cells[i].value.Label + "Management",
          Type: "Generic",
          Accesses: {
            Access: [
              {
                Id: +(TBLID + "0"),
                Name: "Manage " + cells[i].value.Label + "s",
                Type: "GenericWrite",
              },
              {
                Id: +(TBLID + "1"),
                Name: "View " + cells[i].value.Label + "s",
                Type: "GenericRead",
              },
            ],
          },
        };
      }

      _Entity.push(EntityObj);
    }

    if (cells[i].value == "") {
      _AllRelations.push(cells[i]);
    }
  }

  //RELATION

  var _Relations = [];
  for (let m in _AllRelations) {
    let obj = {};
    let defaultRelation = true;
    for (let j = 0; j < $Relations.length; j++) {
      if ($Relations[j].UiId == _AllRelations[m].id) {
        defaultRelation = false;
        obj = $Relations[j];
        break;
      }
    }

    let cell = {};
    for (let j = 0; j < cells.length; j++) {
      if (cells[j].id == _AllRelations[m].id) {
        cell = cells[j];
        break;
      }
    }
    //isdefault
    //$RefEntities
    $.ajax({
      type: "POST",
      url: "../../App_Sys/Services/Admin/Entity.asmx/GetEntities",
      data: "",
      contentType: false,
      async: false,
      dataType: "xml",
      processData: false,

      error: function (jqXHR, textStatus, errorThrown) {
        alert(JSON.stringify(jqXHR));
        return;
      },
      success: function (data) {
        $RefEntities = JSON.parse(
          data.getElementsByTagName("string")[0].childNodes[0].nodeValue
        );
      },
    });

    let isTableFK = false;
    if (cell.target) {
      if (cell.target.style == "tableFK") {
        isTableFK = true;
      }
    }

    if (defaultRelation) {
      _Relations.push({
        Id: _RELATIONID(),
        UiId: _AllRelations[m].id,
        Name:
          Name(cell, obj).split("_")[1] != undefined
            ? Name(cell, obj)
            : cell.source.value.Label,
        Label:
          Label(cell, obj).split("_")[1] != undefined
            ? Label(cell, obj)
            : cell.source.value.Name,
        abel: cell.source.value.FKc
          ? ""
          : _Entity.filter((x) => x.Name == Name(cell, obj).split("_")[0])[0]
              .Label,
        ReversLabel:
          cell.source.style != "table"
            ? cell.source.parent.value.Label
            : cell.source.value.Label,

        Type: "UniAssociation",
        DataName:
          $ModelPrefix +
          "_" +
          addWord(
            cell.source.style == undefined
              ? cell.source.parent.value.Label
              : cell.source.value.Label
          ),

        DataIdentity:
          Name(cell, obj).split("_")[1] != undefined
            ? Name(cell, obj).split("_")[1] + "ID"
            : Name(cell, obj) + "ID",
        PluralName: addWord(
          (Name(cell, obj).split("_")[1] ??= Name(cell, obj))
        ),
        PluralLabel: Label(cell, obj) + " ها",

        SourceEntityID: +getEntity(_AllRelations[m], "source", false, "id"),
        SourceEntity: getEntity(_AllRelations[m], "source", false, "name"),

        SourceMultiplicity: "0-*",
        DestinationEntityID: isTableFK
          ? +$RefEntities.filter((x) => x.Name == cell.target.value.Label)[0].ID
          : +getEntity(_AllRelations[m], "target", false, "id"),
        DestinationEntity: isTableFK
          ? cell.target.value.Label
          : getEntity(_AllRelations[m], "target", false, "name"),
        DestinationMultiplicity: "1-1",
        AssociationEntity: {
          Id: 0,
          Name: "",
          Type: "",
        },
        IsComposition: false,
        Version: "custom",
      });
    } else {
      let EntityRelation = {
        Id: _RELATIONID(),
        UiId: _AllRelations[m].id,
        Name: obj.Name,
        Label: obj.Label,
        ReversLabel: obj.ReversLabel,
        Type: obj.Type,
        DataName: obj.DataName,
        DataIdentity: obj.DataIdentity,
        PluralName: obj.PluralName,
        PluralLabel: obj.PluralLabel,
        SourceEntityID: +getEntity(
          _AllRelations[m],
          "source",
          obj.IsComposition,
          "id"
        ),
        SourceEntity: getEntity(
          _AllRelations[m],
          "source",
          obj.IsComposition,
          "name"
        ),
        SourceMultiplicity: obj.SourceMultiplicity,
        DestinationEntityID: isTableFK
          ? +$RefEntities.filter((x) => x.Name == cell.target.value.Label)[0].ID
          : +getEntity(_AllRelations[m], "target", obj.IsComposition, "id"),
        DestinationEntity: isTableFK
          ? cell.target.value.Label
          : getEntity(_AllRelations[m], "target", obj.IsComposition, "name"),
        DestinationMultiplicity: obj.DestinationMultiplicity,
        AssociationEntity: {
          Id: 0,
          Name: "",
          Type: "",
        },
        IsComposition: (obj.IsComposition ??= false),
        Version: "custom",
      };
      if (obj.Type == "BiAssociation") {
        EntityRelation.AssociationEntity = {
          Id: _ENTITYID(),
          Name: obj.Name,
          Type: "Generic",
        };
      }
      _Relations.push(EntityRelation);
    }

    function getEntity(cell, prop, isComposition, state) {
      let _UiId = null;
      let _Istable = false;

      if (isComposition) {
        if (prop == "source") {
          prop = "target";
        } else {
          prop = "source";
        }
      }

      if (prop == "source") {
        _UiId = cell.source.parent.id;
        if (cell.source.parent.style == "table") _Istable = true;
      } else {
        _UiId = cell.target.id;
        if (cell.target.style == "table") _Istable = true;
      }

      if (_Istable) {
        for (let o in _Entity) {
          let item = _Entity[o];
          if (item.UiId == _UiId) {
            return state == "id" ? item.Id : item.Name;
          }
        }
      } else {
        for (let o in _EntityPlusFK) {
          let item = _EntityPlusFK[o];
          if (item.UiId == _UiId) return state == "id" ? item.Id : item.Name;
        }
      }
    }
  }

  $Relations = _Relations;

  //insert relation in entity
  for (let l in _Entity) {
    _Entity[l].Relations.Relation = [];
    for (let k in _Relations) {
      if (_Entity[l].Id == _Relations[k].SourceEntityID) {
        _Entity[l].Relations.Relation.push({
          Name: _Relations[k].Name,
        });
      }
    }
  }

  //EXPORT

  let _json = {
    GraphModel: xml,
    EntityModel: {
      Entities: { Entity: _Entity },
      EntityRelations: { EntityRelation: _Relations },
    },
  };
  return _json;
}

function ChangeLang() {
  if (_Lang == "Fa") {
    $(`#page-header span`).prop("class", "fa fa-angle-double-left");
  } else if (_Lang == "En") {
    $(`#page-header span`).prop("class", "fa fa-angle-double-right");
  }
}

function Exit() {
  saveDesign(false);
  setTimeout(() => {
    window.open("", "_self").close();
  }, 1000);
}

function Entities_Relaions_Pages(BaseModel, EntityModel, inputJson) {
  // Parse the XML string
  let parser = new DOMParser();
  let BaseDoc = parser.parseFromString(BaseModel.d, "text/xml");
  let getCoreTag = BaseDoc.querySelectorAll("Core")[0];
  let getSoftwaresTag = getCoreTag.querySelectorAll("Softwares")[0];
  let getSoftwareTag = getSoftwaresTag.querySelectorAll("Software")[0];

  //SOFTWARE
  let Id = getSoftwareTag.querySelectorAll("Id")[0];
  let Label = getSoftwareTag.querySelectorAll("Label")[0];
  let Name = getSoftwareTag.querySelectorAll("Name")[0];
  Id.textContent = _pageKey;
  Label.textContent = inputJson.EntityModel.Label;
  Name.textContent = inputJson.EntityModel.Name;
  let BaseEntityModel = getSoftwareTag.querySelectorAll("EntityModel")[0];

  //remove parsererror
  BaseEntityModel = Cleanparser(BaseEntityModel);

  //Parse Export EntityModel
  EntityModel = parser.parseFromString(EntityModel, "text/xml");
  //ENTITIES
  let Entities = EntityModel.querySelectorAll("Entities")[0];
  BaseEntityModel.appendChild(Entities);

  //ENTITY RELATIONS
  let Relations = EntityModel.querySelectorAll("EntityRelations")[0];
  BaseEntityModel.appendChild(Relations);

  /***PAGES AND MENU***/

  //PAGES

  let Lsubject;
  let Subject;
  let LsubSubject;
  let SubSubject;

  let Entity = Entities.getElementsByTagName("Entity");

  //PAGEID Generator
  function PAGEID() {
    let id = _pageKey + "000";
    return () => {
      return id++;
    };
  }
  var _PAGEID = PAGEID();
  Entity = [...Entity];

  Entity.sort((a, b) => {
    const aValue = a.children[15].textContent === "true" ? 1 : 0;
    const bValue = b.children[15].textContent === "true" ? 1 : 0;
    return bValue - aValue; // Sorts in descending order, "true" first
  });

  for (let i = 0; i < Entity.length; i++) {
    if (Entity[i].getElementsByTagName("IsDependent").length) {
      if (
        Entity[i].getElementsByTagName("IsDependent")[0].textContent == "false"
      ) {
        let PageExist = false;

        let Page = BaseDoc.querySelectorAll("Page");

        Lsubject = Entity[i].getElementsByTagName("Lsubject")[0].textContent;
        Subject = Entity[i].getElementsByTagName("Subject")[0].textContent;

        LsubSubject =
          Entity[i].getElementsByTagName("LsubSubject")[0].textContent;

        SubSubject =
          Entity[i].getElementsByTagName("SubSubject")[0].textContent;

        try {
          //check duplikate page
          for (let j = 0; j < Page.length; j++) {
            let PageName = Page[j].getElementsByTagName("Name")[0].textContent;

            if (PageName == Subject + "#" + SubSubject) {
              PageExist = true;
              break;
            }
          }
        } finally {
          if (!PageExist) {
            //create new page
            let lblTxt = Lsubject.concat("#", LsubSubject);
            let Newpage = `
          <Page>
          <Id>${_PAGEID()}</Id>
          <Name>${Subject}#${SubSubject}</Name>
          <Label>${lblTxt}</Label>
          <HeaderVisible>true</HeaderVisible>
          <Type>ManageEntities</Type>
          <Icon/>
          <PageTemplate>Template2</PageTemplate>
          <Version>custom</Version>
          <SmartTags>
          <Subject>${Subject}</Subject>
          <SubSubject>${SubSubject}</SubSubject>
          <ViewEntry>لیست</ViewEntry>
          <CreateEntry>جدید</CreateEntry>
          </SmartTags>
          </Page>`;

            let parser = new DOMParser();
            let _Newpage = parser.parseFromString(Newpage, "text/xml");
            _Newpage = Cleanparser(_Newpage);
            _Newpage = _Newpage.querySelectorAll("Page")[0];
            Pages = BaseDoc.querySelectorAll("Pages")[0];
            Pages.appendChild(_Newpage);
          }
        }
      }
    }
  }

  //MENUS

  let MenuExist = false;
  let SideMenu = BaseDoc.querySelectorAll("SideMenu")[0];
  let MenuItems = SideMenu.querySelectorAll("MenuItems")[0];
  let GeneralMenu = `<MenuItem>
      <Id>100${_pageKey}</Id>
      <Name>${Subject}</Name>
      <Label>${Lsubject}</Label>
      <Icon>${Subject.split("Management")[0]}.png</Icon>
      <Version>custom</Version>
      <MenuItems>
      </MenuItems>
      </MenuItem>`;

  let _GeneralMenu = parser.parseFromString(GeneralMenu, "text/xml");

  _GeneralMenu = Cleanparser(_GeneralMenu);

  _GeneralMenu = _GeneralMenu.querySelectorAll("MenuItem")[0];

  MenuItems.appendChild(_GeneralMenu);

  MenuItems = MenuItems.querySelectorAll("MenuItems")[0];

  //MenuId Generator
  function MENUID() {
    let id = "10" + _pageKey + "000";
    return () => {
      return id++;
    };
  }
  var _MENUID = MENUID();

  for (let i = 0; i < Entity.length; i++) {
    if (Entity[i].getElementsByTagName("IsDependent").length) {
      if (
        Entity[i].getElementsByTagName("IsDependent")[0].textContent == "false"
      ) {
        MenuExist = false;

        let Menu = MenuItems.querySelectorAll("MenuItem");

        Lsubject = Entity[i].getElementsByTagName("Lsubject")[0].textContent;

        Subject = Entity[i].getElementsByTagName("Subject")[0].textContent;

        LsubSubject =
          Entity[i].getElementsByTagName("LsubSubject")[0].textContent;

        SubSubject =
          Entity[i].getElementsByTagName("SubSubject")[0].textContent;

        try {
          //check duplikate menu
          for (let j = 0; j < Menu.length; j++) {
            let MenuName = Menu[j].getElementsByTagName("Name")[0].textContent;
            if (MenuName == SubSubject) {
              MenuExist = true;
              break;
            }
          }
        } finally {
          if (!MenuExist) {
            //create new menu
            let NewMenu = `
            <MenuItem>
            <Id>${_MENUID()}</Id>
            <Name>${SubSubject}</Name>
            <Label>${LsubSubject}</Label>
            <Icon>fa-get-pocket</Icon>
            <Version>custom</Version>
            <SmartTags>
                <Subject>${Subject}</Subject>
                <SubSubject>${SubSubject}</SubSubject>
            </SmartTags>
            </MenuItem>`;

            let _NewMenu = parser.parseFromString(NewMenu, "text/xml");
            _NewMenu = Cleanparser(_NewMenu);
            _NewMenu = _NewMenu.querySelectorAll("MenuItem")[0];

            MenuItems.appendChild(_NewMenu);
          }
        }
      }
    }
  }

  return BaseDoc;
}

function Cleanparser(object) {
  let parsererrors = object.getElementsByTagName("parsererror");
  parsererrors = Array.from(parsererrors);
  parsererrors.forEach((parsererror) => {
    parsererror.parentNode.removeChild(parsererror);
  });
  return object;
}

function BaseXml(EntityModel) {
  let xmlDoc = "";

  $.ajax({
    type: "POST",
    url: "../../App_Sys/Services/Admin/Entity.asmx/GetBaseXml",
    data: `{}`,
    contentType: "application/json; charset=utf-8",
    async: false,
    dataType: "json",
    error: function (jqXHR, textStatus, errorThrown) {
      alert(JSON.stringify(jqXHR));
    },
    success: function (BaseModel) {
      //Assign your parsed XML documents To xmlDoc

      xmlDoc = Entities_Relaions_Pages(BaseModel, EntityModel, inputJson);
    },
  });

  var serializer = new XMLSerializer();
  var xmlString = serializer.serializeToString(xmlDoc);
  return xmlString;
}
