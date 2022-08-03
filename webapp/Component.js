sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("lam.fin.ar.Component",{
        metadata: {
            manifest: "json"
        },
        init: function(){
            //inherit from a base class
            UIComponent.prototype.init.apply(this);
            //Step 1: get Router object from base class
            var oRouter = this.getRouter();
            //Step 2: call initialize function
            oRouter.initialize();

        },
        // createContent: function(){
        //     var oRootView = new sap.ui.view({
        //         viewName: "lam.fin.ar.view.App",
        //         id:"idRoot",
        //         type: "XML"
        //     });

        //     var oAppCon = oRootView.byId("idAppCon");

        //     var oV1 = new sap.ui.view({
        //         viewName: "lam.fin.ar.view.View1",
        //         id:"idView1",
        //         type: "XML"
        //     });

        //     var oV2 = new sap.ui.view({
        //         viewName: "lam.fin.ar.view.View2",
        //         id:"idView2",
        //         type: "XML"
        //     });

        //     //App Container - Mother
        //     //2 Childs = View1, view2 
        //     oAppCon.addMasterPage(oV1).addDetailPage(oV2);

        //     return oRootView;
        // },
        destroy: function(){

        }
    });
});