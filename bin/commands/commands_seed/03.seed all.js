module.exports = {
  command: "all",
  description: "Commits all pending seeders.",
  builder: {},
  handler: argv => {
    require(argv.mongli_project_folder + "/src/mongli.js").create(argv).setup().execute();
  }
};