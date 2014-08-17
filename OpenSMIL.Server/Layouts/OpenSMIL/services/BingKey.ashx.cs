using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using System.Web;

using System.Web.Script.Serialization;
using System.Configuration;
namespace OpenSMIL.Server
{
    public partial class BingKey : OpenSMILServiceBase<object>
    {

        public override object GetResponseData(HttpContext context)
        {
            try
            {
                string key = System.Configuration.ConfigurationManager.AppSettings["BingKey"] ?? "";
                return new {BingKey = key};
            }
            catch (Exception x)
            {
                throw;
            }
        }
    }
}
