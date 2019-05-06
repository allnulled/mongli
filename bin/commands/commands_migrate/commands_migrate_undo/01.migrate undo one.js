module.exports = {
  command: "one",
  description: "Rollbacks one migration.",
  builder: {},
  handler: argv => {
    require(argv.mongli_project_folder + "/src/mongli.js").create(argv).setup().execute();
  }
};