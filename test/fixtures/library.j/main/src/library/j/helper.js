/*!
 * ${copyright}
 */
sap.ui.define([
	'sap/ui/model/json/JSONModel'
], function(JSONModel) {

	"use strict";

	return function(data) {
		return new JSONModel(data);
	};

});
