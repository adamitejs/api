const express = require('express');
const middleware = require('./middleware');
const routers = require('./routers');

class ApiInterface {
  constructor(arc) {
    this.arc = arc;
    this.start();
  }

  start() {
    this.app = express();
    
    middleware(this.app, this.arc);
    routers(this.app, this.arc);
    
    const server = this.app.listen(process.env.PORT || 8081, () => {
      const { address, port } = server.address();
      this.arc.log('api', `Server listening at ${address}:${port}`);
    });
  }
}

module.exports = ApiInterface;