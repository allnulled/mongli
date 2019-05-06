const exec = require("execute-command-sync");
const fs = require("fs-extra");
const rimraf = require("rimraf");
const globby = require("globby");
const { expect, assert } = require("chai");

describe("Mongli CLI", function() {

	this.timeout(20 * 1000);

	before(function() {
		rimraf.sync(__dirname + "/testing/db");
		rimraf.sync(__dirname + "/testing/.monglirc");
	});

	after(function() {
		rimraf.sync(__dirname + "/testing/db");
		rimraf.sync(__dirname + "/testing/.monglirc");
	});
	
	it("can mongli generate project and generate corresponding files", function(doneTest) {
		exec("mongli generate project --basepath .", {cwd: __dirname + "/testing"});
		expect(fs.existsSync(__dirname + "/testing/.monglirc")).to.equal(true);
		expect(fs.existsSync(__dirname + "/testing/db/mongli-config.js")).to.equal(true);
		expect(fs.existsSync(__dirname + "/testing/db/mongli-status.json")).to.equal(true);
		return doneTest();
	});

  it("can mongli generate migration", function(doneTest) {
  	exec("mongli generate migration", {cwd: __dirname + "/testing"});
  	exec("mongli generate migration --name second", {cwd: __dirname + "/testing"});
  	exec("mongli generate migration --name third", {cwd: __dirname + "/testing"});
  	const migrations = fs.readdirSync(__dirname + "/testing/db/migrations");
  	expect(migrations.length).to.equal(3);
  	expect(/^([0-9][0-9][0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]\-[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9])\.unnamed\.js$/g.test(migrations[0])).to.equal(true);
  	// rimraf.sync(__dirname + "/testing/db/migrations/*.js");
  	return doneTest();
  });

  it("can mongli generate seeder", function(doneTest) {
  	exec("mongli generate seeder", {cwd: __dirname + "/testing"});
  	exec("mongli generate seeder --name second", {cwd: __dirname + "/testing"});
  	exec("mongli generate seeder --name third", {cwd: __dirname + "/testing"});
  	const seeders = fs.readdirSync(__dirname + "/testing/db/seeders");
  	expect(seeders.length).to.equal(3);
  	expect(/^([0-9][0-9][0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]\-[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9])\.unnamed\.js$/g.test(seeders[0])).to.equal(true);
  	// rimraf.sync(__dirname + "/testing/db/seeders/*.js");
  	return doneTest();
  });

  it("can mongli migrate status", function(doneTest) {
  	exec("mongli migrate status", {cwd: __dirname + "/testing"});
  	// @NOTDONE: test only the console's output...
  	return doneTest();
  });

  it("can mongli migrate one", function(doneTest) {
  	const unnamed = globby.sync(__dirname + "/testing/db/migrations/*.unnamed.js");
  	const second = globby.sync(__dirname + "/testing/db/migrations/*.second.js");
  	const third = globby.sync(__dirname + "/testing/db/migrations/*.third.js");
  	fs.copyFileSync(__dirname + "/testing/test_default_files/migrations/unnamed.js", unnamed[0]);
  	fs.copyFileSync(__dirname + "/testing/test_default_files/migrations/second.js", second[0]);
  	fs.copyFileSync(__dirname + "/testing/test_default_files/migrations/third.js", third[0]);
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).migrationsExecuted.length).to.equal(0);
  	exec("mongli migrate one", {cwd: __dirname + "/testing"});
  	expect(require(__dirname + "/testing/db/mongli-status.json").migrationsExecuted.length).to.equal(1);
  	return doneTest();
  });

  it("can mongli migrate all", function(doneTest) {
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).migrationsExecuted.length).to.equal(1);
  	exec("mongli migrate all", {cwd: __dirname + "/testing"});
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).migrationsExecuted.length).to.equal(3);
  	return doneTest();
  });

  it("can mongli migrate undo one", function(doneTest) {
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).migrationsExecuted.length).to.equal(3);
  	exec("mongli migrate undo one", {cwd: __dirname + "/testing"});
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).migrationsExecuted.length).to.equal(2);
  	return doneTest();
  });

  it("can mongli migrate undo all", function(doneTest) {
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).migrationsExecuted.length).to.equal(2);
  	exec("mongli migrate undo all", {cwd: __dirname + "/testing"});
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).migrationsExecuted.length).to.equal(0);
  	return doneTest();
  });

  it("can mongli seed status", function(doneTest) {
  	exec("mongli seed status", {cwd: __dirname + "/testing"});
  	// @NOTDONE: test only the console's output...
  	return doneTest();
  });

  it("can mongli seed one", function(doneTest) {
  	const unnamed = globby.sync(__dirname + "/testing/db/seeders/*.unnamed.js");
  	const second = globby.sync(__dirname + "/testing/db/seeders/*.second.js");
  	const third = globby.sync(__dirname + "/testing/db/seeders/*.third.js");
  	fs.copyFileSync(__dirname + "/testing/test_default_files/seeders/unnamed.js", unnamed[0]);
  	fs.copyFileSync(__dirname + "/testing/test_default_files/seeders/second.js", second[0]);
  	fs.copyFileSync(__dirname + "/testing/test_default_files/seeders/third.js", third[0]);
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).seedersExecuted.length).to.equal(0);
  	exec("mongli seed one", {cwd: __dirname + "/testing"});
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).seedersExecuted.length).to.equal(1);
  	return doneTest();
  });

  it("can mongli seed all", function(doneTest) {
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).seedersExecuted.length).to.equal(1);
  	exec("mongli seed all", {cwd: __dirname + "/testing"});
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).seedersExecuted.length).to.equal(3);
  	return doneTest();
  });

  it("can mongli seed undo one", function(doneTest) {
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).seedersExecuted.length).to.equal(3);
  	exec("mongli seed undo one", {cwd: __dirname + "/testing"});
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).seedersExecuted.length).to.equal(2);
  	return doneTest();
  });

  it("can mongli seed undo all", function(doneTest) {
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).seedersExecuted.length).to.equal(2);
  	exec("mongli seed undo all", {cwd: __dirname + "/testing"});
  	expect(JSON.parse(fs.readFileSync(__dirname + "/testing/db/mongli-status.json").toString()).seedersExecuted.length).to.equal(0);
  	return doneTest();
  });

});