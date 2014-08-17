using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using OpenSMIL.Server.BingServices.net.virtualearth.dev;


namespace OpenSMIL.Server.BingServices
{
    public class Address
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="typed"></param>
        /// <param name="bingKey"></param>
        /// <returns>Integer 0, 1, 2 where 0 is perfect match, 1 is moderate, 2 is no match</returns>
        public static string ValidateAddress(string typed, string bingKey = null)
        {
            var service = new OpenSMIL.Server.BingServices.net.virtualearth.dev.GeocodeService(); 

            var request = new GeocodeRequest();
            request.Query = typed;
            request.Options = new GeocodeOptions() { Count = 10 };
            
            FilterBase[] filters = { new ConfidenceFilter() { MinimumConfidence = Confidence.Low } };

            request.Credentials = new Credentials()
            {
                Token = bingKey ?? System.Configuration.ConfigurationManager.AppSettings["BingKey"] ?? ""
            };

            var response = service.Geocode(request);

            // check if there are  any response
            if (response.Results != null)
            {
                // check from ambiguosy
                if (response.Results.Count() == 0)
                {
                    return Accuracy.BAD;
                }
                else if (response.Results.Count() == 1)
                {
                    // perfect match
                    if (response.Results[0].EntityType == "Address")
                        return Accuracy.GOOD;

                    return Accuracy.MODERATE;
                }

                //otherwise multiple results interpetrates as moderate accuracy
                return Accuracy.MODERATE;
            }
            return Accuracy.BAD;
        }
    }
}
