using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint;


namespace OpenSMIL.Server.Extensions
{
    public static class SPExtensions
    {
        /// <summary>
        /// Return if the list has a OpenSMILGeometry field
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        public static bool HasListOpenSMILGeometry(this SPList list)
        {
            foreach (SPField field in list.Fields)
            {
                if (field.TypeAsString == "OpenSMILGeometry")
                    return true;
            }
            return false;
        }

        /// <summary>
        /// Rerurns the geofield
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        public static SPField GetGeoField(this SPList list)
        {
            SPField geoField = null;
            foreach (SPField field in list.Fields)
            {
                if (field.TypeAsString == "OpenSMILGeometry")
                {
                    geoField = field;
                    break;
                }
            }
            return geoField;
        }
    }
}
