import Token from "../models/Token.js";
import jwt from "jsonwebtoken";

const verifyAuthToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }
    try {
        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
        if (!jwtPayload.email) {
            return res.status(403).json({ message: 'Invalid token payload' });
        }
        req.user = jwtPayload;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

export default verifyAuthToken;