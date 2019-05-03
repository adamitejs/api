const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const CommandLineInterface = require("./cli");
const ApiInterface = require("./api");
const KeyRegistry = require("./registry/KeyRegistry");
const ServiceRegistry = require("./registry/ServiceRegistry");

class Adamite {
  constructor(config) {
    this.config = config;
    this.initializeDatabase();
    this.keys = new KeyRegistry(this);
    this.services = new ServiceRegistry(this);
    this.cli = new CommandLineInterface(this);
    this.api = new ApiInterface(this);
  }

  initializeDatabase() {
    if (!fs.existsSync("data")) fs.mkdirSync("data");
    this.db = low(new FileSync("data/api.json"));
    this.db.defaults({ keys: [] }).write();
  }

  log(component, message) {
    console.log(`[${component}]\t${message}`);
  }
}

module.exports = Adamite;
