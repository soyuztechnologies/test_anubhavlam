sap.ui.define([
    'lam/fin/ar/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment'
], function(BaseController, Filter,FilterOperator, JSONModel, MessageBox, MessageToast, Fragment) {
    'use strict';
    return BaseController.extend("lam.fin.ar.controller.Order",{
        onInit: function(){
            var oModel = new JSONModel();
            oModel.setData({
                "orderData": {
                    "SoId": "",
                    "CreatedBy": "400000038",
                    "BuyerId": "100000002",
                    "BuyerName": "DelBont Industries",
                    "CurrencyCode": "USD",
                    "GrossAmount": "0.0",
                    "LifecycleStatus": "N",
                    "To_Items": [
                    ]
                }
            });
            this.oLocalModel = oModel;
            this.getView().setModel(this.oLocalModel, "ord");

        },
        addItem : function(){
            var item = {
                "SoId": "",
                "SoItemPos": "",
                "ProductId": "HT-1010",
                "Note": "",
                "CurrencyCode": "USD",
                "GrossAmount": "0.0",
                "Quantity": "1",
                "QuantityUnit": "EA"
            };
            var aItems = this.oLocalModel.getProperty("/orderData/To_Items");
            aItems.push(item);
            this.oLocalModel.setProperty("/orderData/To_Items", aItems);

        },
        onSave: function(){
            //Step 1: Get the data from local model - payload
            var payload = this.oLocalModel.getProperty("/orderData");
            //Step 2: Get The odata model object
            var oDataModel = this.getView().getModel();
            //Step 3: Trigger post request to odata service
            var that = this;
            oDataModel.create("/OrderSet", payload, {
                success: function(data){
                    //Step 4: Handle response and set back the order no on screen
                    MessageToast.show("The Order has been created successfully , check screen");
                    that.oLocalModel.setProperty("/orderData/SoId", data.SoId);
                    
                }
            });
            

        },
        supplierPopup: null,
        onF4Help: function(){
            //here in the function we can access the global variable this
            //this - works as object of current class which is my controller
            var that = this;
            if(!that.supplierPopup){
                Fragment.load({
                    id: 'supplier',
                    name: 'lam.fin.ar.fragments.popup',
                    controller: this
                }).then(function(oFragment){
                    //inside the callback function, we cannot access this
                    //we must create a local variable outside call back as a copy of this
                    that.supplierPopup = oFragment;
                    that.supplierPopup.setTitle("Suppliers");
                    that.getView().addDependent(that.supplierPopup);
                    that.supplierPopup.setMultiSelect(false);
                    that.supplierPopup.bindAggregation("items",{
                        path: "/SupplierSet",
                        template: new sap.m.DisplayListItem({
                            label: "{BpId}",
                            value: "{CompanyName}"
                        })
                    });
                    that.supplierPopup.open();
                });
            }else{
                that.supplierPopup.open();
            }
       },
       onPopupConfirm: function(oEvent){
        //Step 3: get the id of the fragment
            var sId = oEvent.getSource().getId();
            if(sId.indexOf("supplier") !== -1){
                //Step 1: get the object of selected item
                var oSelectedItem = oEvent.getParameter("selectedItem");
                //Step 2: get the label
                var sVal = oSelectedItem.getValue();
                this.oLocalModel.setProperty("/prodData/SupplierName",sVal);
                sVal = oSelectedItem.getLabel();
                this.oLocalModel.setProperty("/prodData/SupplierId", sVal);
            }
        },
    });
});