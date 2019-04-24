const vorpal = require('vorpal')();
const keys = require('./commands/keys');

class CommandLineInterface {
  constructor(arc) {
    this.arc = arc;
    this.start();
  }

  start() {
    keys(this.arc, vorpal);

    vorpal
      .delimiter(`${this.arc.config.name}$`)
      .show();
  }
}

module.exports = CommandLineInterface;