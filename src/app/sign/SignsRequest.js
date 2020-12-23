import { Schema, model } from 'mongoose';

const options = {
  timestamps: true,
  versionKey: false,
};

const signsRequestSchema = new Schema({
  sign: {
    type: Schema.Types.ObjectId,
    ref: 'Sign',
    required: true,
  },
  requester: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
}, options);

signsRequestSchema.pre(/^find/, function populateSignerSchema() {
  this.populate({ path: 'signs' });
});

const SignsRequest = model('SignsRequest', signsRequestSchema);

export default SignsRequest;
