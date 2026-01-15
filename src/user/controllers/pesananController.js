import { prisma } from "../../config/db.js"

const pesanan = async (req, res) => {
    const userId = req.user.id;

    const pesan = await prisma.pesan.findMany({
        where: { userId },
        include: {
            JamTayang: {
                include: {
                    TanggalTayang: {
                        include: {
                            FilmDiCinema: {
                                include: {
                                    Film: true,
                                    Cinema: true
                                }
                            }
                        }
                    }
                }
            },
            KursiTerpesan: {
                include: {
                    MasterKursi: true
                }
            }
        }
    });
    res.json(pesan)
}

export { pesanan }