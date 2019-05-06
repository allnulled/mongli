module.exports = {
	command: "generate",
	description: "Generates things. More inside.",
	builder: function(yargs) {
		return yargs
			.usage("Usage: $0 generate <migration|seeder|project> [options]")
			.commandDir("commands_generate")
			.demandCommand(1, "")
  		.showHelpOnFail(true)
			.strict()
			.help();
	}
};
