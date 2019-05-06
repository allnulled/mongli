module.exports = {
  command: "status",
  description: "Shows the status of the migrations.",
  builder: {},
  handler: argv => {
    require(argv.mongli_project_folder + "/src/mongli.js").create(argv).setup().execute();
  }
};