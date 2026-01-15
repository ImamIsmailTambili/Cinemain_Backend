import { prisma } from "../../config/db.js"

const pembayaran = async (req, res) => {
    const { userId, jamTayangId, kursiList } = req.body;

    // Ambil kursi yang ada di MasterKursi
    const masterKursi = await prisma.masterKursi.findMany({
        where: {
            nomorKursi: { in: kursiList },
        },
    });

    // Cek apakah semua kursi valid
    if (masterKursi.length !== kursiList.length) {
        return res.status(400).json({
            error: "Beberapa kursi tidak ditemukan di MasterKursi"
        })
    }

    // 🔒 Cek apakah kursi sudah dipesan (hindari double booking)
    const kursiSudahTerpesan = await prisma.kursiTerpesan.findMany({
        where: {
            jamTayangId: Number(jamTayangId),
            masterKursiId: { in: masterKursi.map((k) => k.id) },
        },
    });

    if (kursiSudahTerpesan.length > 0) {
        return res.status(400).json({
            error: "Beberapa kursi sudah dipesan orang lain",
        });
    }

    const result = await prisma.$transaction(async (tx) => {
        const createdRecords = [];

        for (const kursi of masterKursi) {
            const kursiTerpesan = await tx.kursiTerpesan.create({
                data: {
                    jamTayangId: Number(jamTayangId),
                    masterKursiId: kursi.id,
                },
            });

            const pesan = await tx.pesan.create({
                data: {
                    userId: Number(userId),
                    jamTayangId: Number(jamTayangId),
                    kursiTerpesanId: kursiTerpesan.id,
                },
            });

            createdRecords.push({ kursiTerpesan, pesan });
        }

        return createdRecords;
    });

    res.json({
        message: "Pesanan berhasil dibuat",
        data: result,
    });
}

export { pembayaran }