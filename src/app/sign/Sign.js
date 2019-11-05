import { Schema, model } from 'mongoose';
import { VALIDATION_VALUES } from '../../config/validation';

const options = {
  timestamps: true,
  versionKey: false,
};

const signSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    enum: VALIDATION_VALUES.dictionaryRegions,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
  hits: {
    type: Number,
    required: true,
    default: 0,
  },
  requester: {
    type: String,
    required: true,
  },
}, options);

const Sign = model('Sign', signSchema);

export default Sign;
