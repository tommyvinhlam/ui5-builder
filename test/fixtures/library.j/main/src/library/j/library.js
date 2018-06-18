/*!
 * ${copyright}
 */
sap.ui.define([
	'sap/ui/core/Core'
], function(Core) {

	"use strict";

	sap.ui.getCore().initLibrary({
		name : "library.j",
		version: "${version}",
		dependencies : ["sap.ui.core"]
	});

	return thisLib;

});
