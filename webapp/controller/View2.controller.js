sap.ui.define([
    'lam/fin/ar/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(BaseController, MessageBox, MessageToast, Fragment, Filter, FilterOperator) {
    'use strict';
    return BaseController.extend("lam.fin.ar.controller.View2",{
        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("detail").attachMatched(this.herculis, this);
        },
        herculis: function(oEvent){
            var sIndex = oEvent.getParameter("arguments").fruitId;
            console.log("My Element path will be ===>  /fruits/"+ sIndex);
            var sPath = "/" + sIndex;
            this.getView().bindElement(sPath,{
                    expand: 'To_Supplier'
            });
        },
        onLiveChange: function(oEvent){
            //Step 1: What was the value entered by the user
            var sVal = oEvent.getParameter("value");
            //Step 2: Get the root object of the event
            var oControl = oEvent.getSource();
            //Step 3: Create a filter based on what user enters
            var oFilter = new Filter("name", FilterOperator.Contains, sVal);
            //Step 4: Inject the filter to the binding of select dialog
            oControl.getBinding("items").filter(oFilter);
        },
        onPopupConfirm: function(oEvent){
            
            
            //Step 3: get the id of the fragment
            var sId = oEvent.getSource().getId();
            if(sId.indexOf("cities") !== -1){
                //Step 1: get the object of selected item
                var oSelectedItem = oEvent.getParameter("selectedItem");
                //Step 2: get the label
                var sVal = oSelectedItem.getLabel();
                this.myField.setValue(sVal);
            }else{
                //todo: for supplier
                //Step 1: get the object of selected item
                var aSelectedItems = oEvent.getParameter("selectedItems");
                var aFilters = [];
                //Loop at each slected item and prepare a filter array
                aSelectedItems.forEach(element => {
                    aFilters.push(new Filter("name",FilterOperator.EQ,element.getLabel()));
                });
                //check if there is something user really want to filter
                if(aFilters.length > 0){
                    var oTable = this.getView().byId("idTab");
                    var oFilter = new Filter({
                        filters: aFilters,
                        and: false
                    });
                    oTable.getBinding("items").filter(oFilter);
                }
            }
        },
        cityFragment: null,
        supplierPopup: null,
        myField: null,
        onF4Help: function(oEvent){
            //on whichever field user click f4, that object i take out
            this.myField = oEvent.getSource();
            //here in the function we can access the global variable this
            //this - works as object of current class which is my controller
            var that = this;
            if(!that.cityFragment){
                Fragment.load({
                    id: 'cities',
                    name: 'lam.fin.ar.fragments.popup',
                    controller: this
                }).then(function(oFragment){
                    //inside the callback function, we cannot access this
                    //we must create a local variable outside call back as a copy of this
                    that.cityFragment = oFragment;
                    that.cityFragment.setTitle("Cities");
                    that.cityFragment.setMultiSelect(false);
                    that.getView().addDependent(that.cityFragment);
                    that.cityFragment.bindAggregation("items",{
                        path: "/cities",
                        template: new sap.m.DisplayListItem({
                            label: "{name}",
                            value: "{famousFor}"
                        })
                    });
                    that.cityFragment.open();
                });
            }else{
                that.cityFragment.open();
            }
            

        },
        onSupplierItem: function(oEvent){
            //Step 1: which item was pressed by user
            var oSelectedItem = oEvent.getParameter("listItem");
            //Step 2: Get the path of the element
            var sPath = oSelectedItem.getBindingContextPath();
            //Step 3: Print path
            console.log(sPath);
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            this.oRouter.navTo("supplier",{
                supplierId: sIndex
            });
        },
        onFilter: function(){
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
                     that.supplierPopup.bindAggregation("items",{
                         path: "/suppliers",
                         template: new sap.m.DisplayListItem({
                             label: "{name}",
                             value: "{sinceWhen}"
                         })
                     });
                     that.supplierPopup.open();
                 });
             }else{
                 that.supplierPopup.open();
             }
        },
        goBack: function(){
            var oAppCon = this.getView().getParent();
            oAppCon.to("idView1");
        },
        onSave: function(){
            MessageBox.confirm("Would you like to Save",{
                onClose: function(status){
                    if(status === "OK"){
                        MessageToast.show("Your order has been saved");
                    }else{
                        MessageBox.error("Action was cancelled");
                    }
                }
            });
        },
        onCancel: function(){

        }
    });
});