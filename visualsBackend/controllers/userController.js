import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}
//route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success:false, message: "User doesn't exists"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success:false, message: "Invalid password" });
        }
        else{
            //token generate
            const token = createToken(user._id);
            res.json({ success: true, token: token });
        }  
    }
    catch (err) {
        console.error(err);
        res.json({ success: false, message: err.message });
    }
}

//route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({ success:false, message: "User already exists" });
        }
        if(!validator.isEmail(email)){
            return res.json({ success:false, message: "Please enter a valid email" });
        }
        if(password.length < 8){
            return res.json({ success:false, message: "Please enter a strong password"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        const user = await newUser.save();
        const token = createToken(user._id)
        res.json({ success: true, token });
    }
    catch (error){
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

//route for admin login
const adminLogin=async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(email==process.env.ADMIN_EMAIL && password==process.env.ADMIN_PASSWORD){
            const token=jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentials"})
        }
    }
    catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }

}

//route for getting user profile
const getUserProfile = async (req, res) => {
    try {
        // Get from either req object or req.body (for compatibility with GET and POST)
        const userId = req.userId || req.body.userId;
        const userEmail = req.userEmail || req.body.userEmail;
        
        console.log('Profile request - userId:', userId, 'userEmail:', userEmail);
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "User ID not found" });
        }

        // Extract name from email if not available
        const nameFromEmail = userEmail ? userEmail.split('@')[0] : 'User';

        // First, try to find by userId
        let user = await userModel.findById(userId);
        
        if (user) {
            // User exists with this ID, update if needed
            if (user.email !== userEmail) {
                user = await userModel.findByIdAndUpdate(
                    userId,
                    { email: userEmail },
                    { new: true }
                );
            }
        } else {
            // User doesn't exist with this ID, check if email exists with different ID
            const existingUser = await userModel.findOne({ email: userEmail });
            
            if (existingUser) {
                // Email exists with different UID, update it to use new UID
                // Delete old record and create new one with new UID
                await userModel.deleteOne({ email: userEmail });
                console.log('Deleted old user record with same email');
            }
            
            // Create new user with this UID
            user = await userModel.create({
                _id: userId,
                email: userEmail || 'no-email@example.com',
                name: nameFromEmail,
                cartData: {}
            });
            console.log('User created:', user);
        }

        console.log('Returning user data:', user);
        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name || 'User',
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export {loginUser,registerUser,adminLogin,getUserProfile}