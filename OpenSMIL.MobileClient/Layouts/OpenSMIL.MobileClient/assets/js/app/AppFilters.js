angular.module('OpenSMILeMobileApp').filter('listItemsFilter', function(){

	return function(item){
		var retObj = {};
		for (var property in item){
			var invalidFields = ['FileSystemObjectType', 'Id', 'GUID', '__metadata', 'ParentList', 'OData__UIVersionString', 'Folder', 'FieldValuesForEdit', 'FieldValuesAsText', 'FieldValuesAsHtml', 'EditorId', 'ContentTypeId', 'ContentType', 'AuthorId', 'AttachmentFiles'];
			if (~invalidFields.indexOf(property) || item[property] instanceof Object){
				continue;
			}
			//retObj.push(name: property, value: item[property]);
			retObj[property] = item[property];
		}
		return retObj;
	}
	
});