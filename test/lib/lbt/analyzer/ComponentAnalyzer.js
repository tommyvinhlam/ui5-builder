const {test} = require("ava");
const path = require("path");
const ComponentAnalyzer = require("../../../../lib/lbt/analyzer/ComponentAnalyzer");

const sinon = require("sinon");

function createMockPool(relPath, manifest) {
	const expectedPath = path.join(relPath, "manifest.json");
	return {
		async findResource(name) {
			if (name !== expectedPath) {
				throw new Error(`unexpected resource name: ${name}, expected ${expectedPath}`);
			}
			return {
				async buffer() {
					return JSON.stringify(manifest);
				}
			};
		}
	};
}

test("routing with empty config, routes, targets", async (t) => {
	const mockManifest = {
		"sap.ui5": {
			routing: {
				config: {},
				routes: [],
				targets: {}
			}
		}
	};

	const mockPool = createMockPool("test/", mockManifest);

	const mockInfo = {
		deps: [],
		addDependency(name) {
			this.deps.push(name);
		}
	};

	const subject = new ComponentAnalyzer(mockPool);
	await subject.analyze({name: path.join("test", "Component.js")}, mockInfo);

	t.deepEqual(mockInfo.deps, [
		"sap/ui/core/routing/Router.js"
	], "dependencies should be correct");
});

test("routing with empty config, targets", async (t) => {
	const mockManifest = {
		"sap.ui5": {
			routing: {
				config: {},
				targets: {}
			}
		}
	};

	const mockPool = createMockPool("test/", mockManifest);

	const mockInfo = {
		deps: [],
		addDependency(name) {
			this.deps.push(name);
		}
	};

	const subject = new ComponentAnalyzer(mockPool);
	await subject.analyze({name: path.join("test", "Component.js")}, mockInfo);

	t.deepEqual(mockInfo.deps, [
		"sap/ui/core/routing/Targets.js",
		"sap/ui/core/routing/Views.js"
	], "dependencies should be correct");
});

test("routing with targets but no routes", async (t) => {
	const mockManifest = {
		"sap.ui5": {
			routing: {
				config: {
					viewPath: "test.view",
					viewType: "XML"
				},
				targets: {
					test: {
						viewName: "App"
					}
				}
			}
		}
	};

	const mockPool = createMockPool("test/", mockManifest);

	const mockInfo = {
		deps: [],
		addDependency(name) {
			this.deps.push(name);
		}
	};

	const subject = new ComponentAnalyzer(mockPool);
	await subject.analyze({name: path.join("test", "Component.js")}, mockInfo);

	t.deepEqual(mockInfo.deps, [
		"sap/ui/core/routing/Targets.js",
		"sap/ui/core/routing/Views.js",
		"test/view/App.view.xml"
	], "dependencies should be correct");
});

test("routing with routes as array", async (t) => {
	const mockManifest = {
		"sap.ui5": {
			routing: {
				config: {
					viewPath: "test.view",
					viewType: "XML"
				},
				routes: [
					{
						name: "test",
						target: "test"
					}
				],
				targets: {
					test: {viewName: "App"}
				}
			}
		}
	};

	const mockPool = createMockPool("test/", mockManifest);

	const mockInfo = {
		deps: [],
		addDependency(name) {
			this.deps.push(name);
		}
	};

	const subject = new ComponentAnalyzer(mockPool);
	await subject.analyze({name: path.join("test", "Component.js")}, mockInfo);

	t.deepEqual(mockInfo.deps, [
		"sap/ui/core/routing/Router.js",
		"test/view/App.view.xml"
	], "dependencies should be correct");
});


test("routing with routes as object", async (t) => {
	const mockManifest = {
		"sap.ui5": {
			routing: {
				config: {
					viewPath: "test.view",
					viewType: "XML"
				},
				routes: {
					test: {
						target: "test"
					}
				},
				targets: {
					test: {viewName: "App"}
				}
			}
		}
	};

	const mockPool = createMockPool("test/", mockManifest);

	const mockInfo = {
		deps: [],
		addDependency(name) {
			this.deps.push(name);
		}
	};

	const subject = new ComponentAnalyzer(mockPool);
	await subject.analyze({name: path.join("test", "Component.js")}, mockInfo);

	t.deepEqual(mockInfo.deps, [
		"sap/ui/core/routing/Router.js",
		"test/view/App.view.xml"
	], "dependencies should be correct");
});

test("routing with route with multiple targets", async (t) => {
	const mockManifest = {
		"sap.ui5": {
			routing: {
				config: {
					viewPath: "test.view",
					viewType: "XML"
				},
				routes: {
					test: {
						target: ["test1", "test2"]
					}
				},
				targets: {
					test1: {viewName: "Master"},
					test2: {viewName: "Detail"}
				}
			}
		}
	};

	const mockPool = createMockPool("test/", mockManifest);

	const mockInfo = {
		deps: [],
		addDependency(name) {
			this.deps.push(name);
		}
	};

	const subject = new ComponentAnalyzer(mockPool);
	await subject.analyze({name: path.join("test", "Component.js")}, mockInfo);

	t.deepEqual(mockInfo.deps, [
		"sap/ui/core/routing/Router.js",
		"test/view/Master.view.xml",
		"test/view/Detail.view.xml"
	], "dependencies should be correct");
});

test("routing with targets with local config", async (t) => {
	const mockManifest = {
		"sap.ui5": {
			routing: {
				config: {
					viewPath: "test.view",
					viewType: "XML"
				},
				routes: {
					test1: {
						target: "test1"
					},
					test2: {
						target: "test2"
					}
				},
				targets: {
					test1: {
						viewName: "Master",
						viewType: "JS"
					},
					test2: {
						viewName: "Detail",
						viewPath: "test.subview"
					}
				}
			}
		}
	};

	const mockPool = createMockPool("test/", mockManifest);

	const mockInfo = {
		deps: [],
		addDependency(name) {
			this.deps.push(name);
		}
	};

	const subject = new ComponentAnalyzer(mockPool);
	await subject.analyze({name: path.join("test", "Component.js")}, mockInfo);

	t.deepEqual(mockInfo.deps, [
		"sap/ui/core/routing/Router.js",
		"test/view/Master.view.js",
		"test/subview/Detail.view.xml"
	], "dependencies should be correct");
});

test("rootView with object", (t) => {
	const mockManifest = {
		"sap.ui5": {
			rootView: {
				viewName: "test.view.App",
				type: "JS",
				async: true
			}
		}
	};

	const mockPool = createMockPool("test/", mockManifest);

	const mockInfo = {
		deps: [],
		addDependency(name) {
			this.deps.push(name);
		}
	};

	const subject = new ComponentAnalyzer(mockPool);
	return subject.analyze({name: path.join("test", "Component.js")}, mockInfo).then( () => {
		t.deepEqual(mockInfo.deps, [
			"test/view/App.view.js",
		], "dependencies should be correct");
	});
});

test("rootView with string", (t) => {
	const mockManifest = {
		"sap.ui5": {
			rootView: "test.view.App"
		}
	};

	const mockPool = createMockPool("test/", mockManifest);

	const mockInfo = {
		deps: [],
		addDependency(name) {
			this.deps.push(name);
		}
	};

	const subject = new ComponentAnalyzer(mockPool);
	return subject.analyze({name: path.join("test", "Component.js")}, mockInfo).then( () => {
		t.deepEqual(mockInfo.deps, [
			"test/view/App.view.xml",
		], "dependencies should be correct");
	});
});


test("analyze: with Component.js", async (t) => {
	const emptyPool = {};
	const analyzer = new ComponentAnalyzer(emptyPool);
	const name = "sap/ui/core/Component.js";
	const moduleInfo = {};
	const result = await analyzer.analyze({name}, moduleInfo);
	t.deepEqual(result, {}, "moduleInfo was not modified");
});

test("analyze: with manifest", async (t) => {
	const manifest = {
		"sap.ui5": {
		}
	};
	const mockPool = {
		async findResource() {
			return {
				buffer: async () => JSON.stringify(manifest)
			};
		}
	};

	const moduleInfo = {};

	const analyzer = new ComponentAnalyzer(mockPool);

	const stubAnalyzeManifest = sinon.stub(analyzer, "_analyzeManifest").resolves();

	const name = "MyComponent.js";
	await analyzer.analyze({name}, moduleInfo);

	t.true(stubAnalyzeManifest.calledOnce, "_analyzeManifest was called once");
	t.deepEqual(stubAnalyzeManifest.getCall(0).args[0], manifest,
		"_analyzeManifest should be called with the manifest");
});

test("analyze: without manifest", async (t) => {
	const mockPool = {
		async findResource() {
			return {
				buffer: async () => Promise.reject()
			};
		}
	};

	const moduleInfo = {};

	const analyzer = new ComponentAnalyzer(mockPool);

	const stubAnalyzeManifest = sinon.stub(analyzer, "_analyzeManifest").resolves();

	const name = "MyComponent.js";
	const result = await analyzer.analyze({name}, moduleInfo);

	t.false(stubAnalyzeManifest.called, "_analyzeManifest was not called");
	t.deepEqual(result, {}, "empty module info object expected since resource was not found (rejects)");
});

test("_analyzeManifest: empty Manifest", async (t) => {
	const manifest = {};

	const moduleInfo = {
		addDependency: function() {}
	};
	const stubAddDependency = sinon.spy(moduleInfo, "addDependency");

	const analyzer = new ComponentAnalyzer();

	await analyzer._analyzeManifest(manifest, moduleInfo);

	t.false(stubAddDependency.called, "addDependency was called once");
});

test("_analyzeManifest: Manifest with routing and routes array", async (t) => {
	const manifest = {
		"sap.ui5": {
			routing: {
				config: {
					viewPath: "test.view",
					viewType: "XML"
				},
				routes: [
					{
						name: "test",
						target: "test"
					}
				],
				targets: {
					test: {viewName: "App"}
				}
			}
		}
	};

	const moduleInfo = {
		addDependency: function() {}
	};
	const stubAddDependency = sinon.spy(moduleInfo, "addDependency");

	const analyzer = new ComponentAnalyzer();

	await analyzer._analyzeManifest(manifest, moduleInfo);

	t.deepEqual(stubAddDependency.callCount, 2, "addDependency was called twice");
	t.deepEqual(stubAddDependency.getCall(0).args[0], "sap/ui/core/routing/Router.js",
		"addDependency should be called with the router dependency name");
	t.deepEqual(stubAddDependency.getCall(1).args[0], "test/view/App.view.xml",
		"addDependency should be called with the app dependency name");
});

test("_analyzeManifest: Manifest with routing and routes object", async (t) => {
	const manifest = {
		"sap.ui5": {
			routing: {
				config: {
					viewPath: "test.view",
					viewType: "XML"
				},
				routes: {
					test: {
						target: "test"
					}
				},
				targets: {
					test: {viewName: "App"}
				}
			}
		}
	};

	const moduleInfo = {
		addDependency: function() {}
	};
	const stubAddDependency = sinon.spy(moduleInfo, "addDependency");

	const analyzer = new ComponentAnalyzer();

	await analyzer._analyzeManifest(manifest, moduleInfo);

	t.deepEqual(stubAddDependency.callCount, 2, "addDependency was called twice");
	t.deepEqual(stubAddDependency.getCall(0).args[0], "sap/ui/core/routing/Router.js",
		"addDependency should be called with the router dependency name");
	t.deepEqual(stubAddDependency.getCall(1).args[0], "test/view/App.view.xml",
		"addDependency should be called with the app dependency name");
});

test("_analyzeManifest: Manifest with rootview object", async (t) => {
	const manifest = {
		"sap.ui5": {
			rootView: {
				viewName: "test.view.App",
				type: "JS",
				async: true
			}
		}
	};

	const moduleInfo = {
		addDependency: function() {}
	};
	const stubAddDependency = sinon.spy(moduleInfo, "addDependency");

	const analyzer = new ComponentAnalyzer();

	await analyzer._analyzeManifest(manifest, moduleInfo);

	t.true(stubAddDependency.calledOnce, "addDependency was called once");
	t.deepEqual(stubAddDependency.getCall(0).args[0], "test/view/App.view.js",
		"addDependency should be called with the dependency name");
});

test("_analyzeManifest: Manifest with rootview string", async (t) => {
	const manifest = {
		"sap.ui5": {
			rootView: "test.view.App"
		}
	};

	const moduleInfo = {
		addDependency: function() {}
	};
	const stubAddDependency = sinon.spy(moduleInfo, "addDependency");

	const analyzer = new ComponentAnalyzer();
	await analyzer._analyzeManifest(manifest, moduleInfo);

	t.true(stubAddDependency.calledOnce, "addDependency was called once");
	t.deepEqual(stubAddDependency.getCall(0).args[0], "test/view/App.view.xml",
		"addDependency should be called with the dependency name");
});

test("_analyzeManifest: Manifest with dependency libs", async (t) => {
	const manifest = {
		"sap.ui5": {
			"dependencies": {
				"libs": {
					"sap.ui.core": {}
				}
			}
		}
	};

	const moduleInfo = {
		addDependency: function() {}
	};
	const stubAddDependency = sinon.spy(moduleInfo, "addDependency");

	const analyzer = new ComponentAnalyzer();
	await analyzer._analyzeManifest(manifest, moduleInfo);

	t.true(stubAddDependency.calledOnce, "addDependency was called once");
	t.deepEqual(stubAddDependency.getCall(0).args[0], "sap/ui/core/library.js",
		"addDependency should be called with the dependency name");
});

test("_analyzeManifest: Manifest with dependency components", async (t) => {
	const manifest = {
		"sap.ui5": {
			"dependencies": {
				"components": {
					"sap.ui.test.manifestload": {}
				}
			}
		}
	};

	const moduleInfo = {
		addDependency: function() {}
	};
	const stubAddDependency = sinon.spy(moduleInfo, "addDependency");

	const analyzer = new ComponentAnalyzer();
	await analyzer._analyzeManifest(manifest, moduleInfo);

	t.true(stubAddDependency.calledOnce, "addDependency was called once");
	t.deepEqual(stubAddDependency.getCall(0).args[0], "sap/ui/test/manifestload/Component.js",
		"addDependency should be called with the dependency name");
});

test("_analyzeManifest: Manifest with models", async (t) => {
	const manifest = {
		"sap.ui5": {
			"models": {
				"i18n": {
					"type": "sap.ui.model.resource.ResourceModel"
				}
			}
		}
	};

	const moduleInfo = {
		addDependency: function() {}
	};
	const stubAddDependency = sinon.spy(moduleInfo, "addDependency");

	const analyzer = new ComponentAnalyzer();
	await analyzer._analyzeManifest(manifest, moduleInfo);

	t.true(stubAddDependency.calledOnce, "addDependency was called once");
	t.deepEqual(stubAddDependency.getCall(0).args[0], "sap/ui/model/resource/ResourceModel.js",
		"addDependency should be called with the dependency name");
});
