OpenSMILMobile.effects = function(){

	var shake = function(element, callback){

		var l = 8;
		var shakes = 10;
		for (var i = 0; i < shakes; i++){
			$(element).animate({'margin-left' : '+=' + (l = -l) + 'px'}, 50, 'swing', function(){
				if (i === shakes){
					var _callback = callback;
					setTimeout(function(){
						_callback();
					}, 100);
					return;
				}
			});
		}
	};

	return {
		shake : shake
	};	
}();