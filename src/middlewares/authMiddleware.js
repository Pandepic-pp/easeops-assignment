import Token from "../models/Token.js";
import jwt from "jsonwebtoken";

const verifyAuthToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }
    try {
        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
        const storedToken = await Token.findOne({ email: jwtPayload.email, token });
        if (!storedToken || new Date() > storedToken.expiresAt) {
            return res.status(403).json({ message: 'Invalid or expired token'});
        }
        req.user = jwtPayload;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

export default verifyAuthToken;