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

        //public static bool operator ==(Point p1, Point p2)
        //{
        //    if (p1 == null)
        //        return false;
        //    if (p2 == null)
        //        return false;

        //    return (p1.Lon == p2.Lon && p1.Lat == p2.Lat);
        //}

        //public static bool operator !=(Point p1, Point p2)
        //{
        //    if (p1 == null)
        //        return false;
        //    if (p2 == null)
        //        return false;

        //    if (p1.Lon != p2.Lon)
        //        return true;

        //    if (p1.Lat != p2.Lat)
        //        return true;

        //    return false;
        //}

    }
}
