"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.init = void 0;
const mongodb_1 = require("mongodb");
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'portal';
const collectionName = "entries";
const client = new mongodb_1.MongoClient(`${mongoUrl}/${dbName}/${collectionName}`, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = undefined;
function init() {
    client.connect((err, db) => {
        if (err)
            throw err;
        const database = db.db(dbName);
        collection = database.collection(collectionName);
    });
}
exports.init = init;
function getDb() {
    return collection;
}
exports.getDb = getDb;
//# sourceMappingURL=dbHook.js.map