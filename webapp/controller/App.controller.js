sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("sapui5.controller.App", {
        onInit: function () {
            var oView = this.getView();
            var oModel = new JSONModel();
            this.loadOrders(oModel);
            oView.setModel(oModel);
        },

        loadOrders: function (oModel) {
            fetch("http://127.0.0.1:3002/orders")
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Błąd pobierania danych: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    data.newOrder = { name: "", person: "", city: "" };
                    oModel.setData(data);
                })
                .catch(error => {
                    console.error("Błąd ładowania zamówień:", error);
                    MessageToast.show("Błąd ładowania zamówień");
                });
        }
    });
});
