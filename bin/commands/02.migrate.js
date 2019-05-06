module.exports = {
	command: "migrate",
	description: "Manages migration tasks. More inside.",
	builder: function(yargs) {
		return yargs
			.usage("Usage: $0 migrate <status|one|all|undo one|undo all> [options]")
			.commandDir("commands_migrate")
			.demandCommand(1, "")
  		.showHelpOnFail(true)
			.strict()
			.help();
	}
};
