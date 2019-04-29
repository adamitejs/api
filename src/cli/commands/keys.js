const Table = require('cli-table');

module.exports = function(adamite, vorpal) {
  const logKeys = (keys) => {
    const table = new Table({ head: ['ID', 'Key', 'Origins', 'Created']});
    table.push(...keys.map(k => ([k.id, k.key, k.origins.join(', '), k.createdAt])));
    console.log(table.toString());
  };

  vorpal
    .command('keys:list', 'Lists registered keys.')
    .action(function(args, callback) {
      logKeys(adamite.keys.getKeys());
      callback();
    });

  vorpal
    .command('keys:add [origins...]', 'Adds a key.')
    .action(function(args, callback) {
      const newKey = adamite.keys.addKey(args.origins);
      logKeys([newKey]);
      callback();
    });

  vorpal
    .command('keys:check <key>', 'Checks if a key is valid.')
    .option('--origin <origin>')
    .action(function(args, callback) {
      const matchingKey = adamite.keys.findKey(args.key);
      
      if (!matchingKey || (args.options.origin && !matchingKey.origins.includes(args.options.origin))) {
        console.log('\n👎  INVALID key: ' + args.key + '\n');
        return callback();
      }

      logKeys([matchingKey]);
      callback();
    });
};