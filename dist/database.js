"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.init = void 0;
const mongodb_1 = require("mongodb");
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'portal';
const collectionName = "entries";
const client = new mongodb_1.MongoClient(`${mongoUrl}/${dbName}/${collectionName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let collection = undefined;
function init(callback = undefined) {
    client.connect((err, db) => {
        if (err) {
            console.warn(err);
            if (callback)
                callback(err);
        }
        collection = db.db(dbName).collection(collectionName);
    });
}
exports.init = init;
function getDb() {
    if (!collection)
        throw new Error("MongoDB collection must be initialized first!");
    return collection;
}
exports.getDb = getDb;
//# sourceMappingURL=database.js.map