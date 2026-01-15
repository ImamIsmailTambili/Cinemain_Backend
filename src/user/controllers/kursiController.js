import { prisma } from "../../config/db.js"

const kursi = async (req, res) => {
    const kursi = await prisma.masterKursi.findMany()
    res.json(kursi)
}

const kursiTerpesan = async (req, res) => {
    try {
        const { jamTayangId } = req.params;

        if (!jamTayangId) {
            return res.status(400).json({ error: "Invalid jamTayangId parameter" });
        }

        const kursi = await prisma.kursiTerpesan.findMany({
            where: { jamTayangId: Number(jamTayangId) },
            include: { MasterKursi: true }
        })

        const kursiTerpesan = kursi.map(k => k.MasterKursi.nomorKursi)

        res.json(kursiTerpesan);
    } catch (error) {
        console.error("Gagal mengambil kursi terpesan:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export { kursi, kursiTerpesan };