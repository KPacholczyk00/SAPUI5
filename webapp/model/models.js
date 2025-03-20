sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";

    return {
        createOrderModel: function () {
            var oModel = new JSONModel();
            oModel.loadData("./model/Orders.json");
            return oModel;
        }
    };
});
