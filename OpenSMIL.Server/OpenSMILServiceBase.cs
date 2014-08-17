using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Web;
using System.Web.Script.Serialization;

using OpenSMIL.Server.SMILLayers;


namespace OpenSMIL.Server
{
    public abstract class OpenSMILServiceBase<T> : IHttpHandler
    {
        JavaScriptSerializer jsonSerialiazer = new JavaScriptSerializer();

        public  bool IsReusable { get {return false;} }

        string contentType = "application/json";
        public virtual string ContentType
        {
            get { return contentType; }
            set { contentType = value; }
        }

        public virtual void ProcessRequest(HttpContext context)
        {
            try
            {
                T t = GetResponseData(context);
                string response = jsonSerialiazer.Serialize(t);
                context.Response.ContentType = ContentType;
                context.Response.Write(response);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                var respObj = new {Error = ex.Message };
                var responseMessage = jsonSerialiazer.Serialize(respObj);
                context.Response.Write(responseMessage);
            }
        }

        public abstract T GetResponseData(HttpContext context);
    }
}
