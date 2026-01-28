sap.ui.define([
         "sap/m/MessageToast",
         "sap/m/MessageBox"
     ], function(MessageToast, MessageBox) {
         'use strict';

         return {
             // Wird vom Custom Action Button aufgerufen
             onOpenCreateWizard: function(oEvent) {
                 const oView = this.getView();

                 // Fragment lazy laden
                 if (!this._oCreateDialog) {
                     this._oCreateDialog = sap.ui.xmlfragment(
                         "antragsmanagement.antrag.manage.ext.CreateRequestWizard",
                         this
                     );
                     oView.addDependent(this._oCreateDialog);
                 }

                 this._oCreateDialog.open();
             },

             // Validierung für Schritt 1
             onInputChange: function() {
                 const oTitle = sap.ui.core.Fragment.byId(
                     "antragsmanagement.antrag.manage.ext.CreateRequestWizard",
                     "inputTitle"
                 );
                 const oCategory = sap.ui.core.Fragment.byId(
                     "antragsmanagement.antrag.manage.ext.CreateRequestWizard",
                     "selectCategory"
                 );
                 const oStep1 = sap.ui.core.Fragment.byId(
                     "antragsmanagement.antrag.manage.ext.CreateRequestWizard",
                     "step1"
                 );

                 // Validierung: Titel und Kategorie müssen gefüllt sein
                 if (oTitle && oCategory && oTitle.getValue() && oCategory.getSelectedKey()) {
                     oStep1.setValidated(true);
                 } else {
                     oStep1.setValidated(false);
                 }
             },

             // Wird beim Klick auf "Antrag erstellen" (Finish) aufgerufen
             onWizardComplete: function() {
                 // Alle Eingabefelder holen
                 const oTitle =
   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "inputTitle");
                 const oDescription =
   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "inputDescription");
                 const oCategory =
   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "selectCategory");
                 const oDate =
   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "inputDate");
                 const oAmount =
   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "inputAmount");

                 // Daten sammeln
                 const oData = {
                     title: oTitle.getValue(),
                     description: oDescription.getValue(),
                     category: oCategory.getSelectedItem().getText(),
                     date: oDate.getValue(),
                     amount: oAmount.getValue()
                 };

                 // Zusammenfassung aktualisieren
                 const oSummaryTitle =
   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "summaryTitle");
                 const oSummaryCategory =
   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "summaryCategory");

                 oSummaryTitle.setText(oData.title);
                 oSummaryCategory.setText(oData.category);

                 // Bestätigung anzeigen
                 MessageBox.confirm("Möchten Sie den Antrag wirklich erstellen?", {
                     onClose: (sAction) => {
                         if (sAction === MessageBox.Action.OK) {
                             this._createRequest(oData);
                         }
                     }
                 });
             },

             // Erstellt den Antrag via OData
             _createRequest: function(oData) {
                 const oModel = this.getView().getModel();
                 const oListBinding = oModel.bindList("/Requests");

                 // Neuen Eintrag erstellen
                 const oContext = oListBinding.create({
                     // WICHTIG: Passe die Property-Namen an dein OData-Service an!
                     // Beispiel (du musst die echten Feldnamen verwenden):
                     Title: oData.title,
                     Description: oData.description,
                     Category: oData.category,
                     RequestDate: oData.date,
                     Amount: parseFloat(oData.amount) || 0
                     // Weitere Felder nach Bedarf
                 });

                 // Warten bis der Request erfolgreich war
                 oContext.created().then(() => {
                     MessageToast.show("Antrag erfolgreich erstellt!");
                     this._oCreateDialog.close();
                     this._resetWizard();

                     // Liste aktualisieren
                     oModel.refresh();
                 }).catch((oError) => {
                     MessageBox.error("Fehler beim Erstellen: " + oError.message);
                 });
             },

             // Abbrechen-Button Handler
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

             // Wizard zurücksetzen
             _resetWizard: function() {
                 const oWizard =
   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "createRequestWizard");

                 if (oWizard) {
                     oWizard.discardProgress(oWizard.getSteps()[0]);

                     // Alle Felder leeren

   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "inputTitle").setValue("");

   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "inputDescription").setValue("");

   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "selectCategory").setSelectedKey("");

   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "inputDate").setValue("");

   sap.ui.core.Fragment.byId("antragsmanagement.antrag.manage.ext.CreateRequestWizard",
   "inputAmount").setValue("");
                 }
             }
         };
     });
