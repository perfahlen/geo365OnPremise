using System;
using System.ComponentModel;
using System.Web.UI.WebControls.WebParts;



namespace OpenSMIL.Client.OpenSMIL
{
    [ToolboxItemAttribute(false)]
    public partial class OpenSMIL : WebPart
    {
        // Uncomment the following SecurityPermission attribute only when doing Performance Profiling on a farm solution
        // using the Instrumentation method, and then remove the SecurityPermission attribute when the code is ready
        // for production. Because the SecurityPermission attribute bypasses the security check for callers of
        // your constructor, it's not recommended for production purposes.
        // [System.Security.Permissions.SecurityPermission(System.Security.Permissions.SecurityAction.Assert, UnmanagedCode = true)]
        string mapId = string.Empty;
        public OpenSMIL()
        {
            mapId = Guid.NewGuid().ToString() + "_map";
        }

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            InitializeControl();
        }


        public string MapId { get { return mapId; } }

         
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        public string BingKey { get { return System.Configuration.ConfigurationManager.AppSettings["BingKey"] ?? "";} }
    }
}
