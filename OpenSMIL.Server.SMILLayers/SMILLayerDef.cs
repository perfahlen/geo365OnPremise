using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenSMIL.Server.SMILLayers
{
    public class SMILLayerDef
    {
        public string Name { get; set; }

        public Guid GUID { get; set; }

        public SMILLayerTypeDef SMILLayerType { get; set; }

        public string BaseUrlToItemDialog { get; set; }


    }
}
