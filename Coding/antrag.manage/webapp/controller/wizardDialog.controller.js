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
                path: `/Requests(RequestID=${sKey},IsActiveEntity=false)`,
                events: {
                    dataReceived: this._onDataReceived.bind(this)
                }
            });
        },

        _onDataReceived: async function() {
            const oRequestContext = this.getView().getBindingContext();
            const oModel = this.getView().getModel();
            if (!oRequestContext) return;
            await this._createOfferContext(oModel, oRequestContext);
            await this._createPositionContext(oModel);
        },

        _createOfferContext: async function(oModel, oRequestContext) {
            const oOfferListBinding = oModel.bindList("_Offer", oRequestContext);
            this.oOfferContext = oOfferListBinding.create({});
            await this.oOfferContext.created();
        },

        _createPositionContext: async function(oModel) {
            const oPositionListBinding = oModel.bindList("_Position", this.oOfferContext);
            this.oPositionContext = oPositionListBinding.create({});
            await this.oPositionContext.created();
        }
    });
});
