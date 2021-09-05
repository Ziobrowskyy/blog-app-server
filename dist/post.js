"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Post {
    constructor({ title, content, files }) {
        this.title = title;
        this.content = content;
        this.files = [];
        if (files instanceof Array)
            this.files = files.map(it => it.filename ? it.filename : "");
        this.hasContent = this.content.length > 0;
        this.hasFiles = this.files.length > 0;
    }
}
exports.default = Post;
//# sourceMappingURL=post.js.map