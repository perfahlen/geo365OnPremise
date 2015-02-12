using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenSMIL.Server.SimpleFeature.GeomtryTypes
{
    public class Point : ISimpleGeometry
    {

        public Point() { }

        public Point(double lon, double lat)
        {
            Lat = lat;
            Lon = lon;
        }

        public GeometryTypes GeometryType
        {
            get
            {
                return GeometryTypes.Point;
            }
        }

        public Point Centroid
        {
            get { return this; }
        }
        

        public double Lon { get; set; }

        public double Lat { get; set; }

    }
}
