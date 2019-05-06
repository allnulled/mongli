module.exports = {
	command: "undo",
	description: "Rollbacks one or all migrations. More inside.",
	builder: function(yargs) {
		return yargs
			.usage("Usage: $0 migrate undo <one|all> [options]")
			.commandDir("commands_migrate_undo")
			.demandCommand(1, "")
  		.showHelpOnFail(true)
			.strict()
			.help();
	}
};
