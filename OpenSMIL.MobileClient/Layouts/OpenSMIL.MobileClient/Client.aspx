<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Client.aspx.cs" Inherits="OpenSMIL.MobileClient.Layouts.OpenSMIL.MobileClient.Client"%>


<html ng-app="OpenSMILeMobileApp">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><%= SPContext.Current.Web.Title %></title>


</head>
<body>
        <input type="hidden" id="siteUrl" value="<%=SPContext.Current.Web.Url %>" />
    <input type="hidden" id="bingKey" value="<%= this.BingKey %>" />
        <div class="row">
            <div ng-controller="LayersController" class="col-xs-12 col-sm-3" style="bottom: 0px; top: 0px;">
                <div style="margin-top: 20px;" class="panel panel-default">
                    <div class="panel-heading">Layers</div>
                    <div class="panel-body">
                        <ul class="nav nav-sidebar" ng-repeat="layer in layers">
                            <li><div>
                                <span><a href="#" id="layer-{{layer.Name}}" ng-click="toggleLayer(layer, $event);" class="list-group-item" style="float: left; width: 80%;">{{layer.Name}}</a></span>
                                <i ng-click="createPushpin(layer, $event);" class="fa fa-plus-circle fa-2x addItem iconColor"></i>
                                <i ng-click="createMetadata(layer, $event);" class="fa fa-arrow-circle-right fa-2x addItem" style="display: none;"></i>
                                <div>
                            </li>
                        </ul>
                        <button type="button" ng-show="createFeature" ng-click="doneCreateFeature();" class="btn btn-default btn-lg rightSync">
                            <span class="iconRed glyphicon glyphicon-remove-circle"></span>
                        </button>
                    </div>
                    
                    
                </div>

                <div id="infoWidget" class="info-window panel panel-default" style="overflow: hidden; display: none;">
                    <div class="panel-heading">{{Title}}
                            <span class="closeMenu" onclick="$('#infoWidget').hide(200);"><i class="fa fa-times-circle fa-2x faMenu iconColor"></i></span>
                    </div>

                    <div class="rightSync">
                        <button type="button" class="btn btn-default btn-lg" ng-click="update()">
                            <span>Sync to server</span>
                            <span class="glyphicon glyphicon-transfer marginLeft8px iconColor"></span>
                        </button>
                    </div>

                    <div class="gridStyle" ng-grid="gridOptions">
                    </div>
                </div>

             </div>
            <div class="col-xs-12 col-xs-offset-0 col-sm-9 col-sm-offset-3 visible-map" id="map">
            </div>
        </div>



    <script src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>
    <!--script src="http://ecn.dev.virtualearth.net/mapcontrol/v7.0/7.0.20121012100453.93/js/en-us/veapicore.js"></script-->
    <script src="assets/js/libs/html5shiv.min.js"></script>
    <script src="assets/js/libs/jquery-1-10-2-min.js"></script>
    <script src="assets/js/libs/jquery-ui-1.10.4.custom.min.js"></script>
    <script src="assets/js/libs/angular.min.js"></script>
    <script src="assets/js/libs/GPXParserModule.js"></script>
    <script src="assets/js/libs/WKTModule-min.js"></script>
    <script src="assets/js/libs/fastclick.js"></script>
    
    <script src="assets/js/libs/ui-bootstrap-tpls-0.11.0.min.js"></script>
    <script src="assets/js/libs/ng-grid-2.0.11.min.js"></script>
    <script src="assets/js/libs/ng-grid-layout.js"></script>

    <link href="assets/js/libs/bootstrap-3.1.1-dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="assets/fonts/font-awesome-4.0.3/css/font-awesome.min.css" rel="stylesheet" />
    <link href="assets/js/libs/ng-grid.min.css" rel="stylesheet" />

    <link href="assets/css/OpenSMIL-Mobile.css" rel="stylesheet" />
    
    <script src="assets/js/app/ExtendedBingMapsApi.js"></script>

    <script src="assets/js/app/Settings.js"></script>
    <script src="assets/js/app/app.js"></script>
    <script src="assets/js/app/OpenSMILMobile.js"></script>
    <script src="assets/js/app/LayersController.js"></script>
    <script src="assets/js/app/OpenSMILServices.js"></script>
    <script src="assets/js/app/Effects.js"></script>
    <!--script src="assets/js/app/AppFilters.js"></script>-->

    <script>
        $(function () {
            FastClick.attach(document.body);
        });
    </script>
</body>
</html>
