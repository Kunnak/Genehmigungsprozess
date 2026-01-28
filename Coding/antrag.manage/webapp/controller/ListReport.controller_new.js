sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(MessageToast, MessageBox) {
    'use strict';

    return {
        onOpenCreateWizard: function(oEvent) {
            const oView = this.getView();

            if (!this._oCreateDialog) {
                this._oCreateDialog = sap.ui.xmlfragment(
                    "antragsmanagement.antrag.manage.fragments.CreateWizard",
                    this
                );
                oView.addDependent(this._oCreateDialog);
            }

            this._oCreateDialog.open();
        },

        onInputChange: function() {
            const oTitle = sap.ui.core.Fragment.byId(
                "antragsmanagement.antrag.manage.fragments.CreateWizard",
                "inputTitle"
            );
            const oCategory = sap.ui.core.Fragment.byId(
                "antragsmanagement.antrag.manage.fragments.CreateWizard",
                "selectCategory"
            );
            const oStep1 = sap.ui.core.Fragment.byId(
                "antragsmanagement.antrag.manage.fragments.CreateWizard",
                "step1"
            );

            if (oTitle && oCategory && oTitle.getValue() && oCategory.getSelectedKey()) {
                oStep1.setValidated(true);
            } else {
                oStep1.setValidated(false);
            }
        },

        onWizardComplete: function() {
            const oTitle = sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "inputTitle");
            const oDescription = sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "inputDescription");
            const oCategory = sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "selectCategory");
            const oDate = sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "inputDate");
            const oAmount = sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "inputAmount");

            const oData = {
                title: oTitle.getValue(),
                description: oDescription.getValue(),
                category: oCategory.getSelectedItem().getText(),
                date: oDate.getValue(),
                amount: oAmount.getValue()
            };

            const oSummaryTitle = sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "summaryTitle");
            const oSummaryCategory = sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "summaryCategory");

            oSummaryTitle.setText(oData.title);
            oSummaryCategory.setText(oData.category);

            MessageBox.confirm("Möchten Sie den Antrag wirklich erstellen?", {
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        this._createRequest(oData);
                    }
                }
            });
        },

        _createRequest: function(oData) {
            const oModel = this.getView().getModel();
            const oListBinding = oModel.bindList("/Requests");

            const oContext = oListBinding.create({
                Title: oData.title,
                Description: oData.description,
                Category: oData.category,
                RequestDate: oData.date,
                Amount: parseFloat(oData.amount) || 0
            });

            oContext.created().then(() => {
                MessageToast.show("Antrag erfolgreich erstellt!");
                this._oCreateDialog.close();
                this._resetWizard();
                oModel.refresh();
            }).catch((oError) => {
                MessageBox.error("Fehler beim Erstellen: " + oError.message);
            });
        },

        onCancelWizard: function() {
            MessageBox.confirm("Wizard abbrechen? Alle Eingaben gehen verloren.", {
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        this._oCreateDialog.close();
                        this._resetWizard();
                    }
                }
            });
        },

        _resetWizard: function() {
            const oWizard = sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "createRequestWizard");

            if (oWizard) {
                oWizard.discardProgress(oWizard.getSteps()[0]);
                
                sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "inputTitle").setValue("");
                sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "inputDescription").setValue("");
                sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "selectCategory").setSelectedKey("");
                sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "inputDate").setValue("");
                sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.fragments.CreateWizard", "inputAmount").setValue("");
            }
        }
    };
});
