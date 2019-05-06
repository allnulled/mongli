module.exports = {
  command: "one",
  description: "Commits one pending migration.",
  builder: {},
  handler: argv => {
    require(argv.mongli_project_folder + "/src/mongli.js").create(argv).setup().execute();
  }
};