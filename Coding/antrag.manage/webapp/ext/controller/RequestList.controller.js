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

        _createRequest: async function() {
            const oModel = this.getView().getModel();

            const oRequestListBinding = oModel.bindList("/Requests");
            const oRequestContext = oRequestListBinding.create({
                Betreff: `${Date.now()}`,
                RequestDescription: "Test Beschreibung",
                CategoryID: null,
                RequestStatus: 0
            });
            await oRequestContext.created();
            this.getView().setBindingContext(oRequestContext);
        },

        // BOOKMARK
        openWizard: async function() {
            await this._createRequest();
            const sNewRequestID = this.getView().getBindingContext().getProperty("RequestID");
            const oExtensionAPI = this.base.getExtensionAPI();
            const oRouting = oExtensionAPI.getRouting();
            oRouting.navigate(this.getView().getBindingContext());
        },
	});
});
