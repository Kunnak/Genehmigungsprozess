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
        },

        onButtonPress: async function() {
            // const oExtensionAPI = this.base.getExtensionAPI();

            const oModel = this.getView().getModel();

            const oRequestListBinding = oModel.bindList("/Requests");
            const oRequestContext = oRequestListBinding.create({
                Betreff: "Test Betreff",
                RequestDescription: "Test Beschreibung",
                CategoryID: null,
                RequestStatus: 0
            });
            await oRequestContext.created();

            const sNewRequestID = oRequestContext.getProperty("RequestID");
            const sNewRequestBetreff = oRequestContext.getProperty("Betreff");
            const sNewRequestBeschreibung = oRequestContext.getProperty("RequestDescription");
            const sNewRequestStatus = oRequestContext.getProperty("StatusText");

            MessageBox.show(sNewRequestID);
            MessageBox.show(sNewRequestBetreff);
            MessageBox.show(sNewRequestBeschreibung);
            MessageBox.show(sNewRequestStatus);
        }
    });
});
