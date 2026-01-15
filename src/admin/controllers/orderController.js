import { prisma } from "../../config/db.js";

const order = async (req, res) => {
    try {
        const allOrders = await prisma.pesan.findMany({
            select: {
                id: true,
                User: {
                    select: {
                        nama: true,
                    }
                },
                KursiTerpesan: {
                    select: {
                        MasterKursi: {
                            select: {
                                nomorKursi: true,
                            }
                        }
                    }
                },
                JamTayang: {
                    select: {
                        jam: true,
                        TanggalTayang: {
                            select: {
                                tanggal: true,
                                FilmDiCinema: {
                                    select: {
                                        harga: true,
                                        Cinema: {
                                            select: {
                                                nama: true
                                            }
                                        },
                                        Film: {
                                            select: {
                                                judul: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const orders = allOrders.map((order) => {
            return {
                id: order.id,
                customer: order.User.nama,
                nomorKursi: order.KursiTerpesan.MasterKursi.nomorKursi,
                jam: order.JamTayang.jam,
                tanggal: order.JamTayang.TanggalTayang.tanggal,
                harga: order.JamTayang.TanggalTayang.FilmDiCinema.harga,
                cinema: order.JamTayang.TanggalTayang.FilmDiCinema.Cinema.nama,
                film: order.JamTayang.TanggalTayang.FilmDiCinema.Film.judul,
            }
        })

        res.status(200).json({
            status: "success",
            data: orders
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Gagal mengambil order"
        })
    }
}

export { order };