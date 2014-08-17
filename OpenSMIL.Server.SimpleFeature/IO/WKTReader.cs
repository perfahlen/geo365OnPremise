using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Text.RegularExpressions;

using OpenSMIL.Server.SimpleFeature.GeomtryTypes;

namespace OpenSMIL.Server.SimpleFeature.IO
{
    public class SimpleWKTReader : IGeometryReader
    {
        public SimpleWKTReader()
        {
        }



        public virtual ISimpleGeometry Parse(string wkt)
        {
            var match = Regex.IsMatch(wkt, "^[POINT|LINESTRING|POLYGON]", RegexOptions.IgnoreCase);
            if (!match)
                return null;

            //Point
            if (Regex.IsMatch(wkt, "^POINT", RegexOptions.IgnoreCase))
            {
                var coordinate = Regex.Replace(wkt, "^POINT|[(|)]", "", RegexOptions.IgnoreCase);
                var point = ParsePoint(coordinate);
                return point;
            }
            //linestring
            else if (Regex.IsMatch(wkt, "^LINESTRING", RegexOptions.IgnoreCase))
            {
                var coordinates = Regex.Replace(wkt, "^LINESTRING|[(|)]", "", RegexOptions.IgnoreCase);
                LineString lineString = ParseLineString(coordinates);
                return lineString;
            }
            //polygon
            else
            {
                var coordinates = Regex.Replace(wkt, "^POLYGON|[(|)]", "", RegexOptions.IgnoreCase);
                Polygon polygon = ParsePolygon(coordinates);
                return polygon;
            }

            return null;
        }

        Polygon ParsePolygon(string wkt)
        {
            LineString lineString = ParseLineString(wkt);
            //if (lineString.Points.First() == lineString.Points.Last())
            //{
                return new Polygon(lineString);
            //}
            //return null;
        }

        LineString ParseLineString(string wkt)
        {
			string[] points = wkt.Split(new char[]{','});

            LineString lineString = new LineString();
            foreach (var item in points)
            {
                var point = ParsePoint(item);
				lineString.AddPoint(point);
            }

            return lineString;

        }

        Point ParsePoint(string point)
        {
            string[] pieces = point.Split(new char[] { ' ' });
            if (pieces.Length >= 2)
            {
				double lon = double.Parse(pieces[0]);
				double lat = double.Parse(pieces[1]);
                return new Point(lon, lat);
            }
            return null;
        }
    }
}
