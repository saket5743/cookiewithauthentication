import mongoose, { Schema, model, Document, CallbackWithoutResultAndOptionalError } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

interface UserDocument extends Document {
  password: string;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});

// Password hashing and compare
UserSchema.pre<UserDocument>('save', async function (next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model<IUser>('User', UserSchema);

export default User