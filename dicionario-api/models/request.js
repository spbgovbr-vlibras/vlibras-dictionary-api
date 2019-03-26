var mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

var host = process.env.DB_HOST;

var port = process.env.DB_PORT;

var dbname = "vlibrasdicionario" || process.env.DB_NAME;

const uri = `mongodb://${host}:${port}/${dbname}`;

mongoose.connect(uri, { useNewUrlParser: true });

const requestSchema = new mongoose.Schema({
    bundle: { type: String, required: true },
    hit: Boolean,
    requester: { type: String, required: true }
}, { timestamps: true, versionKey: false });

const Request = mongoose.model('Request', requestSchema);

module.exports = { Mongoose: mongoose, Request: Request }
