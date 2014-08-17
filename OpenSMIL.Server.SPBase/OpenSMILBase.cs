using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint;

namespace OpenSMIL.Server.SPBase
{
    public class OpenSMILBase
    {
        public void UseWeb(Action<SPWeb> spWeb)
        {
            using (SPSite site = new SPSite(SPContext.Current.Web.Url))
            {
                using (SPWeb web = site.OpenWeb())
                {
                    spWeb(web);
                }
            }
        }
    }
}
