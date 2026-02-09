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
	'sap/ui/model/json/JSONModel',
    'sap/ui/core/ValueState',
    'sap/ui/core/ValueState'
], function (ControllerExtension, MessageBox, Fragment, JSONModel, ValueState) {
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
					
					// BOOKMARK: WizardModel
					that.oWizardModel = new JSONModel({
						newRequest: {
							title: "",
							description: "",
							category_id: null,
							CategoryName: "",
							offers: []
						},
						currentOffer: {
                            description: "",
							positions: [],
							calculatedPrice: 0,
							currency: "EUR"
						},
						currentPosition: {
							description: "",
							price: null,
							currency: "EUR"
						},
						nextButtonVisible: true,
						nextButtonEnabled: true,
						backButtonVisible: false,
						reviewButtonVisible: false,
						finishButtonVisible: false
					});
					that.oWizardDialog.setModel(that.oWizardModel, "wizard");
					
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
					this.oWizardModel.setProperty("/newRequest", {
						title: "",
						description: "",
						category_id: null,
						CategoryName: "",
						offers: []
					});
					this.oWizardModel.setProperty("/currentOffer", {
						description: "",
						positions: [],
						calculatedPrice: 0,
						currency: "EUR"
					});
					this.oWizardModel.setProperty("/currentPosition", {
						description: "",
						quantity: null,
						unitPrice: null,
						currency: "EUR"
					});
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

        // BOOKMARK: SelecitonChange Validierungen
		onSelectionChange: function(oEvent) {
			var oControl = oEvent.getSource();
			var sValue = oControl.getValue();
			
			if (oControl.getId() === this._getControl("inputTitle").getId()) {
				if (!sValue || sValue.trim() === "") {
					oControl.setValueState(ValueState.Error);
					oControl.setValueStateText("Betreff erforderlich!");
				} else {
					oControl.setValueState(ValueState.None);
					oControl.setValueStateText("");
				}
			} else if (oControl.getId() === this._getControl("inputDescription").getId()) {
				if (!sValue || sValue.trim() === "") {
					oControl.setValueState(ValueState.Error);
					oControl.setValueStateText("Beschreibung erforderlich!");
				} else {
					oControl.setValueState(ValueState.None);
					oControl.setValueStateText("");
				}
			} else if (oControl.getId() === this._getControl("comboCategory").getId()) {
				var sKey = oControl.getSelectedKey();
				if (!sKey) {
					oControl.setValueState(ValueState.Error);
					oControl.setValueStateText("Kategorie erforderlich!");
				} else {
					oControl.setValueState(ValueState.None);
					oControl.setValueStateText("");
				}
			} else if (oControl.getId() === this._getControl("inputOfferPrice").getId()) {
				if (!sValue || sValue.trim() === "") {
					oControl.setValueState(ValueState.Error);
					oControl.setValueStateText("Preis erforderlich!");
				} else {
					oControl.setValueState(ValueState.None);
					oControl.setValueStateText("");
				}
			} else if (oControl.getId() === this._getControl("inputOfferDescription").getId()) {
				if (!sValue || sValue.trim() === "") {
					oControl.setValueState(ValueState.Error);
					oControl.setValueStateText("Beschreibung erforderlich!");
				} else {
					oControl.setValueState(ValueState.None);
					oControl.setValueStateText("");
				}

            }
		},

		_clearValueStates: function(oControl) {
			oControl.setValueState(ValueState.None);
			oControl.setValueStateText("");
		},

		_resetValueStates: function() {
			var oTitleField = this._getControl("inputTitle");
			var oDescriptionField = this._getControl("inputDescription");
			var oCategoryField = this._getControl("comboCategory");
			
			if (oTitleField) {
				oTitleField.setValueState(ValueState.None);
				oTitleField.setValueStateText("");
			}
			if (oDescriptionField) {
				oDescriptionField.setValueState(ValueState.None);
				oDescriptionField.setValueStateText("");
			}
			if (oCategoryField) {
				oCategoryField.setValueState(ValueState.None);
				oCategoryField.setValueStateText("");
			}
		},

		onDialogNextButton: function() {
			if (!this.oWizard) {
				this.oWizard = this._getControl("createRequest");
			}
			
			if (!this.oWizard) return;
			
			if (!this._validateCurrentStep()) {
				return; 
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

        // BOOKMARK: NextStep Validierungen
		_validateCurrentStep: function() {
			var oNewRequest = this.oWizardModel.getProperty("/newRequest");
			
			if (this.iSelectedStepIndex === 0) {
				if (!oNewRequest.title || oNewRequest.title.trim() === "") {
                    var inputTitleField = this._getControl("inputTitle");
                    inputTitleField.setValueState(ValueState.Error);
                    inputTitleField.setValueStateText("Betreff angeben!");
                    var bCheckTitle = false;
				} else {
                    var inputTitleField = this._getControl("inputTitle");
                    this._clearValueStates(inputTitleField);
                    var bCheckTitle = true;
                }
				if (!oNewRequest.description || oNewRequest.description.trim() === "") {
                    var inputDescriptionField = this._getControl("inputDescription");
                    inputDescriptionField.setValueState(ValueState.Error);
                    inputDescriptionField.setValueStateText("Beschreibung angeben!");
                    var bCheckDescription = false;
				} else {
                    var inputDescriptionField = this._getControl("inputDescription");
                    this._clearValueStates(inputDescriptionField);
                    var bCheckDescription = true;
                }
				if (!oNewRequest.category_id) {
                    var inputCategoryField = this._getControl("comboCategory");
                    inputCategoryField.setValueState(ValueState.Error);
                    inputCategoryField.setValueStateText("Kategorie wählen!");
                    var bCheckCategory = false;
				} else {
                    var inputCategoryField = this._getControl("comboCategory");
                    this._clearValueStates(inputCategoryField);
                    var bCheckCategory = true;
                }

                if (!bCheckTitle || !bCheckDescription || !bCheckCategory ) {
                    return false;
                }

			} else if (this.iSelectedStepIndex === 1) {
				var aOffers = oNewRequest.offers || [];
				var oOffersTable = this._getControl("offersTable");
				
				if (aOffers.length === 0) {
					MessageBox.error("Bitte fügen Sie mindestens ein Angebot hinzu.");
					return false;
				}
				
				var bAllDescriptionsValid = true;
				var aTableItems = oOffersTable.getItems();
				
				for (var i = 0; i < aOffers.length; i++) {
					var oOffer = aOffers[i];
					var oItem = aTableItems[i];
					
					if (oItem) {
						var oCells = oItem.getCells();
						var oDescriptionInput = oCells[1];
						
						if (!oOffer.description || oOffer.description.trim() === "") {
							oDescriptionInput.setValueState(ValueState.Error);
							oDescriptionInput.setValueStateText("Beschreibung erforderlich!");
							bAllDescriptionsValid = false;
						} else {
							oDescriptionInput.setValueState(ValueState.None);
							oDescriptionInput.setValueStateText("");
						}
					}
				}
				
				if (!bAllDescriptionsValid) {
					MessageBox.error("Bitte geben Sie für alle Angebote eine Beschreibung an.");
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
						that._resetValueStates();
						if (that.oWizardModel) {
							that.oWizardModel.setProperty("/newRequest", {
								title: "",
								description: "",
								category_id: null,
								CategoryName: "",
								offers: []
							});
							that.oWizardModel.setProperty("/currentOffer", {
								description: "",
								positions: [],
								calculatedPrice: 0,
								currency: "EUR"
							});
							that.oWizardModel.setProperty("/currentPosition", {
								description: "",
								price: null,
								currency: "EUR"
							});
						}
						that.iSelectedStepIndex = 0;
						that.oSelectedStep = that.oWizard ? that.oWizard.getSteps()[0] : null;
					}
				}
			});
		},

        // Noch generiert w
		handleWizardSubmit: function() {
			var oNewRequest = this.oWizardModel.getProperty("/newRequest");
			var that = this;
			
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
						that._resetValueStates();
						if (that.oWizardModel) {
							that.oWizardModel.setProperty("/newRequest", {
								title: "",
								description: "",
								category_id: null,
								CategoryName: "",
								offers: []
							});
							that.oWizardModel.setProperty("/currentOffer", {
								description: "",
								price: null,
								currency: "EUR"
							});
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
		},

		onAddPosition: function() {
			var oCurrentPosition = this.oWizardModel.getProperty("/currentPosition");
			var aPositions = this.oWizardModel.getProperty("/currentOffer/positions") || [];
			
            // Validation
			if (!oCurrentPosition.description || oCurrentPosition.description.trim() === "") {
                var oPositionDescriptionInput = this._getControl("inputOfferDescription");
                oPositionDescriptionInput.setValueState(ValueState.Error);
				MessageBox.error("Bitte geben Sie eine Positionsbeschreibung ein.");
				return;
			}
			if (!oCurrentPosition.price || oCurrentPosition.price <= 0) {
                var oPositionPriceInput = this._getControl("inputOfferPrice");
                oPositionPriceInput.setValueState(ValueState.Error);
				MessageBox.error("Bitte geben Sie einen gültigen Preis ein.");
				return;
			}
			
			var oNewPosition = {
				description: oCurrentPosition.description,
				price: parseFloat(oCurrentPosition.price),
				currency: oCurrentPosition.currency || "EUR"
			};
			
			aPositions.push(oNewPosition);
			this.oWizardModel.setProperty("/currentOffer/positions", aPositions);
			
			this._calculateOfferPrice();
			
			this.oWizardModel.setProperty("/currentPosition", {
				description: "",
				price: null,
				currency: "EUR"
			});
		},

		onDeletePosition: function(oEvent) {
			var oItem = oEvent.getSource().getParent();
			var oTable = this._getControl("positionTable");
			var iIndex = oTable.indexOfItem(oItem);
			
			if (iIndex > -1) {
				var aPositions = this.oWizardModel.getProperty("/currentOffer/positions");
				aPositions.splice(iIndex, 1);
				this.oWizardModel.setProperty("/currentOffer/positions", aPositions);
				this._calculateOfferPrice();
			}
		},

		_calculateOfferPrice: function() {
			var aPositions = this.oWizardModel.getProperty("/currentOffer/positions") || [];
			var fTotalPrice = 0;
			
			aPositions.forEach(function(oPosition) {
				fTotalPrice += oPosition.price;
			});
			
			this.oWizardModel.setProperty("/currentOffer/calculatedPrice", fTotalPrice);
		},

		onAddOffer: function() {
			var oCurrentOffer = this.oWizardModel.getProperty("/currentOffer");
			var aOffers = this.oWizardModel.getProperty("/newRequest/offers") || [];
			
			if (!oCurrentOffer.positions || oCurrentOffer.positions.length === 0) {
				MessageBox.error("Bitte fügen Sie mindestens eine Position hinzu.");
				return;
			}
			
			var oNewOffer = {
				description: oCurrentOffer.description || "", 
				price: oCurrentOffer.calculatedPrice,
				currency: oCurrentOffer.currency || "EUR",
				positions: JSON.parse(JSON.stringify(oCurrentOffer.positions)), // Deep copy
				isFavorite: aOffers.length === 0 // Erstes Angebot ist automatisch Favorit
			};
			
			aOffers.push(oNewOffer);
			this.oWizardModel.setProperty("/newRequest/offers", aOffers);
			
			// Aktuelles Angebot zurücksetzen
			this.oWizardModel.setProperty("/currentOffer", {
				description: "",
				positions: [],
				calculatedPrice: 0,
				currency: "EUR"
			});
		},

		onDeleteOffer: function(oEvent) {
			var oItem = oEvent.getSource().getParent();
			var oTable = this._getControl("offersTable");
			var iIndex = oTable.indexOfItem(oItem);
			
			if (iIndex > -1) {
				var aOffers = this.oWizardModel.getProperty("/newRequest/offers");
				aOffers.splice(iIndex, 1);
				this.oWizardModel.setProperty("/newRequest/offers", aOffers);
			}
		},

		onSelectFavorite: function(oEvent) {
			var oRadioButton = oEvent.getSource();
			var oItem = oRadioButton.getParent();
			var oTable = this._getControl("offersTable");
			var iSelectedIndex = oTable.indexOfItem(oItem);
			
			var aOffers = this.oWizardModel.getProperty("/newRequest/offers");
			
			// Alle Favoriten zurücksetzen und nur das ausgewählte setzen
			aOffers.forEach(function(oOffer, index) {
				oOffer.isFavorite = (index === iSelectedIndex);
			});
			
			this.oWizardModel.setProperty("/newRequest/offers", aOffers);
		},

		onShowPositions: function(oEvent) {
			var oButton = oEvent.getSource();
			var oBindingContext = oButton.getBindingContext("wizard");
			var aPositions = oBindingContext.getProperty("positions");
			
			// Erstelle Popover mit Positionstabelle
			if (!this._oPositionsPopover) {
				this._oPositionsPopover = new sap.m.Popover({
					title: "Positionen des Angebots",
					contentWidth: "500px",
					placement: "Left",
					content: [
						new sap.m.Table({
							columns: [
								new sap.m.Column({ header: new sap.m.Text({ text: "Beschreibung" }) }),
								new sap.m.Column({ 
									header: new sap.m.Text({ text: "Preis" }), 
									width: "10em" 
								})
							]
						})
					]
				});
				this.base.getView().addDependent(this._oPositionsPopover);
			}
			
			// Setze Positionen als Items
			var oTable = this._oPositionsPopover.getContent()[0];
			oTable.destroyItems();
			
			aPositions.forEach(function(oPosition) {
				oTable.addItem(new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({ text: oPosition.description }),
						new sap.m.Text({ 
							text: oPosition.price + " " + oPosition.currency
						})
					]
				}));
			});
			
			this._oPositionsPopover.openBy(oButton);
		}

	});
});
