import { Schema, model } from 'mongoose';
import * as mongoose from 'mongoose';

import { ModelValidator } from './validator';

mongoose.set('useCreateIndex', true);

export const sLabelSchema = new Schema(
  {
    title: { type: Schema.Types.String,
            required: true,
            unique : true,
            validateor: [ModelValidator.contentsValidator, 'Invalid Label Title']},
    desc: { type: Schema.Types.String,
              required: false,
              unique : false},
    color: { type: Schema.Types.String,
            required: true,
            validator: [ModelValidator.colorValidator, 'Invalid Color']},
    todos: [{ type: Schema.Types.ObjectId, ref: 'item' }]
  },
  {
    timestamps: true,
    versionKey: false
  }
);
export const LABELMODEL = model('labels', sLabelSchema);
export default LABELMODEL;
