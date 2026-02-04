sap.ui.define([
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Core"
], function(MessageBox, Fragment, JSONModel, Core) {
    'use strict';

    var _oWizardDialog;
    var _oWizardModel;
    var _oView;
    var _oWizard;
    var _oSelectedStep;
    var _iSelectedStepIndex = 0;
    var FRAGMENT_NAME = "antragsmanagement.antrag.manage.view.fragments.createWizard";
    
    var getControl = function(sId) {
        if (!_oWizardDialog) return null;
        // Use sap.ui.core.Fragment.byId for controls inside fragments
        var oControl = Fragment.byId(FRAGMENT_NAME, sId);
        // if (!oControl) {
        //     // Fallback: search in dialog content
        //     var fnFindControl = function(oParent, sSearchId) {
        //         if (oParent.getId && oParent.getId().endsWith(sSearchId)) {
        //             return oParent;
        //         }
        //         var aAggregations = oParent.getMetadata().getAllAggregations();
        //         for (var sAggName in aAggregations) {
        //             var oAggregation = oParent.getAggregation(sAggName);
        //             if (oAggregation) {
        //                 if (Array.isArray(oAggregation)) {
        //                     for (var i = 0; i < oAggregation.length; i++) {
        //                         var oFound = fnFindControl(oAggregation[i], sSearchId);
        //                         if (oFound) return oFound;
        //                     }
        //                 } else {
        //                     var oFound = fnFindControl(oAggregation, sSearchId);
        //                     if (oFound) return oFound;
        //                 }
        //             }
        //         }
        //         return null;
        //     };
        //     oControl = fnFindControl(_oWizardDialog, sId);
        // }
        return oControl;
    };

    var handleButtonsVisibility = function() {
        if (!_oWizardModel) return;
        
        switch (_iSelectedStepIndex) {
            case 0:
                _oWizardModel.setProperty("/nextButtonVisible", true);
                _oWizardModel.setProperty("/nextButtonEnabled", true);
                _oWizardModel.setProperty("/backButtonVisible", false);
                _oWizardModel.setProperty("/reviewButtonVisible", false);
                _oWizardModel.setProperty("/finishButtonVisible", false);
                break;
            case 1:
                _oWizardModel.setProperty("/backButtonVisible", true);
                _oWizardModel.setProperty("/nextButtonVisible", true);
                _oWizardModel.setProperty("/nextButtonEnabled", true);
                _oWizardModel.setProperty("/reviewButtonVisible", false);
                _oWizardModel.setProperty("/finishButtonVisible", false);
                break;
            case 2:
                _oWizardModel.setProperty("/backButtonVisible", true);
                _oWizardModel.setProperty("/nextButtonVisible", true);
                _oWizardModel.setProperty("/nextButtonEnabled", true);
                _oWizardModel.setProperty("/reviewButtonVisible", false);
                _oWizardModel.setProperty("/finishButtonVisible", false);
                break;
            case 3:
                _oWizardModel.setProperty("/nextButtonVisible", false);
                _oWizardModel.setProperty("/backButtonVisible", true);
                _oWizardModel.setProperty("/reviewButtonVisible", true);
                _oWizardModel.setProperty("/finishButtonVisible", false);
                break;
            case 4:
                _oWizardModel.setProperty("/nextButtonVisible", false);
                _oWizardModel.setProperty("/finishButtonVisible", true);
                _oWizardModel.setProperty("/backButtonVisible", false);
                _oWizardModel.setProperty("/reviewButtonVisible", false);
                break;
            default: break;
        }
    };

    var handleNavigationToStep = function(iStepNumber) {
        if (_oWizardDialog && _oWizard) {
            _oWizardDialog.open();
            _oWizard.goToStep(_oWizard.getSteps()[iStepNumber], true);
        }
    };

    var handleMessageBoxOpen = function(sMessage, sMessageBoxType) {
        MessageBox[sMessageBoxType](sMessage, {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function(oAction) {
                if (oAction === MessageBox.Action.YES) {
                    if (_oWizard) {
                        _oWizard.discardProgress(_oWizard.getSteps()[0]);
                    }
                    if (_oWizardDialog) {
                        _oWizardDialog.close();
                    }
                    if (_oWizardModel) {
                        _oWizardModel.setProperty("/newRequest", {});
                    }
                    _iSelectedStepIndex = 0;
                    _oSelectedStep = _oWizard ? _oWizard.getSteps()[0] : null;
                }
            }
        });
    };
    
    return {
        openWizard: function(oBindingContext, aSelectedContexts) {
            // Get the view from the current UI component
            var oAppComponent = Core.getComponent(Core.getCurrentFocusedControlId());
            if (!oAppComponent) {
                var oRootView = Core.getRootComponent();
                if (oRootView) {
                    oAppComponent = oRootView;
                }
            }
            
            // Try to get view from component or use byId
            if (oAppComponent && oAppComponent.getRootControl) {
                _oView = oAppComponent.getRootControl();
            } else {
                // Fallback: get any view
                var aViews = Core.byFieldGroupId("");
                if (aViews && aViews.length > 0) {
                    _oView = aViews[0];
                } else {
                    // Last resort: create without view dependency
                    _oView = null;
                }
            }
            
            if (!_oWizardDialog) {
                Fragment.load({
                    name: FRAGMENT_NAME,
                    controller: {
                        handleNavigationChange: function(oEvent) {
                            _oSelectedStep = oEvent.getParameter("step");
                            if (_oWizard) {
                                _iSelectedStepIndex = _oWizard.getSteps().indexOf(_oSelectedStep);
                                handleButtonsVisibility();
                            }
                        },

                        onDialogNextButton: function() {
                            console.log("Next button clicked");
                            
                            if (!_oWizard) {
                                _oWizard = getControl("createRequest");
                                console.log("Wizard loaded:", _oWizard);
                            }
                            
                            if (!_oWizard) {
                                console.error("Wizard control not found!");
                                return;
                            }
                            
                            console.log("Current selected step:", _oSelectedStep);
                            console.log("Current index:", _iSelectedStepIndex);
                            
                            _iSelectedStepIndex = _oWizard.getSteps().indexOf(_oSelectedStep);
                            console.log("Recalculated index:", _iSelectedStepIndex);
                            
                            var oNextStep = _oWizard.getSteps()[_iSelectedStepIndex + 1];
                            console.log("Next step:", oNextStep);

                            if (_oSelectedStep && !_oSelectedStep.bLast) {
                                console.log("Using goToStep");
                                _oWizard.goToStep(oNextStep, true);
                            } else {
                                console.log("Using nextStep");
                                _oWizard.nextStep();
                            }

                            _iSelectedStepIndex++;
                            _oSelectedStep = oNextStep;

                            handleButtonsVisibility();
                        },

                        onDialogBackButton: function() {
                            if (!_oWizard) {
                                _oWizard = getControl("createRequest");
                            }
                            
                            if (!_oWizard) return;
                            
                            _iSelectedStepIndex = _oWizard.getSteps().indexOf(_oSelectedStep);
                            var oPreviousStep = _oWizard.getSteps()[_iSelectedStepIndex - 1];

                            if (_oSelectedStep) {
                                _oWizard.goToStep(oPreviousStep, true);
                            } else {
                                _oWizard.previousStep();
                            }

                            _iSelectedStepIndex--;
                            _oSelectedStep = oPreviousStep;

                            handleButtonsVisibility();
                        },

                        handleWizardCancel: function() {
                            handleMessageBoxOpen("Möchten Sie den Wizard wirklich abbrechen? Alle Eingaben gehen verloren.", "warning");
                        },

                        handleWizardSubmit: function() {
                            var oNewRequest = _oWizardModel.getProperty("/newRequest");
                            
                            if (!oNewRequest.title) {
                                MessageBox.error("Bitte füllen Sie alle Pflichtfelder aus.");
                                return;
                            }

                            var oODataModel = _oView ? _oView.getModel() : Core.getComponent(Core.getCurrentFocusedControlId()).getModel();
                            var oBinding = oODataModel.bindList("/Requests");

                            oBinding.create(oNewRequest).created().then(function() {
                                MessageBox.success("Antrag wurde erfolgreich erstellt!", {
                                    onClose: function() {
                                        if (_oWizard) {
                                            _oWizard.discardProgress(_oWizard.getSteps()[0]);
                                        }
                                        if (_oWizardDialog) {
                                            _oWizardDialog.close();
                                        }
                                        if (_oWizardModel) {
                                            _oWizardModel.setProperty("/newRequest", {});
                                        }
                                        _iSelectedStepIndex = 0;
                                        _oSelectedStep = _oWizard ? _oWizard.getSteps()[0] : null;
                                    }
                                });
                            }).catch(function(oError) {
                                MessageBox.error("Fehler beim Erstellen des Antrags: " + oError.message);
                            });
                        },

                        editStepOne: function() {
                            handleNavigationToStep(0);
                        },

                        editStepTwo: function() {
                            handleNavigationToStep(1);
                        },

                        editStepThree: function() {
                            handleNavigationToStep(2);
                        },

                        editStepFour: function() {
                            handleNavigationToStep(3);
                        }
                    }
                }).then(function(oDialog) {
                    _oWizardDialog = oDialog;
                    
                    console.log("Dialog created:", _oWizardDialog);
                    
                    // Add dependent only if view exists
                    if (_oView && _oView.addDependent) {
                        _oView.addDependent(_oWizardDialog);
                    }
                    
                    _oWizardModel = new JSONModel({
                        newRequest: {},
                        nextButtonVisible: true,
                        nextButtonEnabled: true,
                        backButtonVisible: false,
                        reviewButtonVisible: false,
                        finishButtonVisible: false
                    });
                    _oWizardDialog.setModel(_oWizardModel, "wizard");
                    
                    // Open dialog first, then initialize wizard
                    _oWizardDialog.attachAfterOpen(function() {
                        // Initialize wizard and selected step AFTER dialog is opened
                        _oWizard = getControl("createRequest");
                        console.log("Wizard initialized after open:", _oWizard);
                        
                        _iSelectedStepIndex = 0;
                        _oSelectedStep = _oWizard ? _oWizard.getSteps()[0] : null;
                        console.log("Initial selected step:", _oSelectedStep);
                        console.log("Total steps:", _oWizard ? _oWizard.getSteps().length : 0);
                        
                        handleButtonsVisibility();
                    });
                    
                    _oWizardDialog.open();
                });
            } else {
                if (_oWizardModel) {
                    _oWizardModel.setProperty("/newRequest", {});
                }
                _iSelectedStepIndex = 0;
                
                // Ensure wizard is initialized
                if (!_oWizard) {
                    _oWizard = getControl("createRequest");
                }
                
                if (_oWizard) {
                    _oWizard.discardProgress(_oWizard.getSteps()[0]);
                    _oSelectedStep = _oWizard.getSteps()[0];
                }
                
                handleButtonsVisibility();
                _oWizardDialog.open();
            }
        }
    };
});
