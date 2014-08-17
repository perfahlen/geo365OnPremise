using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenSMIL.Server.SMILLayers
{
    public class SMILLayerDefView : SMILLayerDef
    {
        public string ParentName { get; set; }

        public Guid ParentGUID { get; set; }
    }
}
