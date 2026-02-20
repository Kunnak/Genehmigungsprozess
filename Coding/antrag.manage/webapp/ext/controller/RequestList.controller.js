//  _     _     _      ____            _             _ _
// | |   (_)___| |_   / ___|___  _ __ | |_ _ __ ___ | | | ___ _ __
// | |   | / __| __| | |   / _ \| '_ \| __| '__/ _ \| | |/ _ \ '__|
// | |___| \__ \ |_  | |__| (_) | | | | |_| | | (_) | | |  __/ |
// |_____|_|___/\__|  \____\___/|_| |_|\__|_|  \___/|_|_|\___|_|

sap.ui.define([
	'sap/ui/core/mvc/ControllerExtension',
], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('antragsmanagement.antrag.manage.ext.controller.RequestList', {
		
		override: {
			onInit: function () {
			}
		},

        // BOOKMARK
        openWizard: async function(oEvent) {
            const oExtensionAPI = this.base.getExtensionAPI();
            const oRouting = oExtensionAPI.getRouting();
            // const oModel = this.base.getView().getModel();

            // const oRequestListBinding = oModel.bindList("/Requests");
            // const oRequestContext = oRequestListBinding.create({
            //     Betreff: "Test",
            //     RequestDescription: "Test",
            //     CategoryID: null,
            //     RequestStatus: 0
            // });
            // await oRequestContext.created();

            // const sRequestID = oRequestContext.getProperty("RequestID");
            
            oRouting.navigateToRoute("WizardDialog", {
                // key: sRequestID
            });
        },
	});
});
