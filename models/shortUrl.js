const mongoose = require('mongoose');
const shortId = require('shortid');

const shortUrlSchema = new mongoose.Schema({
    createdby : {
    type:String,
    required: true,
    default : "Guest"
    },
    full : {
        type:String,
        required: true,
    },
    short : {
        type:String,
        required: true,
        default: shortId.generate,
    },

},
{ versionKey: false }
);

module.exports = mongoose.model('ShortUrl' , shortUrlSchema);