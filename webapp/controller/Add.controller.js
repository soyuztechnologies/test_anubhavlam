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
    return BaseController.extend("lam.fin.ar.controller.Add",{
        onInit: function(){
            var oModel = new JSONModel();
            oModel.setData({
                prodData: {
                                "ProductId": "",
                                "TypeCode": "PR",
                                "Category": "Notebooks",
                                "Name": "",
                                "Description": "",
                                "SupplierId": "100000051",
                                "SupplierName": "TECUM",
                                "TaxTarifCode": 1,
                                "MeasureUnit": "EA",
                                "Price": "0.0000",
                                "CurrencyCode": "USD",
                                "DimUnit": "CM"
                        }
            });
            this.getView().setModel(oModel,'prod');
            this.oLocalModel = oModel;
            this.changeMode("Create");
        },

        onMostExpensive: function(){
            //Step 1: Which category selected by user in dropdown
            var sCat = this.oLocalModel.getProperty("/prodData/Category");
            //Step 2: Get Odata model object
            var oDataModel = this.getView().getModel();
            //Step 3: Call Function API
            var that = this;
            oDataModel.callFunction("/GetMostExpensiveProduct",{
                urlParameters:{
                    "I_CATEGORY": sCat
                },
                success: function(data){
                    //Step 4: Set the response to local model
                    that.oLocalModel.setProperty("/prodData",data);
                    //Step 5: Change mode to update mode
                    that.changeMode("Update");
                }
            });
        },
        onDelete: function(){
            //Step 1: Get the odata model object
            var oDataModel = this.getView().getModel();
            //Step 2: delete
            var that = this;
            oDataModel.remove("/ProductSet('" + this.prodId + "')",{
                success: function(){
                    //Step 3: confirm user that its deleted and clear scren
                    MessageBox.confirm("The delete was successful");
                    that.onClear();
                }
            });
        },
        mode: "Create",
        changeMode: function(sMode){
            if(sMode === "Create"){
                this.getView().byId("idSave").setText("Save");
                this.getView().byId("name").setEnabled(true);
                this.getView().byId("idDelete").setEnabled(false);
                this.mode = "Create";
            }else{
                this.getView().byId("idSave").setText("Update");
                this.getView().byId("name").setEnabled(false);
                this.getView().byId("idDelete").setEnabled(true);
                this.mode = "Update";
            }
        },
        onClear: function(){
            this.changeMode("Create");
            this.oLocalModel.setProperty("/prodData",{
                    "ProductId": "",
                    "TypeCode": "PR",
                    "Category": "Notebooks",
                    "Name": "",
                    "Description": "",
                    "SupplierId": "100000051",
                    "SupplierName": "TECUM",
                    "TaxTarifCode": 1,
                    "MeasureUnit": "EA",
                    "Price": "0.0000",
                    "CurrencyCode": "USD",
                    "DimUnit": "CM"
            });
        },
        prodId : "",
        onLoadProd: function(){
            //Step 1: Read the product ID from the UI <==> Model
            var prodId = this.oLocalModel.getProperty("/prodData/ProductId");
            this.prodId = prodId;
            //Step 2: Get The Odata Model 
            var oDataModel = this.getView().getModel();
            //Step 3: Call the GET request Single product /ProductSet('ID')
            var that = this;
            oDataModel.read("/ProductSet('" + prodId + "')", {
                success: function(data){
                    //Step 4: Get the response, if product found - set local model with found data
                    that.oLocalModel.setProperty("/prodData", data);
                    that.changeMode("Update");
                    that.getView().byId("idImg").setSrc(
                        "/sap/opu/odata/sap/ZLAM_AB_ODATA_SRV/ProductImgSet('" + prodId +"')/$value"
                    );
                },
                error: function(oErr){
                    //Step 5: Clear screen if not found
                    that.changeMode("Create");
                    MessageBox.error("The product was not found");
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
        onSave: function(){
            //Step 1: Get The OData Model object - default
            var oDataModel = this.getView().getModel();
            //Step 2: Prepare payload and pre-check
            var oModel = this.getView().getModel('prod');
            var payload = oModel.getProperty("/prodData");
            if(!payload.ProductId){
                MessageBox.error("Please enter valid product id");
                return "";
            }
            if(this.mode === "Create"){
                //Step 3: Fire POST request to SAP
                oDataModel.create("/ProductSet", payload ,{
                    //Step 4: We get the response back
                    success: function(){
                        MessageToast.show("The Product has been created in SAP Now");
                    },
                    error: function(oErr){
                        MessageBox.error("Something gone wrong, please try again!");
                    }
                });
            }else{
                //Step 3: Fire POST request to SAP
                oDataModel.update("/ProductSet('" + this.prodId + "')", payload ,{
                    //Step 4: We get the response back
                    success: function(){
                        MessageToast.show("The Product has been updated in SAP Now");
                    },
                    error: function(oErr){
                        MessageBox.error("Something gone wrong, please try again!");
                    }
                });
            }
            
            

        }
    });
});