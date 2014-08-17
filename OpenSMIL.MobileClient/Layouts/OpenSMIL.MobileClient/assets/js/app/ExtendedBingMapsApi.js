var ExtendedBingMapsApi = function(){

    Microsoft.Maps.Pushpin.prototype.setAttributes = function () { this._attributes = arguments[0]; };
	Microsoft.Maps.Pushpin.prototype.getAttributes = function () { return this._attributes; };

	Microsoft.Maps.Polyline.prototype.setAttributes = function () { this._attributes = arguments[0]; };
	Microsoft.Maps.Polyline.prototype.getAttributes = function () { return this._attributes; };

	Microsoft.Maps.Polygon.prototype.setAttributes = function () { this._attributes = arguments[0]; };
	Microsoft.Maps.Polygon.prototype.getAttributes = function () { return this._attributes; };
}();