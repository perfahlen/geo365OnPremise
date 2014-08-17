using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using OpenSMIL.Server.SimpleFeature.GeomtryTypes;

namespace OpenSMIL.Server.SimpleFeature.IO
{
    public interface IGeometryReader
    {
        ISimpleGeometry Parse(string wkt);

    }
}
