/*
 * hierarchy-test.js: Basic tests for hierarchical file stores.
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

var fs = require("fs");
var path = require("path");
var spawn = require("child_process").spawn;
var nconf = require("../lib/nconf");

var configDir = path.join(__dirname, "fixtures", "hierarchy");
var globalConfig = path.join(configDir, "global.json");
var userConfig = path.join(configDir, "user.json");

describe("nconf/hierarchy, When using nconf", () => {
  it("configured with two file stores, should have the appropriate keys present", () => {
    nconf.add("user", { type: "file", file: userConfig });
    nconf.add("global", { type: "file", file: globalConfig });
    nconf.load();

    expect(nconf.get("title")).toEqual("My specific title");
    expect(nconf.get("color")).toEqual("green");
    expect(nconf.get("movie")).toEqual("Kill Bill");
  });
  it("configured with two file stores using `file` should have the appropriate keys present", () => {
    nconf.file("user", userConfig);
    nconf.file("global", globalConfig);
    nconf.load();

    expect(nconf.get("title")).toEqual("My specific title");
    expect(nconf.get("color")).toEqual("green");
    expect(nconf.get("movie")).toEqual("Kill Bill");
  });

  it("configured with .file() and invoked with nested command line options, should merge nested objects", (done) => {
    var script = path.join(
      __dirname,
      "fixtures",
      "scripts",
      "nconf-hierarchical-load-merge.js"
    );
    var data = "";

    var child = spawn("node", [script]);

    child.stdout.on("data", function (d) {
      data += d;
    });

    child.on("close", function () {
      expect(JSON.parse(data)).toEqual({
        apples: true,
        candy: {
          something: "file1",
          something1: true,
          something2: true,
          something5: {
            first: 1,
            second: 2,
          },
        },
      });
      done();
    });
  });

  it("configured with .file() and invoked with nested command line options should merge nested objects", (done) => {
    var script = path.join(
      __dirname,
      "fixtures",
      "scripts",
      "nconf-hierarchical-load-merge-with-separator.js"
    );
    var data = "";
    process.env.candy__bonbon = "sweet";
    var child = spawn("node", [script], { env: process.env });
    delete process.env.candy__bonbon;
    child.stdout.on("data", function (d) {
      data += d;
    });

    child.on("close", function () {
      expect(JSON.parse(data)).toEqual({
        apples: true,
        candy: {
          bonbon: "sweet",
          something: "file1",
          something1: true,
          something2: true,
          something5: {
            first: 1,
            second: 2,
          },
        },
      });
      done();
    });
  });

  it("configured with .file(), .defaults() should deep merge objects should merge nested objects ", (done) => {
    var script = path.join(
      __dirname,
      "fixtures",
      "scripts",
      "nconf-hierarchical-defaults-merge.js"
    );
    var data = "";
    var child = spawn("node", [script]);

    child.stdout.on("data", function (d) {
      data += d;
    });

    child.on("close", function () {
      expect(JSON.parse(data)).toEqual({
        candy: {
          something: "much better something for you",
          something1: true,
          something2: true,
          something18: "completely unique",
          something5: {
            first: 1,
            second: 99,
          },
        },
      });
      done();
    });
  });
});
