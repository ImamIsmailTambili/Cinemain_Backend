import { prisma } from "../../config/db.js"

const film = async (req, res) => {
    const films = await prisma.film.findMany()
    res.json(films)
}

const getFilmById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const film = await prisma.film.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                FilmDiCinema: {
                    include: {
                        Cinema: { include: { Daerah: true } },
                        TanggalTayang: { include: { JamTayang: true } },
                    },
                },
            },
        });

        if (!film) {
            return res.status(404).json({ message: "Film tidak ditemukan" });
        }

        res.json(film);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}

export { film, getFilmById };