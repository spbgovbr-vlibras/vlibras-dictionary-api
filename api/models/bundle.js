import mongoose from 'mongoose';

const bundleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    region: { type: String, default: 'BR' },
    available: { type: Boolean, required: true },
    requester: { type: String, required: true }
}, { timestamps: true, versionKey: false });

const Bundle = mongoose.model('Bundle', bundleSchema)

export default Bundle;