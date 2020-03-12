import { Schema, model } from 'mongoose';
import { ModelValidator } from './validator';

export const sTodoSchema = new Schema(
    {
        title: {
            type: Schema.Types.String,
            required: true,
            validateor: [ModelValidator.contentsValidator, 'Invalid Todo Title']
        },
        contents: {
            type: Schema.Types.String,
            required: true,
            validateor: [ModelValidator.contentsValidator, 'Invalid Todo Contents']
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);
export const TODOMODEL = model('todos', sTodoSchema);
export default TODOMODEL;
