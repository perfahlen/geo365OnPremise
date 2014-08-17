using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using System.Web;

using OpenSMIL.Server.SMILLayers;

using System.Web.Script.Serialization;
using System.Collections.Generic;

namespace OpenSMIL.Server
{
    public partial class OpenSMILLayers : OpenSMILServiceBase<SMILLayerDef[]>
    {

        public override SMILLayerDef[] GetResponseData(HttpContext context)
        {
            try
            {
                SMILLayers.SMILLayers layer = new SMILLayers.SMILLayers();
                var layers = layer.GetSiteLayers();
                return layers.ToArray();
            }
            catch (Exception x)
            {
                throw;
            }
        }
    }
}
