import { prisma } from "../../config/db.js";
import { createNotification } from "../utils/createdNotification.js";

const film = async (req, res) => {
    try {
        const allFilms = await prisma.film.findMany({
            select: {
                id: true,
                judul: true,
                genre: true,
                duration: true,
                sinopsis: true,
                produser: true,
                sutradara: true,
                production: true,
                pemeran: true,
                poster: true,
                trailer: true,
                penulis: true,
                FilmDiCinema: {
                    select: {
                        Cinema: {
                            select: {
                                nama: true
                            }
                        }
                    }
                }
            }
        })

        const films = allFilms.map((film) => {
            return {
                id: film.id,
                judul: film.judul,
                genre: film.genre,
                duration: film.duration,
                sinopsis: film.sinopsis,
                produser: film.produser,
                sutradara: film.sutradara,
                production: film.production,
                pemeran: film.pemeran,
                poster: film.poster,
                trailer: film.trailer,
                penulis: film.penulis,
                cinema: film.FilmDiCinema.map(fd => fd.Cinema.nama),
            }
        })

        res.status(200).json({
            status: "success",
            data: films
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Gagal mengambil film"
        })
    }
}

const addFilm = async (req, res) => {
    const { judul, genre, duration, sinopsis, produser, sutradara, production, pemeran, poster, trailer, penulis } = req.body;

    const filmExists = await prisma.film.findFirst({
        where: { judul: judul }
    });

    if (filmExists) {
        return res.status(400).json({ error: "Film alredy exists" })
    }

    const film = await prisma.film.create({
        data: {
            judul,
            genre,
            duration: Number(duration),
            sinopsis,
            produser,
            sutradara,
            production,
            pemeran,
            poster,
            trailer,
            penulis
        }
    });

    await createNotification({
        title: "Film Baru Ditambahkan",
        message: `Film ${film.judul} berhasil ditambahkan`,
        type: "ADD",
        entity: "FILM",
        entityId: film.id
    });

    res.status(201).json({
        status: "success",
        data: {
            film
        }
    })

}

const updateFilm = async (req, res) => {
    const { id } = req.params;
    const { judul, genre, duration, sinopsis, produser, sutradara, production, pemeran, poster, trailer, penulis } = req.body;

    const film = await prisma.film.update({
        where: { id: Number(id) },
        data: {
            judul,
            genre,
            duration: Number(duration),
            sinopsis,
            produser,
            sutradara,
            production,
            pemeran,
            poster,
            trailer,
            penulis
        }
    });

    await createNotification({
        title: "Film Diperbarui",
        message: `Film ${film.judul} telah diperbarui`,
        type: "UPDATE",
        entity: "FILM",
        entityId: film.id
    });

    res.status(201).json({
        status: "success",
        data: {
            film
        }
    })

}

const deleteFilm = async (req, res) => {
    const { id } = req.params;

    const film = await prisma.film.delete({
        where: { id: Number(id) }
    });

    await createNotification({
        title: "Film Dihapus",
        message: `Film ${film.judul} telah dihapus`,
        type: "DELETE",
        entity: "FILM",
        entityId: film.id
    });

    res.status(200).json({
        status: "success",
        data: {
            film
        }
    })
}
export { film, addFilm, updateFilm, deleteFilm }