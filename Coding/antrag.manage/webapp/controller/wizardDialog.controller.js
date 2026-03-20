// __        ___                  _    ____            _             _ _
// \ \      / (_)______ _ _ __ __| |  / ___|___  _ __ | |_ _ __ ___ | | | ___ _ __
//  \ \ /\ / /| |_  / _` | '__/ _` | | |   / _ \| '_ \| __| '__/ _ \| | |/ _ \ '__|
//   \ V  V / | |/ / (_| | | | (_| | | |__| (_) | | | | |_| | | (_) | | |  __/ |
//    \_/\_/  |_/___\__,_|_|  \__,_|  \____\___/|_| |_|\__|_|  \___/|_|_|\___|_|

sap.ui.define([
    "sap/fe/core/PageController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
], function(PageController, JSONModel ,MessageBox ) {
    "use strict";

    return PageController.extend("antragsmanagement.antrag.manage.controller.wizardDialog", {

        onInit: function() {

            // ─── Router ───
            const oExtensionAPI = this.getExtensionAPI();
            const oRouting = oExtensionAPI.getRouting();

            // const oRouter = this.getOwnerComponent().getRouter();
            // oRouter.getRoute("WizardDialog").attachPatternMatched(this.onRouteMatched, this);

            // ─── Varaiblen ───
            this.oWizard = this.byId("createRequestWizard");
            this.oNavContainer = this.byId("wizardNavContainer");
            this.oWizardContentPage = this.byId("wizardContentPage");
            this.iCurrentStep = 1;

            const oStep1 = this.byId("requestInformation");
            const oStep2 = this.byId("offerInformation");
            const oStep3 = this.byId("reviewPage");

            // ─── ButtonModel ───
            this.oWizardButtons = new JSONModel({
                nextButtonVisible: true,
                nextButtonEnabled: true,
                backButtonVisible: false,
                reviewButtonVisible: false,
                finishButtonVisible: false
            });
            this.getView().setModel(this.oWizardButtons, "wizardButton");

            this._handleButtonsVisibility();

        },

        onBeforeNavigation: function(oEvent) {
            var sKey = oEvent.getParameter("arguments").key;
            this.getView().bindElement({
                path: `/Requests(RequestID=${sKey},IsActiveEntity=false)`,
                events: {
                    dataReceived: this._onDataReceived.bind(this)
                }
            });
        },

        override : {
            routing: {
                onBeforeNavigation: function(oEvent) {
                    var sKey = oEvent.getParameter("arguments").key;
                    this.getView().bindElement({
                        path: `/Requests(RequestID=${sKey},IsActiveEntity=false)`,
                        events: {
                            dataReceived: this._onDataReceived.bind(this)
                        }
                    });
                },
            },
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

        },

        onDialogNextButton: function() {

            if (this.iCurrentStep >= 4) {
                return;
            }

            this.iCurrentStep += 1;
            this.oWizard.nextStep();

            this._handleButtonsVisibility();

        },

        onDialogBackButton: function () {

            if (this.iCurrentStep == 1) {
                return;
            }

            this.iCurrentStep -= 1;
            this.oWizard.previousStep();
            this._handleButtonsVisibility();

        },

        handleWizardSubmit: function () {
            console.log("Submit Button pressed!");
            this.oNavContainer.to(this.byId("wizardReviewPage"));
        },

        handleWizardCancel: function() {
            console.log("Cancel Button pressed!");
        },

        _handleNavigationToStep: function (iStepNumber) {
            var fnAfterNavigate = function () {
                this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
            }.bind(this);

            this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
            this.backToWizardContent();
        },

        _handleButtonsVisibility: function() {

            if (!this.oWizardButtons) return;

            switch (this.iCurrentStep) {
                case 1:
                    this.oWizardButtons.setProperty("/nextButtonVisible", true);
                    this.oWizardButtons.setProperty("/backButtonVisible", false);
                    this.oWizardButtons.setProperty("/reviewButtonVisible", false);
                    this.oWizardButtons.setProperty("/finishButtonVisible", false);
                    break;

                case 2:
                    this.oWizardButtons.setProperty("/backButtonVisible", true);
                    this.oWizardButtons.setProperty("/nextButtonVisible", true);
                    this.oWizardButtons.setProperty("/reviewButtonVisible", false);
                    this.oWizardButtons.setProperty("/finishButtonVisible", false);
                    break;

                case 3:
                    this.oWizardButtons.setProperty("/backButtonVisible", true);
                    this.oWizardButtons.setProperty("/nextButtonVisible", true)
                    this.oWizardButtons.setProperty("/reviewButtonVisible", false);
                    this.oWizardButtons.setProperty("/finishButtonVisible", false);
                    break;

                case 4:
                    this.oWizardButtons.setProperty("/nextButtonVisible", false);
                    this.oWizardButtons.setProperty("/backButtonVisible", true);
                    this.oWizardButtons.setProperty("/reviewButtonVisible", true);
                    this.oWizardButtons.setProperty("/finishButtonVisible", true);
                    break;

                default: break;

            }
        },

        onCategorySelected: function(oEvent) {
            const oComboBox = oEvent.getSource();
            const oSelectedItem = oComboBox.getSelectedItem();

            if (oSelectedItem) {
                const sCategoryID = oSelectedItem.getKey();

                const oContext = this.getView().getBindingContext();
                var oCategoryID = oContext.getProperty("CategoryID");
                oCategoryID = sCategoryID;
                oContext.setProperty("CategoryID", sCategoryID);
            }
        },

        // Ich check wirklich nicht
        onSelectionChange: function(oEvent) {
            const oComboBox = this.byId("comboCategory");
            const oSelectedItem = oComboBox.getSelectedItem();

            if (oSelectedItem) {
                const sCategoryID = oSelectedItem.getKey();

                const oContext = this.getView().getBindingContext();
                var oCategoryID = oContext.getProperty("CategoryID");
                oContext.setProperty("CategoryID", sCategoryID);
            }

            const oContext = this.getView().getBindingContext();
            var oCategoryID = oContext.getProperty("CategoryID");
        },
    });
});
