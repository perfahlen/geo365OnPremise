using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.SharePoint;

namespace OpenSMIL.Fields
{
    public class AddressValidationField : SPFieldText
    {

        private const string JSLinkUrl = "~site/_layouts/15/OpenSMIL/js/ValidateAddressField.js";


        public AddressValidationField(SPFieldCollection fields, string fieldName)
            : base(fields, fieldName)
        {
        }

        public AddressValidationField(SPFieldCollection fields, string fieldName, string displayName)
            : base(fields, fieldName, displayName)
        {
        }


        public override string JSLink
        {
            get
            {
                return JSLinkUrl;
            }
            set
            {
                base.JSLink = value;
            }
        }
    }
}
