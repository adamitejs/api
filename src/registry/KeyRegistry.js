const uuid = require("uuid");

class KeyRegistry {
  constructor(adamite) {
    this.adamite = adamite;
  }

  getAdminUsers() {
    return this.adamite.config.api.admins;
  }

  getSecret() {
    return this.adamite.config.api.secret;
  }

  getKeys() {
    return this.adamite.db.get("keys").value();
  }

  findKey(key, origin) {
    const keys = this.adamite.db.get("keys");
    const matchingKey = keys.find({ key }).value();

    if (!matchingKey) {
      return null;
    }

    if (matchingKey.origins && matchingKey.origins.length > 0 && !matchingKey.origins.includes(origin)) {
      return null;
    }

    return matchingKey;
  }

  addKey(origins = []) {
    const keys = this.adamite.db.get("keys");

    const randomId = uuid.v4();
    const randomKey = Buffer.from(uuid.v4()).toString("base64");

    const newKey = {
      id: randomId,
      key: randomKey,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      origins
    };

    keys.push(newKey).write();
    return newKey;
  }

  regenerateKey(id) {
    const randomKey = Buffer.from(uuid.v4()).toString("base64");
    const keys = this.adamite.db.get("keys");

    keys
      .find({ id })
      .set({
        key: randomKey,
        updatedAt: Date.now()
      })
      .write();
  }
}

module.exports = KeyRegistry;
