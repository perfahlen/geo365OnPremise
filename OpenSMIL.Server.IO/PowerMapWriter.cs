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
    public class PowerMapWriter : OpenSMILBase, IWriter
    {
        public string Write(Guid listGuid)
        {
            string csv = string.Empty;
            UseWeb(spWeb => {
                SPList list = spWeb.Lists.GetList(listGuid, true);

                SPView view = list.DefaultView;

                SPViewFieldCollection fields = view.ViewFields;

                
                SPField geomField =  list.GetGeoField();
                
                //create header
                for (int i = 0; i < view.ViewFields.Count; i++)
                {
                    string field = view.ViewFields[i];
                    if (geomField.InternalName != field)
                    {
                        csv += view.ViewFields[i];
                    }
                    else
                        csv += "Longitude, Latitude";
                    
                    if ((i + 1) < view.ViewFields.Count)
                        csv += ",";
                    else
                        csv += "\r\n";
                }

                //create CSV rows
                foreach (SPListItem listItem in list.Items)
                {
                    for (int i = 0; i < view.ViewFields.Count; i++)
                    {
                        string field = view.ViewFields[i];
                        if (geomField.InternalName != field)
                        {
                            csv += listItem[view.ViewFields[i]].ToString();
                        }
                        else
                        {
                            OpenSMIL.Server.SimpleFeature.GeomtryTypes.Point point = GetPoint(listItem[field] as string);
                            csv += point.Lon + ",";
                            csv += point.Lat;
                        }
                        
                        if ((i + 1) < view.ViewFields.Count)
                            csv += ",";
                        else csv += "\r\n";
                    }
                }
            });
            return csv;
        }

        private SimpleFeature.GeomtryTypes.Point GetPoint(string wkt)
        {
            OpenSMIL.Server.SimpleFeature.IO.SimpleWKTReader wktReader = new SimpleWKTReader();
            ISimpleGeometry geometry = wktReader.Parse(wkt);
            return geometry.Centroid;

        }
    }
}
