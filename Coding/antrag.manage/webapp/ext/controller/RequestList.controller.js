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

		openWizard: async function(oEvent) {
            const oExtensionAPI = this.base.getExtensionAPI();
			const oModel = this.base.getView().getModel();

			const oListBinding = oModel.bindList("/Requests");
			const oContext = oListBinding.create({
				topic: "",
				request_description: "",
				category_id: null,
				request_status: 0
			});
			await oContext.created();

            this.oWizardDialog = await oExtensionAPI.loadFragment({
                id: this.getView().getId(),
                name: "antragsmanagement.antrag.manage.view.fragments.createWizard",
                controller: this
            });

			this.oWizardDialog.setBindingContext(oContext);

			this.oWizardButtonModel = new JSONModel({
				backButtonVisible: true,
				nextButtonVisible: true,
				nextButtonEnabled: true,
				reviewButtonVisible: false,
				finishButtonVisible: false,
				selectedOffer: null
			});

			this.oWizardDialog.setModel(this.oWizardButtonModel, "wizard");

			this.oWizard = this._getControl("createRequest");
			this.oSelectedStep = this.oWizard.getSteps()[0];
			this.iSelectedStepIndex = 0;

            this.oWizardDialog.open();
			
        },

		_getControl: function(sId) {
			return Fragment.byId(this.base.getView().getId(), sId);
		},

		// _handleButtonsVisibility: function() {
		// 	if (!this.oWizardButtonModel) return;
		//
		// 	switch (this.iSelectedStepIndex) {
		// 		case 0:
		// 			this.oWizardButtonModel.setProperty("/nextButtonVisible", true);
		// 			this.oWizardButtonModel.setProperty("/nextButtonEnabled", true);
		// 			this.oWizardButtonModel.setProperty("/backButtonVisible", false);
		// 			this.oWizardButtonModel.setProperty("/reviewButtonVisible", false);
		// 			this.oWizardButtonModel.setProperty("/finishButtonVisible", false);
		// 			break;
		// 		case 1:
		// 			this.oWizardButtonModel.setProperty("/backButtonVisible", true);
		// 			this.oWizardButtonModel.setProperty("/nextButtonVisible", true);
		// 			this.oWizardButtonModel.setProperty("/nextButtonEnabled", true);
		// 			this.oWizardButtonModel.setProperty("/reviewButtonVisible", false);
		// 			this.oWizardButtonModel.setProperty("/finishButtonVisible", false);
		// 			break;
		// 		case 2:
		// 			this.oWizardButtonModel.setProperty("/backButtonVisible", true);
		// 			this.oWizardButtonModel.setProperty("/nextButtonVisible", true);
		// 			this.oWizardButtonModel.setProperty("/nextButtonEnabled", true);
		// 			this.oWizardButtonModel.setProperty("/reviewButtonVisible", false);
		// 			this.oWizardButtonModel.setProperty("/finishButtonVisible", false);
		// 			break;
		// 		case 3:
		// 			this.oWizardButtonModel.setProperty("/nextButtonVisible", false);
		// 			this.oWizardButtonModel.setProperty("/backButtonVisible", true);
		// 			this.oWizardButtonModel.setProperty("/reviewButtonVisible", true);
		// 			this.oWizardButtonModel.setProperty("/finishButtonVisible", false);
		// 			break;
		// 		case 4:
		// 			this.oWizardButtonModel.setProperty("/nextButtonVisible", false);
		// 			this.oWizardButtonModel.setProperty("/finishButtonVisible", true);
		// 			this.oWizardButtonModel.setProperty("/backButtonVisible", false);
		// 			this.oWizardButtonModel.setProperty("/reviewButtonVisible", false);
		// 			break;
		// 		default: break;
		// 	}
		// },
		//
		// handleNavigationChange: function(oEvent) {
		// 	this.oSelectedStep = oEvent.getParameter("step");
		// 	if (this.oWizard) {
		// 		this.iSelectedStepIndex = this.oWizard.getSteps().indexOf(this.oSelectedStep);
		// 		this._handleButtonsVisibility();
		// 	}
		// },
		//
		//       // BOOKMARK: SelectionChange Validations
		// onSelectionChange: function(oEvent) {
		// 	var oControl = oEvent.getSource();
		// 	var sValue = oControl.getValue();
		//
		// 	if (oControl.getId() === this._getControl("inputTitle").getId()) {
		// 		if (!sValue || sValue.trim() === "") {
		// 			oControl.setValueState(ValueState.Error);
		// 			oControl.setValueStateText("Betreff erforderlich!");
		// 		} else {
		// 			oControl.setValueState(ValueState.None);
		// 			oControl.setValueStateText("");
		// 		}
		// 	} else if (oControl.getId() === this._getControl("inputDescription").getId()) {
		// 		if (!sValue || sValue.trim() === "") {
		// 			oControl.setValueState(ValueState.Error);
		// 			oControl.setValueStateText("Beschreibung erforderlich!");
		// 		} else {
		// 			oControl.setValueState(ValueState.None);
		// 			oControl.setValueStateText("");
		// 		}
		// 	} else if (oControl.getId() === this._getControl("comboCategory").getId()) {
		// 		var sKey = oControl.getSelectedKey();
		// 		if (!sKey) {
		// 			oControl.setValueState(ValueState.Error);
		// 			oControl.setValueStateText("Kategorie erforderlich!");
		// 		} else {
		// 			oControl.setValueState(ValueState.None);
		// 			oControl.setValueStateText("");
		// 		}
		// 	} else if (oControl.getId() === this._getControl("inputOfferPrice").getId()) {
		// 		if (!sValue || sValue.trim() === "") {
		// 			oControl.setValueState(ValueState.Error);
		// 			oControl.setValueStateText("Preis erforderlich!");
		// 		} else {
		// 			oControl.setValueState(ValueState.None);
		// 			oControl.setValueStateText("");
		// 		}
		// 	} else if (oControl.getId() === this._getControl("inputOfferDescription").getId()) {
		// 		if (!sValue || sValue.trim() === "") {
		// 			oControl.setValueState(ValueState.Error);
		// 			oControl.setValueStateText("Beschreibung erforderlich!");
		// 		} else {
		// 			oControl.setValueState(ValueState.None);
		// 			oControl.setValueStateText("");
		// 		}
		//
		//           }
		// },
		//
		// _clearValueStates: function(oControl) {
		// 	oControl.setValueState(ValueState.None);
		// 	oControl.setValueStateText("");
		// },
		//
		// _resetValueStates: function() {
		// 	var oTitleField = this._getControl("inputTitle");
		// 	var oDescriptionField = this._getControl("inputDescription");
		// 	var oCategoryField = this._getControl("comboCategory");
		//
		// 	if (oTitleField) {
		// 		oTitleField.setValueState(ValueState.None);
		// 		oTitleField.setValueStateText("");
		// 	}
		// 	if (oDescriptionField) {
		// 		oDescriptionField.setValueState(ValueState.None);
		// 		oDescriptionField.setValueStateText("");
		// 	}
		// 	if (oCategoryField) {
		// 		oCategoryField.setValueState(ValueState.None);
		// 		oCategoryField.setValueStateText("");
		// 	}
		// },
		//

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

			// this._handleButtonsVisibility();
		},
		//
		//       // BOOKMARK: NextStep Validierungen
		// _validateCurrentStep: function() {
		// 	const oContext = this.oWizardDialog.getBindingContext();
		// 	const oData = oContext.getObject();
		//
		// 	if (this.iSelectedStepIndex === 0) {
		// 		if (!oData.topic || oData.topic.trim() === "") {
		//                   var inputTitleField = this._getControl("inputTitle");
		//                   inputTitleField.setValueState(ValueState.Error);
		//                   inputTitleField.setValueStateText("Betreff angeben!");
		//                   var bCheckTitle = false;
		// 		} else {
		//                   var inputTitleField = this._getControl("inputTitle");
		//                   this._clearValueStates(inputTitleField);
		//                   var bCheckTitle = true;
		//               }
		// 		if (!oData.request_description || oData.request_description.trim() === "") {
		//                   var inputDescriptionField = this._getControl("inputDescription");
		//                   inputDescriptionField.setValueState(ValueState.Error);
		//                   inputDescriptionField.setValueStateText("Beschreibung angeben!");
		//                   var bCheckDescription = false;
		// 		} else {
		//                   var inputDescriptionField = this._getControl("inputDescription");
		//                   this._clearValueStates(inputDescriptionField);
		//                   var bCheckDescription = true;
		//               }
		// 		if (!oData.category_id) {
		//                   var inputCategoryField = this._getControl("comboCategory");
		//                   inputCategoryField.setValueState(ValueState.Error);
		//                   inputCategoryField.setValueStateText("Kategorie wählen!");
		//                   var bCheckCategory = false;
		// 		} else {
		//                   var inputCategoryField = this._getControl("comboCategory");
		//                   this._clearValueStates(inputCategoryField);
		//                   var bCheckCategory = true;
		//               }
		//
		//               if (!bCheckTitle || !bCheckDescription || !bCheckCategory) {
		//                   return false;
		//               }
		// 	}
		//
		// 	return true;
		// },

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

						// Lösche den Draft
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

		//
		//       // Noch generiert 
		// handleWizardSubmit: function() {
		// 	var that = this;
		//
		// 	if (!this._validateCurrentStep()) {
		// 		return;
		// 	}
		//
		// 	const oContext = this.oWizardDialog.getBindingContext();
		// 	const oModel = oContext.getModel();
		//
		// 	// Speichere alle Änderungen
		// 	oModel.submitBatch("$auto").then(function() {
		// 		MessageBox.success("Antrag wurde erfolgreich erstellt!", {
		// 			onClose: function() {
		// 				if (that.oWizard) {
		// 					that.oWizard.discardProgress(that.oWizard.getSteps()[0]);
		// 				}
		// 				if (that.oWizardDialog) {
		// 					that.oWizardDialog.close();
		// 				}
		// 				that._resetValueStates();
		// 				that.oWizardButtonModel.setProperty("/selectedOffer", null);
		// 				that.iSelectedStepIndex = 0;
		// 				that.oSelectedStep = that.oWizard ? that.oWizard.getSteps()[0] : null;
		// 			}
		// 		});
		// 	}).catch(function(oError) {
		// 		MessageBox.error("Fehler beim Erstellen des Antrags: " + oError.message);
		// 	});
		// },
		//
		// _handleNavigationToStep: function(iStepNumber) {
		// 	if (this.oWizardDialog && this.oWizard) {
		// 		this.oWizardDialog.open();
		// 		this.oWizard.goToStep(this.oWizard.getSteps()[iStepNumber], true);
		// 	}
		// },
		//
		// editStepOne: function() {
		// 	this._handleNavigationToStep(0);
		// },
		//
		// editStepTwo: function() {
		// 	this._handleNavigationToStep(1);
		// },
		//
		// editStepThree: function() {
		// 	this._handleNavigationToStep(2);
		// },
		//
		// onAddPosition: function() {
		// 	const oSelectedOffer = this.oWizardButtonModel.getProperty("/selectedOffer");
		//
		// 	if (!oSelectedOffer) {
		// 		MessageBox.error("Bitte wählen Sie zuerst ein Angebot aus der Tabelle aus.");
		// 		return;
		// 	}
		//
		// 	const oModel = oSelectedOffer.getModel();
		//
		// 	// Erstelle eine neue Position über die _Position Navigation
		// 	const oPositionListBinding = oModel.bindList("_Position", oSelectedOffer);
		// 	const oPositionContext = oPositionListBinding.create({
		// 		description: "",
		// 		price: 0,
		// 		currency_code: "EUR",
		// 		offer_position: 10
		// 	});
		//
		// 	MessageBox.success("Neue Position hinzugefügt.");
		// },
		//
		// onDeletePosition: function(oEvent) {
		// 	var oItem = oEvent.getSource().getParent();
		// 	var oTable = this._getControl("positionTable");
		// 	var iIndex = oTable.indexOfItem(oItem);
		//
		// 	if (iIndex > -1) {
		// 		var aPositions = this.oWizardButtonModel.getProperty("/currentOffer/positions");
		// 		aPositions.splice(iIndex, 1);
		// 		this.oWizardButtonModel.setProperty("/currentOffer/positions", aPositions);
		// 		this._calculateOfferPrice();
		// 	}
		// },
		//
		// _calculateOfferPrice: function() {
		// 	var aPositions = this.oWizardButtonModel.getProperty("/currentOffer/positions") || [];
		// 	var fTotalPrice = 0;
		//
		// 	aPositions.forEach(function(oPosition) {
		// 		fTotalPrice += oPosition.price;
		// 	});
		//
		// 	this.oWizardButtonModel.setProperty("/currentOffer/calculatedPrice", fTotalPrice);
		// },

		onAddOffer: async function() {
			const oContext = this.oWizardDialog.getBindingContext();
			const oModel = oContext.getModel();

			const oOfferListBinding = oModel.bindList("_Offer", oContext);
			const oOfferContext = oOfferListBinding.create({});
			await oOfferContext.created();

            // BOOKMARK
            this.getView().byId("offerTable").refresh();
            // oOfferListBinding.refresh();

            this.getView().byId("positionTable").setBindingContext(oOfferContext);
		},

		// onOfferSelectionChange: function(oEvent) {
		// 	const oTable = oEvent.getSource();
		// 	const aSelectedItems = oTable.getSelectedItems();
		//
		// 	if (aSelectedItems.length > 0) {
		// 		const oSelectedItem = aSelectedItems[0];
		// 		const oContext = oSelectedItem.getBindingContext();
		// 		this.oWizardModel.setProperty("/selectedOffer", oContext);
		//
		// 		// Binde die positionTable an das ausgewählte Angebot
		// 		const oPositionTable = this._getControl("positionTable");
		// 		if (oPositionTable) {
		// 			// Hole die innere Tabelle des Makros
		// 			const oInnerTable = oPositionTable.getContent ? oPositionTable.getContent() : oPositionTable;
		// 			if (oInnerTable && oInnerTable.setBindingContext) {
		// 				oInnerTable.setBindingContext(oContext);
		// 			}
		// 		}
		// 	} else {
		// 		this.oWizardModel.setProperty("/selectedOffer", null);
		// 	}
		// }

	});
});
