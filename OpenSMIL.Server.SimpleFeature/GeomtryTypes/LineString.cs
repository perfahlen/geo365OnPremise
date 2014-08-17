using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace OpenSMIL.Server.SimpleFeature.GeomtryTypes
{
    public class LineString : MultiPointGeometry
    {
       
        public LineString()
        {
             
        }

        /// <summary>
        /// Adds a point to the end of linestring point collection
        /// </summary>
        /// <param name="point"></param>
        public virtual void AddPoint(Point point)
        {
            Points.Add(point);
        }


        public override GeometryTypes GeometryType
        {
            get { return GeometryTypes.LineString; }
        }
    }
}
