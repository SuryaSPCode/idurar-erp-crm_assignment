const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const register = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);

  const { email, password, name } = req.body;

  // 1. Validate inputs
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required(),
  });

  const { error } = schema.validate({ email, password, name });
  if (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid input data.',
      errorMessage: error.message,
    });
  }

  // 2. Check if user exists
  const existingUser = await UserModel.findOne({ email, removed: false });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Email already in use.',
    });
  }

  // 3. Create user
  const newUser = new UserModel({
    email,
    name,
    enabled: true,
    removed: false,
  });

  const savedUser = await newUser.save();

  // 4. Generate salt + hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(salt + password); // Exactly how your schema handles it

  // 5. Save to UserPasswordModel
  const userPassword = new UserPasswordModel({
    user: savedUser._id,
    password: hashedPassword,
    salt: salt,
    emailVerified: true,
    removed: false,
  });

  await userPassword.save();

  return res.status(201).json({
    success: true,
    result: savedUser,
    message: 'User registered successfully.',
  });
};

module.exports = register;
