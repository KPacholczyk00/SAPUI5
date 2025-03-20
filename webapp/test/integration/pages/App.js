sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/PropertyStrictEquals"
], function (Opa5, Press, PropertyStrictEquals) {
    "use strict";

    return Opa5.createPageObjects({
        onTheAppPage: {
            actions: {
                iPressTheAddOrderButton: function () {
                    return this.waitFor({
                        id: "addOrderButton",
                        actions: new Press(),
                        errorMessage: "Nie można znaleźć przycisku dodawania zamówienia"
                    });
                }
            },
            assertions: {
                iShouldSeeTheOrderList: function () {
                    return this.waitFor({
                        controlType: "sap.m.List",
                        matchers: new PropertyStrictEquals({ name: "visible", value: true }),
                        success: function () {
                            Opa5.assert.ok(true, "Lista zamówień jest widoczna");
                        },
                        errorMessage: "Lista zamówień nie jest widoczna"
                    });
                }
            }
        }
    });
});
