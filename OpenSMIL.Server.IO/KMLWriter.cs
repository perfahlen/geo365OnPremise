using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.SharePoint;
using OpenSMIL.Server.SPBase;
using SharpKml.Base;
using SharpKml.Dom;
using OpenSMIL.Server.Extensions;
using OpenSMIL.Server.SimpleFeature.GeomtryTypes;
using OpenSMIL.Server.SimpleFeature.IO;


namespace OpenSMIL.Server.IO
{
    public class KMLWriter : OpenSMILBase, IWriter
    {
        public string Write(Guid listGuid)
        {
            string kml = string.Empty;
            Serializer serializer = new Serializer();
            Kml _kml = new Kml();
            Folder folder = new Folder();
            UseWeb(spWeb =>
            {
                SPList list = spWeb.Lists.GetList(listGuid, true);
                SPField field = list.GetGeoField();
                if (field != null)
                {

                    foreach (SPListItem item in list.Items)
                    {
                        string wkt = item[field.Id] as string;
                        SimpleWKTReader wktReader = new SimpleWKTReader();
                        var simpleGeometry = wktReader.Parse(wkt);

                        if (simpleGeometry.GeometryType == GeometryTypes.Point)
                        {
                            var _point = (OpenSMIL.Server.SimpleFeature.GeomtryTypes.Point)simpleGeometry;
                            SharpKml.Dom.Point point = new SharpKml.Dom.Point();
                            point.Coordinate = new Vector(_point.Lat, _point.Lon);

                            Placemark placemark = CreatePlaceMark(item.Title, point);
                            folder.AddFeature(placemark);
                        }
                        else if (simpleGeometry.GeometryType == GeometryTypes.LineString)
                        {
                            var _lineString = (OpenSMIL.Server.SimpleFeature.GeomtryTypes.LineString)simpleGeometry;
                            SharpKml.Dom.LineString line = new SharpKml.Dom.LineString();
                            line.Coordinates = CreateCoordinateCollection(_lineString.Points);
                            Placemark placeMark = CreatePlaceMark(item.Title, line);
                            folder.AddFeature(placeMark);

                        }
                        else if (simpleGeometry.GeometryType == GeometryTypes.Polygon)
                        {
                            var _polygon = (OpenSMIL.Server.SimpleFeature.GeomtryTypes.Polygon)simpleGeometry;
                            OuterBoundary outerBoundary = new OuterBoundary();
                            outerBoundary.LinearRing = new LinearRing();
                            outerBoundary.LinearRing.Coordinates = CreateCoordinateCollection(_polygon.Points);

                            SharpKml.Dom.Polygon polygon = new SharpKml.Dom.Polygon();
                            polygon.OuterBoundary = outerBoundary;
                            polygon.Extrude = true;

                            Placemark placeMark = CreatePlaceMark(item.Title, polygon);
                            folder.AddFeature(placeMark);
                        }

                    }
                    _kml.Feature = folder;
                }
            });
            serializer.Serialize(_kml);
            return serializer.Xml;
        }


        CoordinateCollection CreateCoordinateCollection(List<OpenSMIL.Server.SimpleFeature.GeomtryTypes.Point> points)
        {
            CoordinateCollection coordinates = new CoordinateCollection();
            foreach (var item in points)
            {
                coordinates.Add(new Vector(item.Lat, item.Lon));
            }
            return coordinates;
        }

        Placemark CreatePlaceMark(string title, SharpKml.Dom.Geometry geometry)
        {
            Placemark placeMark = new Placemark();
            placeMark.Name = title;
            placeMark.Geometry = geometry;
            return placeMark;
        }
    }
}
