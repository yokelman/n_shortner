import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const auth = (req, res, next) => {
    // Check if token exists in cookies
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "not authenticated, no token" });
    }

    try {
        // Verify the token
        const verified = jsonwebtoken.verify(token, process.env.SECRET);
        if (verified && verified.username) {
            // Attach the username to the request object
            req.user = verified.username;
            next();
        } else {
            return res.status(401).json({ success: false, message: "invalid token structure" });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: "invalid token" });
    }
};
