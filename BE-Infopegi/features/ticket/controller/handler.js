const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyToken } = require("../../../helper/jwt");

const getTicket = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  const userId = decoded.id;

  try {
    // Ambil tiket berdasarkan userId
    const tickets = await prisma.ticket.findMany({
      where: {
        transaction: {
          user_id: userId 
        }
      },
      include: {
        transaction: {
          include: {
            destination: true
          }
        }
      }
    });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTicket,
};
