const express = require('express');
const middleware = require('./middleware');
const routers = require('./routers');

class ApiInterface {
  constructor(adamite) {
    this.adamite = adamite;
    this.start();
  }

  start() {
    this.app = express();
    
    middleware(this.app, this.adamite);
    routers(this.app, this.adamite);
    
    const server = this.app.listen(process.env.PORT || 9000, () => {
      const { address, port } = server.address();
      this.adamite.log('api', `Server listening at ${address}:${port}`);
    });
  }
}

module.exports = ApiInterface;