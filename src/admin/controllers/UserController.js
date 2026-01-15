import { prisma } from "../../config/db.js";

const getUser = async (req, res) => {
    try {
        // 1️⃣ Total pesanan per user
        const totalPesanan = await prisma.pesan.groupBy({
            by: ['userId'],
            _count: {
                _all: true
            }
        });

        // 2️⃣ Semua user
        const users = await prisma.user.findMany({
            select: {
                id: true,
                nama: true,
                telepon: true,
                email: true,
            }
        });

        // 3️⃣ Gabungkan (LEFT JOIN versi JS)
        const data = users.map(user => {
            const pesanan = totalPesanan.find(tp => tp.userId === user.id);

            return {
                id: user.id,
                nama: user.nama,
                telepon: user.telepon,
                email: user.email,
                totalPesanan: pesanan ? pesanan._count._all : 0
            };
        });

        res.status(200).json({
            status: "success",
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Gagal mengambil data pengguna"
        });
    }
};

export { getUser };
