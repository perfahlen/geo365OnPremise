// TO DO 
// Refactor communication to core layer
// put in closure

var OpenSMILWebPart = {};
OpenSMILWebPart.map = undefined;

OpenSMILWebPart.request = function (args, url, callbackSuccess, callbackError) {
    $.ajax({
        url: url,
        method: 'GET',
        headers: {
            'accept': 'application/json; odata=verbose'
        },
        success: callbackSuccess,
        error: callbackError || function () {
            console.log('error calling', url);
        }
    });
};

OpenSMILWebPart.layers = [];

OpenSMILWebPart.getCurrentPushPinLocations = function(){
    var locations = [];
    for (i = 0; i < OpenSMILWebPart.map.entities.getLength() ; i++) {
        var entity = OpenSMILWebPart.map.entities.get(i);
        if (entity instanceof Microsoft.Maps.Pushpin) {
            var location = entity.getLocation();
            locations.push(location);
        }
    }
    return locations;
};

OpenSMILWebPart.zoomToEntities = function () {
    
    var locations = OpenSMILWebPart.getCurrentPushPinLocations();
    if (locations.length > 0) {
        var locationRect = Microsoft.Maps.LocationRect.fromLocations(locations);
        OpenSMILWebPart.map.setView({ bounds: locationRect });
    }
};

OpenSMILWebPart.loadLists = function (listNames) {
    if (listNames && listNames instanceof Array && listNames.length > 0) {
        var listNames = listNames;
        var listName = listNames[0].Name;
        var baseUrlToItem = listNames[0].BaseUrlToItemDialog;
        OpenSMILWebPart.request(null, _spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getByTitle(\'' + listName + '\')/fields',
            function loadListReq() {
                var geomFields = arguments[0].d.results.filter(function filterColumns(field) {
                    return field.TypeAsString === 'OpenSMILGeometry';
                }
                );
                listNames.reverse();
                listNames.pop();
                listNames.reverse();
                OpenSMILWebPart.loadSharePointFeatures(listName, geomFields[0].Title, listNames, baseUrlToItem);
            });
    }
    else if (listNames.length === 0 && OpenSMILWebPart.map.entities.getLength() > 0) {
        OpenSMILWebPart.zoomToEntities();
        $('#layers').height("+=8px");
    }
};

//Pull data from sharePoint
OpenSMILWebPart.loadSharePointFeatures = function (listName, geomField, listNames, baseUrlToItem) {
    var geomField = geomField;
    var listNames = listNames;
    var baseUrlToItem = baseUrlToItem;
    var url = _spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getByTitle(\'' + listName + '\')/items';
    OpenSMILWebPart.request(null, url,
        function loadSharePointFeaturesReq(evt) {
            var features = evt.d.results.filter(function (i) {
                return i[geomField];
            });
            OpenSMILWebPart.plot(features, listName, geomField, listNames, baseUrlToItem);
        },
        function loadSharePointFeaturesReqError() {
            alert("Error loading list items from server");
        });
};

OpenSMILWebPart.plot = function (features, listName, geomField, listNames, baseUrlToItem) {
    var geomField = geomField;
    var listName = listName;
    var baseUrlToItem = baseUrlToItem;
    features.forEach(function (f) {
        var wkt = f[geomField];
        var geom = WKTModule.Read(wkt);
        geom.setAttributes({ listName: listName, url: _spPageContextInfo.webAbsoluteUrl + baseUrlToItem + '?ID=' + f.ID });
        OpenSMILWebPart.map.entities.push(geom);
        Microsoft.Maps.Events.addHandler(geom, 'click', OpenSMILWebPart.showFeatureDialog);
    });
    OpenSMILWebPart.listAdded(listName);
    OpenSMILWebPart.loadLists(listNames);
};

OpenSMILWebPart.listAdded = function (listName) {
    this.layers.push(listName);
    $('<li style="margin-left: 0px; list-style-type: none; padding-left: 12px; padding-top: 6px;"><label for="layer_' + listName + '"><input type="checkbox" checked="true" style="margin-right: 12px;" id="layer_' + listName + '" />' + listName + '</ul>').appendTo('#layersList');

    $('#layer_' + listName).click(function () {
        var layer = $('label[for=layer_' + listName + ']').text();
        var entitiesLength = OpenSMILWebPart.map.entities.getLength();
        for (i = 0; i < entitiesLength; i++) {
            var entity = OpenSMILWebPart.map.entities.get(i);
                var attributes = entity.getAttributes();
                if (attributes.listName && attributes.listName === listName) {
                    entity.setOptions({ visible: $('#layer_' + listName)[0].checked });
                }
        }
    });
};

OpenSMILWebPart.showFeatureDialog = function (e) {
    var attributes = e.target.getAttributes();
    var url = attributes.url;
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', { url: url, width: 600, height: 800 });
    
};

OpenSMILWebPart.addLayerControl = function () {
    $('<div style="width: 200px; height: 30px; right: 10px; background-color: rgb(0, 114, 198); position: absolute; top: 10px; opacity: 0.9; color: white;" id="layersmenu"><span style="position: relative; top : 4px; margin-left: 8px;">Layers</span><span id="layerToggler" class="fa fa-chevron-circle-down" style="position: absolute; top: 6px; right:8px; -ms-transform: rotate(180deg); -webkit-transform: rotate(180deg);"></span></div>').appendTo('#OpenSMILWebPartMap');
    $('<div style="width: 200px; right: 10px; background-color: rgb(0, 114, 198); position: absolute; top: 40px; opacity: 0.7;" id="layers"><ul id="layersList" style="color: white; list-style-type: none; margin: 0px; padding-left: 0px;"></ul></div>').appendTo('#OpenSMILWebPartMap');
    $('#layerToggler').click(function () {
        $('#layers').animate({ height: 'toggle' }, 50, function () {
            if ($('#layers').css('display') === 'none') {
                $('#layerToggler').css('-ms-transform', 'rotate(0deg)');
                $('#layerToggler').css('-webkit-transform', 'rotate(0deg)');
            } else {
                $('#layerToggler').css('-ms-transform', 'rotate(180deg)');
                $('#layerToggler').css('-webkit-transform', 'rotate(180deg)');
            }
        })
    });

};

OpenSMILWebPart.currentLocation = null;

OpenSMILWebPart.addDragFilesBehaviour = function () {

    $('.MicrosoftMap, .MapTypeId_m, .large').bind('drop', function fileDropped(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var fileReader = new FileReader();
        fileReader.onloadend = function (theFile) {
            var parser = new DOMParser();
            var xml = parser.parseFromString(theFile.currentTarget.result, 'application/xml');

            var myTrackOptions = {
                strokeColor: new Microsoft.Maps.Color(156, 0, 0, 255)
            };

            var myRouteOptions = {
                strokeColor: new Microsoft.Maps.Color(156, 0, 0, 255)
            };

            var myPushpinOptions = {
            };

            new GPXParser().ParseXML(xml, function plotGPX(items) {
                OpenSMILWebPart.map.entities.push(items);
                if (items.Metadata != null && items.Metadata.LocationRect != null) {
                    map.setView({ bounds: items.Metadata.LocationRect });
                }
            }, { pushpinOptions: myPushpinOptions, routeOptions: myRouteOptions, trackOptions: myTrackOptions });
        }; 

        fileReader.readAsText(evt.originalEvent.dataTransfer.files[0]);
    });

    $('.MicrosoftMap, .MapTypeId_m, .large').bind('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    });

    $('.MicrosoftMap, .MapTypeId_m, .large').bind('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    });
};


OpenSMILWebPart.extendBingMaps = function(){
//need to extend Bing Maps functionality a bit
    Microsoft.Maps.Pushpin.prototype.setAttributes = function () {
        this._attributes = arguments[0];
    };
    
    Microsoft.Maps.Pushpin.prototype.getAttributes = function () {
        return this._attributes;
    };

    Microsoft.Maps.Polygon.prototype.setAttributes = function () {
        this._attributes = arguments[0];
    };
    
    Microsoft.Maps.Polygon.prototype.getAttributes = function () {
        return this._attributes;
    };

    Microsoft.Maps.Polyline.prototype.setAttributes = function () {
        this._attributes = arguments[0];
    };
    
    Microsoft.Maps.Polyline.prototype.getAttributes = function () {
        return this._attributes;
    };
};

OpenSMILWebPart.initMap = function () {


        if (Microsoft.Maps && Microsoft.Maps.Pushpin && Microsoft.Maps.Polyline && Microsoft.Maps.Polygon) {
            
            OpenSMILWebPart.extendBingMaps();

            var element = $('#' + 'OpenSMILWebPartMap');
            OpenSMILWebPart.map = new Microsoft.Maps.Map(document.getElementById('OpenSMILWebPartMap'), {
                credentials: OpenSMIL.bingKey, width: element.width(), height: element.height()
            }
            );

            OpenSMILWebPart.addLayerControl();

            OpenSMILWebPart.request(null, _spPageContextInfo.webAbsoluteUrl + '/_layouts/15/opensmil/services/OpenSMILLayers.ashx', function getListsRequest() {
                OpenSMILWebPart.loadLists(arguments[0]);
                OpenSMILWebPart.addDragFilesBehaviour();
            });
        } else {
            setTimeout(OpenSMILWebPart.initMap, 50);
        }
};