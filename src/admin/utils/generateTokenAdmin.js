import jwt from 'jsonwebtoken';

export const generateTokenAdmin = (adminId, res) => {
    const payload = { id: adminId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
}
