const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({

    userId: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default: "https://imgs.search.brave.com/zj90E50IZp3mj8hkD-9psGbC7iNGqwcxwZuQZNHQ0To/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cnlyb2IuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIyLzAy/L0hvdy10by1QaWNr/LXRoZS1SaWdodC1J/bWFnZXMtdG8tVXNl/LW9uLVlvdXItQmxv/Zy1TdG9jay1JbWFn/ZS1FeGFtcGxlLnBu/Zw"
    },

    category: {
        type: String,
        default: "uncategorized"
    },

    slug: {
        type: String,
        required: true
    }

}, { timestamps: true });

const postModel = model("Post", postSchema);

module.exports = postModel;
