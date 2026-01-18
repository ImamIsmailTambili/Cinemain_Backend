import { prisma } from "../../config/db.js";
import bcrypt from "bcryptjs";
import { generateTokenAdmin } from "../utils/generateTokenAdmin.js";

const registerAdmin = async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const userExists = await prisma.admin.findUnique({
        where: { username: username }
    });

    if (userExists) {
        return res.status(400).json({ error: "User already exists" });
    }

    // Hash the pin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const admin = await prisma.admin.create({
        data: {
            username,
            password: hashedPassword
        }
    });

    res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: admin.id,
                nama: admin.username,
            }
        }
    });
};

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const admin = await prisma.admin.findUnique({
        where: { username: username }
    });

    if (!admin) {
        return res.status(401).json({ error: "Anda belum terdaftar" });
    }

    // verify pin
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: "Password Salah" });
    }

    // Generate JWT Token
    const token = generateTokenAdmin(admin.id, res);

    res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: admin.id,
                username: admin.username,
            },
            token,
        }
    });
}

const logoutAdmin = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
    });
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
}

const admin = async (req, res) => {
    res.status(200).json({
        loggedIn: true,
        admin: {
            id: req.admin.id,
            username: req.admin.username,
        }
    });
};

export { registerAdmin, loginAdmin, logoutAdmin, admin };
