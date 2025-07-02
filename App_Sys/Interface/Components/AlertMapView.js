// JScript File(Amnpardaz Software Co. Copyright 2022 - All Right Reserved)
// Release Ferdos.WebAppDesk 3.3.0.0

function gAlertMapView(id, objKey) {

    var _actContextID = id;

    var _objKey = objKey;

    var _data;

    var _map;

    var _entityIcon;

    var _defaultIcon;

    var _l1Marker;

    var _l2Marker;

    var _l3Marker;

    var _l4Marker;

    var _firstLoad = true;

    var _mapMarkers = [];

    this.renderContext = function (pageElementID) {

        var bodyID = '#box-body-' + pageElementID;
        var boxID = '#page-box-' + pageElementID;

        //#region Load Map Metadata

        _mapOption = new iData('c97a78da-7640-9041-92ab-ab8544ecdab1', _actContextID);

        if (_mapOption.getError() != null) {

            raiseError(_mapOption.getError(), bodyID);
            return;
        }

        _mapOption = _mapOption.getObject();

        //#endregion

        $(boxID + ' .box-title').html(_mapOption.Label);
        $(bodyID).html('');

        //#region Load Map Data

        _data = new aData(_actContextID, null, _objKey, '1/1/2020');

        if (_data.getError() != null) {

            raiseError(_data.getError(), bodyID);
            return;
        }

        _data = _data.getList();

        //#endregion

        //#region Set Icon Markers

        _entityIcon = L.Icon.extend({
            options: {
                shadowUrl: '',
                iconSize: null,
                shadowSize: null,
                iconAnchor: [7, 34],
                shadowAnchor: null,
                popupAnchor: [0, 0]
            }
        });

        _defaultIcon = L.Icon.extend({
            options: {
                shadowUrl: '',
                iconSize: null,
                shadowSize: null,
                iconAnchor: [12, 41],
                shadowAnchor: null,
                popupAnchor: [0, 0]
            }
        });

        _l1Marker = new _defaultIcon({ iconUrl: '../App_Res/Images/Mark/' + _mapOption.Level1Marker });
        _l2Marker = new _defaultIcon({ iconUrl: '../App_Res/Images/Mark/' + _mapOption.Level2Marker });
        _l3Marker = new _defaultIcon({ iconUrl: '../App_Res/Images/Mark/' + _mapOption.Level3Marker });
        _l4Marker = new _defaultIcon({ iconUrl: '../App_Res/Images/Mark/' + _mapOption.Level4Marker });

        //#endregion

        //#region Render Map

        $(boxID).css('margin-bottom', '0px');
        $(bodyID).css('height', '800px');

        try {

            _map = L.map('box-body-' + pageElementID).setView([_mapOption.Latitude, _mapOption.Longitude], _mapOption.MidZoom);

            L.tileLayer(_mapOption.TileLayer, {
                attribution: 'amnpardaz'
            }).addTo(_map)

            $.getJSON("../App_Res/Jsons/Geo/" + _mapOption.GeoJson, function (data) {
                _this.markMap();
            });

        } catch (e) {

            raiseError(e, bodyID);

            return;
        }

        if (_mapOption.Filterable == '1') {

            $(bodyID).append('<div class="map-toolbar">' +
                '<input type="checkbox" checked="checked" class="map-toolbar" id="map-check1" class="custom-input"><label class="custom-label">&nbsp;Black Alert</label>' +
                '<br/><input type="checkbox" checked="checked"  class="map-toolbar" id="map-check2"  class="custom-input"><label class="custom-label">&nbsp;Red Alert</label>' +
                '<br/><input type="checkbox" checked="checked"  class="map-toolbar" id="map-check3"  class="custom-input"><label class="custom-label">&nbsp;Orange Alert</label>' +
                '<br/><input type="checkbox" checked="checked"  class="map-toolbar" id="map-check4"  class="custom-input"><label class="custom-label">&nbsp;Yellow Alert</label>' +
                '</div > ');

            $(bodyID).append('<div class="map-toolbar" style="top:150px;">' +
                '<input type="radio" checked="checked"  class="map-toolbar" id="map-all" name="timefilter" class="custom-input"><label class="custom-label">&nbsp;Show All</label>' +
                '<br/><input type="radio" class="map-toolbar" name="timefilter" id="map-1yaer"  class="custom-input"><label class="custom-label">&nbsp;Last year</label>' +
                '<br/><input type="radio" class="map-toolbar" name="timefilter" id="map-9month"  class="custom-input"><label class="custom-label">&nbsp;Last 9 months</label>' +
                '<br/><input type="radio" class="map-toolbar" name="timefilter" id="map-9month"  class="custom-input"><label class="custom-label">&nbsp;Last 6 months</label>' +
                '<br/><input type="radio" class="map-toolbar" name="timefilter" id="map-9month"  class="custom-input"><label class="custom-label">&nbsp;Last 3 months</label>' +
                '<br/><input type="radio" class="map-toolbar" name="timefilter" id="map-9month"  class="custom-input"><label class="custom-label">&nbsp;Last month</label>' +
                '<br/><input type="radio" class="map-toolbar" name="timefilter" id="map-9month"  class="custom-input"><label class="custom-label">&nbsp;Last week</label>' +
                '<br/><input type="radio" class="map-toolbar" name="timefilter" id="map-9month"  class="custom-input"><label class="custom-label">&nbsp;Today</label>' +
                '</div > ');
        }

        $('input.map-toolbar').change(function () {

            _firstLoad = true;

            for (var i = 0; i < _mapMarkers.length; i++) {
                _map.removeLayer(_mapMarkers[i]);
            }

            _mapMarkers = [];

            _this.markMap();
        });

        //#endregion 
    }

    _this = this;

    var _flag = 0;

    this.markMap = function () {

        if (!_firstLoad) {

            _data = new aData(_actContextID, null, _objKey, _data[0].requestDate);

            if (_data.getError() != null) {

                raiseError(_data.getError(), bodyID);
                return;
            }

            _data = _data.getList();

            console.info("refresh");
        }

        $.each(_data, function (index, node) {

            try {

                var _node = geohash_decode(node.Geohash);

                var _icon = (node.AlertStatus == '4' ? _l4Marker : (node.AlertStatus == '3' ? _l3Marker : (node.AlertStatus == '2' ? _l2Marker : (node.AlertStatus == '1' ? _l1Marker : null))))

                if (_icon !== null) {

                    var marker = L.marker({ lat: _node.lat, lng: _node.lon }, { icon: _icon }).bindPopup(
                        "" + "Server IP : <b>" + node.NodeAddr + "</b><br/><br/>" +
                        "" + "Server Connect Time: <b>" + node.LastConnectTime + "</b><br/><br/>" +
                        //"" + "Alert Severity : <b>" + node.AlertStatus + "</b><br/><br/>" +
                        "" + "Server Location : <b>" + node.NodeLabel + "</b><br/>").addTo(_map);

                    _mapMarkers.push(marker);
                }
            }
            catch (e) {

                ;
            }
        });

        _firstLoad = false;

        $$Intervals.push(setTimeout("_this.markMap()", _mapOption.RefreshPeriod * 1000));
    }
}
