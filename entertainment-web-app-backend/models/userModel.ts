import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  passwordConfirm?: string;
  googleId?: string;
  photo?: string;
  active?: boolean;
  refreshTokens?: { token: { type: string }; device: { type: string } }[];
  bookmarks?: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "please provide an email"],
    },
    password: {
      type: String,
      required: [
        function () {
          return !this.googleId;
        },
        "please provide a password",
      ],
      minlength: 5,
      // select: false,
    },
    passwordConfirm: {
      type: String,
      required: [
        function () {
          return !this.googleId && (this.isNew || this.isModified("password"));
        },
        "please confirm your password",
      ],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "passwords are not the same",
      },
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    photo: {
      type: String,
      default: "image-avatar.png",
    },
    active: {
      type: Boolean,
      default: true,
      // select: false,
    },
    refreshTokens: [
      {
        token: { type: String, required: true },
        device: { type: String, required: true },
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MovieTVSeries",
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  this.find({ active: { $ne: false } });

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
