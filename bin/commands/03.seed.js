module.exports = {
	command: "seed",
	description: "Manages seeder tasks. More inside.",
	builder: function(yargs) {
		return yargs
			.usage("Usage: $0 seed <status|one|all|undo:one|undo:all> [options]")
			.commandDir("commands_migrate")
			.demandCommand(1, "")
  		.showHelpOnFail(true)
			.strict()
			.help();
	}
};
