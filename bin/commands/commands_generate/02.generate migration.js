module.exports = {
	command: "migration",
	description: "Generates a file for a new migration.",
	builder: function(yargs) {
		return yargs
			.usage("Usage: $0 generate migration [opts]")
			.option("name", {
				type: "string",
				describe: "Specifies the name of the new migration.",
				demand: false,
				nargs: 1,
				default: undefined
			})
			.strict()
			.help();
	},
	handler: (argv) => {
		require(argv.mongli_project_folder + "/src/mongli.js")
			.create(argv)
			.setup()
			.execute();
	}
};
