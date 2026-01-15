import { prisma } from "../../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
    const { nama, telepon, email, gender, tanggalLahir, pin } = req.body;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
        where: { telepon: telepon }
    });

    if (userExists) {
        return res.status(400).json({ error: "User already exists" });
    }

    // Hash the pin
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    // Create user
    const user = await prisma.user.create({
        data: {
            nama,
            telepon,
            email,
            gender,
            tanggalLahir,
            pin: hashedPin
        }
    });

    res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: user.id,
                nama: user.nama,
                telepon: user.telepon,
                email: user.email,
            }
        }
    });
};

const login = async (req, res) => {
    const { telepon, pin } = req.body;

    // Check if user already exists
    const user = await prisma.user.findUnique({
        where: { telepon: telepon }
    });

    if (!user) {
        return res.status(401).json({ error: "Telepon atau PIN salah" });
    }

    // verify pin
    const isPinValid = await bcrypt.compare(pin, user.pin);

    if (!isPinValid) {
        return res.status(401).json({ error: "Telepon atau PIN salah" });
    }

    // Generate JWT Token
    const token = generateToken(user.id, res);

    res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: user.id,
                telepon: user.telepon,
            },
            token,
        }
    });
}

const logout = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
}

const me = async (req, res) => {
    res.status(200).json({
        loggedIn: true,
        user: {
            id: req.user.id,
            nama: req.user.nama,
            telepon: req.user.telepon,
            email: req.user.email
        }
    });
};

export { register, login, logout, me };