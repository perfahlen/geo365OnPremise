var OpenSMIL = OpenSMIL || {};

OpenSMIL.bingMaps = undefined;
OpenSMIL.jquery = undefined;
OpenSMIL.currentGeom = undefined
OpenSMIL.isDrawing = undefined;
OpenSMIL.WKT = undefined;
OpenSMIL.isEditView = false;
OpenSMIL.firstVertice = true;

OpenSMIL.DisplayForm = function (ctx) {
    OpenSMIL.mapId = new Date().getTime();
    var geom = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
    if (geom === '') {
        return "<span></span>";
    }
    OpenSMIL.currentGeom = geom;
    return '<div id="' + OpenSMIL.mapId + '" style="width: 400px; height: 400px;"></div>';
};

OpenSMIL.ViewForm = function (ctx) {
    var list = ctx.ListTitle;
    var geom = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
    if (geom != '') {
        var image = /point/i.test(geom) ? '_layouts/15/OpenSMIL/img/marker.png' : /polygon/i.test(geom) ?
            '_layouts/15/OpenSMIL/img/polygon.png' : '_layouts/15/OpenSMIL/img/polyline.png';
        return '<img src="' + image + '"style="position: relative; left : 40%;" onmouseover="OpenSMIL.renderViewMap({element: this, geom: ' + "'" + geom + "'" + '});" />';
    }
    return '<span></span>';
};

OpenSMIL.renderViewMap = function (args) {
    var element = args.element;
    var geom = args.geom;
    if (OpenSMIL.WKT) {
        OpenSMIL.mapId = new Date().getTime();
        $('<div id="' + OpenSMIL.mapId + '"</div>').appendTo(OpenSMIL.createPreviewMapContainer(element));

        OpenSMIL.map = new Microsoft.Maps.Map(document.getElementById(OpenSMIL.mapId), { credentials: OpenSMIL.getKey(), disableZooming: true, disablePanning: true, enableClickableLogo: false, enableSearchLogo: false, showDashboard: false });
        var msGeom = WKTModule.Read(geom);
        OpenSMIL.map.entities.push(msGeom);
        if (msGeom instanceof Microsoft.Maps.Pushpin) {
            OpenSMIL.map.setView({ zoom: 12, center: msGeom.getLocation() });
        }
        else {
            var bounds = Microsoft.Maps.LocationRect.fromLocations(msGeom.getLocations());
            OpenSMIL.map.setView({ bounds: bounds });
        }
    } else {
        setTimeout(OpenSMIL.renderViewMap, 100, {element: element, geom: geom})
    }
};

OpenSMIL.createPreviewMapContainer = function (element) {

    var top = parseInt($(element).position().top);
    if (top - 100 > 200) {
        top = top - 100;
    }

    var left = parseInt($(element).position().left);

    var left = left + "px";
    top = top + "px";
    var cont = '<div style="z-index: 100;width: 400px;height: 400px; background-color: white; border-color: green; border: 1px solid; border-radius: 5px; overflow: hidden; position: absolute;left:' + left + '; top: ' + top + ';" onmouseleave="$(this).remove();"></div>';
    return $(cont).appendTo("body");
};

OpenSMIL.getKey = function () {
    if (OpenSMIL.key) {
        return OpenSMIL.key;
    }
    var cookies = document.cookie.split(';');
    var bingKey = cookies.filter(function (e) {
        return /bingkey/.test(e);
    });
    if (bingKey.length == 0) {
        return 0;
    }
    var pieces = bingKey[0].split('=');
    return pieces[1];
};

OpenSMIL.loadBingKey = function (callback) {
    var bingKeyService = '/_layouts/15/OpenSMIL/services/BingKey.ashx';
    $.ajax({
        url: bingKeyService,
        success: function receiveKey(evt) {
            OpenSMIL.key = evt.BingKey;
            document.cookie = 'bingkey=' + evt.BingKey; // not nice
        }
    });
};

OpenSMIL.registerEditFormCallBack = function (formContext) {
    var element = document.getElementById(formContext.fieldSchema.Id + '_' + formContext.fieldName);
    var address = element.value;
    return address;
};

OpenSMIL.EditForm = function (ctx) {
    var formContext = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
    formContext.registerGetValueCallback(formContext.fieldName, OpenSMIL.registerEditFormCallBack.bind(null, formContext));
    var geom = ctx.CurrentFieldValue;

    OpenSMIL.currentGeom = geom;
    OpenSMIL.mapId = new Date().getTime();
    OpenSMIL.dataId = (formContext.fieldSchema.Id + '_' + formContext.fieldName);
    OpenSMIL.isEditView = true;
    return '<input type="text" id="' + OpenSMIL.dataId + '" value="' + geom + '" style="visibility: hidden;" /><div id="' + OpenSMIL.mapId + '" style="width: 400px; height: 400px; background-color: blue;"></div>';
};

OpenSMIL.NewForm = function (ctx) {
    var formContext = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
    formContext.registerGetValueCallback(formContext.fieldName, OpenSMIL.registerEditFormCallBack.bind(null, formContext));

    OpenSMIL.mapId = new Date().getTime();
    OpenSMIL.dataId = (formContext.fieldSchema.Id + '_' + formContext.fieldName);
    OpenSMIL.isEditView = true;
    return '<input type="text" id="' + OpenSMIL.dataId + '" style="visibility: hidden;" /><div id="' + OpenSMIL.mapId + '" style="width: 400px; height: 400px; background-color: blue;"></div>';
};

OpenSMIL.map = null;

//fallback function when fromLocations doesn't work
OpenSMIL.getBB = function (geom) {
    var bounds = { west: 180.0, east: -180.0, north: -90.0, south: 90.0 };
    var locations = geom.getLocations();
    var coordinates = locations[0];
    coordinates.forEach(function (c) {
        bounds.west = Math.min(bounds.west, c.longitude);
        bounds.east = Math.max(bounds.east, c.longitude);
        bounds.south = Math.min(bounds.south, c.latitude);
        bounds.north = Math.max(bounds.north, c.latitude);
    });
    var bb = Microsoft.Maps.LocationRect.fromEdges(bounds.north, bounds.west, bounds.south, bounds.east);
    return bb;
};

OpenSMIL.createEditMap = function () {
    var mapContainer = document.getElementById(OpenSMIL.mapId);
    if (Microsoft !== undefined && Microsoft.Maps !== undefined && Microsoft.Maps.Map !== undefined && OpenSMIL.WKT) {
            var element = $('#' + OpenSMIL.mapId);
            OpenSMIL.map = new Microsoft.Maps.Map(document.getElementById(OpenSMIL.mapId), { credentials: OpenSMIL.getKey(), width: element.width(), height: element.height() });
            // { strokeColor: new Microsoft.Maps.Color(200, 255, 0, 0) }

            if (/^\POLYGON|^\LINESTRING/.test(OpenSMIL.currentGeom)) {
                var msGeom = WKTModule.Read(OpenSMIL.currentGeom);
                OpenSMIL.map.entities.push(msGeom);
                var bounds = Microsoft.Maps.LocationRect.fromLocations(msGeom.getLocations());
                if (isNaN(bounds.getEast())) {
                    bounds = OpenSMIL.getBB(msGeom);
                }
                OpenSMIL.map.setView({ bounds: bounds });
            }
            else {
                var pushpin = OpenSMIL.currentGeom ? WKTModule.Read(OpenSMIL.currentGeom) : new Microsoft.Maps.Pushpin(OpenSMIL.map.getCenter(), null);
                pushpin.setOptions({ draggable: OpenSMIL.isEditView });
                if (OpenSMIL.currentGeom) {
                    OpenSMIL.map.setView({ zoom: 12, center: pushpin.getLocation() });
                }
                OpenSMIL.addDragablePushpin(pushpin);
            }
            OpenSMIL.addPanel();
    }
    else {
        setTimeout(OpenSMIL.createEditMap, 100);
    }
};

OpenSMIL.addDragablePushpin = function (pushPin) {
    OpenSMIL.map.entities.clear();
    Microsoft.Maps.Events.addHandler(pushPin, 'dragend', function (evt) {
        var wkt = WKTModule.Write(OpenSMIL.map.entities.get(0));
        $('#' + OpenSMIL.dataId).val(wkt);
    });
    OpenSMIL.map.entities.push(pushPin);
};

OpenSMIL.adjustBingToolWidth = function () {
    if (OpenSMIL.isEditView) {
        if ($('.NavBar_modeSelectorControlContainer').length > 0) {
            $('.NavBar_modeSelectorControlContainer').width(100);
        } else {
            setTimeout(OpenSMIL.adjustBingToolWidth, 50);
        }
    }
    else {
        $('#mapToolBar').width(0);
    }
};

OpenSMIL.addPanel = function () {
    $('<span id="mapToolBar" class="MicrosoftNav MapTypeId_auto" style="position: absolute; right: 0; top: 0; height: 29px; cursor: pointer; background-color: #faf7f5; vertical-align: middle; text-align: right; width: 140px; color: white;">' +
        '<img onclick="OpenSMIL.toggleTool(this); OpenSMIL.setIsDrawing(false);" title="Pan map" onload="OpenSMIL.toggleTool(this);" style="margin-top: 6px; margin-left: 6px;" src="/_layouts/15/opensmil/img/hand.png" />' +
        '<img onclick="OpenSMIL.map.entities.clear();" title="Clear map" style="margin-top: 6px; margin-left: 6px;" src="/_layouts/15/opensmil/img/broom.png" />' +
        '<img onclick="OpenSMIL.drawGeomOnclick(' + "'Polygon'" + ', event, this);" title="Draw polygon" style="margin-top: 6px; margin-left: 6px;" src="/_layouts/15/opensmil/img/polygon.png" />' +
        '<img onclick="OpenSMIL.drawGeomOnclick(' + "'Polyline'" + ', event, this);" title="Draw polyline" style="margin-left: 6px; margin-top: 6px;" src="/_layouts/15/opensmil/img/polyline.png" />' +
        '<img onclick="OpenSMIL.drawGeomOnclick(' + "'Pushpin'" + ', event, this)" title="Add point" style="margin-left: 6px; margin-top: 6px; margin-right: 6px;" src="/_layouts/15/opensmil/img/marker.png" />' +
        '</span>').appendTo('.MicrosoftMap', 'MapTypeId_m medium');
    OpenSMIL.adjustBingToolWidth();
};

OpenSMIL.drawGeomOnclick = function (geomType, evt, elem) {
    evt.stopPropagation();
    evt.cancelBubble = true;
    OpenSMIL.toggleTool(elem);
    OpenSMIL.draw(geomType);
    OpenSMIL.setIsDrawing(true);
};

OpenSMIL.setIsDrawing = function (isDrawing) {
    OpenSMIL.isDrawing = isDrawing;
};

OpenSMIL.addGeometry = function (geomType) {
    OpenSMIL.map.entities.clear();
    if (geomType === 'Pushpin') {
        var pushPin = new Microsoft.Maps.Pushpin(OpenSMIL.map.getCenter(), { draggable: true });
        return OpenSMIL.map.entities.get(0);
    }
    var geometry = new Microsoft.Maps[geomType]();
    OpenSMIL.map.entities.push(geometry);
    return OpenSMIL.map.entities.get(0);
};

OpenSMIL.draw = function (geomType) {
    Microsoft.Maps.Events.addHandler(OpenSMIL.map, 'click', function (evt) {
        if (evt.targetType === 'map' && OpenSMIL.isDrawing) {
            var point = new Microsoft.Maps.Point(evt.getX(), evt.getY());
            var location = evt.target.tryPixelToLocation(point);
            if (geomType === 'Pushpin') {
                var pushPin = new Microsoft.Maps.Pushpin(location, { draggable: true });
                OpenSMIL.addDragablePushpin(pushPin);
                return;
            }
            if (OpenSMIL.firstVertice) {
                OpenSMIL.currentGeom = OpenSMIL.addGeometry(geomType);
                OpenSMIL.firstVertice = false;
            } else {
                if (!(OpenSMIL.currentGeom instanceof Microsoft.Maps[geomType])) {
                    OpenSMIL.currentGeom = OpenSMIL.addGeometry(geomType);
                }
            }
            if (OpenSMIL.currentGeom) {
                var vertices = OpenSMIL.currentGeom.getLocations();
                if (!(vertices)) {
                    OpenSMIL.currentGeom.setLocations([location]);
                }
                else {
                    vertices.push(location);
                    OpenSMIL.currentGeom.setLocations(vertices);
                }
            }
        }
    });

    Microsoft.Maps.Events.addHandler(OpenSMIL.map, 'dblclick', function (evt) {
        OpenSMIL.isDrawing = undefined;
        OpenSMIL.firstVertice = true;
        Microsoft.Maps.Events.removeHandler('click');
        OpenSMIL.onDigitized();

        var geom = OpenSMIL.map.entities.get(0);
        var wkt = WKTModule.Write(geom);
        $('#' + OpenSMIL.dataId).val(wkt);

        OpenSMIL.toggleTool($('#mapToolBar').children().first()[0]);
        evt.cancelBubble = true;
        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
    });
};

OpenSMIL.onDigitized = function () {
    var geom = OpenSMIL.map.entities.get(0);
    if (geom instanceof Microsoft.Maps.Polygon) {
        var locations = geom.getLocations();
        var firstLocation = locations[0];
        var lastLocation = locations[locations.length - 1];
        if (!Microsoft.Maps.Location.areEqual(firstLocation, lastLocation)) {
            locations.push(firstLocation);
            OpenSMIL.map.entities.clear();
            OpenSMIL.map.entities.push(new Microsoft.Maps.Polygon(locations));
        }
    }
};

OpenSMIL.toggleTool = function (tool, clearAll) {
    tool.style.border = 'solid';
    tool.style.borderColor = '#999999';
    tool.style.borderWidth = '1px';
    $(tool).siblings().css('border', 'none');
};

OpenSMIL.loadScript = function (url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.body.appendChild(script);
};


document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'complete') {
        OpenSMIL.loadScript('http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0', function loadBingMaps() {
            OpenSMIL.bingMaps = true;
            OpenSMIL.loadScript('/_layouts/15/OpenSMIL/js/libs/jquery-1-10-2-min.js', function wktLoaded() {
                OpenSMIL.WKT = true;
                setTimeout(function () {
                    OpenSMIL.loadScript('/_layouts/15/OpenSMIL/js/libs/WKTModule-min.js', function jqueryLoad() {
                        OpenSMIL.jquery = true;
                        OpenSMIL.loadBingKey();
                        OpenSMIL.createEditMap();
                    });
                }, 500);
            });
        });
    }
};

(function () {

    var geometryContext = {};
    geometryContext.Templates = {};
    geometryContext.Templates.Fields = {
        'OpenSMILGeometry': {
            'View': OpenSMIL.ViewForm,
            'DisplayForm': OpenSMIL.DisplayForm,
            'EditForm': OpenSMIL.EditForm,
            'NewForm': OpenSMIL.NewForm
        }
    };

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(
        geometryContext
    );
})();