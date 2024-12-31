import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';
import { User } from '../model.js';
import express from 'express';
const router = express.Router();


router.post('/register', async (req, res) => {
  try{
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  res.status(201).send('User registered successfully');
  }catch(err){
    res.status(500).send('Account creation failed!!');
  }
});

router.post('/login', async (req, res) => {
    try{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ _id: user._id,email:email }, process.env.SECRET, { expiresIn: '1h' });
  res.status(200).json({message:'Logged in successfully',token});
}
  catch(err){
    res.status(500).send('Error logging in!',err);
  }
});

export default router;