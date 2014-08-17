using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using System.Web;

using System.Web.Hosting;
using System.Runtime.InteropServices;

using System.Web.Script.Serialization;
using System.Configuration;

using System.IO;

namespace OpenSMIL.Server
{
    public partial class KML : OpenSMILServiceBase<string>
    {
        public override string GetResponseData(HttpContext context)
        {
            base.ContentType = "application/vnd.google-earth.kml+xml";
                
            try
            {
                Guid listId = Guid.Parse(context.Request["listid"]);

                OpenSMIL.Server.IO.KMLWriter writer = new IO.KMLWriter();
                string kml = writer.Write(listId);
                
                return kml;
            }
            catch (Exception x)
            {
                return x.Message;
            }
        }


        public override void ProcessRequest(HttpContext context)
        {
            try
            {
                context.Response.ContentType = "application/vnd.google-earth.kml+xml";
                var data = GetResponseData(context);
                var content = GetBytes(data);
                context.Response.AddHeader("Content-Disposition", "attachment; filename=OpenSMIL.kml");
                context.Response.Clear();
                context.Response.AddHeader("Content-Length", content.Length.ToString());
                context.Response.OutputStream.Write(content, 0, content.Length);
                context.Response.End();

            }
            catch (Exception x)
            {

                throw x;
            }
        }

        public Stream GetStreamFromString(string s)
        {
            MemoryStream stream = new MemoryStream();
            StreamWriter writer = new StreamWriter(stream);
            writer.Write(s);
            writer.Flush();
            stream.Position = 0;
            return stream;
        }

        byte[] GetBytes(string str)
        {
            byte[] bytes = new byte[str.Length * sizeof(char)];
            System.Buffer.BlockCopy(str.ToCharArray(), 0, bytes, 0, bytes.Length);
            return bytes;
        }
    }
}
