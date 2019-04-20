import mongoose from 'mongoose';

const bunldeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    region: { type: String, default: 'BR' },
    available: { type: Boolean, required: true },
    requester: { type: String, required: true }
}, { timestamps: true, versionKey: false });

const Bundle = mongoose.model('Bundle', bunldeSchema)

export default Bundle;