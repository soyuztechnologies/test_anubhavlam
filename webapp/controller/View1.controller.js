sap.ui.define([
    'lam/fin/ar/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(BaseController, Filter,FilterOperator) {
    'use strict';
    return BaseController.extend("lam.fin.ar.controller.View1",{
        onInit: function(){
            this.oRoter = this.getOwnerComponent().getRouter();
        },
        goTo: function(sIndex){
            //var oAppCon = this.getView().getParent();
            //oAppCon.to("idView2");
            this.oRoter.navTo("detail",{
                fruitId: sIndex
            });
        },
        onAdd: function(){
            this.oRoter.navTo("add");
        },
        onOrder: function(){
            this.oRoter.navTo("order");
        },
        onSearch: function(oEvent){
            //Step 1: get the value typed by user
            var sVal = oEvent.getParameter("query");
            //Step 2: create a filter object
            var oFilter1 = new Filter("Category", FilterOperator.Contains, sVal);
            //var oFilter2 = new Filter("type", FilterOperator.Contains, sVal);
            // var oFilter = new Filter({
            //     filters: [oFilter2,oFilter1],
            //     and: false
            // });
            //Step 3: get list object
            var oList = this.getView().byId("myList");
            //step 4: inject our filter inside the list
            oList.getBinding("items").filter(oFilter1);
        },
        onSelect: function(oEvent){
            //Step 1: get the view2 object from mother
            //var oV2 = this.getView().getParent().getParent().getDetailPages()[0];
            //Step 2: get the path of selected item
            var sPath = oEvent.getParameter("listItem").getBindingContextPath();
            //step 3: bind the view2 with the path - element binding
            //oV2.bindElement(sPath); 
            // ===/fruits/index extract the index
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            this.goTo(sIndex);
        },
        onDelete: function(oEvent){
            //Step 1: which item user click on delete for
            var itemToBeDel = oEvent.getParameter("listItem");
            //Step 2: get object of the list itself
            var oList = oEvent.getSource();
            //Step 3: Remove item
            oList.removeItem(itemToBeDel);
        }
    });
});