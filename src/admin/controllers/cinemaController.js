import { prisma } from "../../config/db.js";
import { createNotification } from "../utils/createdNotification.js";

const cinema = async (req, res) => {
    try {
        const allCinema = await prisma.cinema.findMany({
            select: {
                id: true,
                nama: true,
                Daerah: {
                    select: {
                        id: true,
                        nama: true
                    }
                }
            }
        })

        const cinemas = allCinema.map((cinema) => {
            return {
                id: cinema.id,
                nama: cinema.nama,
                daerah: cinema.Daerah.nama,
                daerahId: cinema.Daerah.id
            }
        })
        res.status(200).json({
            status: "success",
            data: cinemas
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Gagal mengambil cinema"
        })
    }
}

const daerah = async (req, res) => {
    const daerah = await prisma.daerah.findMany();

    res.status(200).json({
        status: "success",
        data: daerah
    })
}

const addCinema = async (req, res) => {
    const { nama, daerahId } = req.body;

    const cinemaExists = await prisma.cinema.findFirst({
        where: { nama: nama }
    });

    if (cinemaExists) {
        return res.status(400).json({ error: "Cinema already exists" })
    }

    const cinemas = await prisma.cinema.create({
        data: {
            nama: nama,
            daerahId: Number(daerahId)
        }
    });

    await createNotification({
        title: "Cinema Baru Ditambahkan",
        message: `Cinema ${cinemas.nama} berhasil ditambahkan`,
        type: "ADD",
        entity: "CINEMA",
        entityId: cinemas.id
    });

    res.status(201).json({
        status: "success",
        data: {
            cinemas
        }
    })

}

const updateCinema = async (req, res) => {
    const { id } = req.params;
    const { cinema, daerahId } = req.body;

    const cinemas = await prisma.cinema.update({
        where: { id: Number(id) },
        data: {
            nama: cinema,
            daerahId: Number(daerahId)
        }
    });

    await createNotification({
        title: "Cinema Diperbarui",
        message: `Cinema ${cinemas.nama} telah diperbarui`,
        type: "UPDATE",
        entity: "CINEMA",
        entityId: cinemas.id
    });

    res.status(201).json({
        status: "success",
        data: {
            cinemas
        }
    })

}

const deleteCinema = async (req, res) => {
    const { id } = req.params;

    const cinema = await prisma.cinema.delete({
        where: { id: Number(id) }
    });

    await createNotification({
        title: "Cinema Dihapus",
        message: `Cinema ${cinema.nama} telah dihapus`,
        type: "DELETE",
        entity: "CINEMA",
        entityId: cinema.id
    });
    res.status(200).json({
        status: "success",
        data: {
            cinema
        }
    })
}
export { cinema, daerah, addCinema, updateCinema, deleteCinema }