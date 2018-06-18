sap.ui.require.preload({
	"application/g/manifest.json":'{"_version":"1.1.0","sap.app":{"_version":"1.1.0","id":"application.g","type":"application","applicationVersion":{"version":"1.2.2"},"embeds":["embedded"],"title":"{{title}}"}}'
});
sap.ui.loader.config({depCacheUI5:{
"application/g/Component.js": ["sap/ui/core/UIComponent.js"]
}});
