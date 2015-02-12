var OpenSMIL = OpenSMIL || {};

OpenSMIL.registerGetCallBack = function (formContext) {
    var element = document.getElementById(formContext.fieldSchema.Id + '_' + formContext.fieldName);
    var val = element.value;
    return val;
};

OpenSMIL.addressEditValidationTemplate = function (ctx) {
    var formContext = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
    formContext.registerGetValueCallback(formContext.fieldName, OpenSMIL.registerGetCallBack.bind(null, formContext));
    return '<input type="text" id="' + (formContext.fieldSchema.Id + '_' + formContext.fieldName) +
        '" onkeyup="OpenSMIL.validate(ctx, this);" onchange="OpenSMIL.validate(ctx, this);" style="width: 80%" value="' + ctx.CurrentFieldValue + '" /><span style="margin-left: 8px"></span>';
};

OpenSMIL.addressDisplay = function (ctx) {
    return '<span>' + ctx.CurrentItem[ctx.CurrentFieldSchema.Name] + '</span>';
};


OpenSMIL.validate = function (ctx, textField) {

    // be kind with bing .... 3 simple tests
    if (textField.value.endsWith(' '))
        return;

    if (textField.value.length < 5)
        return;

    if (!/,/.test(textField.value))
        return;

    var xhr = new XMLHttpRequest();
    var validationService = '/_layouts/15/OpenSMIL/services/ValidateAddress.ashx?address=' + textField.value;
    xhr.open('GET', validationService, true);
    xhr.onload = function onLoad(e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var accuracy = JSON.parse(xhr.responseText);
                var qualityInfo = textField.nextSibling;
                qualityInfo.innerHTML = accuracy.Accuracy;
                OpenSMIL.setAddressQualityStyle(qualityInfo, accuracy.Accuracy);
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.send(null);
};

OpenSMIL.setAddressQualityStyle = function (qualityInfo, quality) {
    quality === 'Bad' ?  qualityInfo.style.color = 'red' :
    quality === 'Moderate' ? qualityInfo.style.color = 'orange' :
    qualityInfo.style.color = 'green';
};

(function () {
    var addressValidationContext = {};
    addressValidationContext.Templates = {};
    addressValidationContext.Templates.Fields = {
        'AddressValidationField': {
            "EditForm": OpenSMIL.addressEditValidationTemplate,
            'NewForm': OpenSMIL.addressEditValidationTemplate,
            'View': OpenSMIL.addressDisplay,
            'DisplayForm': OpenSMIL.addressDisplay
        }
    };

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(
        addressValidationContext
        );
})();