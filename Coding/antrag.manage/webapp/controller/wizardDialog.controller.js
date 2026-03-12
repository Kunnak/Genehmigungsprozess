// __        ___                  _    ____            _             _ _
// \ \      / (_)______ _ _ __ __| |  / ___|___  _ __ | |_ _ __ ___ | | | ___ _ __
//  \ \ /\ / /| |_  / _` | '__/ _` | | |   / _ \| '_ \| __| '__/ _ \| | |/ _ \ '__|
//   \ V  V / | |/ / (_| | | | (_| | | |__| (_) | | | | |_| | | (_) | | |  __/ |
//    \_/\_/  |_/___\__,_|_|  \__,_|  \____\___/|_| |_|\__|_|  \___/|_|_|\___|_|

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
], function(Controller,MessageBox) {
    "use strict";

    return Controller.extend("antragsmanagement.antrag.manage.controller.wizardDialog", {

        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("WizardDialog").attachPatternMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function(oEvent) {
            var sKey = oEvent.getParameter("arguments").key;

            this.getView().bindElement({
                path: `/Requests(RequestID=${sKey},IsActiveEntity=false)`
            });

            this.oRequestContext = this.getView().getBindingContext();

            this._createOfferContext();
            this._createPositionContext();
        },

        onButtonPress: async function() {
            var oRequestContext = this.getView().getBindingContext();

            console.log("RequestID = ", oRequestContext.getProperty("RequestID"));
            console.log("Betreff = ", oRequestContext.getProperty("Betreff"));
        },

        _createOfferContext: async function() {
            var oOfferListBinding = this.oRequestContext.bindList("_Offer");
            this.oOfferContext = oOfferListBinding.create({
                //FELDER !!
            });
            await oOfferContext.created();
        },

        _createPositionContext: async function() {
            var oPositionListBinding = this.oOfferContext.bindList("_Position");
            this.oPositionContext = oPositionListBinding.create({
                // FELDER !!
            });

            await oPositionContext.created();
        },
    });
});
