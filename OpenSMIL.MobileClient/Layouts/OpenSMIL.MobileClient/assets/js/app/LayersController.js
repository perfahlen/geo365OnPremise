OpenSMILeMobileApp.controller('LayersController', ['$scope', '$http', 'OpenSMILUpdateItemService', function($scope, $http, OpenSMILUpdateItemService){

    $scope.layers = [];

    $scope.createFeature = false;

    $scope.isLoaded = false;

    $scope.basePath = $('#siteUrl').val();

    $http.defaults.headers.common.Accept = 'application/json; odata=verbose';

    $scope.getLayers = function () {
        $http.get($scope.basePath + '/_layouts/15/opensmil/services/OpenSMILLayers.ashx').success(function (res) {
            $scope.layers = res;
        });
    }();

    $scope.currentPushpin = [];
    $scope.gridOptions = {
      data : 'currentPushpin',
      enableCellSelection: true,
      enableRowSelection: false,
      enableCellEditOnFocus: true,
      columnDefs: [{field: 'name', width: '40%', displayName: 'Name', enableCellEdit : false},
                   {field: 'value', displayName: '', enableCellEdit : true}]
    };


    $scope.toggleLayer = function (linkLayer, evt) {

        var layerLoaded = evt.currentTarget.classList.contains('list-group-item-info');
        
        // remove features from map
        if (layerLoaded) {
            var length = OpenSMILMobile.map.entities.getLength();
            var i = 0;
            while (i < OpenSMILMobile.map.entities.getLength()) {
                var entity = OpenSMILMobile.map.entities.get(i);
                if (entity.getAttributes().__layerName === linkLayer.Name) {
                    OpenSMILMobile.map.entities.remove(entity);
                    i = 0;
                    continue;
                }
                i++;
            }

            $(evt.currentTarget).removeClass('list-group-item-info');
            return;
        }

        $(evt.currentTarget).addClass('list-group-item-info');
        
        $http.get($scope.basePath + "/_api/web/lists/getByTitle('" + linkLayer.Name + "')/fields").success(function (resFields) {
        var geomField = resFields.d.results.filter(function(f){return f.TypeAsString === 'OpenSMILGeometry';})[0];
           
            // move to service
        $http.get($scope.basePath + "/_api/web/lists/getByTitle('" + linkLayer.Name + "')/items").success(function (resItems) {
            resItems.d.results.forEach(function(i){
              var wkt = i[geomField.InternalName];
              var geom = WKTModule.Read(wkt);
              i.__layerName = linkLayer.Name;
              geom.setAttributes(i);
              

              /*this section should be moved from controller*/
              OpenSMILMobile.map.entities.push(geom);
              Microsoft.Maps.Events.addHandler(geom, 'click', function(){

                  while ($scope.currentPushpin.length > 0){
                    $scope.currentPushpin.pop();
                  }

                  var pushPin = $scope.createData(arguments[0].target.getAttributes());
                  $scope.currentPushpin = pushPin;
                  showGrid();
                });
             });
            });
        });
    };

    showGrid = function(){
      $('#infoWidget').show();
      $(window).resize();
    };

    $scope.doneCreateFeature = function () {
        $scope.createFeature = false;
        var items = $('.fa-arrow-circle-right').filter(
            function () {
                return $(this).css('display') === 'inline';
            });
        items.css('display', 'none');
        $(OpenSMILMobile.currentTarget).css('display', 'inline');
        OpenSMILMobile.removeCurrentPushpin();
    };
        
    $scope.createPushpin = function(linkLayer, evt){

        OpenSMILMobile.addPushpin(linkLayer.Name, evt, $scope);
        $scope.createFeature = true;
      //description of layer from server,

      //generate grid from response

    };

    $scope.createMetadata = function(linkLayer, evt){

      var pushpin = OpenSMILMobile.getPushpin();
      var wkt = WKTModule.Write(pushpin);

      var getAttributes = pushpin.getAttributes();

      // move to service, get metadata about list
      var url = $scope.basePath + "/_api/web/lists/getByTitle('" + linkLayer.Name + "')/fields/?$filter=CanBeDeleted eq true and Hidden eq false";

      var newObj = [];
      var newObj = [{name: 'Title', value: '-'}];
      $scope.Title = 'New item';

      //create object and add it to the grid
      $http.get(url).success(function(resItems){
        resItems.d.results.forEach(function(f){
          var obj = {
            name : f["Title"],
            value : undefined
          };
          newObj.push(obj); 
        });

        $scope.currentPushpin = newObj;
        showGrid();

          //http://win-hv7sk10bcsr/_api/web/lists/getByTitle('customers')

        $http.get($scope.basePath + "/_api/web/lists/getByTitle('" + linkLayer.Name + "')/fields?$select=Title,TypeAsString&$filter=TypeAsString eq 'OpenSMILGeometry'").success(function (res) {
            var geometryField = res.d.results[0]["Title"];
            $scope.currentPushpin.forEach(function (c) {
                if (c["name"] === geometryField) {
                    c["value"] = WKTModule.Write(OpenSMILMobile.getPushpin());
                }
            });
        });
      });
    };

    $scope.update = function () {
        var url = $scope.basePath + "/_api/web/lists/getByTitle('" + OpenSMILMobile.getPushpin().getAttributes().__layerName + "')?$select=ListItemEntityTypeFullName";
        $http.get(url).success(function (res) {
            OpenSMILUpdateItemService.update($scope.currentPushpin, res.d.ListItemEntityTypeFullName, $scope.doneCreateFeature);
        });
    };

    $scope.createData = function(item){
      var data = [];
      for (var property in item){
        var invalidFields = ['FileSystemObjectType', 'Id', 'GUID', '__metadata', 'ParentList', 'OData__UIVersionString', 'Folder', 'FieldValuesForEdit', 'FieldValuesAsText', 'FieldValuesAsHtml', 'EditorId', 'ContentTypeId', 'ContentType', 'AuthorId', 'AttachmentFiles'];
        if (~invalidFields.indexOf(property) || item[property] instanceof Object){
          continue;
        }
        if (property === 'Title'){
          $scope.Title = item[property];
        }
        data.push({name: property, value: item[property]});
      }
      return data;
    };

}]);