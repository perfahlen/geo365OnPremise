OpenSMILeMobileApp.service('OpenSMILUpdateItemService', function($http){

    this.update = function (item, listItemEntityTypeFullName, callback) {
        var layerName = OpenSMILMobile.getPushpin().getAttributes().__layerName;

	    var listItem = {};
	    item.forEach(function (i) { listItem[i.name] = i.value });
	    listItem.__metadata = { type: listItemEntityTypeFullName };
	    var url = OpenSMILSettings.basePath + "/_api/web/lists/GetByTitle('" + layerName + "')/items";

	    var payload = JSON.stringify(listItem);

	    var self = this;

	    $http.post(OpenSMILSettings.basePath + '/_api/contextinfo').success(function (response) {
	        var token = (response.d.GetContextWebInformation.FormDigestValue);

	        $http.defaults.headers.post["X-RequestDigest"] = token;
	        $http.defaults.headers.post["Content-Type"] = "application/json;odata=verbose",


	        $http.post(url, payload).success(function (r) {
	            OpenSMILMobile.removePushpin();
	            OpenSMILMobile.pushPinAdded();
	            callback();
	        });
	    });
	};
});