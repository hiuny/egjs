/*global module:false*/
function getConfig(name){
	return require("./config/"+name);
}

module.exports = function(grunt) {
	"use strict";
	require("time-grunt")(grunt);
	require("load-grunt-tasks")(grunt);
	grunt.loadNpmTasks("testee");

	var config = {
		"pkg": grunt.file.readJSON("package.json"),
		"clean": getConfig("clean"),
		"gitinfo": grunt.task.run("exec:gitinfo"),
		"banner": getConfig("banner"),
		"exec": getConfig("exec"),
		"concat": getConfig("concat"),
		"copy": getConfig("copy"),
		"jscs": getConfig("jscs"),
		"jsdoc": getConfig("jsdoc"),
		"jshint": getConfig("jshint"),
		"qunit": getConfig("qunit"),
		"testee": getConfig("testee"),
		"uglify": getConfig("uglify"),
		"watch": getConfig("watch")
	};

	grunt.initConfig(config);

	grunt.registerTask("test", function() {
		var eachfile = Array.prototype.slice.apply(arguments);
		if(eachfile.length) {
			eachfile = eachfile.map(function(v) {
				return "test/" + v + ".test.html";
			}, this);
		} else {
			eachfile.push("test/*.test.html");
		}
		grunt.config.set("qunit.each", eachfile);
		grunt.log.oklns(grunt.config.get("qunit.each"));
		grunt.task.run("qunit:each");
	});

	grunt.registerTask("validate-commit", function() {
		var fs = require("fs");
		if (grunt.file.exists(".git/hooks/commit-msg")) {
			grunt.file["delete"](".git/hooks/commit-msg", { force: true });
		}
		grunt.file.copy("config/validate-commit-msg.js", ".git/hooks/commit-msg", { force: true });
		fs.chmodSync(".git/hooks/commit-msg", "755");
	});

	grunt.registerTask("docBuild", ["copy:doc", "clean:doc", "jsdoc"]);
	grunt.registerTask("build", ["validate-commit", "concat", "uglify", "clean:pkgd", "docBuild"]);
	grunt.registerTask("default", ["jshint", "jscs", "build", "test"]);
	grunt.registerTask("check", ["jshint", "jscs", "test"]);
	grunt.registerTask("changelog", ["exec:changelog"]);
};