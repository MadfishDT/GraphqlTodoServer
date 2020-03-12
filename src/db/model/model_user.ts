import { Schema, model } from 'mongoose';
import { ModelValidator } from './validator';
import * as bcrypt from 'bcrypt-nodejs';

const SALT_FACTOR = 10;
export const sUserSchema = new Schema(
    {
        userEmail: {
            type: Schema.Types.String,
            required: true,
            validateor: [ModelValidator.emailValidate, 'Invalid user email']
        },
        userName: {
            type: Schema.Types.String,
            required: true,
            validateor: [ModelValidator.contentsValidator, 'Invalid user name']
        },
        password: {
            type: Schema.Types.String,
            required: true,
            validateor: [ModelValidator.contentsValidator, 'Invalid Todo Contents']
        },
        level: {
            type: Schema.Types.Number,
            required: true,
            validateor: [ModelValidator.contentsValidator, 'Invalid level']
        },
        phone: {
            type: Schema.Types.String,
            required: false,
            validateor: [ModelValidator.contentsValidator, 'Invalid PhonNujmber']
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const crypPropgress= () => {};
sUserSchema.pre("save",(done) => {
    var user = this;
    if(!user.isModified("password")){
      return done();
    }
    bcrypt.genSalt(SALT_FACTOR,(err,salt) => {
      if(err){return done(err);}
      bcrypt.hash(user.password, salt, crypPropgress, (err,hashedPassword) => {
        if(err){return done(err);}
        user.password = hashedPassword;
        done();
      });
    });
});
  
export const USERMODEL = model('users', sUserSchema);
export default USERMODEL;
