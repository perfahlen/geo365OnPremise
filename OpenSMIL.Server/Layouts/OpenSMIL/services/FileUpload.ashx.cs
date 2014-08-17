using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using System.Web;

using System.Web.Script.Serialization;

using Microsoft.SharePoint;
using System.Collections;

namespace OpenSMIL.Server
{
    public partial class FileUpload : OpenSMILServiceBase<object>
    {

        public override object GetResponseData(HttpContext context)
        {
            try
            {
                string location = context.Request.Form["Location"];

                System.IO.BinaryReader br = new System.IO.BinaryReader(context.Request.InputStream);
                int bytesToRead = (int)context.Request.InputStream.Length;
                var content = br.ReadBytes(bytesToRead);

                var metaData = new Hashtable(){ {"Geo", location}};

                SPWeb web = new SPSite(SPContext.Current.Web.Url).OpenWeb();
                web.AllowUnsafeUpdates = true;
                var docLibrary = web.GetFolder("Shared Documents");
                var files = docLibrary.Files;
                var addedFile = files.Add("Shared Documents/file.png", content, metaData);
                
                return new { ID = addedFile.Item.ID, URL = addedFile.Url}; 
            }
            catch (Exception x)
            {
                throw;
            }
        }
    }
}
