/* Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)*/
/* Release Ferdos.WebAppDesk 4.2.1.0*/
/* Release Ferdos.BPMS*/

var $JSON_IMPORTED = "";
var _SLA = [];
var _Setting = [];
var _Cartabele = [];
var _CurrentPosition = [];
var _AssignmentOBJ = [];
var _ScheduleOBJ = [];
var Obj_EnumType = [];
var $editorUI;
var $DeletedIDs = {
    DeletedFormIDs: [],
    DeletedDocIDs: [],
};

function Actions(editorUi) {
    $editorUI = editorUi;
    this.editorUi = editorUi;
    this.actions = new Object();
    this.init();
}

/**
 * Adds the default actions.
 */
printDiagram = function () {
    $editorUI.showDialog(
        new PrintDialog($editorUI).container,
        300,
        180,
        true,
        true
    );
};
Actions.prototype.init = function () {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    var isGraphEnabled = function () {
        return (
            Action.prototype.isEnabled.apply(this, arguments) && graph.isEnabled()
        );
    };

    Getxml = function () {
        return mxUtils.getXml(editor.getGraphXml());
    };

    //Get all the elements except connections//
    getGraphChildCells = function (items) {
        return graph.getChildCells(items || null);
    };

    Elements_except_Connections = function () {
        let cells = graph.getChildCells();
        let arr = [];

        for (let i = 0; i < cells.length; i++) {
            //pool
            if (getType(cells[i].style) == "Pool") {
                let pool = cells[i];
                //lane
                let lanes = pool.children;
                for (let k = 0; k < lanes.length; k++) {
                    for (let count = 0; count < Object.keys(lanes[k]).length; count++) {
                        //element
                        if (Object.keys(lanes[k])[count] == "children") {
                            let elements = lanes[k].children;
                            for (let j = 0; j < elements.length; j++) {
                                if (getType(elements[j].style) != "Connection")
                                    arr.push(elements[j]);
                            }
                        }
                    }
                }
                //just lane
            } else if (getType(cells[i].style) == "Lane") {
                let lane = cells[i];
                for (let count = 0; count < Object.keys(lane).length; count++) {
                    //element
                    if (Object.keys(lane)[count] == "children") {
                        let elements = lane.children;
                        for (let k = 0; k < elements.length; k++) {
                            if (getType(elements[k].style) != "Connection")
                                arr.push(elements[k]);
                        }
                    }
                }
            } else {
                //just element
                if (getType(cells[i].style) != "Connection") arr.push(cells[i]);
            }
        }
        if (arr.length) return arr;
    };

    FlowElements = function () {
        return getFlows();
    };

    this.Export = () => {
        let DefaultUI = {};
        const _FlowElements = FlowElements();

        if (_FlowElements == false) {
            return JSON.stringify(DefaultUI);
        } else {
            DefaultUI.GraphModel = Getxml().replaceAll(
                mxResources.get("DecisionGateway"),
                ""
            );

            DefaultUI.ProcessModel = {
                ProcessID: +_pageKey,
                Label: $JSON_IMPORTED.ProcessModel.Label,
                Type: $JSON_IMPORTED.ProcessModel.Type,
                Category: $JSON_IMPORTED.ProcessModel.Category,
                Status: $JSON_IMPORTED.ProcessModel.Status,
                Enabled: $JSON_IMPORTED.ProcessModel.Enabled,
                Version: $JSON_IMPORTED.ProcessModel.Version,
                Description: $JSON_IMPORTED.ProcessModel.Description,
                FlowElements: _FlowElements,
                Variables: VariableUI.MainArray,
                Documents: DocumentUI.MainArray,
                DeletedIDs: $DeletedIDs,
            };

            return JSON.stringify(DefaultUI);
        }
    };

    ExportFile = () => {
        let JsonModel = JSON.parse(new Actions($editorUI).Export());
        //SubTable disabled false
        let filter = JsonModel.ProcessModel.Variables.SubTables.filter(
            (x) => x.disabled == true
        );
        filter.map((value) => (value.disabled = false));
        JsonModel = JSON.stringify(JsonModel);
        //convert to code
        // var hash = objectHash.sha1(JsonModel);

        let count = 0;
        let cells = graph.getChildCells();
        let Connections = cells.filter((x) => getType(x.style) == "Connection");
        for (let i in Connections)
            if (
                Connections[i].source == undefined ||
                Connections[i].target == undefined
            )
                count++;
        try {
            if (count == 0) {
                const filename = `Process-${_pageKey}.fdm`;
                let element = document.createElement("a");
                element.setAttribute(
                    "href",
                    "data:text/plain;charset=utf-8," + encodeURIComponent(JsonModel)
                );
                element.setAttribute("download", filename);
                element.style.display = "none";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }
        } catch (error) {
            swal(`${mxResources.get("errorconnection")}`, { icon: "warning" });
        }
    };

    Import = function () {
        /*UI OpenFile*/
        if ($("#myModal").css("display") != "block") {
            ModalConstractor("450px", "content");

            $("#formModal").css("top", "150px");
            $("#formModal").css("border-radius", "0.25rem");
            $(".modal-content").css("padding", "0px");
            const div = '<div id="open_div" style="padding:0px 10px"></div>';
            const btn = '<div id="open_btn_Div"></div>';
            $("#formModal").append(div);
            $("#formModal").append(btn);
            let input_file = `<input type="file" id="file-input" accept=".fdm" style="margin-bottom: 20px;margin-top: 20px;font-size:14px;cursor: pointer;font-weight: 600;font-family: sans-serif;" onchange="ShowBtn()"/><span style="color:#7c7c7c">
      ${mxResources.get("jsonsuport")}</span>`;
            $("#open_div").append(input_file);
            let Open_btn = `<input type="button" id="open_btn" class="btn btn-primary" value="${mxResources.get(
                "open"
            )}" onclick="openDialog()" style="background-color: #3a5ba0;padding-bottom: 20px;width:70px;margin-bottom:5px;font-size: 13px;height:35px" Disabled />`;
            $("#open_btn_Div").append(Open_btn);
            let cancel_btn = `<input type="button" id="cancel_btn" class="btn btn-light" value="${mxResources.get(
                "cancel"
            )}" style="margin-right:5px;width:70px;margin-bottom:5px;font-size: 13px;height:35px" onclick="HideModal()">`;
            $("#open_btn_Div").append(cancel_btn);
        }
    };

    openDialog = function () {
        let input = document.getElementById("file-input").files[0];
        if (input) {
            $(`#open_btn`).removeAttr("Disabled");
            var reader = new FileReader();
            reader.onload = function (e) {
                let json = JSON.parse(e.target.result);

                $JSON_IMPORTED = json;
                RenderJson(json);
                $(`#page-header b`)
                    .text(" " + mxResources.get("designprocess") + "  ")
                    .append(`<b style="font-weight:bold">${json.ProcessModel.Label}</b>`);

                $JSON_IMPORTED.ProcessModel.Variables = json.ProcessModel.Variables;
                // $JSON_IMPORTED.ProcessModel.Variables.SubTables =
                //   json.ProcessModel.Variables.SubTables;
                // $JSON_IMPORTED.ProcessModel.Label = json.ProcessModel.Label;
                $JSON_IMPORTED.ProcessModel.Documents = json.ProcessModel.Documents;
                $JSON_IMPORTED.ProcessModel.FlowElements =
                    json.ProcessModel.FlowElements;

                if ($JSON_IMPORTED.ProcessModel.ProcessID != _pageKey) {
                    swal({
                        title: `${mxResources.get("editProcess")}`,
                        text: `${mxResources.get("areyou")}`,
                        icon: "warning",
                        buttons: {
                            cancel: `${mxResources.get("cancel")}`,
                            confirm: `${mxResources.get("ok")}`,
                        },
                        dangerMode: true,
                    }).then(async (willDelete) => {
                        if (willDelete) {
                            saveDesign(false);

                            RenderJson(json);

                            //delete fdms form and doc
                            // is processid _pageKey
                        }
                    });
                }
            };
            reader.readAsText(input);
            $("#myModal").remove();
        }
    };

    this.Import_CS = function (_json) {
        let json = JSON.parse(_json);
        $JSON_IMPORTED = json;
        RenderJson(json);
        $(`#page-header b`)
            .text(" " + mxResources.get("designprocess") + "  ")
            .append(`<b style="font-weight:bold">${json.ProcessModel.Label}</b>`);
    };

    ShowBtn = function () {
        $("#open_btn").removeAttr("Disabled");
    };

    HideModal = function () {
        $("#myModal").remove();
    };

    RenderJson = function (json) {
        // activity header
        graph.model.clear();
        let getConditions = [];

        let FlowElements = $JSON_IMPORTED.ProcessModel.FlowElements;

        for (let i in FlowElements) {
            let gateway = FlowElements[i].Type;
            if (gateway) {
                if (gateway.includes("Gateway") && !gateway.includes("Parallel")) {
                    if (FlowElements[i].GatewayOption.RoutingRules.length > 0)
                        getConditions.push(...FlowElements[i].GatewayOption.RoutingRules);
                }
            }
        }

        if ($JSON_IMPORTED.ProcessModel.Variables.Items) {
            let arr = $JSON_IMPORTED.ProcessModel.Variables.Items;

            arr = arr.map(function (obj) {
                // Assign new key
                obj["SystemID"] = obj["SysType"];

                // Delete old key
                delete obj["SysType"];

                return obj;
            });

            VariableUI.MainArray = arr;
        } else {
            VariableUI.MainArray = $JSON_IMPORTED.ProcessModel.Variables;
        }

        //SubTableUI.MainArray = $JSON_IMPORTED.ProcessModel.Variables.SubTables;
        Conditions.MainArray = getConditions;
        DocumentUI.MainArray = $JSON_IMPORTED.ProcessModel.Documents;
        for (let i = 0; i <= localStorage.length; i++) {
            if (localStorage.key(i) != null) {
                if (localStorage.key(i).includes("Variables"))
                    localStorage.removeItem(localStorage.key(i));
            }
        }
        //set LastSet SeyetemID

        if (VariableUI.MainArray.length > 0) {
            VariableUI.MainArray.sort(
                (a, b) => +a.SystemID.slice(3) - +b.SystemID.slice(3)
            );

            let last = VariableUI.MainArray.at(-1).SystemID;
            localStorage.setItem("LastSystemID" + _pageKey, last);
        } else {
            localStorage.setItem("LastSystemID" + _pageKey, "Val000");
        }

        //Is Old Fdm

        //Find last row key in variables
        let LastVarRowKey = VariableUI.MainArray.length
            ? VariableUI.MainArray.sort((a, b) => a.RowKey - b.RowKey).at(-1).RowKey
            : "999";
        //Find last row key in conditions
        let LastConRowKey = Conditions.MainArray.length
            ? Conditions.MainArray.sort((a, b) => a.RowKey - b.RowKey).at(-1).RowKey
            : "999";
        //Find last row key in documents
        let LastDocRowKey = DocumentUI.MainArray.length
            ? DocumentUI.MainArray.sort((a, b) => a.RowKey - b.RowKey).at(-1).RowKey
            : "999";
        //Find the greatest rowkey in all rowkeys
        let LastRowKey = Math.max(LastVarRowKey, LastConRowKey, LastDocRowKey);

        localStorage.setItem("LastRowkey", +LastRowKey + 1);

        localStorage.setItem("CurrentRowKey", "");

        localStorage.setItem(
            "Variables" + _pageKey,
            JSON.stringify(VariableUI.MainArray)
        );

let ProcessModel_Flow=$JSON_IMPORTED.ProcessModel.FlowElements
        for (let i=0;i<ProcessModel_Flow.length;i++) {
            if ($JSON_IMPORTED.ProcessModel.FlowElements[i].Schedule) {
                _ScheduleOBJ.push(ProcessModel_Flow[i].Schedule);
            }
            if (ProcessModel_Flow[i].Assignment) {
                if (ProcessModel_Flow[i].Assignment)
                    _AssignmentOBJ.push(
                        ProcessModel_Flow[i].Assignment
                    );
                 if (ProcessModel_Flow[i].Assignment.SLA)
                    _SLA.push(ProcessModel_Flow[i].Assignment.SLA);

                 if (ProcessModel_Flow[i].Assignment.Settings)
                    _Setting.push(
                        ProcessModel_Flow[i].Assignment.Settings
                    );
                 if (ProcessModel_Flow[i].Assignment.Cartable)
                    _Cartabele.push(
                        ProcessModel_Flow[i].Assignment.Cartable
                    );
                    
              

                    

                } else if (ProcessModel_Flow[i].SLA) {
                    _SLA.push(ProcessModel_Flow[i].SLA);
                }


                if (ProcessModel_Flow[i].Type=="EndEvent" || ProcessModel_Flow[i].Type=="UserTask")
                    _CurrentPosition.push({
                        ID: ProcessModel_Flow[i].ElementID,
                        value: ProcessModel_Flow[i].StateID,
                    });

            }


        //get enumTypes
        $.ajax({
            type: "POST",

            url: "../../App_Sys/Services/Admin/Process.asmx/GetEnumTypes",

            data: "",

            contentType: false,

            dataType: "xml",

            processData: false,

            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.stringify(jqXHR));
            },
            success: function (data) {
                Obj_EnumType = JSON.parse(
                    data.getElementsByTagName("string")[0].childNodes[0].nodeValue
                );
            },
        });

        //show graph
        let xml = json.GraphModel;
        var doc = mxUtils.parseXml(xml);
        editor.setGraphXml(doc.documentElement);
    };

    function ModalConstractor(width, parent) {
        let div =
            '<div id="myModal" class="modal" >' +
            '<div id="formModal" class="modal-content">' +
            '<div id="contentM" class="row col-md-12"></div>' +
            "</div></div>";
        $("#" + parent).append(div);

        $("#myModal").css("display", "block");
        $("#formModal").css("width", width);
    }

    this.addAction("editDiagram...", function () {
        var dlg = new EditDiagramDialog(ui);
        ui.showDialog(dlg.container, 620, 420, true, false);
        dlg.init();
    });
    this.addAction("pageSetup...", function () {
        ui.showDialog(new PageSetupDialog(ui).container, 320, 220, true, true);
    }).isEnabled = isGraphEnabled;
    this.addAction(
        "print...",
        function () {
            ui.showDialog(new PrintDialog(ui).container, 300, 180, true, true);
        },
        null,
        "sprite-print",
        Editor.ctrlKey + "+P"
    );
    this.addAction("preview", function () {
        mxUtils.show(graph, null, 10, 10);
    });

    // Edit actions
    this.addAction(
        "undo",
        function () {
            ui.undo();
        },
        null,
        "sprite-undo"
    );
    this.addAction(
        "redo",
        function () {
            ui.redo();
        },
        null,
        "sprite-redo"
    );
    this.addAction(
        "cut",
        function () {
            mxClipboard.cut(graph);
        },
        null,
        "sprite-cut"
    );
    this.addAction(
        "copy",
        function () {
            try {
                mxClipboard.copy(graph);
            } catch (e) {
                ui.handleError(e);
            }
        },
        null,
        "sprite-copy"
    );
    this.addAction("paste", function () {
        if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())) {
            mxClipboard.paste(graph);
        }
    });

    this.addAction(
        "pasteHere",
        function (evt) {
            if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())) {
                graph.getModel().beginUpdate();
                try {
                    var cells = mxClipboard.paste(graph);

                    if (cells != null) {
                        var includeEdges = true;

                        for (var i = 0; i < cells.length && includeEdges; i++) {
                            includeEdges = includeEdges && graph.model.isEdge(cells[i]);
                        }

                        var t = graph.view.translate;
                        var s = graph.view.scale;
                        var dx = t.x;
                        var dy = t.y;
                        var bb = null;

                        if (cells.length == 1 && includeEdges) {
                            var geo = graph.getCellGeometry(cells[0]);

                            if (geo != null) {
                                bb = geo.getTerminalPoint(true);
                            }
                        }

                        bb =
                            bb != null
                                ? bb
                                : graph.getBoundingBoxFromGeometry(cells, includeEdges);

                        if (bb != null) {
                            var x = Math.round(
                                graph.snap(graph.popupMenuHandler.triggerX / s - dx)
                            );
                            var y = Math.round(
                                graph.snap(graph.popupMenuHandler.triggerY / s - dy)
                            );

                            graph.cellsMoved(cells, x - bb.x, y - bb.y);
                        }
                    }
                } finally {
                    graph.getModel().endUpdate();
                }
            }
        },
        false,
        "sprite-paste"
    );

    this.addAction(
        "copySize",
        function (evt) {
            var cell = graph.getSelectionCell();

            if (
                graph.isEnabled() &&
                cell != null &&
                graph.getModel().isVertex(cell)
            ) {
                var geo = graph.getCellGeometry(cell);

                if (geo != null) {
                    ui.copiedSize = new mxRectangle(geo.x, geo.y, geo.width, geo.height);
                }
            }
        },
        null,
        null
    );

    this.addAction(
        "pasteSize",
        function (evt) {
            if (
                graph.isEnabled() &&
                !graph.isSelectionEmpty() &&
                ui.copiedSize != null
            ) {
                graph.getModel().beginUpdate();

                try {
                    var cells = graph.getSelectionCells();

                    for (var i = 0; i < cells.length; i++) {
                        if (graph.getModel().isVertex(cells[i])) {
                            var geo = graph.getCellGeometry(cells[i]);

                            if (geo != null) {
                                geo = geo.clone();
                                geo.width = ui.copiedSize.width;
                                geo.height = ui.copiedSize.height;

                                graph.getModel().setGeometry(cells[i], geo);
                            }
                        }
                    }
                } finally {
                    graph.getModel().endUpdate();
                }
            }
        },
        null,
        null,
        "Alt+Shift+V"
    );

    function deleteCells(includeEdges) {
        // Cancels interactive operations
        graph.escape();
        var select = graph.deleteCells(
            graph.getDeletableCells(graph.getSelectionCells()),
            includeEdges
        );

        if (select != null) {
            graph.setSelectionCells(select);
        }
    }

    this.addAction(
        "delete",
        function (evt) {
            let label;
            let filter = false;
            let isMainGateway = false;
            let cells = graph.getSelectionCells();
            let isUserTask = false;
            for (let i in cells) {
                let Inclusives = [];

                if (
                    getType(cells[i].style) != "Inclusive Gateway" &&
                    getType(cells[i].style) != "Exclusive Gateway"
                ) {
                    Inclusives = Conditions.MainArray.filter(
                        (x) => x.OutgoingEID == cells[i].id
                    );
                    if (Inclusives.length > 0) filter = true;
                    const Document = DocumentUI.MainArray.filter(
                        (x) => x.ActivityID == cells[i].id
                    );
                    if (Document.length > 0) filter = true;
                } else {
                    Inclusives = Conditions.MainArray.filter(
                        (x) => x.OwnerEID == cells[i].id
                    );
                    if (Inclusives.length > 0) {
                        filter = true;
                        isMainGateway = true;
                    }
                }
            }
            if (filter == false) {
                if (
                    graph.getSelectionCells()[0].value != "" &&
                    graph.getSelectionCells()[0].value != null
                ) {
                    label = graph.getSelectionCells()[0].value;
                    eraseLbl(label);
                } else {
                    label = mxResources.get(getType(graph.getSelectionCells()[0].style));
                }

                function eraseLbl(label) {
                    // label = extractContent(label);
                    if (label != null) {
                        if (label.search("<br>") != -1)
                            label = label.replaceAll("<br>", " ");
                        if (label.search("&nbsp;") != -1)
                            label = label.replaceAll("&nbsp", " ").replaceAll(";", "");
                        if (label.search("<div>") != -1)
                            label = label.replaceAll("<div>", " ");
                        if (label.search("</div>") != -1)
                            label = label.replaceAll("</div>", " ");
                        if (label.search("<h1>") != -1)
                            label = label.replaceAll("<h1>", " ");
                        if (label.search("</h1>") != -1)
                            label = label.replaceAll("</h1>", " ");
                        if (label.search("<p>") != -1) label = label.replaceAll("<p>", " ");
                        if (label.search("</p>") != -1)
                            label = label.replaceAll("</p>", " ");
                        return `[ ${label} ]`;
                    }
                }

                swal({
                    title: `${mxResources.get("delete")} ${eraseLbl(label)} `,
                    text:
                        isUserTask == true
                            ? mxResources.get("areyousureForm")
                            : mxResources.get("areyousure"),
                    icon: "warning",
                    buttons: {
                        cancel: `${mxResources.get("cancel")}`,
                        confirm: `${mxResources.get("ok")}`,
                    },
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        let cells = graph.getSelectionCells();
                        deleteCells(evt != null && mxEvent.isControlDown(evt));
                        for (const i in cells) {
                            let getElem;
                            // Assignment
                            getElem = _AssignmentOBJ.filter((x) => x.ID == +cells[i].id);
                            if (getElem.length && getElem != undefined)
                                _AssignmentOBJ.splice(_AssignmentOBJ.indexOf(getElem), 1);

                            //SLA
                            getElem = _SLA.filter((x) => x.ID == +cells[i].id);
                            if (getElem.length && getElem != undefined)
                                _SLA.splice(_SLA.indexOf(getElem[0]), 1);

                            //Setting
                            getElem = _Setting.filter((x) => x.ID == +cells[i].id);
                            if (getElem.length && getElem != undefined)
                                _Setting.splice(_Setting.indexOf(getElem[0]), 1);

                            getElem = _Cartabele.filter((x) => x.ID == +cells[i].id);
                            if (getElem.length && getElem != undefined)
                                _Cartabele.splice(_Cartabele.indexOf(getElem), 1);

                            //delete form File
                            const UserID = +cells[i].id + (500 + +_pageKey) * 10000;
                            $DeletedIDs.DeletedFormIDs.push(UserID);
                        }
                    }
                });
            } else {
                swal(
                    `${mxResources.get("isValid_condition_doc1")}`,
                    `${
                    isMainGateway
                        ? mxResources.get("isMainGateway")
                        : mxResources.get("isValid_condition_doc2")
                    }`,
                    "error",
                    {
                        button: `${mxResources.get("ok")}`,
                    }
                );
            }
        },
        null,
        null
    );

    this.addAction(
        "duplicate",
        function () {
            try {
                graph.setSelectionCells(graph.duplicateCells());
                graph.scrollCellToVisible(graph.getSelectionCell());
            } catch (e) {
                ui.handleError(e);
            }
        },
        null,
        null,
        Editor.ctrlKey + "+D"
    );
    this.addAction(
        "conditions",
        function () {
            try {
                saveDesign(false);
                localStorage.setItem("FieldType", "RoutingRules");
                Table(Conditions);
            } catch (e) {
                ui.handleError(e);
            }
        },
        null,
        null
    );
    this.addAction(
        "Activity_Form",
        function () {
            try {
                if (
                    !JSON.parse(localStorage.getItem("ActiveFD")) ||
                    localStorage.getItem("ActiveFD") == undefined
                ) {
                    const _id = +graph.getSelectionCell().id + (500 + +_pageKey) * 10000;
                    localStorage.setItem(
                        "formLabel" + _id,
                        graph.getSelectionCell().value
                    );
                    localStorage.setItem(
                        "EntityTypes" + _pageKey,
                        JSON.stringify($JSON_IMPORTED.ProcessModel.EntityTypes)
                    );
                    saveDesign(false);

                    setTimeout(() => {
                        window.open(`../App_Dgr/FormDesigner.aspx?id=${_id}`, "_blank");
                    }, 10);
                } else {
                    swal(`${mxResources.get("FormDuplicate")}`, {
                        icon: "warning",
                        buttons: {
                            confirm: `${mxResources.get("ok")}`,
                        },
                    });
                }
            } catch (e) {
                ui.handleError(e);
            }
        },
        null,
        null
    );
    this.addAction(
        "Activity_SLA",
        function () {
            try {
                Activity_SLA(graph);
            } catch (e) {
                ui.handleError(e);
            }
        },
        null,
        null
    );
    this.addAction(
        "TimerStart",
        function () {
            try {
                TimerEvent(graph, "TimerStart");
            } catch (e) {
                ui.handleError(e);
            }
        },
        null,
        null
    );
    this.addAction(
        "IntermediateTimer",
        function () {
            try {
                TimerEvent(graph, "TimerIntermediate");
            } catch (e) {
                ui.handleError(e);
            }
        },
        null,
        null
    );
    this.addAction(
        "Activity_Setting",
        function () {
            try {
                Activity_Setting(graph);
            } catch (e) {
                ui.handleError(e);
            }
        },
        null,
        null
    );
    this.addAction(
        "Activity_Schedule",
        function () {
            try {
                Activity_Schedule(graph);
            } catch (e) {
                ui.handleError(e);
            }
        },
        null,
        null
    );
    this.addAction(
        "Activity_Assign",
        function () {
            try {
                Activity_Assign(graph);
            } catch (e) {
                ui.handleError(e);
            }
        },
        null,
        null
    );
    this.put(
        "turn",
        new Action(
            mxResources.get("turn") + " / " + mxResources.get("reverse"),
            function (evt) {
                graph.turnShapes(
                    graph.getSelectionCells(),
                    evt != null ? mxEvent.isShiftDown(evt) : false
                );
            },
            null,
            null
        )
    );
    this.addAction(
        "selectVertices",
        function () {
            graph.selectVertices(null, true);
        },
        null,
        null
    );
    this.addAction(
        "selectEdges",
        function () {
            graph.selectEdges();
        },
        null,
        null
    );
    this.addAction(
        "selectAll",
        function () {
            graph.selectAll(null, true);
        },
        null,
        null
    );

    this.addAction(
        "selectNone",
        function () {
            graph.clearSelection();
        },
        null,
        null
    );
    this.addAction(
        "lockUnlock",
        function () {
            if (!graph.isSelectionEmpty()) {
                graph.getModel().beginUpdate();
                try {
                    var defaultValue = graph.isCellMovable(graph.getSelectionCell())
                        ? 1
                        : 0;
                    graph.toggleCellStyles(mxConstants.STYLE_MOVABLE, defaultValue);
                    graph.toggleCellStyles(mxConstants.STYLE_RESIZABLE, defaultValue);
                    graph.toggleCellStyles(mxConstants.STYLE_ROTATABLE, defaultValue);
                    graph.toggleCellStyles(mxConstants.STYLE_DELETABLE, defaultValue);
                    graph.toggleCellStyles(mxConstants.STYLE_EDITABLE, defaultValue);
                    graph.toggleCellStyles("connectable", defaultValue);
                } finally {
                    graph.getModel().endUpdate();
                }
            }
        },
        null,
        null
    );
    this.addAction(
        "eventSetting",
        function () {
            if (!graph.isSelectionEmpty()) {
                graph.getModel().beginUpdate();
                try {
                    EventSetting(graph);
                } finally {
                    graph.getModel().endUpdate();
                }
            }
        },
        null,
        null
    );

    // Navigation actions
    this.addAction(
        "home",
        function () {
            graph.home();
        },
        null,
        null,
        "Shift+Home"
    );
    this.addAction(
        "exitGroup",
        function () {
            graph.exitGroup();
        },
        null,
        null,
        Editor.ctrlKey + "+Shift+Home"
    );
    this.addAction(
        "enterGroup",
        function () {
            graph.enterGroup();
        },
        null,
        null,
        Editor.ctrlKey + "+Shift+End"
    );
    this.addAction(
        "collapse",
        function () {
            graph.foldCells(true);
        },
        null,
        null,
        Editor.ctrlKey + "+Home"
    );
    this.addAction(
        "expand",
        function () {
            graph.foldCells(false);
        },
        null,
        null,
        Editor.ctrlKey + "+End"
    );

    // Arrange actions
    this.addAction(
        "toFront",
        function () {
            graph.orderCells(false);
        },
        null,
        null,
        null
    );
    this.addAction(
        "toBack",
        function () {
            graph.orderCells(true);
        },
        null,
        null,
        null
    );
    this.addAction(
        "group",
        function () {
            if (graph.isEnabled()) {
                var cells = mxUtils.sortCells(graph.getSelectionCells(), true);

                if (
                    cells.length == 1 &&
                    !graph.isTable(cells[0]) &&
                    !graph.isTableRow(cells[0])
                ) {
                    graph.setCellStyles("container", "1");
                } else {
                    cells = graph.getCellsForGroup(cells);

                    if (cells.length > 1) {
                        graph.setSelectionCell(graph.groupCells(null, 0, cells));
                    }
                }
            }
        },
        null,
        null
    );
    this.addAction(
        "ungroup",
        function () {
            if (graph.isEnabled()) {
                var cells = graph.getSelectionCells();
                graph.model.beginUpdate();
                try {
                    var temp = graph.ungroupCells();

                    // Clears container flag for remaining cells
                    if (cells != null) {
                        for (var i = 0; i < cells.length; i++) {
                            if (graph.model.contains(cells[i])) {
                                if (
                                    graph.model.getChildCount(cells[i]) == 0 &&
                                    graph.model.isVertex(cells[i])
                                ) {
                                    graph.setCellStyles("container", "0", [cells[i]]);
                                }

                                temp.push(cells[i]);
                            }
                        }
                    }
                } finally {
                    graph.model.endUpdate();
                }

                graph.setSelectionCells(temp);
            }
        },
        null,
        null
    );
    this.addAction("removeFromGroup", function () {
        if (graph.isEnabled()) {
            var cells = graph.getSelectionCells();

            // Removes table rows and cells
            if (cells != null) {
                var temp = [];

                for (var i = 0; i < cells.length; i++) {
                    if (!graph.isTableRow(cells[i]) && !graph.isTableCell(cells[i])) {
                        temp.push(cells[i]);
                    }
                }

                graph.removeCellsFromParent(temp);
            }
        }
    });
    // Adds action
    this.addAction(
        "edit",
        function () {
            if (graph.isEnabled()) {
                graph.startEditingAtCell();
            }
        },
        null,
        null,
        "F2/Enter"
    );
    this.addAction(
        "editData...",
        function () {
            var cell = graph.getSelectionCell() || graph.getModel().getRoot();
            ui.showDataDialog(cell);
        },
        null,
        null,
        Editor.ctrlKey + "+M"
    );
    this.addAction(
        "editTooltip...",
        function () {
            if (graph.isEnabled() && !graph.isSelectionEmpty()) {
                var cell = graph.getSelectionCell();
                var tooltip = "";

                if (mxUtils.isNode(cell.value)) {
                    var tmp = null;

                    if (
                        Graph.translateDiagram &&
                        Graph.diagramLanguage != null &&
                        cell.value.hasAttribute("tooltip_" + Graph.diagramLanguage)
                    ) {
                        tmp = cell.value.getAttribute("tooltip_" + Graph.diagramLanguage);
                    }

                    if (tmp == null) {
                        tmp = cell.value.getAttribute("tooltip");
                    }

                    if (tmp != null) {
                        tooltip = tmp;
                    }
                }

                var dlg = new TextareaDialog(
                    ui,
                    mxResources.get("editTooltip") + ":",
                    tooltip,
                    function (newValue) {
                        graph.setTooltipForCell(cell, newValue);
                    }
                );
                ui.showDialog(dlg.container, 320, 200, true, true);
                dlg.init();
            }
        },
        null,
        null,
        "Alt+Shift+T"
    );
    this.addAction("openLink", function () {
        var link = graph.getLinkForCell(graph.getSelectionCell());

        if (link != null) {
            graph.openLink(link);
        }
    });
    this.addAction(
        "editLink...",
        function () {
            if (graph.isEnabled() && !graph.isSelectionEmpty()) {
                var cell = graph.getSelectionCell();
                var value = graph.getLinkForCell(cell) || "";

                ui.showLinkDialog(value, mxResources.get("apply"), function (link) {
                    link = mxUtils.trim(link);
                    graph.setLinkForCell(cell, link.length > 0 ? link : null);
                });
            }
        },
        null,
        null,
        "Alt+Shift+L"
    );
    this.put(
        "insertImage",
        new Action(mxResources.get("image") + "...", function () {
            if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())) {
                graph.clearSelection();
                ui.actions.get("image").funct();
            }
        })
    ).isEnabled = isGraphEnabled;
    this.put(
        "insertLink",
        new Action(mxResources.get("link") + "...", function () {
            if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())) {
                ui.showLinkDialog("", mxResources.get("insert"), function (link, docs) {
                    link = mxUtils.trim(link);

                    if (link.length > 0) {
                        var icon = null;
                        var title = graph.getLinkTitle(link);

                        if (docs != null && docs.length > 0) {
                            icon = docs[0].iconUrl;
                            title = docs[0].name || docs[0].type;
                            title = title.charAt(0).toUpperCase() + title.substring(1);

                            if (title.length > 30) {
                                title = title.substring(0, 30) + "...";
                            }
                        }

                        var linkCell = new mxCell(
                            title,
                            new mxGeometry(0, 0, 100, 40),
                            "fontColor=#0000EE;fontStyle=4;rounded=1;overflow=hidden;" +
                            (icon != null
                                ? "shape=label;imageWidth=16;imageHeight=16;spacingLeft=26;align=left;image=" +
                                icon
                                : "spacing=10;")
                        );
                        linkCell.vertex = true;

                        var pt = graph.getCenterInsertPoint(
                            graph.getBoundingBoxFromGeometry([linkCell], true)
                        );
                        linkCell.geometry.x = pt.x;
                        linkCell.geometry.y = pt.y;

                        graph.setLinkForCell(linkCell, link);
                        graph.cellSizeUpdated(linkCell, true);

                        graph.getModel().beginUpdate();
                        try {
                            linkCell = graph.addCell(linkCell);
                            graph.fireEvent(
                                new mxEventObject("cellsInserted", "cells", [linkCell])
                            );
                        } finally {
                            graph.getModel().endUpdate();
                        }

                        graph.setSelectionCell(linkCell);
                        graph.scrollCellToVisible(graph.getSelectionCell());
                    }
                });
            }
        })
    ).isEnabled = isGraphEnabled;
    this.addAction(
        "link...",
        mxUtils.bind(this, function () {
            if (graph.isEnabled()) {
                if (graph.cellEditor.isContentEditing()) {
                    var elt = graph.getSelectedElement();
                    var link = graph.getParentByName(elt, "A", graph.cellEditor.textarea);
                    var oldValue = "";

                    // Workaround for FF returning the outermost selected element after double
                    // click on a DOM hierarchy with a link inside (but not as topmost element)
                    if (link == null && elt != null && elt.getElementsByTagName != null) {
                        // Finds all links in the selected DOM and uses the link
                        // where the selection text matches its text content
                        var links = elt.getElementsByTagName("a");

                        for (var i = 0; i < links.length && link == null; i++) {
                            if (links[i].textContent == elt.textContent) {
                                link = links[i];
                            }
                        }
                    }

                    if (link != null && link.nodeName == "A") {
                        oldValue = link.getAttribute("href") || "";
                        graph.selectNode(link);
                    }

                    var selState = graph.cellEditor.saveSelection();

                    ui.showLinkDialog(
                        oldValue,
                        mxResources.get("apply"),
                        mxUtils.bind(this, function (value) {
                            graph.cellEditor.restoreSelection(selState);

                            if (value != null) {
                                graph.insertLink(value);
                            }
                        })
                    );
                } else if (graph.isSelectionEmpty()) {
                    this.get("insertLink").funct();
                } else {
                    this.get("editLink").funct();
                }
            }
        })
    ).isEnabled = isGraphEnabled;
    this.addAction(
        "autosize",
        function () {
            var cells = graph.getSelectionCells();

            if (cells != null) {
                graph.getModel().beginUpdate();
                try {
                    for (var i = 0; i < cells.length; i++) {
                        var cell = cells[i];

                        if (graph.getModel().getChildCount(cell)) {
                            graph.updateGroupBounds([cell], 20);
                        } else {
                            var state = graph.view.getState(cell);
                            var geo = graph.getCellGeometry(cell);

                            if (
                                graph.getModel().isVertex(cell) &&
                                state != null &&
                                state.text != null &&
                                geo != null &&
                                graph.isWrapping(cell)
                            ) {
                                geo = geo.clone();
                                geo.height = state.text.boundingBox.height / graph.view.scale;
                                graph.getModel().setGeometry(cell, geo);
                            } else {
                                graph.updateCellSize(cell);
                            }
                        }
                    }
                } finally {
                    graph.getModel().endUpdate();
                }
            }
        },
        null,
        null,
        Editor.ctrlKey + "+Shift+Y"
    );
    this.addAction("formattedText", function () {
        var refState = graph.getView().getState(graph.getSelectionCell());

        if (refState != null) {
            graph.stopEditing();
            var value = refState.style["html"] == "1" ? null : "1";

            graph.getModel().beginUpdate();
            try {
                var cells = graph.getSelectionCells();

                for (var i = 0; i < cells.length; i++) {
                    state = graph.getView().getState(cells[i]);

                    if (state != null) {
                        var html = mxUtils.getValue(state.style, "html", "0");

                        if (html == "1" && value == null) {
                            var label = graph.convertValueToString(state.cell);

                            if (mxUtils.getValue(state.style, "nl2Br", "1") != "0") {
                                // Removes newlines from HTML and converts breaks to newlines
                                // to match the HTML output in plain text
                                label = label.replace(/\n/g, "").replace(/<br\s*.?>/g, "\n");
                            }

                            // Removes HTML tags
                            var temp = document.createElement("div");
                            temp.innerHTML = graph.sanitizeHtml(label);
                            label = mxUtils.extractTextWithWhitespace(temp.childNodes);

                            graph.cellLabelChanged(state.cell, label);
                            graph.setCellStyles("html", value, [cells[i]]);
                        } else if (html == "0" && value == "1") {
                            // Converts HTML tags to text
                            var label = mxUtils.htmlEntities(
                                graph.convertValueToString(state.cell),
                                false
                            );

                            if (mxUtils.getValue(state.style, "nl2Br", "1") != "0") {
                                // Converts newlines in plain text to breaks in HTML
                                // to match the plain text output
                                label = label.replace(/\n/g, "<br/>");
                            }

                            graph.cellLabelChanged(state.cell, graph.sanitizeHtml(label));
                            graph.setCellStyles("html", value, [cells[i]]);
                        }
                    }
                }

                ui.fireEvent(
                    new mxEventObject(
                        "styleChanged",
                        "keys",
                        ["html"],
                        "values",
                        [value != null ? value : "0"],
                        "cells",
                        cells
                    )
                );
            } finally {
                graph.getModel().endUpdate();
            }
        }
    });
    this.addAction("wordWrap", function () {
        var state = graph.getView().getState(graph.getSelectionCell());
        var value = "wrap";

        graph.stopEditing();

        if (state != null && state.style[mxConstants.STYLE_WHITE_SPACE] == "wrap") {
            value = null;
        }

        graph.setCellStyles(mxConstants.STYLE_WHITE_SPACE, value);
    });
    this.addAction("rotation", function () {
        var value = "0";
        var state = graph.getView().getState(graph.getSelectionCell());

        if (state != null) {
            value = state.style[mxConstants.STYLE_ROTATION] || value;
        }

        var dlg = new FilenameDialog(
            ui,
            value,
            mxResources.get("apply"),
            function (newValue) {
                if (newValue != null && newValue.length > 0) {
                    graph.setCellStyles(mxConstants.STYLE_ROTATION, newValue);
                }
            },
            mxResources.get("enterValue") +
            " (" +
            mxResources.get("rotation") +
            " 0-360)"
        );

        ui.showDialog(dlg.container, 375, 80, true, true);
        dlg.init();
    });
    // View actions
    this.addAction(
        "resetView",
        function () {
            graph.zoomTo(1);
            ui.resetScrollbars();
        },
        null,
        null,
        "Home"
    );
    this.addAction(
        "zoomIn",
        function (evt) {
            if (graph.isFastZoomEnabled()) {
                graph.lazyZoom(true, true, ui.buttonZoomDelay);
            } else {
                graph.zoomIn();
            }
        },
        null,
        null,
        Editor.ctrlKey + " + (Numpad) / Alt+Mousewheel"
    );
    this.addAction(
        "zoomOut",
        function (evt) {
            if (graph.isFastZoomEnabled()) {
                graph.lazyZoom(false, true, ui.buttonZoomDelay);
            } else {
                graph.zoomOut();
            }
        },
        null,
        null,
        Editor.ctrlKey + " - (Numpad) / Alt+Mousewheel"
    );
    this.addAction(
        "fitWindow",
        function () {
            var bounds = graph.isSelectionEmpty()
                ? graph.getGraphBounds()
                : graph.getBoundingBox(graph.getSelectionCells());
            var t = graph.view.translate;
            var s = graph.view.scale;

            bounds.x = bounds.x / s - t.x;
            bounds.y = bounds.y / s - t.y;
            bounds.width /= s;
            bounds.height /= s;

            if (graph.backgroundImage != null) {
                bounds.add(
                    new mxRectangle(
                        0,
                        0,
                        graph.backgroundImage.width,
                        graph.backgroundImage.height
                    )
                );
            }

            if (bounds.width == 0 || bounds.height == 0) {
                graph.zoomTo(1);
                ui.resetScrollbars();
            } else {
                graph.fitWindow(bounds);
            }
        },
        null,
        null,
        Editor.ctrlKey + "+Shift+H"
    );
    this.addAction(
        "fitPage",
        mxUtils.bind(this, function () {
            if (!graph.pageVisible) {
                this.get("pageView").funct();
            }

            var fmt = graph.pageFormat;
            var ps = graph.pageScale;
            var cw = graph.container.clientWidth - 10;
            var ch = graph.container.clientHeight - 10;
            var scale =
                Math.floor(20 * Math.min(cw / fmt.width / ps, ch / fmt.height / ps)) /
                20;
            graph.zoomTo(scale);

            if (mxUtils.hasScrollbars(graph.container)) {
                var pad = graph.getPagePadding();
                graph.container.scrollTop = pad.y * graph.view.scale - 1;
                graph.container.scrollLeft =
                    Math.min(
                        pad.x * graph.view.scale,
                        (graph.container.scrollWidth - graph.container.clientWidth) / 2
                    ) - 1;
            }
        }),
        null,
        null,
        Editor.ctrlKey + "+J"
    );
    this.addAction(
        "fitTwoPages",
        mxUtils.bind(this, function () {
            if (!graph.pageVisible) {
                this.get("pageView").funct();
            }

            var fmt = graph.pageFormat;
            var ps = graph.pageScale;
            var cw = graph.container.clientWidth - 10;
            var ch = graph.container.clientHeight - 10;

            var scale =
                Math.floor(
                    20 * Math.min(cw / (2 * fmt.width) / ps, ch / fmt.height / ps)
                ) / 20;
            graph.zoomTo(scale);

            if (mxUtils.hasScrollbars(graph.container)) {
                var pad = graph.getPagePadding();
                graph.container.scrollTop = Math.min(
                    pad.y,
                    (graph.container.scrollHeight - graph.container.clientHeight) / 2
                );
                graph.container.scrollLeft = Math.min(
                    pad.x,
                    (graph.container.scrollWidth - graph.container.clientWidth) / 2
                );
            }
        }),
        null,
        null,
        Editor.ctrlKey + "+Shift+J"
    );
    this.addAction(
        "fitPageWidth",
        mxUtils.bind(this, function () {
            if (!graph.pageVisible) {
                this.get("pageView").funct();
            }

            var fmt = graph.pageFormat;
            var ps = graph.pageScale;
            var cw = graph.container.clientWidth - 10;

            var scale = Math.floor((20 * cw) / fmt.width / ps) / 20;
            graph.zoomTo(scale);

            if (mxUtils.hasScrollbars(graph.container)) {
                var pad = graph.getPagePadding();
                graph.container.scrollLeft = Math.min(
                    pad.x * graph.view.scale,
                    (graph.container.scrollWidth - graph.container.clientWidth) / 2
                );
            }
        })
    );
    this.put(
        "customZoom",
        new Action(
            mxResources.get("custom") + "...",
            mxUtils.bind(this, function () {
                var dlg = new FilenameDialog(
                    this.editorUi,
                    parseInt(graph.getView().getScale() * 100),
                    mxResources.get("apply"),
                    mxUtils.bind(this, function (newValue) {
                        var val = parseInt(newValue);

                        if (!isNaN(val) && val > 0) {
                            graph.zoomTo(val / 100);
                        }
                    }),
                    mxResources.get("zoom") + " (%)"
                );
                this.editorUi.showDialog(dlg.container, 300, 80, true, true);
                dlg.init();
            }),
            null,
            null,
            Editor.ctrlKey + "+0"
        )
    );
    this.addAction(
        "pageScale...",
        mxUtils.bind(this, function () {
            var dlg = new FilenameDialog(
                this.editorUi,
                parseInt(graph.pageScale * 100),
                mxResources.get("apply"),
                mxUtils.bind(this, function (newValue) {
                    var val = parseInt(newValue);

                    if (!isNaN(val) && val > 0) {
                        var change = new ChangePageSetup(ui, null, null, null, val / 100);
                        change.ignoreColor = true;
                        change.ignoreImage = true;

                        graph.model.execute(change);
                    }
                }),
                mxResources.get("pageScale") + " (%)"
            );
            this.editorUi.showDialog(dlg.container, 300, 80, true, true);
            dlg.init();
        })
    );

    // Option actions
    var action = null;
    action = this.addAction(
        "grid",
        function () {
            graph.setGridEnabled(!graph.isGridEnabled());
            ui.fireEvent(new mxEventObject("gridEnabledChanged"));
        },
        null,
        null,
        Editor.ctrlKey + "+Shift+G"
    );
    action.setToggleAction(true);
    action.setSelectedCallback(function () {
        return graph.isGridEnabled();
    });
    action.setEnabled(false);

    action = this.addAction("guides", function () {
        graph.graphHandler.guidesEnabled = !graph.graphHandler.guidesEnabled;
        ui.fireEvent(new mxEventObject("guidesEnabledChanged"));
    });
    action.setToggleAction(true);
    action.setSelectedCallback(function () {
        return graph.graphHandler.guidesEnabled;
    });
    action.setEnabled(false);

    action = this.addAction("tooltips", function () {
        graph.tooltipHandler.setEnabled(!graph.tooltipHandler.isEnabled());
        ui.fireEvent(new mxEventObject("tooltipsEnabledChanged"));
    });
    action.setToggleAction(true);
    action.setSelectedCallback(function () {
        return graph.tooltipHandler.isEnabled();
    });

    action = this.addAction("collapseExpand", function () {
        var change = new ChangePageSetup(ui);
        change.ignoreColor = true;
        change.ignoreImage = true;
        change.foldingEnabled = !graph.foldingEnabled;

        graph.model.execute(change);
    });
    action.setToggleAction(true);
    action.setSelectedCallback(function () {
        return graph.foldingEnabled;
    });
    action.isEnabled = isGraphEnabled;
    action = this.addAction("scrollbars", function () {
        ui.setScrollbars(!ui.hasScrollbars());
    });
    action.setToggleAction(true);
    action.setSelectedCallback(function () {
        return graph.scrollbars;
    });
    action = this.addAction(
        "pageView",
        mxUtils.bind(this, function () {
            ui.setPageVisible(!graph.pageVisible);
        })
    );
    action.setToggleAction(true);
    action.setSelectedCallback(function () {
        return graph.pageVisible;
    });
    action = this.addAction(
        "connectionArrows",
        function () {
            graph.connectionArrowsEnabled = !graph.connectionArrowsEnabled;
            ui.fireEvent(new mxEventObject("connectionArrowsChanged"));
        },
        null,
        null,
        "Alt+Shift+A"
    );
    action.setToggleAction(true);
    action.setSelectedCallback(function () {
        return graph.connectionArrowsEnabled;
    });
    action = this.addAction(
        "connectionPoints",
        function () {
            graph.setConnectable(!graph.connectionHandler.isEnabled());
            ui.fireEvent(new mxEventObject("connectionPointsChanged"));
        },
        null,
        null,
        "Alt+Shift+P"
    );
    action.setToggleAction(true);
    action.setSelectedCallback(function () {
        return graph.connectionHandler.isEnabled();
    });
    action = this.addAction("copyConnect", function () {
        graph.connectionHandler.setCreateTarget(
            !graph.connectionHandler.isCreateTarget()
        );
        ui.fireEvent(new mxEventObject("copyConnectChanged"));
    });
    action.setToggleAction(true);
    action.setSelectedCallback(function () {
        return graph.connectionHandler.isCreateTarget();
    });

    action.isEnabled = isGraphEnabled;
    action.visible = false;

    // Help actions
    this.addAction("help", function () {
        var ext = "";

        if (mxResources.isLanguageSupported(mxClient.language)) {
            ext = "_" + mxClient.language;
        }

        graph.openLink(RESOURCES_PATH + "/help" + ext + ".html");
    });

    var showingAbout = false;

    this.put(
        "about",
        new Action(mxResources.get("about") + " Graph Editor...", function () {
            if (!showingAbout) {
                ui.showDialog(
                    new AboutDialog(ui).container,
                    320,
                    280,
                    true,
                    true,
                    function () {
                        showingAbout = false;
                    }
                );

                showingAbout = true;
            }
        })
    );

    // Font style actions

    var toggleFontStyle = mxUtils.bind(this, function (key, style, fn, shortcut) {
        return this.addAction(
            key,
            function () {
                if (fn != null && graph.cellEditor.isContentEditing()) {
                    fn();
                } else {
                    graph.stopEditing(false);

                    graph.getModel().beginUpdate();
                    try {
                        var cells = graph.getSelectionCells();
                        graph.toggleCellStyleFlags(
                            mxConstants.STYLE_FONTSTYLE,
                            style,
                            cells
                        );

                        // Removes bold and italic tags and CSS styles inside labels
                        if ((style & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) {
                            graph.updateLabelElements(
                                graph.getSelectionCells(),
                                function (elt) {
                                    elt.style.fontWeight = null;

                                    if (elt.nodeName == "B") {
                                        graph.replaceElement(elt);
                                    }
                                }
                            );
                        } else if (
                            (style & mxConstants.FONT_ITALIC) ==
                            mxConstants.FONT_ITALIC
                        ) {
                            graph.updateLabelElements(
                                graph.getSelectionCells(),
                                function (elt) {
                                    elt.style.fontStyle = null;

                                    if (elt.nodeName == "I") {
                                        graph.replaceElement(elt);
                                    }
                                }
                            );
                        } else if (
                            (style & mxConstants.FONT_UNDERLINE) ==
                            mxConstants.FONT_UNDERLINE
                        ) {
                            graph.updateLabelElements(
                                graph.getSelectionCells(),
                                function (elt) {
                                    elt.style.textDecoration = null;

                                    if (elt.nodeName == "U") {
                                        graph.replaceElement(elt);
                                    }
                                }
                            );
                        }

                        for (var i = 0; i < cells.length; i++) {
                            if (graph.model.getChildCount(cells[i]) == 0) {
                                graph.autoSizeCell(cells[i], false);
                            }
                        }
                    } finally {
                        graph.getModel().endUpdate();
                    }
                }
            },
            null,
            null,
            shortcut
        );
    });

    toggleFontStyle(
        "bold",
        mxConstants.FONT_BOLD,
        function () {
            document.execCommand("bold", false, null);
        },
        Editor.ctrlKey + "+B"
    );
    toggleFontStyle(
        "italic",
        mxConstants.FONT_ITALIC,
        function () {
            document.execCommand("italic", false, null);
        },
        Editor.ctrlKey + "+I"
    );
    toggleFontStyle(
        "underline",
        mxConstants.FONT_UNDERLINE,
        function () {
            document.execCommand("underline", false, null);
        },
        Editor.ctrlKey + "+U"
    );

    // Color actions
    this.addAction("fontColor...", function () {
        ui.menus.pickColor(mxConstants.STYLE_FONTCOLOR, "forecolor", "000000");
    });
    this.addAction("strokeColor...", function () {
        ui.menus.pickColor(mxConstants.STYLE_STROKECOLOR);
    });
    this.addAction("fillColor...", function () {
        ui.menus.pickColor(mxConstants.STYLE_FILLCOLOR);
    });
    this.addAction("gradientColor...", function () {
        ui.menus.pickColor(mxConstants.STYLE_GRADIENTCOLOR);
    });
    this.addAction("backgroundColor...", function () {
        ui.menus.pickColor(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, "backcolor");
    });
    this.addAction("borderColor...", function () {
        ui.menus.pickColor(mxConstants.STYLE_LABEL_BORDERCOLOR);
    });

    // Format actions
    this.addAction("vertical", function () {
        ui.menus.toggleStyle(mxConstants.STYLE_HORIZONTAL, true);
    });
    this.addAction("shadow", function () {
        ui.menus.toggleStyle(mxConstants.STYLE_SHADOW);
    });
    this.addAction("solid", function () {
        graph.getModel().beginUpdate();
        try {
            graph.setCellStyles(mxConstants.STYLE_DASHED, null);
            graph.setCellStyles(mxConstants.STYLE_DASH_PATTERN, null);
            ui.fireEvent(
                new mxEventObject(
                    "styleChanged",
                    "keys",
                    [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
                    "values",
                    [null, null],
                    "cells",
                    graph.getSelectionCells()
                )
            );
        } finally {
            graph.getModel().endUpdate();
        }
    });
    this.addAction("dashed", function () {
        graph.getModel().beginUpdate();
        try {
            graph.setCellStyles(mxConstants.STYLE_DASHED, "1");
            graph.setCellStyles(mxConstants.STYLE_DASH_PATTERN, null);
            ui.fireEvent(
                new mxEventObject(
                    "styleChanged",
                    "keys",
                    [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
                    "values",
                    ["1", null],
                    "cells",
                    graph.getSelectionCells()
                )
            );
        } finally {
            graph.getModel().endUpdate();
        }
    });
    this.addAction("dotted", function () {
        graph.getModel().beginUpdate();
        try {
            graph.setCellStyles(mxConstants.STYLE_DASHED, "1");
            graph.setCellStyles(mxConstants.STYLE_DASH_PATTERN, "1 4");
            ui.fireEvent(
                new mxEventObject(
                    "styleChanged",
                    "keys",
                    [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
                    "values",
                    ["1", "1 4"],
                    "cells",
                    graph.getSelectionCells()
                )
            );
        } finally {
            graph.getModel().endUpdate();
        }
    });
    this.addAction("sharp", function () {
        graph.getModel().beginUpdate();
        try {
            graph.setCellStyles(mxConstants.STYLE_ROUNDED, "0");
            graph.setCellStyles(mxConstants.STYLE_CURVED, "0");
            ui.fireEvent(
                new mxEventObject(
                    "styleChanged",
                    "keys",
                    [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED],
                    "values",
                    ["0", "0"],
                    "cells",
                    graph.getSelectionCells()
                )
            );
        } finally {
            graph.getModel().endUpdate();
        }
    });
    this.addAction("rounded", function () {
        graph.getModel().beginUpdate();
        try {
            graph.setCellStyles(mxConstants.STYLE_ROUNDED, "1");
            graph.setCellStyles(mxConstants.STYLE_CURVED, "0");
            ui.fireEvent(
                new mxEventObject(
                    "styleChanged",
                    "keys",
                    [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED],
                    "values",
                    ["1", "0"],
                    "cells",
                    graph.getSelectionCells()
                )
            );
        } finally {
            graph.getModel().endUpdate();
        }
    });
    this.addAction("toggleRounded", function () {
        if (!graph.isSelectionEmpty() && graph.isEnabled()) {
            graph.getModel().beginUpdate();
            try {
                var cells = graph.getSelectionCells();
                var style = graph.getCurrentCellStyle(cells[0]);
                var value =
                    mxUtils.getValue(style, mxConstants.STYLE_ROUNDED, "0") == "1"
                        ? "0"
                        : "1";

                graph.setCellStyles(mxConstants.STYLE_ROUNDED, value);
                graph.setCellStyles(mxConstants.STYLE_CURVED, null);
                ui.fireEvent(
                    new mxEventObject(
                        "styleChanged",
                        "keys",
                        [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED],
                        "values",
                        [value, "0"],
                        "cells",
                        graph.getSelectionCells()
                    )
                );
            } finally {
                graph.getModel().endUpdate();
            }
        }
    });
    this.addAction("curved", function () {
        graph.getModel().beginUpdate();
        try {
            graph.setCellStyles(mxConstants.STYLE_ROUNDED, "0");
            graph.setCellStyles(mxConstants.STYLE_CURVED, "1");
            ui.fireEvent(
                new mxEventObject(
                    "styleChanged",
                    "keys",
                    [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED],
                    "values",
                    ["0", "1"],
                    "cells",
                    graph.getSelectionCells()
                )
            );
        } finally {
            graph.getModel().endUpdate();
        }
    });
    this.addAction("collapsible", function () {
        var state = graph.view.getState(graph.getSelectionCell());
        var value = "1";

        if (state != null && graph.getFoldingImage(state) != null) {
            value = "0";
        }

        graph.setCellStyles("collapsible", value);
        ui.fireEvent(
            new mxEventObject(
                "styleChanged",
                "keys",
                ["collapsible"],
                "values",
                [value],
                "cells",
                graph.getSelectionCells()
            )
        );
    });
    this.addAction(
        "editStyle...",
        mxUtils.bind(this, function () {
            var cells = graph.getSelectionCells();

            if (cells != null && cells.length > 0) {
                var model = graph.getModel();

                var dlg = new TextareaDialog(
                    this.editorUi,
                    mxResources.get("editStyle") + ":",
                    model.getStyle(cells[0]) || "",
                    function (newValue) {
                        if (newValue != null) {
                            graph.setCellStyle(mxUtils.trim(newValue), cells);
                        }
                    },
                    null,
                    null,
                    400,
                    220
                );
                this.editorUi.showDialog(dlg.container, 420, 300, true, true);
                dlg.init();
            }
        }),
        null,
        null,
        Editor.ctrlKey + "+E"
    );
    this.addAction(
        "setAsDefaultStyle",
        function () {
            if (graph.isEnabled() && !graph.isSelectionEmpty()) {
                ui.setDefaultStyle(graph.getSelectionCell());
            }
        },
        null,
        null,
        Editor.ctrlKey + "+Shift+D"
    );
    this.addAction(
        "clearDefaultStyle",
        function () {
            if (graph.isEnabled()) {
                ui.clearDefaultStyle();
            }
        },
        null,
        null,
        Editor.ctrlKey + "+Shift+R"
    );
    this.addAction("addWaypoint", function () {
        var cell = graph.getSelectionCell();

        if (cell != null && graph.getModel().isEdge(cell)) {
            var handler = editor.graph.selectionCellsHandler.getHandler(cell);

            if (handler instanceof mxEdgeHandler) {
                var t = graph.view.translate;
                var s = graph.view.scale;
                var dx = t.x;
                var dy = t.y;

                var parent = graph.getModel().getParent(cell);
                var pgeo = graph.getCellGeometry(parent);

                while (graph.getModel().isVertex(parent) && pgeo != null) {
                    dx += pgeo.x;
                    dy += pgeo.y;

                    parent = graph.getModel().getParent(parent);
                    pgeo = graph.getCellGeometry(parent);
                }

                var x = Math.round(
                    graph.snap(graph.popupMenuHandler.triggerX / s - dx)
                );
                var y = Math.round(
                    graph.snap(graph.popupMenuHandler.triggerY / s - dy)
                );

                handler.addPointAt(handler.state, x, y);
            }
        }
    });

    this.addAction("removeWaypoint", function () {
        // TODO: Action should run with "this" set to action
        var rmWaypointAction = ui.actions.get("removeWaypoint");

        if (rmWaypointAction.handler != null) {
            // NOTE: Popupevent handled and action updated in Menus.createPopupMenu
            rmWaypointAction.handler.removePoint(
                rmWaypointAction.handler.state,
                rmWaypointAction.index
            );
        }
    });
    this.addAction(
        "clearWaypoints",
        function () {
            var cells = graph.getSelectionCells();

            if (cells != null) {
                cells = graph.addAllEdges(cells);

                graph.getModel().beginUpdate();
                try {
                    for (var i = 0; i < cells.length; i++) {
                        var cell = cells[i];

                        if (graph.getModel().isEdge(cell)) {
                            var geo = graph.getCellGeometry(cell);

                            if (geo != null) {
                                geo = geo.clone();
                                geo.points = null;
                                graph.getModel().setGeometry(cell, geo);
                            }
                        }
                    }
                } finally {
                    graph.getModel().endUpdate();
                }
            }
        },
        null,
        null
    );
    action = this.addAction(
        "subscript",
        mxUtils.bind(this, function () {
            if (graph.cellEditor.isContentEditing()) {
                document.execCommand("subscript", false, null);
            }
        }),
        null,
        null,
        Editor.ctrlKey + "+,"
    );
    action = this.addAction(
        "superscript",
        mxUtils.bind(this, function () {
            if (graph.cellEditor.isContentEditing()) {
                document.execCommand("superscript", false, null);
            }
        }),
        null,
        null,
        Editor.ctrlKey + "+."
    );
    action = this.addAction(
        "indent",
        mxUtils.bind(this, function () {
            // NOTE: Alt+Tab for outdent implemented via special code in
            // keyHandler.getFunction in EditorUi.js. Ctrl+Tab is reserved.
            if (graph.cellEditor.isContentEditing()) {
                document.execCommand("indent", false, null);
            }
        }),
        null,
        null,
        "Shift+Tab"
    );
    this.addAction("image...", function () {
        if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())) {
            var title =
                mxResources.get("image") + " (" + mxResources.get("url") + "):";
            var state = graph.getView().getState(graph.getSelectionCell());
            var value = "";

            if (state != null) {
                value = state.style[mxConstants.STYLE_IMAGE] || value;
            }

            var selectionState = graph.cellEditor.saveSelection();

            ui.showImageDialog(
                title,
                value,
                function (newValue, w, h) {
                    // Inserts image into HTML text
                    if (graph.cellEditor.isContentEditing()) {
                        graph.cellEditor.restoreSelection(selectionState);
                        graph.insertImage(newValue, w, h);
                    } else {
                        var cells = graph.getSelectionCells();

                        if (newValue != null && (newValue.length > 0 || cells.length > 0)) {
                            var select = null;

                            graph.getModel().beginUpdate();
                            try {
                                // Inserts new cell if no cell is selected
                                if (cells.length == 0) {
                                    cells = [
                                        graph.insertVertex(
                                            graph.getDefaultParent(),
                                            null,
                                            "",
                                            0,
                                            0,
                                            w,
                                            h,
                                            "shape=image;imageAspect=0;aspect=fixed;verticalLabelPosition=bottom;verticalAlign=top;"
                                        ),
                                    ];
                                    var pt = graph.getCenterInsertPoint(
                                        graph.getBoundingBoxFromGeometry(cells, true)
                                    );
                                    cells[0].geometry.x = pt.x;
                                    cells[0].geometry.y = pt.y;

                                    select = cells;
                                    graph.fireEvent(
                                        new mxEventObject("cellsInserted", "cells", select)
                                    );
                                }

                                graph.setCellStyles(
                                    mxConstants.STYLE_IMAGE,
                                    newValue.length > 0 ? newValue : null,
                                    cells
                                );

                                // Sets shape only if not already shape with image (label or image)
                                var style = graph.getCurrentCellStyle(cells[0]);

                                if (
                                    style[mxConstants.STYLE_SHAPE] != "image" &&
                                    style[mxConstants.STYLE_SHAPE] != "label"
                                ) {
                                    graph.setCellStyles(mxConstants.STYLE_SHAPE, "image", cells);
                                } else if (newValue.length == 0) {
                                    graph.setCellStyles(mxConstants.STYLE_SHAPE, null, cells);
                                }

                                if (graph.getSelectionCount() == 1) {
                                    if (w != null && h != null) {
                                        var cell = cells[0];
                                        var geo = graph.getModel().getGeometry(cell);

                                        if (geo != null) {
                                            geo = geo.clone();
                                            geo.width = w;
                                            geo.height = h;
                                            graph.getModel().setGeometry(cell, geo);
                                        }
                                    }
                                }
                            } finally {
                                graph.getModel().endUpdate();
                            }

                            if (select != null) {
                                graph.setSelectionCells(select);
                                graph.scrollCellToVisible(select[0]);
                            }
                        }
                    }
                },
                graph.cellEditor.isContentEditing(),
                !graph.cellEditor.isContentEditing()
            );
        }
    }).isEnabled = isGraphEnabled;
    action = this.addAction(
        "layers",
        mxUtils.bind(this, function () {
            if (this.layersWindow == null) {
                // LATER: Check outline window for initial placement
                this.layersWindow = new LayersWindow(
                    ui,
                    document.body.offsetWidth - 280,
                    120,
                    220,
                    196
                );
                this.layersWindow.window.addListener("show", function () {
                    ui.fireEvent(new mxEventObject("layers"));
                });
                this.layersWindow.window.addListener("hide", function () {
                    ui.fireEvent(new mxEventObject("layers"));
                });
                this.layersWindow.window.setVisible(true);
                ui.fireEvent(new mxEventObject("layers"));

                this.layersWindow.init();
            } else {
                this.layersWindow.window.setVisible(
                    !this.layersWindow.window.isVisible()
                );
            }
        }),
        null,
        null,
        Editor.ctrlKey + "+Shift+L"
    );
    action.setToggleAction(true);
    action.setSelectedCallback(
        mxUtils.bind(this, function () {
            return this.layersWindow != null && this.layersWindow.window.isVisible();
        })
    );
    action = this.addAction(
        "formatPanel",
        mxUtils.bind(this, function () {
            ui.toggleFormatPanel();
        }),
        null,
        null,
        Editor.ctrlKey + "+Shift+P"
    );
    action.setToggleAction(true);
    action.setSelectedCallback(
        mxUtils.bind(this, function () {
            return ui.formatWidth > 0;
        })
    );
    action = this.addAction(
        "outline",
        mxUtils.bind(this, function () {
            if (this.outlineWindow == null) {
                // LATER: Check layers window for initial placement
                this.outlineWindow = new OutlineWindow(
                    ui,
                    document.body.offsetWidth - 260,
                    100,
                    180,
                    180
                );
                this.outlineWindow.window.addListener("show", function () {
                    ui.fireEvent(new mxEventObject("outline"));
                });
                this.outlineWindow.window.addListener("hide", function () {
                    ui.fireEvent(new mxEventObject("outline"));
                });
                this.outlineWindow.window.setVisible(true);
                ui.fireEvent(new mxEventObject("outline"));
            } else {
                this.outlineWindow.window.setVisible(
                    !this.outlineWindow.window.isVisible()
                );
            }
        }),
        null,
        null,
        Editor.ctrlKey + "+Shift+O"
    );

    action.setToggleAction(true);
    action.setSelectedCallback(
        mxUtils.bind(this, function () {
            return (
                this.outlineWindow != null && this.outlineWindow.window.isVisible()
            );
        })
    );

    let color = "#000000";
    setInterval(() => {
        //IncomingEIDs OutgoingEIDs check
        //arrow disconnect red color
        let cell = graph.getSelectionCell();
        if (cell != undefined) {
            if (getType(cell.style) == "Connection") {
                if (getColor(cell.style) != undefined)
                    if (getColor(cell.style) != "#FF0000") color = getColor(cell.style);

                cell.target == null || cell.source == null
                    ? graph.setCellStyles("strokeColor", "#FF0000", [cell])
                    : graph.setCellStyles("strokeColor", color, [cell]);
            }
        }
    }, 100);
};

/**
 * Registers the given action under the given name.
 */
Actions.prototype.addAction = function (
    key,
    funct,
    enabled,
    iconCls,
    shortcut
) {
    var title;

    if (key.substring(key.length - 3) == "...") {
        key = key.substring(0, key.length - 3);
        title = mxResources.get(key) + "...";
    } else {
        title = mxResources.get(key);
    }

    return this.put(key, new Action(title, funct, enabled, iconCls, shortcut));
};

/**
 * Registers the given action under the given name.
 */
Actions.prototype.put = function (name, action) {
    this.actions[name] = action;

    return action;
};

/**
 * Returns the action for the given name or null if no such action exists.
 */
Actions.prototype.get = function (name) {
    return this.actions[name];
};

/**
 * Constructs a new action for the given parameters.
 */
function Action(label, funct, enabled, iconCls, shortcut) {
    mxEventSource.call(this);
    this.label = label;
    this.funct = this.createFunction(funct);
    this.enabled = enabled != null ? enabled : true;
    this.iconCls = iconCls;
    this.shortcut = shortcut;
    this.visible = true;
}

// Action inherits from mxEventSource
mxUtils.extend(Action, mxEventSource);

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.createFunction = function (funct) {
    return funct;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setEnabled = function (value) {
    if (this.enabled != value) {
        this.enabled = value;
        this.fireEvent(new mxEventObject("stateChanged"));
    }
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.isEnabled = function () {
    return this.enabled;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setToggleAction = function (value) {
    this.toggleAction = value;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setSelectedCallback = function (funct) {
    this.selectedCallback = funct;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.isSelected = function () {
    return this.selectedCallback();
};

function getType(style) {
    let type;
    if (style != undefined) {
        type = style.split(";").filter((x) => x.split("=")[0] == "type")[0];
        if (type != undefined) type = type.split("=")[1];
    }
    return type;
}

function getColor(style) {
    let color;
    if (style != undefined) {
        color = style.split(";").filter((x) => x.split("=")[0] == "strokeColor")[0];
        if (color != undefined) color = color.split("=")[1];
    }
    return color;
}

//change language
function ChangeLang() {
    if (_Lang == "Fa") {
        $(`#page-header span`).prop("class", "fa fa-angle-double-left");
        $(`#out a i`).addClass("fa-rotate-180");
    } else if (_Lang == "En") {
        $(`#format a i`).addClass("fa-rotate-180");
        $(`#page-header span`).prop("class", "fa fa-angle-double-right");
        $(".geFooterContainer").css("left", $(".geFooterContainer").css("right"));
    }
}

function ResourceFunct() {
    $(`[changelang]`).map((index, elem) => {
        const htm = resurce($(elem).attr("changelang"));
        const title = resurce($(elem).attr("titleLang"));
        $(elem).html(htm);
        $(elem).attr("title", title);
    });
    function resurce(item) {
        return mxResources.get(item);
    }
}

function Exit() {
    saveDesign(false);

    setTimeout(() => {
        window.open("", "_self").close();
    }, 1000);
}

function setting() {
    $(`.geFormatContainer`).toggleClass("formatClicked");
    $(`.geDiagramContainer`).toggleClass("diagramClicked");
}

setTimeout(() => {
    (function () {
        setInterval(() => {
            if (localStorage.getItem("Saveinterval") == "true") {
                if (localStorage.getItem("Variables" + _pageKey)) {
                    if (
                        JSON.stringify(VariableUI.MainArray) !=
                        localStorage.getItem("Variables" + _pageKey)
                    ) {
                        let myPromise = new Promise(function (myResolve) {
                            //process

                            VariableUI.MainArray = JSON.parse(
                                localStorage.getItem("Variables" + _pageKey)
                            );

                            for (let i = 0; i < VariableUI.MainArray.length; i++) {
                                VariableUI.MainArray[i].GeneralId = i + 1;
                                VariableUI.MainArray[i].VariableID = parseInt(
                                    VariableUI.MainArray[i].SystemID.match(/\d+/)[0]
                                );

                                if (i == VariableUI.MainArray.length - 1)
                                    myResolve(VariableUI.MainArray);
                            }
                        });

                        myPromise.then(function (value) {
                            //save

                            if (value.length) saveDesign(false);
                        });
                    }
                }
                if ($(`#ProcessData_AddTable`).css("display") == "block")
                    $(`#ProcessData_AddTable`).remove();

                if ($(`#SubTable_AddTable`).css("display") == "block")
                    $(`#SubTable_AddTable`).remove();

                //get enumTypes
                $.ajax({
                    type: "POST",

                    url: "../../App_Sys/Services/Admin/Process.asmx/GetEnumTypes",

                    data: "",

                    contentType: false,

                    dataType: "xml",

                    processData: false,

                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(JSON.stringify(jqXHR));
                    },
                    success: function (data) {
                        Obj_EnumType = JSON.parse(
                            data.getElementsByTagName("string")[0].childNodes[0].nodeValue
                        );
                    },
                });

                localStorage.setItem("Saveinterval", false);
            }
        }, 1000);
    })();
}, 2000);

var _ListTaskNotForm = "";
function getFlows() {
    let _Array = [];

    //Set IncomingEIDs OutgoingEIDs
    let cells = getGraphChildCells();
    let Connections = [],
        Lanes = [],
        Pools = [],
        LaneChild = [],
        LanesPool = [],
        OtherElem = [];
    //connections root
    Connections.push(...cells.filter((x) => getType(x.style) == "Connection"));

    //Other Elements root
    OtherElem = cells.filter(
        (x) =>
            getType(x.style) != "Connection" &&
            getType(x.style) != "Lane" &&
            getType(x.style) != "Pool"
    );

    //Lane root
    Lanes.push(...cells.filter((x) => getType(x.style) == "Lane"));

    //pool
    Pools.push(...cells.filter((x) => getType(x.style) == "Pool"));

    //Lane in Pool
    for (const i in Pools) {
        LanesPool = getGraphChildCells(Pools[i]);
        Lanes.push(...LanesPool.filter((x) => getType(x.style) == "Lane"));
        Connections.push(
            ...LanesPool.filter((x) => getType(x.style) == "Connection")
        );
    }

    //Elem in Lane
    for (const i in Lanes)
        if (getGraphChildCells(Lanes[i]) != "")
            LaneChild.push(...getGraphChildCells(Lanes[i]));

    //connections lane
    Connections.push(
        ...LaneChild.filter((x) => getType(x.style) == "Connection")
    );
    //Other Elements lane
    OtherElem.push(
        ...LaneChild.filter(
            (x) =>
                getType(x.style) != "Connection" &&
                getType(x.style) != "Lane" &&
                getType(x.style) != "Pool"
        )
    );

    //check have form from formDesigner
    let _UsedFormArray;
    $.ajax({
        type: "POST",
        url: "../../App_Sys/Services/Admin/Process.asmx/GetUsedVariables",
        data: `{processID : ${_pageKey}}`,
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data) {
            _UsedFormArray = JSON.parse(data.d);
        },
        error: function (error) {
            alert(JSON.stringify(error));
        },
    });

    var StartEventID;
    _ListTaskNotForm = "";
    for (const j in OtherElem) {
        let key = getType(OtherElem[j].style);

        switch (key) {
            case "UserTaskTimer":
            case "UserTask":
                RenderUserTask(key, OtherElem, j);

                //check have form from formDesigner
                const _formid = +OtherElem[j].id + (500 + +_pageKey) * 10000;
                let _filter = _UsedFormArray.filter((x) => x.ID == _formid);
                if (!_filter.length) {
                    if (OtherElem[j].value == "") {
                        alert("فعالیت فاقد نام می باشد");
                        _ListTaskNotForm += "فاقد نام" + ",";
                    } else {
                        _ListTaskNotForm +=
                            OtherElem[j].value
                                .replaceAll("<br>", "")
                                .replaceAll("&nbsp;", "")
                                .replaceAll("</span>", "")
                                .replaceAll('<span style="font-size: 12px">', "") + ",";
                    }
                }

                break;
            case "TimerStartEvent":
            case "IntermediateTimerEvent":
                RenderTimerEvent(key, OtherElem, j);
                break;
            case "Inclusive Gateway":
            case "Exclusive Gateway":
                RenderGateway(key, OtherElem, j);
                break;
            default:
                OtherElement(key, OtherElem, j);
                break;
        }
    }

    function RenderUserTask(key, OtherElem, j) {
        const _ScheduleFilter = _ScheduleOBJ.filter(
            (x) => x.ID == +OtherElem[j].id
        );

        let _Schedule = Object.assign({
            AccessTiming: _ScheduleFilter.length
                ? _ScheduleFilter[0].AccessTiming
                : [],
            ID: _ScheduleFilter.length ? _ScheduleFilter[0].ID : 0,
        });

        const _AssignmentFilter = _AssignmentOBJ.filter(
            (x) => x.ID == +OtherElem[j].id
        );

        const _SettingFilter = _Setting.filter((x) => x.ID == +OtherElem[j].id);
        const _CartabeleFilter = _Cartabele.filter((x) => x.ID == +OtherElem[j].id);
        let _Assignment = Object.assign(
            {
                Type: _AssignmentFilter.length ? _AssignmentFilter[0].Type : "",
                AssignedUserID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].AssignedUserID
                    : 0,
                AssignedTeamID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].AssignedTeamID
                    : 0,
                AssignedPositionID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].AssignedPositionID
                    : 0,
                DefaultUserID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].DefaultUserID
                    : 0,
                DefaultTeamID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].DefaultTeamID
                    : 0,
                DefaultPositionID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].DefaultPositionID
                    : 0,
                AssignmentProcedureID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].AssignmentProcedureID
                    : 0,
                AssignedVariableID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].AssignedVariableID
                    : 0,
                AssignedDepartmentID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].AssignedDepartmentID
                    : 0,
                AssignedSiteID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].AssignedSiteID
                    : 0,
                AssignedContractID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].AssignedContractID
                    : 0,
                AssignedProfiles: _AssignmentFilter.length
                    ? _AssignmentFilter[0].AssignedProfiles
                    : 0,
                AssignedBuildingID: _AssignmentFilter.length
                    ? _AssignmentFilter[0].AssignedBuildingID
                    : 0,
                ID: _AssignmentFilter.length ? _AssignmentFilter[0].ID : 0,
            },
            {
                Settings: (_SettingFilter[0] ??= {
                    ID: +OtherElem[j].id,
                    BOption1: false,
                    BOption2: false,
                    BOption3: false,
                    BOption4: false,
                    BOption5: false,
                }),
    },
    {
        Cartable: (_CartabeleFilter[0] ??= {
            ID: +OtherElem[j].id,
            AssignedCartabeleID: 0,
            DefaultCartabeleID: 0,
        }),
    }
    );
    const _SLAFilter = _SLA.filter((x) => x.ID == +OtherElem[j].id);
    Object.assign(_Assignment, {
        SLA: (_SLAFilter[0] ??= {
            ID: +OtherElem[j].id,
            ResolutionTimes: 0,
            ResolutionType: "MINUTE",
            BOption0: false,
            BOption6: false,
        }),
    });
const Currentp = _CurrentPosition.filter((x) => x.ID == OtherElem[j].id);
let flowObject = {
    ElementID: +OtherElem[j].id,
    StateID: Currentp.length ? Currentp[0].value : "",
    Type: getType(OtherElem[j].style),
    Label: extractContent(OtherElem[j].value),
    Name: extractContent(OtherElem[j].value),
    IncomingEIDs: [],
    OutgoingEIDs: [],
    // GatewayOption: {
    //   DefaultOutgoingEID: "",
    //   RoutingRules: [],
    // },
    Assignment: _Assignment,
    Schedule: _Schedule,
    IsFirstTask: false,
};

_Array.push(flowObject);
  }

function RenderTimerEvent(key, OtherElem, j) {
    if (key == "TimerStartEvent") {
        StartEventID = OtherElem[j].id;
        const _SLAFilter = _SLA.filter((x) => x.ID == +OtherElem[j].id);
        let obj = (_SLAFilter[0] ??= {
            ID: +OtherElem[j].id,
            StartDateTime: currentDateTime(),
            Repeat: 0,
            ResolutionTimes: 1,
            ResolutionType: "Second",
            BOption0: false,
            BOption6: false,
        });

        const Currentp = _CurrentPosition.filter((x) => x.ID == OtherElem[j].id);
        let flowObject = {
            ElementID: +OtherElem[j].id,
            StateID: Currentp.length ? Currentp[0].value : "",
            Type: key,
            Label: extractContent(OtherElem[j].value),
            Name: extractContent(OtherElem[j].value),
            IncomingEIDs: [],
            OutgoingEIDs: [],
            // GatewayOption: {
            //   DefaultOutgoingEID: "",
            //   RoutingRules: [],
            // },
            SLA: obj,
        };
        _Array.push(flowObject);
    } else if (key == "IntermediateTimerEvent") {
        const _SLAFilter = _SLA.filter((x) => x.ID == +OtherElem[j].id);
        let obj = (_SLAFilter[0] ??= {
            ID: +OtherElem[j].id,
            Repeat: 1,
            ResolutionTimes: 0,
            ResolutionType: "MINUTE",
            BOption0: false,
            BOption6: false,
        });

        const Currentp = _CurrentPosition.filter((x) => x.ID == OtherElem[j].id);
        let flowObject = {
            ElementID: +OtherElem[j].id,
            StateID: Currentp.length ? Currentp[0].value : "",
            Type: getType(OtherElem[j].style),
            Label: extractContent(OtherElem[j].value),
            Name: extractContent(OtherElem[j].value),
            IncomingEIDs: [],
            OutgoingEIDs: [],
            // GatewayOption: {
            //   DefaultOutgoingEID: "",
            //   RoutingRules: [],
            // },
            SLA: obj,
        };

        _Array.push(flowObject);
    }
}

function RenderGateway(key, OtherElem, j) {
    let _RoutingRules = Conditions.MainArray.filter(
        (x) => x.OwnerEID == OtherElem[j].id
    );
    const Currentp = _CurrentPosition.filter((x) => x.ID == OtherElem[j].id);

    _Array.push({
        ElementID: +OtherElem[j].id,
        StateID: Currentp.length ? Currentp[0].value : "",
        Type: key,
        Label: extractContent(OtherElem[j].value),
        Name: extractContent(OtherElem[j].value),
        IncomingEIDs: [],
        OutgoingEIDs: [],
        GatewayOption: {
            DefaultOutgoingEID: "",
            RoutingRules: _RoutingRules,
        },
    });
}

function OtherElement(key, OtherElem, j) {
   
    const Currentp = _CurrentPosition.filter((x) => x.ID == OtherElem[j].id);
    if (key == "StartEvent") StartEventID = OtherElem[j].id;

    _Array.push({
        ElementID: +OtherElem[j].id,
        StateID: Currentp.length ? Currentp[0].value : "",
        Type: key,
        Label: extractContent(OtherElem[j].value),
        Name: extractContent(OtherElem[j].value),
        IncomingEIDs: [],
        OutgoingEIDs: [],
        // GatewayOption: {
        //   DefaultOutgoingEID: "",
        //   RoutingRules: [],
        // },
    });
}

//IncomingEIDs OutgoingEIDs check
let breakLoop = false;
for (let j in Connections) {
    if ((Connections[j].source && Connections[j].target) == null) {
        breakLoop = true;
        return false;
    }
}

if (!breakLoop) {
    for (let i in Connections) {
        if ((Connections[i].source && Connections[i].target) != null) {
            const source = +Connections[i].source.id;
            const target = +Connections[i].target.id;
            //get set source
            const TargetElem = _Array.filter((item) => item.ElementID == source);
            if (TargetElem.length > 0) TargetElem[0].OutgoingEIDs.push(target);

            //get set target
            const SourceElem = _Array.filter((item) => item.ElementID == target);
            if (SourceElem.length > 0) {
                SourceElem[0].IncomingEIDs.push(source);
                //set IsFirstTask
                if (source == StartEventID) SourceElem[0].IsFirstTask = true;
            }
        }
    }
}
return _Array;
}

function extractContent(value) {
    var div = document.createElement("div");
    div.innerHTML = value;
    var text = div.textContent;
    return text;
}
