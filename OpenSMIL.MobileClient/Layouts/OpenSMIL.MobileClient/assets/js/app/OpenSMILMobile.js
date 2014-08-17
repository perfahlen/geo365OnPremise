 var OpenSMILMobile = function(){

 	var layer = '';
	var currentTarget = null;
	var lastMove = null;
	var currentPushpin = null;
	var added = false;

	var map = new Microsoft.Maps.Map(document.getElementById('map'), {
	    credentials: OpenSMILSettings.bingKey
	});
     
	var viewChanged = function(e) {
		lastMove = new Date().getTime();
		removePushPin();
		$(OpenSMILMobile.currentTarget).css({'display': 'inline'});
		$(OpenSMILMobile.currentTarget).next().css({'display': 'none'});
	    _addPushpin();

	};

	var removePushPin = function () {
	    var entitiesLength = OpenSMILMobile.map.entities.getLength();
	    for (i = 0; i < entitiesLength; i++) {
	        var entity = OpenSMILMobile.map.entities.get(i);
	        if (entity) {
	            var attributes = entity.getAttributes();
	            if (attributes.centerIcon) {
	                OpenSMILMobile.map.entities.remove(entity);
	            }
	        }
	    }
	};

	var _addPushpin = function ($scope) {
        if (!added){
	        var pushPin = new Microsoft.Maps.Pushpin(OpenSMILMobile.map.getCenter(), {color: 'blue'});
		    pushPin.setAttributes({ centerIcon: true, __layerName: layer });
	        OpenSMILMobile.map.entities.push(pushPin);
	        currentPushpin = pushPin;

	        setTimeout(function () {
	    	    if (!lastMove || (new Date().getTime()) - lastMove > 1000){
	    	        OpenSMILMobile.effects.shake(OpenSMILMobile.currentTarget, function () {
                           $(OpenSMILMobile.currentTarget).removeAttr('style');
	    			       $(OpenSMILMobile.currentTarget).css({'display': 'none'});
	    			       $(OpenSMILMobile.currentTarget).next().css({ 'display': 'inline', 'color': 'orange' });
	    			       return;
                        
	    		    });
	    	    }
	        }, 1000);
        }
	};

	var addPushpin = function(_layer, evt, $scope){
		OpenSMILMobile.currentTarget = evt.target;
		layer = _layer;
		Microsoft.Maps.Events.addHandler(map, 'viewchange', viewChanged);
		added = false;
		_addPushpin($scope);
	};

	var pushPinAdded = function (argument) {
	    Microsoft.Maps.Events.removeHandler(map, 'viewchange', viewChanged);
	    delete currentPushpin;
	    $('#infoWidget').hide(200);
	    added = true;
	};

	var getPushpin = function(){
		return currentPushpin;
	};

	var removeCurrentPushpin = function () {
	    map.entities.remove(currentPushpin);
	    added = true;
	    delete currentPushpin;
	};

	

	return {
		map: map,
		addPushpin: addPushpin,
		pushPinAdded: pushPinAdded,
		currentTarget: currentTarget,
		getPushpin: getPushpin,
		removePushpin: removePushPin,
		removeCurrentPushpin: removeCurrentPushpin
	};
}();