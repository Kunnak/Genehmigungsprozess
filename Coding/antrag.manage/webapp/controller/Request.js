sap.ui.define([
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function(MessageBox, Fragment) {
    'use strict';

    var _oWizardDialog;
    var FRAGMENT_NAME = "antragsmanagement.antrag.manage.view.fragments.createWizard";
    
    var _getControl = function(sId) {
        return Fragment.byId(FRAGMENT_NAME, sId);
    };
    
    var _resetWizard = function() {
        var oWizard = _getControl("createRequestWizard");
        
        if (oWizard) {
            oWizard.discardProgress(oWizard.getSteps()[0]);
        }

        _getControl("inputTitle").setValue("");
        _getControl("inputDescription").setValue("");
        _getControl("selectPriority").setSelectedKey("");
        _getControl("inputTheme1Field1").setValue("");
        _getControl("inputTheme1Field2").setValue("");
        _getControl("inputTheme2Field1").setValue("");
        _getControl("inputTheme2Field2").setValue("");
    };
    
    return {
        openWizard: function(oBindingContext, aSelectedContexts) {
            if (!_oWizardDialog) {
                Fragment.load({
                    name: FRAGMENT_NAME,
                    controller: {
                        onCancelWizard: function() {
                            if (_oWizardDialog) {
                                _oWizardDialog.close();
                                _resetWizard();
                            }
                        },

                        onWizardComplete: function() {
                            var sTitle = _getControl("inputTitle").getValue();
                            var sDescription = _getControl("inputDescription").getValue();

                            if (!sTitle) {
                                MessageBox.error("Bitte geben Sie einen Titel ein.");
                                return;
                            }

                            _getControl("summaryTitle").setText(sTitle);
                            _getControl("summaryDescription").setText(sDescription);
                            var oSelectPriority = _getControl("selectPriority");
                            _getControl("summaryPriority").setText(
                                oSelectPriority.getSelectedItem() ? oSelectPriority.getSelectedItem().getText() : ""
                            );

                            MessageBox.success("Antrag wurde erfolgreich erstellt!", {
                                onClose: function() {
                                    if (_oWizardDialog) {
                                        _oWizardDialog.close();
                                        _resetWizard();
                                    }
                                }
                            });
                        }
                    }
                }).then(function(oDialog) {
                    _oWizardDialog = oDialog;
                    _oWizardDialog.open();
                });
            } else {
                _oWizardDialog.open();
            }
        }
    };
});
