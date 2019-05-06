module.exports = {
  command: "all",
  description: "Rollbacks all committed migrations.",
  builder: {},
  handler: argv => {
    require(argv.mongli_project_folder + "/src/mongli.js").create(argv).setup().execute();
  }
};