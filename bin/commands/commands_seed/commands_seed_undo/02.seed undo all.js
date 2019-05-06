module.exports = {
  command: "undo all",
  description: "Rollbacks all committed seeders.",
  builder: {},
  handler: argv => {
    require(argv.mongli_project_folder + "/src/mongli.js").create(argv).setup().execute();
  }
};