const mongoose = require('mongoose');
const shortId = require('shortid');

const shortUrlSchema = new mongoose.Schema({
    createdby: {
        type: String,
        required: true,
        default: "Guest",
    },
    full: {
        type: String,
        required: true,
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate,
    },
    state: {
        type: Boolean,
        required: true,
        default: true,
    },
    count: {
        type: Number,
        default: 0,
    },
    visits: [
        {
            ip: { type: String },
            time: { type: Date, default: Date.now },
            browserInfo: {
                browser: { type: String, required: false },
                version: { type: String, required: false },
                os: { type: String, required: false },
            },
        },
    ],
}, { versionKey: false });

module.exports = mongoose.model('ShortUrl', shortUrlSchema);
