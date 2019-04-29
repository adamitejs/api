const vorpal = require('vorpal')();
const keys = require('./commands/keys');

class CommandLineInterface {
  constructor(adamite) {
    this.adamite = adamite;
    this.start();
  }

  start() {
    keys(this.adamite, vorpal);

    vorpal
      .delimiter(`${this.adamite.config.name}$`)
      .show();
  }
}

module.exports = CommandLineInterface;