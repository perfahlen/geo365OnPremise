using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//using SimpleFeature.GeomtryType;

namespace OpenSMIL.Server.SimpleFeature.GeomtryTypes
{
    public interface ISimpleGeometry
    {
        GeometryTypes GeometryType { get;  }

        Point Centroid { get; }
    }
}
