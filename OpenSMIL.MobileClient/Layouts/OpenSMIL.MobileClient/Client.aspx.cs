using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using System.Configuration;

namespace OpenSMIL.MobileClient.Layouts.OpenSMIL.MobileClient
{
    public partial class Client : LayoutsPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        public string BingKey { 
            get 
            {
                return System.Configuration.ConfigurationManager.AppSettings["BingKey"] as string;
            }
        }
    }
}
