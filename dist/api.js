"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.getAllPosts = exports.getPost = exports.deletePost = exports.updatePost = exports.createPost = void 0;
const Database = __importStar(require("./database"));
const post_1 = __importDefault(require("./post"));
function createPost(req, res) {
    const post = new post_1.default(Object.assign(Object.assign({}, req.body), { files: req.files }));
    Database.getDb().insertOne(post).then((successResult) => {
        res.status(200).json({
            "success": true,
            "message": successResult
        });
    }, (failMessage) => {
        res.status(400).json({
            "success": false,
            "message": "Failed to add data to database. " + failMessage
        });
    });
}
exports.createPost = createPost;
function updatePost(req, res) {
    const postId = req.body.id;
    if (!req.body.params.id) {
        res.status(400).json({
            "success": false,
            "message": "Missing body parameters"
        });
    }
    Database.getDb().updateOne({ _id: postId }, {}).then((successResult) => {
        res.status(200).json({
            "success": true,
            "message": successResult
        });
    }, (failMessage) => {
        res.status(400).json({
            "success": false,
            "message": "Failed to update. " + failMessage
        });
    });
}
exports.updatePost = updatePost;
function deletePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database.getDb().deleteOne({ _id: req.body.id }).then((successResult) => {
            res.status(200).json({
                "success": true,
                "message": successResult
            });
        }, (failMessage) => {
            res.status(400).json({
                "success": false,
                "message": "Failed to delete document. " + failMessage
            });
        });
    });
}
exports.deletePost = deletePost;
function getPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        Database.getDb().findOne({ _id: req.body.id }).then((successResult) => {
            res.status(200).json({
                "success": true,
                "message": successResult,
                "data": JSON.stringify(successResult)
            });
        }, (failMessage) => {
            res.status(400).json({
                "success": false,
                "message": "Failed to find document. " + failMessage
            });
        });
    });
}
exports.getPost = getPost;
function getAllPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const documents = yield Database.getDb().find().toArray();
        if (documents) {
            res.status(200).json({
                "success": true,
                "message": "",
                "data": JSON.stringify(documents)
            });
        }
        else {
            res.status(400).json({
                "success": false,
                "message": "Failed to find documents"
            });
        }
    });
}
exports.getAllPosts = getAllPosts;
function testConnection(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {};
        const options = {};
        const cursor = yield Database.getDb().find(query, options);
        const data = yield cursor.map(it => {
            return {
                title: it.title,
                content: it.content,
                type: it.content,
                images: it.images
            };
        }).toArray();
        res.json(data);
    });
}
exports.testConnection = testConnection;
//# sourceMappingURL=api.js.map