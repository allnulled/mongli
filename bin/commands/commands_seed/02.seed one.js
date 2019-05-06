module.exports = {
  command: "one",
  description: "Commits one pending seeder.",
  builder: {},
  handler: argv => {
    require(argv.mongli_project_folder + "/src/mongli.js").create(argv).setup().execute();
  }
};