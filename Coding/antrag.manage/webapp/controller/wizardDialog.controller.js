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
            // const oRouter = this.getOwnerComponent().getRouter();
            // oRouter.getRoute("WizardDialog").attachPatternMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function() {
            // this._createRequest();
        },

        onButtonPress: async function() {
            await this._createRequest();
            const sNewRequestID = this.getView().getBindingContext().getProperty("RequestID");
            const sNewRequestBetreff = this.getView().getBindingContext().getProperty("Betreff");
            const sNewRequestBeschreibung = this.getView().getBindingContext().getProperty("RequestDescription");

            MessageBox.show(sNewRequestID);
            MessageBox.show(sNewRequestBetreff);
            MessageBox.show(sNewRequestBeschreibung);
        },

        _createRequest: async function() {
            const oModel = this.getView().getModel();

            const oRequestListBinding = oModel.bindList("/Requests");
            const oRequestContext = oRequestListBinding.create({
                Betreff: "Test Betreff",
                RequestDescription: "Test Beschreibung",
                CategoryID: null,
                RequestStatus: 0
            });
            await oRequestContext.created();
            this.getView().setBindingContext(oRequestContext);
        }
    });
});
