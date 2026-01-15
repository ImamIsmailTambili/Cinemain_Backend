import { prisma } from "../../config/db.js";

const getDashboard = async (req, res) => {
    const orders = await prisma.pesan.findMany({
        select: {
            JamTayang: {
                select: {
                    TanggalTayang: {
                        select: {
                            FilmDiCinema: {
                                select: {
                                    harga: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    try {
        const totalUsers = await prisma.user.count();
        const totalOrders = await prisma.kursiTerpesan.count();
        const totalRevenue = orders.reduce((total, order) => {
            return total + order.JamTayang.TanggalTayang.FilmDiCinema.harga
        }, 0);
        const activeMovies = await prisma.film.count();

        res.status(200).json({
            status: "success",
            data: {
                totalUsers,
                totalOrders,
                totalRevenue,
                activeMovies
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Gagal mengambil dashboard stats"
        })
    }
}

const dashboardChart = async (req, res) => {
    try {
        const year = parseInt(req.query.year);
        const month = req.query.month ? parseInt(req.query.month) : null;

        if (!year) {
            return res.status(400).json({ message: "Year is required" });
        }

        let startDate, endDate;

        if (month) {
            // 📆 Per hari (dalam 1 bulan)
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0, 23, 59, 59);
        } else {
            // 📆 Per bulan (1 tahun)
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59);
        }

        const orders = await prisma.pesan.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                createdAt: true,
            },
        });

        const result = {};

        orders.forEach(order => {
            const date = new Date(order.createdAt);

            const key = month
                ? date.getDate()               // per hari
                : date.getMonth() + 1;         // per bulan

            result[key] = (result[key] || 0) + 1;
        });

        const data = Object.keys(result).map(key => ({
            label: month ? `Day ${key}` : `Month ${key}`,
            orders: result[key],
        }));

        res.json({ data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const recentOrders = async (req, res) => {
    const orders = await prisma.pesan.findMany({
        orderBy: {
            id: 'desc'
        },
        take: 5,
        select: {
            id: true,
            JamTayang: {
                select: {
                    jam: true,
                    TanggalTayang: {
                        select: {
                            tanggal: true,
                            FilmDiCinema: {
                                select: {
                                    harga: true,
                                    Film: {
                                        select: {
                                            judul: true
                                        }
                                    },
                                    Cinema: {
                                        select: {
                                            nama: true
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

    try {

        const recentOrders = orders.map((order) => {
            const FilmDiCinema = order.JamTayang.TanggalTayang.FilmDiCinema
            const date = new Date(order.JamTayang.TanggalTayang.tanggal)
            const formatDate = date.toLocaleString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })

            return {
                id: order.id,
                film: FilmDiCinema.Film.judul,
                cinema: FilmDiCinema.Cinema.nama,
                amount: FilmDiCinema.harga,
                date: formatDate,
                time: `${order.JamTayang.jam}`
            }
        })

        res.status(200).json({
            status: "success",
            data: recentOrders
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Gagal mengambil Recent Order"
        })
    }
}

export { getDashboard, dashboardChart, recentOrders }