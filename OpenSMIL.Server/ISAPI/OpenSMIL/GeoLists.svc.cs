using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.SharePoint.Client.Services;
using System.ServiceModel.Activation;

namespace OpenSMIL.Server.ISAPI.OpenSMIL
{
    [BasicHttpBindingServiceMetadataExchangeEndpoint]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class GeoLists : IGeoLists
    {
        
        public string GetGeoLists()
        {
            return "{ \"prop1\" : \"apa\"}";
        }
    }
}
