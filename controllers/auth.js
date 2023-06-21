import bcrypt from "bcrypt"; //encrypts passwd
import jwt from "jsonwebtoken"; //generate token which user can use for authorisation
import User from "../models/User.js";

export const register = async (req, res) => {
  //this ia  essentially like an api call that we make front front end to backend and then backend to front end
  //req->req body we are getting front frontend res->response being provided to frontend
  try {
    const { firstName, lastName, email, password, location, occupation } =
      req.body;
    if (!firstName || !lastName || !email || !password || password.length < 6)
      return res.status(400).json({ error: "bad request" });
    if (await User.exists({ email }))
      return res.status(400).json({ error: "email already exists" });
    const salt = await bcrypt.genSalt(); //random salt provided by b-crypt I am going to use this salt to encrypt passwds we are going to give json web token back to user this step is for authorisation
    const passwordHash = await bcrypt.hash(password, salt);
    const picturePath = "/assets/" + req.file.filename;
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password); //if hash doesnot match then credentials are invalid
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
