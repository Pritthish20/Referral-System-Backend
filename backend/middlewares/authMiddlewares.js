import  jwt from "jsonwebtoken";
import  {User}  from "../models/userModel.js";

//check
export const authenticate = async (req,res,next)=>{
    const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No access token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired access token' , error:err});
  }
};

export const authenticateAsAdmin =async(req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401).send("Not authorized as an Admin");
    }
};
