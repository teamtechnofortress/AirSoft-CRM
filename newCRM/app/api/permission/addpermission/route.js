import { connectDb } from "helper/db";
import Permission from "models/permission";
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly');
    return res.status(401).json({ status: "tokenerror", message: 'Token Missing!' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is valid, connect to the database
    await connectDb();


    // const permission = "viewproduct";

    // const u = new Permission({ permission });
    // await u.save();


    res.status(200).json({ status: "success", msg: "Your permission has been created!" });
  } catch (error) {
    
    console.error('Error during token verification:', error.message);

    if (error.name === 'TokenExpiredError') {
      res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly');
      return res.status(401).json({ status: "tokenerror", message: 'Token Expired!' });
    }

    return res.status(401).json({ status: "error", message: 'Invalid Token!' });
  }
}
