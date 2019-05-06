module.exports = {
	command: "project",
	description: "Generates a new mongli project.",
	builder: function(yargs) {
		return yargs
			.usage("Usage: $0 generate project [opts]")
			.option("basepath", {
				alias: "base",
				type: "string",
				describe: "Specifies the base path of the new project.",
				demand: false,
				nargs: 1,
				default: process.cwd()
			})
			.strict()
			.help()
			.epilogue(`This command will create the following files and folders in your current directory (or, if specified, under the --basepath parameter):
	- .monglirc: initial settings.
	- db/mongli-config.js: database connection settings.
	- db/mongli-status.json: migrations and seeders current status.
	- db/migrations: migrations folder.
	- db/seeders: seeders folder.
`);
	},
	handler: (argv) => {
		require(argv.mongli_project_folder + "/src/mongli.js")
			.create(argv)
			.setup()
			.execute();
	}
};
