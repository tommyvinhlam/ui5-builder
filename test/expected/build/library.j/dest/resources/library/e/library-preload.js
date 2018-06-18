sap.ui.require.preload({
	"library/e/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"library.d","type":"library","embeds":[],"applicationVersion":{"version":"1.0.0"},"title":"Library E","description":"Library E","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.0","libs":{}},"library":{"i18n":false}}}',
	"library/e/some.js":function(){/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-xxx SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
console.log("HelloWorld");
}
});
