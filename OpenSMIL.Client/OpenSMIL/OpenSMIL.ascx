<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="OpenSMIL.ascx.cs" Inherits="OpenSMIL.Client.OpenSMIL.OpenSMIL" %>
<link href="../_layouts/15/OpenSMIL/fonts/font-awesome-4.0.3/css/font-awesome.min.css" rel="stylesheet" />

<script src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0" type="text/javascript"></script>
<script src="/_layouts/15/OpenSMIL/js/libs/jquery-1-10-2-min.js" type="text/javascript"></script>
<script src="/_layouts/15/OpenSMIL/js/WebPartMap.js"></script>

<script type="text/javascript">

    var OpenSMIL = OpenSMIL || {};
    OpenSMIL.mapId = <%= DateTime.Now.Ticks  %> + '_map';
    OpenSMIL.bingMaps = undefined;
    OpenSMIL.apiBingMaps = undefined;
    OpenSMIL.WKT = undefined;
    OpenSMIL.jquery = undefined;
    OpenSMIL.WebPartMap = undefined;
    OpenSMIL.bingKey = '<%= BingKey %>';

 
          
        jQuery(document).ready(function(){
            Microsoft.Maps.registerModule('WKTModule', '/_layouts/15/OpenSMIL/js/libs/WKTModule-min.js');
            Microsoft.Maps.loadModule('WKTModule');
            OpenSMIL.WKT = true;

            Microsoft.Maps.registerModule('GPXParserModule', '/_layouts/15/OpenSMIL/js/libs/GPXParserModule.js');
            Microsoft.Maps.loadModule('GPXParserModule');

        
            OpenSMILWebPart.initMap();

        });

    _spBodyOnLoadFunctionNames.push('OpenSMIL.init');
</script>
<div id="mapDropBox">
<div style="width: 100%; height: 100%; background-color: #0072c6;" id="OpenSMILWebPartMap"></div>
    </div>