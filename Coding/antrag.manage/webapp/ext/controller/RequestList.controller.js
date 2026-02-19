//  _     _     _      ____            _             _ _           
// | |   (_)___| |_   / ___|___  _ __ | |_ _ __ ___ | | | ___ _ __ 
// | |   | / __| __| | |   / _ \| '_ \| __| '__/ _ \| | |/ _ \ '__|
// | |___| \__ \ |_  | |__| (_) | | | | |_| | | (_) | | |  __/ |   
// |_____|_|___/\__|  \____\___/|_| |_|\__|_|  \___/|_|_|\___|_|    
// 

sap.ui.define([
	'sap/ui/core/mvc/ControllerExtension',
	'sap/m/MessageBox',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel'
], function (ControllerExtension, MessageBox, Fragment, JSONModel) {
	'use strict';

	return ControllerExtension.extend('antragsmanagement.antrag.manage.ext.controller.RequestList', {
		
		override: {
			onInit: function () {
				this.oWizardDialog = null;
				this.oWizard = null;
				this.oWizardButtonModel = null;
				this.oSelectedStep = null;
				this.iSelectedStepIndex = 0;
                
			}
		},

        // BOOKMARK
        openWizard: async function(oEvent) {
            const oExtensionAPI = this.base.getExtensionAPI();
            const oRouting = oExtensionAPI.getRouting();
            const oModel = this.base.getView().getModel();

            const oRequestListBinding = oModel.bindList("/Requests");
            const oRequestContext = oRequestListBinding.create({
                Betreff: "Test",
                RequestDescription: "Test",
                CategoryID: null,
                RequestStatus: 0
            });
            await oRequestContext.created();

            const sRequestID = oRequestContext.getProperty("RequestID"); // const hinzugefügt!
            
            oRouting.navigateToRoute("WizardDialog", {
                key: sRequestID
            });


            
			//          this.oWizardDialog ??= await oExtensionAPI.loadFragment({
			//              id: this.getView().getId(),
			//              name: "antragsmanagement.antrag.manage.view.fragments.createWizard",
			//              controller: this,
			//              initialBindingContext: oRequestContext 
			//          });
			//
			//          this.oWizardDialog.getBindingContext(oRequestContext);
			//
			// this.oWizardButtonModel = new JSONModel({
			// 	backButtonVisible: true,
			// 	nextButtonVisible: true,
			// 	nextButtonEnabled: true,
			// 	reviewButtonVisible: false,
			// 	finishButtonVisible: false,
			// 	selectedOffer: null
			// });
			//
			// this.oWizardDialog.setModel(this.oWizardButtonModel, "wizardButtons");
			//
			// this.oWizard = this._getControl("createRequest");
			// this.oSelectedStep = this.oWizard.getSteps()[0];
			// this.iSelectedStepIndex = 0;
			//
			//          this.oWizardDialog.open();
			
        },

        // BOOKMARK
		onAddOffer: async function() {
            const oExtensionAPI = this.base.getExtensionAPI();
			const oContext = this.oWizardDialog.getBindingContext();
			const oModel = oContext.getModel();

			const oOfferListBinding = oModel.bindList("_Offer", oContext);
			const oOfferContext = oOfferListBinding.create({});
			await oOfferContext.created();

            this.oTableFragment ??=  await oExtensionAPI.loadFragment({
                name: "antragsmanagement.antrag.manage.view.fragments.wizardTables",
                controller: this,
                initialBindingContext: oOfferContext 
            }).then(function(oFragment) {
                this.getView().byId("idPositionTable").addItem(oFragment);
            }.bind(this));

            this.getView().byId("offerTable").refresh();
		},

        onAddPosition: async function() {
			const oPositionBinding = oModel.bindList("_Position", oOfferContext);
			const oPositionContext = oPositionBinding.create({});
			await oPositionContext.created();

            // MessageBox.error("°՞(ᗒᗣᗕ)՞°");
        },

		_getControl: function(sId) {   
			return Fragment.byId(this.base.getView().getId(), sId);
		},


		onDialogNextButton: function() {
			if (!this.oWizard) {
				this.oWizard = this._getControl("createRequest");
			}

			this.iSelectedStepIndex = this.oWizard.getSteps().indexOf(this.oSelectedStep);
			var oNextStep = this.oWizard.getSteps()[this.iSelectedStepIndex + 1];

			if (this.oSelectedStep && !this.oSelectedStep.bLast) {
				this.oWizard.goToStep(oNextStep, true);
			} else {
				this.oWizard.nextStep();
			}

			this.iSelectedStepIndex++;
			this.oSelectedStep = oNextStep;
		},
        

		onDialogBackButton: function() {
			if (!this.oWizard) {
				this.oWizard = this._getControl("createRequest");
			}

			if (!this.oWizard) return;

			this.iSelectedStepIndex = this.oWizard.getSteps().indexOf(this.oSelectedStep);
			var oPreviousStep = this.oWizard.getSteps()[this.iSelectedStepIndex - 1];

			if (this.oSelectedStep) {
				this.oWizard.goToStep(oPreviousStep, true);
			} else {
				this.oWizard.previousStep();
			}

			this.iSelectedStepIndex--;
			this.oSelectedStep = oPreviousStep;

			this._handleButtonsVisibility();
		},

		handleWizardCancel: function() {
			var that = this;
			MessageBox.warning("Möchten Sie den Wizard wirklich abbrechen? Alle Eingaben gehen verloren.", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function(oAction) {
					if (oAction === MessageBox.Action.YES) {
						const oContext = that.oWizardDialog.getBindingContext();
						const oModel = oContext.getModel();

						oModel.resetChanges();
						oContext.delete();

						if (that.oWizard) {
							that.oWizard.discardProgress(that.oWizard.getSteps()[0]);
						}
						if (that.oWizardDialog) {
							that.oWizardDialog.close();
						}
						that._resetValueStates();
						that.oWizardButtonModel.setProperty("/selectedOffer", null);
						that.iSelectedStepIndex = 0;
						that.oSelectedStep = that.oWizard ? that.oWizard.getSteps()[0] : null;
					}
				}
			});
		},
	});
});
