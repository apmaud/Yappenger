import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: { 
            type: "String", 
            required: true 
        },
        email: { 
            type: "String", 
            unique: true, 
            required: true 
        },
        password: { 
            type: "String", 
            required: true 
        },
        pic: {
            type: "String",
            required: true,
            default: "https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Aperson%3AFILL%400%3Bwght%40400%3BGRAD%400%3Bopsz%4024",
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestaps: true }
);


UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
UserSchema.pre("save", async function (next) {
    if (!this.isModified) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", UserSchema);

export default User;