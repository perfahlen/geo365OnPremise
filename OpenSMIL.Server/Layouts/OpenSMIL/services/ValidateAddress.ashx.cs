using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using System.Web;

using System.Web.Script.Serialization;
using OpenSMIL.Server.BingServices;

namespace OpenSMIL.Server
{
    public partial class ValidateAddress : OpenSMILServiceBase<object>
    {
        public override object GetResponseData(HttpContext context)
        {
            string responseText = string.Empty;
            context.Response.ContentType = "application/json";
            if (!string.IsNullOrEmpty(context.Request.Params["Address"]))
            {
                string address = context.Request.Params["Address"];
                responseText = Address.ValidateAddress(address);
            }
            else
            {
                throw new Exception("missing input paratemer address");
            }

            var response = new { Accuracy = responseText };

            return response;
        }
    }
}
