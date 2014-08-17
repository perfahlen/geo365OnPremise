using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenSMIL.Server.SimpleFeature.GeomtryTypes
{
    public class Polygon : MultiPointGeometry
    {
        public virtual void AddPoint(Point point)
        {
            Points.Add(point);
        }

        public bool IsValid
        {
            get { return (Points.First() == Points.Last()); }
        }

        public Polygon()
        {
        }

        public Polygon(LineString lineString)
        {
            Populate(lineString.Points);
        }


        public Polygon(IEnumerable<Point> points)
        {
            Populate(points);
        }

        void Populate(IEnumerable<Point> points)
        {
            foreach (var item in points)
            {
                this.AddPoint(item);
            }
        }

        public override GeometryTypes GeometryType
        {
            get { return GeometryTypes.Polygon; }
        }
    }
}
