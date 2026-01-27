sap.ui.define([], () => {
    "use strict";

    return {
        AppointmentType(sType) {
            switch (sType) {
                case "Sick":
                    return "Type01";
                case "HU": // halber Urlaubstag
                    return "Type02";
                case "SU": // Sonderurlaub
                    return "Type03";
                case "U":  // Urlaub
                    return "Type04";
                case "UP": // Urlaub (geplant)
                    return "Type05";
                case "HP": // halber Tag (geplant)
                    return "Type06";
                case "Special":
                    return "Type07";
                default:
                    return "Type20";
            }
        },
        AppointmentIcon(sType) {
            switch (sType) {
                case "Sick":
                    return "sap-icon://temperature";
                case "HU": // halber Urlaubstag
                    return "sap-icon://general-leave-request";
                case "SU": // Sonderurlaub
                    return "sap-icon://create-leave-request";
                case "U":  // Urlaub
                    return "sap-icon://general-leave-request";
                case "UP": // Urlaub (geplant)
                    return "sap-icon://general-leave-request";
                case "HP": // halber Tag (geplant)
                    return "sap-icon://general-leave-request";
                case "Special":
                    return "sap-icon://study-leave";
                default:
                    return "sap-icon://incident";
            }
        }
    };
});