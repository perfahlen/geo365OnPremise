using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.SharePoint;
using OpenSMIL.Server.SPBase;
using OpenSMIL.Server.Extensions;

namespace OpenSMIL.Server.SMILLayers
{
    public class SMILLayers : OpenSMILBase
    {

        public SMILLayers()
        {
        }

        public List<SMILLayerDef> GetSiteLayers()
        {
            try
            {
                // Get all lists from site
                List<SMILLayerDef> layers = new List<SMILLayerDef>();
                UseWeb(spWeb =>
                {
                    foreach (SPList list in spWeb.Lists)
                    {
                        if (list.HasListOpenSMILGeometry())
                        {
                            var smilLayer = new SMILLayerDef()
                            {
                                Name = list.Title,
                                GUID = list.ID,
                                SMILLayerType = SMILLayerTypeDef.LIST,
                                BaseUrlToItemDialog = list.Forms[0].ServerRelativeUrl
                            };
                            layers.Add(smilLayer);
                        }
                    }
                }
                );
                return layers;
            }
            catch (Exception x)
            {
                throw x;
            }
        }

    }
}
