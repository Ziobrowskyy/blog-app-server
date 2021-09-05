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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const Database = __importStar(require("./database"));
const api = __importStar(require("./api"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 8000;
app.use("/static", express_1.default.static("uploads"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use((0, cors_1.default)());
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const suffix = Date.now();
        cb(null, suffix + file.originalname);
    }
});
const imageUpload = (0, multer_1.default)({ storage: storage }).array("files");
app.use(express_1.default.static(path_1.default.join(__dirname, "../../blog-app/build")));
Database.init(err => {
    console.warn("Failed to connect to database!");
    throw (err);
});
app.post("/api/post", imageUpload, api.createPost);
app.put("/api/post/:id", api.updatePost);
app.delete("/api/post/:id", api.deletePost);
app.get("/api/post/:id", api.getPost);
app.get("/api/posts", api.getAllPosts);
app.get("/api/", api.testConnection);
app.listen(port, () => {
    console.log(__dirname);
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map