import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import PersonIcon from '@mui/icons-material/Person';


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
            default: PersonIcon,
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