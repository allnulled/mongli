module.exports = {
	command: "undo",
	description: "Rollbacks one or all seeders. More inside.",
	builder: function(yargs) {
		return yargs
			.usage("Usage: $0 seed undo <one|all> [options]")
			.commandDir("commands_seed_undo")
			.demandCommand(1, "")
  		.showHelpOnFail(true)
			.strict()
			.help();
	}
};