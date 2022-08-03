sap.ui.define([
    'lam/fin/ar/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/core/routing/History"
], function(BaseController, MessageBox, MessageToast, Fragment, Filter, FilterOperator, History) {
    'use strict';
    return BaseController.extend("lam.fin.ar.controller.View3",{
        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("supplier").attachMatched(this.herculis, this);
        },
        onChartChange: function(oEvent){
            var chartType = oEvent.getParameter("selectedItem").getKey();
            var oFrame = this.getView().byId("myFrame");
            oFrame.setVizType(chartType);
        },
        herculis: function(oEvent){
            var sIndex = oEvent.getParameter("arguments").supplierId;
            console.log("My Element path will be ===>  /fruits/"+ sIndex);
            var sPath = "/suppliers/" + sIndex;
            this.getView().bindElement(sPath);
        },
        goBack: function(){
            var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("detail", {fruitId: 1}, true);
			}
        }
    });
});