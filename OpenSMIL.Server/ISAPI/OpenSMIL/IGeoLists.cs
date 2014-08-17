using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ServiceModel;
using System.ServiceModel.Web;

namespace OpenSMIL.Server.ISAPI.OpenSMIL
{
    [ServiceContract]
    public interface IGeoLists
    {
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        string GetGeoLists();
    }
}
