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
				this.oWizardModel = null;
				this.oSelectedStep = null;
				this.iSelectedStepIndex = 0;
			}
		},

		openWizard: function() {
			var that = this;
			
			if (!this.oWizardDialog) {
				Fragment.load({
					id: this.base.getView().getId(),
					name: "antragsmanagement.antrag.manage.view.fragments.createWizard",
					controller: this
				}).then(function(oDialog) {
					that.oWizardDialog = oDialog;
					that.base.getView().addDependent(that.oWizardDialog);
					
					// Create wizard model
					that.oWizardModel = new JSONModel({
						newRequest: {},
						nextButtonVisible: true,
						nextButtonEnabled: true,
						backButtonVisible: false,
						reviewButtonVisible: false,
						finishButtonVisible: false
					});
					that.oWizardDialog.setModel(that.oWizardModel, "wizard");
					
					// Initialize wizard after dialog is opened
					that.oWizardDialog.attachAfterOpen(function() {
						that.oWizard = that._getControl("createRequest");
						that.iSelectedStepIndex = 0;
						that.oSelectedStep = that.oWizard ? that.oWizard.getSteps()[0] : null;
						that._handleButtonsVisibility();
					});
					
					that.oWizardDialog.open();
				});
			} else {
				if (this.oWizardModel) {
					this.oWizardModel.setProperty("/newRequest", {});
				}
				this.iSelectedStepIndex = 0;
				
				if (!this.oWizard) {
					this.oWizard = this._getControl("createRequest");
				}
				
				if (this.oWizard) {
					this.oWizard.discardProgress(this.oWizard.getSteps()[0]);
					this.oSelectedStep = this.oWizard.getSteps()[0];
				}
				
				this._handleButtonsVisibility();
				this.oWizardDialog.open();
			}
		},

		_getControl: function(sId) {
			return Fragment.byId(this.base.getView().getId(), sId);
		},

		_handleButtonsVisibility: function() {
			if (!this.oWizardModel) return;
			
			switch (this.iSelectedStepIndex) {
				case 0:
					this.oWizardModel.setProperty("/nextButtonVisible", true);
					this.oWizardModel.setProperty("/nextButtonEnabled", true);
					this.oWizardModel.setProperty("/backButtonVisible", false);
					this.oWizardModel.setProperty("/reviewButtonVisible", false);
					this.oWizardModel.setProperty("/finishButtonVisible", false);
					break;
				case 1:
					this.oWizardModel.setProperty("/backButtonVisible", true);
					this.oWizardModel.setProperty("/nextButtonVisible", true);
					this.oWizardModel.setProperty("/nextButtonEnabled", true);
					this.oWizardModel.setProperty("/reviewButtonVisible", false);
					this.oWizardModel.setProperty("/finishButtonVisible", false);
					break;
				case 2:
					this.oWizardModel.setProperty("/backButtonVisible", true);
					this.oWizardModel.setProperty("/nextButtonVisible", true);
					this.oWizardModel.setProperty("/nextButtonEnabled", true);
					this.oWizardModel.setProperty("/reviewButtonVisible", false);
					this.oWizardModel.setProperty("/finishButtonVisible", false);
					break;
				case 3:
					this.oWizardModel.setProperty("/nextButtonVisible", false);
					this.oWizardModel.setProperty("/backButtonVisible", true);
					this.oWizardModel.setProperty("/reviewButtonVisible", true);
					this.oWizardModel.setProperty("/finishButtonVisible", false);
					break;
				case 4:
					this.oWizardModel.setProperty("/nextButtonVisible", false);
					this.oWizardModel.setProperty("/finishButtonVisible", true);
					this.oWizardModel.setProperty("/backButtonVisible", false);
					this.oWizardModel.setProperty("/reviewButtonVisible", false);
					break;
				default: break;
			}
		},

		handleNavigationChange: function(oEvent) {
			this.oSelectedStep = oEvent.getParameter("step");
			if (this.oWizard) {
				this.iSelectedStepIndex = this.oWizard.getSteps().indexOf(this.oSelectedStep);
				this._handleButtonsVisibility();
			}
		},

		onDialogNextButton: function() {
			if (!this.oWizard) {
				this.oWizard = this._getControl("createRequest");
			}
			
			if (!this.oWizard) return;
			
			// Validate current step before proceeding
			if (!this._validateCurrentStep()) {
				return; // Stop navigation if validation fails
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

			this._handleButtonsVisibility();
		},

		_validateCurrentStep: function() {
			var oNewRequest = this.oWizardModel.getProperty("/newRequest");
			
			// Step 0: Allgemeine Informationen
			if (this.iSelectedStepIndex === 0) {
				if (!oNewRequest.title || oNewRequest.title.trim() === "") {
					MessageBox.error("Bitte geben Sie einen Titel ein.");
					return false;
				}
				if (!oNewRequest.description || oNewRequest.description.trim() === "") {
					MessageBox.error("Bitte geben Sie eine Beschreibung ein.");
					return false;
				}
				if (!oNewRequest.category_id) {
					MessageBox.error("Bitte wählen Sie eine Kategorie aus.");
					return false;
				}
			}
			
			return true;
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
						if (that.oWizard) {
							that.oWizard.discardProgress(that.oWizard.getSteps()[0]);
						}
						if (that.oWizardDialog) {
							that.oWizardDialog.close();
						}
						if (that.oWizardModel) {
							that.oWizardModel.setProperty("/newRequest", {});
						}
						that.iSelectedStepIndex = 0;
						that.oSelectedStep = that.oWizard ? that.oWizard.getSteps()[0] : null;
					}
				}
			});
		},

		handleWizardSubmit: function() {
			var oNewRequest = this.oWizardModel.getProperty("/newRequest");
			var that = this;
			
			// Final validation before submit
			if (!this._validateCurrentStep()) {
				return;
			}

			var oODataModel = this.base.getView().getModel();
			var oBinding = oODataModel.bindList("/Requests");

			oBinding.create(oNewRequest).created().then(function() {
				MessageBox.success("Antrag wurde erfolgreich erstellt!", {
					onClose: function() {
						if (that.oWizard) {
							that.oWizard.discardProgress(that.oWizard.getSteps()[0]);
						}
						if (that.oWizardDialog) {
							that.oWizardDialog.close();
						}
						if (that.oWizardModel) {
							that.oWizardModel.setProperty("/newRequest", {});
						}
						that.iSelectedStepIndex = 0;
						that.oSelectedStep = that.oWizard ? that.oWizard.getSteps()[0] : null;
					}
				});
			}).catch(function(oError) {
				MessageBox.error("Fehler beim Erstellen des Antrags: " + oError.message);
			});
		},

		_handleNavigationToStep: function(iStepNumber) {
			if (this.oWizardDialog && this.oWizard) {
				this.oWizardDialog.open();
				this.oWizard.goToStep(this.oWizard.getSteps()[iStepNumber], true);
			}
		},

		editStepOne: function() {
			this._handleNavigationToStep(0);
		},

		editStepTwo: function() {
			this._handleNavigationToStep(1);
		},

		editStepThree: function() {
			this._handleNavigationToStep(2);
		}
	});
});
