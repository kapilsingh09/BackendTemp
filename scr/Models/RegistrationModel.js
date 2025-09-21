import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const { Schema } = mongoose;

const RegistrationSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // it's better to enforce uniqueness for emails
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, { timestamps: true });

// Hash password before saving
RegistrationSchema.pre('save', async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

// Method to check password
RegistrationSchema.methods.isPasswordCorrect = async function(password) {
 return await bcrypt.compare(password,this.password)
}

// jwt is berar token
RegistrationSchema.methods.generateAccessToken = function(){
    jwt.sign({
      _id:this._id,
      email:this.email,
      firstName:this.firstName,
    },
  process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
)
} 

RegistrationSchema.methods.generateRefreshToken = function(){
 jwt.sign({
      _id:this._id,
      email:this.email,
      firstName:this.firstName,
    },
  process.env.REFRESH_TOKEN_SECRET,{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }
)
}


// Method to check password
// RegistrationSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

const Registration = mongoose.model('Registration', RegistrationSchema);

export default Registration;
