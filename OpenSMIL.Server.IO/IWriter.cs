using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint;

namespace OpenSMIL.Server.IO
{
    public interface IWriter
    {
        string Write(Guid listGuid);
    }
}
