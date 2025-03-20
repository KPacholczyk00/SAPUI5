sap.ui.define([
    "sap/ui/test/opaQunit",
    "sapui5/test/integration/arrangements/Startup",
    "sapui5/test/integration/pages/App"
], function (opaTest, Startup, App) {
    "use strict";

    QUnit.module("Navigation");

    opaTest("Powinienem zobaczyć listę zamówień", function (Given, When, Then) {
        Given.iStartMyApp();
        Then.onTheAppPage.iShouldSeeTheOrderList();
    });
});
