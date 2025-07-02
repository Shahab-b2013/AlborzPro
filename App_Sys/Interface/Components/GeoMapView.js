// JScript File(Amnpardaz Software Co. Copyright 2021 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.5.3.0

function gMapView(id, objKey) {

    var _actContextID = id;

    var _objKey = objKey;

    var _data;

    var _map;

    var _entityIcon;

    var _defaultIcon;

    var _onMarker;

    var _offMarker;

    var _unMarker;

    var _firstLoad = true;

    var _mapMarkers = [];

    this.renderContext = function (pageElementID) {

        var bodyID = '#box-body-' + pageElementID;
        var boxID = '#page-box-' + pageElementID;

        //#region Load Map Metadata

        _mapOption = new iData('a57f98fb-7640-9041-92ab-ab8544ecdab1', _actContextID);

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

        _onMarker = new _defaultIcon({ iconUrl: '../App_Res/Images/Mark/' + _mapOption.OnMarker });
        _offMarker = new _defaultIcon({ iconUrl: '../App_Res/Images/Mark/' + _mapOption.OffMarker });
        _unMarker = new _defaultIcon({ iconUrl: '../App_Res/Images/Mark/' + _mapOption.UnMarker });

        //#endregion

        //#region Render Map

        $(boxID).css('margin-bottom', '0px');
        $(bodyID).css('height', '800px');

        try {

            _map = L.map('box-body-' + pageElementID).setView([_mapOption.Latitude, _mapOption.Longitude], _mapOption.MidZoom);

            L.tileLayer(_mapOption.TileLayer, {
                attribution: 'amnpardaz',
                minZoom: _mapOption.MinZoom
            }).addTo(_map)

            $.getJSON("../App_Res/Jsons/Geo/" + _mapOption.GeoJson, function (data) {

                L.geoJson(data).addTo(_map);

                _this.markMap();
            });

        } catch (e) {

            raiseError(e, bodyID);

            return;
        }

        $(bodyID).append('<div class="map-toolbar">' +
            '<input type="checkbox" checked="checked" class="map-toolbar" id="map-checkUp" class="custom-input"><label class="custom-label">&nbsp;Connected Servers</label>' +
            '<br/><input type="checkbox" checked="checked"  class="map-toolbar" id="map-checkDown"  class="custom-input"><label class="custom-label">&nbsp;Diconnected Servers</label>' +
            '<br/><input type="checkbox" checked="checked"  class="map-toolbar" id="map-checkUnknown"  class="custom-input"><label class="custom-label">&nbsp;Unknown Servers</label>' +
            '</div > ');

        $(bodyID).append('<div class="map-toolbar" style="top:150px;">' +
            '<input type="radio" checked="checked"  class="map-toolbar" id="map-all" name="capital" class="custom-input"><label class="custom-label">&nbsp;All Servers</label>' +
            '<br/><input type="radio" class="map-toolbar" name="capital" id="map-capital"  class="custom-input"><label class="custom-label">&nbsp;Capital Servers</label>' +
            '</div > ');

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

                var _icon = (node.UpStatus == 'UP' ? _onMarker : (node.UpStatus == 'DOWN' ? _offMarker : _unMarker))

                if ((document.getElementById('map-checkUp').checked && node.UpStatus == 'UP') ||
                    (document.getElementById('map-checkDown').checked && node.UpStatus == 'DOWN') ||
                    (document.getElementById('map-checkUnknown').checked && node.UpStatus == 'UNKNOWN')
                ) {
                   
                    if ((document.getElementById('map-all').checked) ||
                        (document.getElementById('map-capital').checked && node.IsCapital == 'True')) {
                        var marker = L.marker({ lat: _node.lat, lng: _node.lon }, { icon: _icon }).bindPopup("" + "Server Name : <b>" + node.NodeLabel + "</b><br/><br/>" +
                            "" + "Server IP : <b>" + node.NodeAddr + "</b><br/><br/>" +
                            "" + "Pingable : <b>" + node.Pingable + "</b><br/><br/>" +
                            "" + "Server Status : <b>" + node.UpStatus + "</b><br/><br/>" +
                            "" + "Last Change Status: <b>" + node.LastUSChange + "</b><br/><br/>" +
                            "" + "Location : <b>" + node.SiteLabel + "</b><br/>").addTo(_map);

                        _mapMarkers.push(marker);
                    }
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
