using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenSMIL.Server.SimpleFeature.GeomtryTypes
{
    public abstract class MultiPointGeometry : ISimpleGeometry
    {
        List<Point> points = new List<Point>();

        
        public virtual List<Point> Points
        {
            get
            {
                return points;
            }
        }

        public virtual Point Centroid
        {
            get 
            {
                if (this.points.Count() > 0)
                {
                    return this.points.First();
                }
                return null;
            
            }
        }

        public abstract GeometryTypes GeometryType { get; }
    }
}
