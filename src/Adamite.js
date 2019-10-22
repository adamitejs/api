const fs = require("fs");
const low = require("lowdb");
const chalk = require("chalk");
const FileSync = require("lowdb/adapters/FileSync");
const CommandLineInterface = require("./cli");
const ApiInterface = require("./api");
const KeyRegistry = require("./registry/KeyRegistry");
const ServiceRegistry = require("./registry/ServiceRegistry");

class Adamite {
  constructor(config) {
    this.config = config;
    this.keys = new KeyRegistry(this);
    this.services = new ServiceRegistry(this);
    this.api = new ApiInterface(this);
    this.initializeDatabase();
  }

  initializeDatabase() {
    if (!fs.existsSync("data")) fs.mkdirSync("data");
    const apiJsonExists = fs.existsSync("data/api.json");

    this.db = low(new FileSync("data/api.json"));
    this.db.defaults({ keys: [] }).write();

    if (!apiJsonExists) {
      this.log("api", `👋   ${chalk.green("a new API key has been generated and can be viewed in data/api.json")}`);

      this.keys.addKey(); // add a default API key
    }
  }

  log(component, message) {
    console.log(`[${component}]\t${message}`);
  }
}

module.exports = Adamite;
