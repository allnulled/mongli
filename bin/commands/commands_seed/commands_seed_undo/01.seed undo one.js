module.exports = {
  command: "undo one",
  description: "Rollbacks one committed seeder.",
  builder: {},
  handler: argv => {
    require(argv.mongli_project_folder + "/src/mongli.js").create(argv).setup().execute();
  }
};