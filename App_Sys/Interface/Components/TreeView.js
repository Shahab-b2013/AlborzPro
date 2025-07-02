// JScript File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.2.0.0

function treeView(id, objKey) {

    var _actContextID = id;

    var _objKey = objKey;

    var _treeOptions;

    var _treeData;

    var _treeData2;

    var _internalIDs = new Object();

    var _parentID2s = new Object();

    var _treeButtons;

    var _contextMenuItems;

    var _treeDragDrops;

    this.renderContext = function (pageElementID) {

        var bodyID = '#box-body-' + pageElementID;

        var boxID = '#page-box-' + pageElementID;

        var footerID = '#box-footer-' + pageElementID;

        //#region Load Tree Metadata

        //TreeOptions
        _treeOptions = new iData('bb7f98fb-8940-4541-32ab-f88544e56abc', _actContextID);

        if (_treeOptions.getError() != null) {

            raiseError(_treeOptions.getError(), bodyID);

            return;
        }

        _treeOptions = _treeOptions.getObject();

        //ContextMenuItems
        _contextMenuItems = new iData('ed2653cc-c40f-4583-a2d8-129b6b89eb5a', _treeOptions.TreeID);

        if (_contextMenuItems.getError() != null) {

            raiseError(_contextMenuItems.getError(), bodyID);

            return;
        }

        //TreeButtons
        _treeButtons = new iData('f543c842-dcea-4315-9817-9ffe47dbdb75', _treeOptions.TreeID);

        if (_treeButtons.getError() != null) {

            raiseError(_treeButtons.getError(), bodyID);

            return;
        }

        _treeButtons = _treeButtons.getList();

        //TreeDragDrops
        _treeDragDrops = new iData('a43ac8b4-6f3e-4b52-ae33-11b7ced1c2d5', _treeOptions.TreeID);

        if (_treeDragDrops.getError() != null) {

            raiseError(_treeDragDrops.getError(), bodyID);

            return;
        }

        _treeDragDrops = _treeDragDrops.getList();

        //TreeData
        _treeData = new aData(_treeOptions.ActivityID, null, _objKey, '');

        if (_treeData.getError() != null) {

            raiseError(_treeData.getError(), bodyID);

            return;
        }

        var treeData = _treeData.getList();

        //#endregion

        //#region Preparing Tree Data

        _treeData = [];

        _treeData2 = [];

        var $icon;

        var myDictionary = new Object();

        $.each(treeData, function (index, treeNode) {

            $icon = '/App_Res/Images/Page/16/' + treeNode.Type + '.png';

            if (!jQuery.parseJSON(treeNode.Enabled.toLowerCase())) {

                $icon = '/App_Res/Images/Page/16/' + treeNode.Type + '_Dis.png'
            }

            if (jQuery.parseJSON(treeNode.IsDeleted.toLowerCase())) {

                $icon = '/App_Res/Images/Page/16/' + treeNode.Type + '_Del.png'
            }

            _treeData.push({
                id: treeNode.ID,
                text: treeNode.Label,
                enabled: treeNode.Enabled,
                parent: treeNode.ParentID,
                data: treeNode.Type,
                icon: $icon
            });

            _internalIDs[treeNode.ID] = treeNode.InternalID;

            _parentID2s[treeNode.ID] = treeNode.ParentID2;

            if (!jQuery.parseJSON(treeNode.IsDeleted.toLowerCase())) {

                _treeData2.push({
                    id: treeNode.ID,
                    text: treeNode.Label,
                    enabled: treeNode.Enabled,
                    parent: treeNode.ParentID,
                    data: treeNode.Type,
                    icon: $icon
                });
            }
        });

        //#endregion

        $(bodyID).html('');

        $(footerID).html('');

        $(boxID + ' .box-title').html(_treeOptions.Label);

        //#region Render Tree Toolbar

        $(bodyID).append('<div id="tree-' + pageElementID + '-toolbar"></div>');

        //SearchEnabled
        if (jQuery.parseJSON(_treeOptions.SearchEnabled)) {

            $('#tree-' + pageElementID + '-toolbar').append('<label>' + ($$Lang != 'Fa' ? 'Search' : 'جستجو') + ' : <input type="text" class="tree-search-box" id="tree-' + pageElementID + '-search"></label>');

            var to = false;

            $('#tree-' + pageElementID + '-search').keyup(function () {

                if (to) { clearTimeout(to); }

                to = setTimeout(function () {

                    var searchString = $('#tree-' + pageElementID + '-search').val();

                    $('#tree-' + pageElementID).jstree('search', searchString);

                }, 1000);
            });
        }

        //ShowHideEnabled
        if (jQuery.parseJSON(_treeOptions.ShowHideEnabled)) {

            $('#tree-' + pageElementID + '-toolbar').append('&nbsp;&nbsp;<div class="btn-group" id="tree-' + pageElementID + '-toolbar-group1">');

            $('#tree-' + pageElementID + '-toolbar-group1').append('<button type="button"  class="btn btn-default btn-sm btn-tool-grid" id="btn-showall" title="Show All"><img src="App_Res/Images/Page/16/ShowAll.png"></button>');

            $('#tree-' + pageElementID + '-toolbar-group1').append('<button type="button"  class="btn btn-default btn-sm btn-tool-grid" id="btn-hide-del" title="Hide Deleted Items"><img src="App_Res/Images/Page/16/HideDeleted.png"></button>');

            $('#btn-showall').on('click', function () {

                $('#tree-' + pageElementID).jstree(true).settings.core.data = _treeData;

                $('#tree-' + pageElementID).jstree(true).refresh();
            });

            $('#btn-hide-del').on('click', function () {

                $('#tree-' + pageElementID).jstree(true).settings.core.data = _treeData2;

                $('#tree-' + pageElementID).jstree(true).refresh();
            });
        }

        var $Plugins = ['types', 'search', 'contextmenu'];

        //CheckBoxEnabled
        if (jQuery.parseJSON(_treeOptions.CheckboxEnabled)) {

            $Plugins.push('checkbox');
        }

        //DragDropEnabled
        if (jQuery.parseJSON(_treeOptions.DragDropEnabled)) {

            $Plugins.push('dnd');
        }

        //SelectAllEnabled
        if (jQuery.parseJSON(_treeOptions.SelectAllEnabled) && jQuery.parseJSON(_treeOptions.CheckboxEnabled)) {

            $('#tree-' + pageElementID + '-toolbar').append('&nbsp;&nbsp;<div class="btn-group" id="tree-' + pageElementID + '-toolbar-group2">');

            $('#tree-' + pageElementID + '-toolbar-group2').append('<button type="button"  class="btn btn-default btn-sm btn-tool-grid" id="btn-select" title="Select All"><img src="App_Res/Images/Page/16/Checked.png"></button>');

            $('#tree-' + pageElementID + '-toolbar-group2').append('<button type="button"  class="btn btn-default btn-sm btn-tool-grid" id="btn-deselect" title="Unselect All"><img src="App_Res/Images/Page/16/Unchecked.png"></button>');

            $('#btn-select').on('click', function () {

                $('#tree-' + pageElementID).jstree("check_all");
            });

            $('#btn-deselect').on('click', function () {

                $('#tree-' + pageElementID).jstree("deselect_all");
            });
        }

        //RefershEnabled
        if (jQuery.parseJSON(_treeOptions.RefershEnabled)) {

            $('#tree-' + pageElementID + '-toolbar').append('&nbsp;&nbsp;<button type="button"  class="btn btn-default btn-sm btn-tool-grid btn-refresh" id="btn-refresh-' + pageElementID + '" title="Refresh"><img src="App_Res/Images/Page/16/Refresh.png"></button>');

            $('#btn-refresh-' + pageElementID).on('click', function () {

                //TreeData
                _treeData = new aData(_treeOptions.ActivityID, null, _objKey, '');

                if (_treeData.getError() != null) {

                    raiseError(_treeData.getError(), bodyID);

                    return;
                }

                var treeData = _treeData.getList();

                //Preparing Data
                _treeData = [];

                _treeData2 = [];

                var $icon;

                $.each(treeData, function (index, treeNode) {

                    $icon = '/App_Res/Images/Page/16/' + treeNode.Type + '.png';

                    if (!jQuery.parseJSON(treeNode.Enabled.toLowerCase())) {

                        $icon = '/App_Res/Images/Page/16/' + treeNode.Type + '_Dis.png'
                    }

                    if (jQuery.parseJSON(treeNode.IsDeleted.toLowerCase())) {

                        $icon = '/App_Res/Images/Page/16/' + treeNode.Type + '_Del.png'
                    }

                    _treeData.push({
                        id: treeNode.ID,
                        text: treeNode.Label,
                        enabled: treeNode.Enabled,
                        parent: treeNode.ParentID,
                        data: treeNode.Type,
                        icon: $icon
                    });

                    _internalIDs[treeNode.ID] = treeNode.InternalID;

                    _parentID2s[treeNode.ID] = treeNode.ParentID2;

                    if (!jQuery.parseJSON(treeNode.IsDeleted.toLowerCase())) {

                        _treeData2.push({
                            id: treeNode.ID,
                            text: treeNode.Label,
                            enabled: treeNode.Enabled,
                            parent: treeNode.ParentID,
                            data: treeNode.Type,
                            icon: $icon
                        });
                    }
                });

                $('#tree-' + pageElementID).jstree(true).settings.core.data = _treeData2;

                $('#tree-' + pageElementID).jstree(true).refresh();
            });
        }

        //ExportEnabled
        $('#tree-' + pageElementID + '-toolbar').append('&nbsp;&nbsp;<div class="btn-group" id="tree-' + pageElementID + '-toolbar-group3">');

        if (jQuery.parseJSON(_treeOptions.ExcelExportEnabled)) {

            $('#tree-' + pageElementID + '-toolbar-group3').append('<button type="button"  class="btn btn-default btn-sm btn-tool-grid" title="Export to Excel"><img src="App_Res/Images/Page/16/Export.png"></button>');
        }

        if (jQuery.parseJSON(_treeOptions.PdfExportEnabled)) {

            $('#tree-' + pageElementID + '-toolbar-group3').append('<button type="button" class="btn btn-default btn-sm btn-tool-grid" title="Export to Pdf"><img src="App_Res/Images/Page/16/Pdf.png"></button>');
        }

        if (jQuery.parseJSON(_treeOptions.PrintEnabled)) {

            $('#tree-' + pageElementID + '-toolbar-group3').append('<button type="button" class="btn btn-default btn-sm btn-tool-grid" title="Print"><img src="App_Res/Images/Page/16/Print.png"></button>');
        }

        //Render Buttons
        $('#tree-' + pageElementID + '-toolbar').append('&nbsp;&nbsp;<div class="btn-group" id="tree-' + pageElementID + '-toolbar-group4">');

        $.each(_treeButtons, function (index, treeButton) {

            $('#tree-' + pageElementID + '-toolbar-group4').append('<button type="button" class="btn btn-default btn-sm btn-tool-grid btn-tool-' + index + '" data-id="' + index + '" title="' + treeButton.Label + '"><img alt="' + treeButton.Label + '" src="App_Res/Images/Page/16/' + treeButton.Icon + '"></button>');

            $('#tree-' + pageElementID + '-toolbar-group4').on('click', 'button.btn-tool-' + index, function () {

                lanchAction(_treeButtons[$(this).attr('data-id')]);
            });

        });

        //#endregion

        $(bodyID).append('<hr style="margin-top: 3px;margin-bottom: 10px;"/>');

        //#region Render Tree & Bind data

        $(bodyID).append('<div id="tree-' + pageElementID + '"></div>');

        try {

            $('#tree-' + pageElementID).jstree({

                'types': {

                    'default': {

                        'icon': false//'glyphicon glyphicon-minus'
                    }
                },

                'search': {

                    'show_only_matches': true,

                    'show_only_matches_children': true

                },

                'checkbox': {

                    'keep_selected_style': false
                },

                'core': {

                    'check_callback': function (operation, node, node_parent, node_position, more) {

                        var nodeType = node.data;

                        var parentNodeType = node_parent.data;

                        var res = false;

                        if (nodeType && parentNodeType && node.icon.indexOf('_Del.png') == -1) {

                            $.each(_treeDragDrops, function (index, treeDragDrop) {

                                if (treeDragDrop.ChildNodeType == nodeType) {

                                    if (treeDragDrop.ParentNodeType == parentNodeType || treeDragDrop.ParentNodeType == '*') {

                                        if (jQuery.parseJSON(treeDragDrop.DropAllowed)) {

                                            if (_parentID2s[node.id] == _parentID2s[node_parent.id]) {

                                                res = true;
                                            }
                                        }
                                        else {

                                            ;
                                        }
                                    }
                                }
                            });
                        }

                        return res;
                    },

                    'data': _treeData2
                },

                'contextmenu':
                {
                    'items': function ($node) {

                        var _items = {};

                        if ($node.icon.indexOf('_Dis.png') > -1) {

                            contextMenuItems = _contextMenuItems.getListByFilter('OnDisabledIsActive', '1');
                        }
                        else {

                            if ($node.icon.indexOf('_Del.png') > -1) {

                                contextMenuItems = _contextMenuItems.getListByFilter('OnHiddenIsActive', '1');
                            }
                            else {

                                contextMenuItems = _contextMenuItems.getListByFilter('OnEnabledIsActive', '1');
                            }
                        }

                        $.each(contextMenuItems, function (index, menuItem) {

                            if (menuItem.TreeNodeType == $node.data) {

                                _items[menuItem.Name] = {

                                    'label': menuItem.Label,

                                    'icon': menuItem.Icon,

                                    'action': function (obj) {

                                        var object = $node.id.split("$");

                                        if (jQuery.parseJSON(menuItem.UseInternalID)) {

                                            object = _internalIDs[$node.id].split("$");
                                        }

                                        lanchConetxtMenuAction(menuItem, object[1], object[0], ($node.children.length > 0 ? true : false));

                                    }
                                };

                            }

                        });

                        return _items;
                    }
                },

                'plugins': $Plugins
            }

            ).on('search.jstree', function (nodes, str, res) {

                }).on('open_node.jstree', function (nodes, str, res) {
                 
                setTimeout('alignSideBarHeight();', 1 * 200);

            }).on('close_node.jstree', function (nodes, str, res) {

                setTimeout('alignSideBarHeight();', 1 * 200);

            }).on("move_node.jstree", function (e, data) {

                    var object = data.node.id.split("ID$");

                    var parentObject = data.parent.split("ID$");

                    if (data.parent != data.old_parent) {

                        var objectID = object[1];

                        var parentObjectID = parentObject[1];

                        var parentNodeType = parentObject[0];

                        var nodeType = object[0];

                        if (nodeType && parentNodeType) {

                            $.each(_treeDragDrops, function (index, treeDragDrop) {

                                if (treeDragDrop.ChildNodeType == nodeType) {

                                    if (treeDragDrop.ParentNodeType == parentNodeType) {

                                        executeDndActivity(treeDragDrop.DropContextID, objectID, parentObjectID);
                                    }
                                }
                            });
                        }
                    }
                });
        }
        catch (e) {

            raiseError(e, bodyID);

            return;
        }

        //#endregion
    }

    lanchAction = function (treeButton, objKey) {

        var objKeys = [0];

        if (treeButton.ActionHasNode) {

            if (treeButton.MultiNodeHandled) {

                var selRows = [];

                for (i = 0; i < selRows.length; i++) {

                    objKeys[i] = selRows[i].ObjKey;
                }
            }
            else {

                try {

                    objKeys[0] = 0;
                }
                catch (e) {
                    ;
                }
            }

            if (!objKeys[0]) {

                if ($$Lang == 'Fa') {

                    alert("هیچ رکوردی انتخاب نشده است");
                }
                else {
                    alert("No any record has been selected");
                }

                return;
            }
        }

        if (treeButton.ActionOnClick == "openModalContext") openModalContext(1, treeButton.LanchedContextID, treeButton.ContextType, objKeys, objKeys[0], -1); //_contextIndex=-1

        if (treeButton.ActionOnClick == "navigatePage") redirectPage(treeButton.LanchedPageID, objKeys[0]);
    }

    lanchConetxtMenuAction = function (contextMenuItem, objKey, objTyp, hasChild) {

        var objKeys = [objKey]

        if (contextMenuItem.Name.indexOf('Add') == -1) {

            objKey = 0; //No Use As ParentObjectID
        }
        else {

            objKeys = [0];//No Use As ObjectIDs 
        }

        if (hasChild && contextMenuItem.Name.indexOf('Delete') > -1) {

            if ($$Lang == 'Fa') {

                alert('There is no deletion due to the sub branch.');
            }
            else {
                alert("No any record has been selected");
            }
            return;
        }

        if (contextMenuItem.ActionOnClick == "openModalContext") openModalContext(1, contextMenuItem.LanchedContextID, contextMenuItem.ContextType, objKeys, objKey, objTyp);

        if (contextMenuItem.ActionOnClick == "navigatePage") redirectPage(contextMenuItem.LanchedPageID, objKey);

        if (contextMenuItem.ActionOnClick == "silentActivity") executeSilentActivity(contextMenuItem.LanchedContextID, objKeys);
    }

    executeDndActivity = function (activityID, objectID, parentObjectID) {

        var data = new FormData();

        var __objKeys = [objectID];

        var activiyParams = new Array();

        activiyParams.push({
            ParamIndex: 0,
            ParamName: "ParentObjectID",
            ParamValue: parentObjectID,
            FileIsExist: 2,
            FileAttachCode: ""
        });

        data.append('activiyParams', JSON.stringify(activiyParams));

        data.append('objectIDs', JSON.stringify(__objKeys));

        data.append('id', activityID);

        var $aExecutor = new saExecutor(data);

        $aExecutor.submit();
    }
}
