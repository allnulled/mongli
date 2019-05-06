module.exports = {
	command: "seeder",
	description: "Generates a file for a new seeder.",
	builder: function(yargs) {
		return yargs
			.usage("Usage: $0 generate seeder [opts]")
			.option("name", {
				type: "string",
				describe: "Specifies the name of the new seeder.",
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
