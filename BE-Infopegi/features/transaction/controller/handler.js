const { PrismaClient } = require("@prisma/client");
const { CreateTransaction } = require("../../../config/midtrans");
const { randomID, randomTicket } = require("../../../helper/utils");
const { verifyToken } = require("../../../helper/jwt");
const prisma = new PrismaClient();

async function createTransaction(req, res) {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  const userId = decoded.id;

  const { id, anak, dewasa, date_booking } = req.body;
  const parsedAnak = parseInt(anak);
  const parsedDewasa = parseInt(dewasa);
  const getPrice = await prisma.destination.findUnique({
    where: {
      id: id
    }
  });

  const price = parsedAnak * getPrice.anak + parsedDewasa * getPrice.dewasa;
  const transactionId = randomID();

  const snap_url = await CreateTransaction(transactionId, price);
  const isoDate = new Date(date_booking).toISOString();

  try {
    const transaction = await prisma.transaction.create({
      data: {
        id: transactionId,
        destination_id: id,
        user_id: userId,
        child: parsedAnak,
        adult: parsedDewasa,
        total_price: price,
        date_booking: isoDate,
        status: "Pending",
        snap_url: snap_url,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTransaction(req, res) {
  const { id } = req.params;
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: id
    }
  });
  res.status(200).json(transaction);
}

async function getUserTransaction(req, res) {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  const userId = decoded.id;
  const transaction = await prisma.transaction.findMany({
    where: {
      user_id: userId
    },
    include: {
      destination: true,
      user: true
    }
  });
  res.status(200).json(transaction);
}

async function webhook(req, res) {
  const { transaction_status, order_id, fraud_status } = req.body;

  let orderId = order_id;
  let transactionStatus = transaction_status;
  let fraudStatus = fraud_status;
  const ticketId = randomTicket();

  const date_booking = await prisma.transaction.findUnique({
    where: {
      id: orderId,
    },
  });
  if (!date_booking) {
    return;
  }
  var expiredAt = new Date(
    new Date(date_booking.date_booking).getTime() + 3 * 24 * 60 * 60 * 1000
  );

  if (transactionStatus == "capture") {
    if (fraudStatus == "accept") {
      // TODO set transaction status on your database to 'success'
      // and response with 200 OK
      const isTicketExist = await prisma.ticket.findUnique({
        where: {
          transaction_id: orderId
        }
      });
      if (isTicketExist) {
        console.log("Tiket sudah ada");
        return;
      }
      const updateTransaction = await prisma.transaction.update({
        where: {
          id: orderId
        },
        data: {
          status: "Berhasil"
        }
      });
      const createTicket = await prisma.ticket.create({
        data: {
          ticket_id: ticketId,
          transaction_id: orderId,
          expired_at: expiredAt,
        },
      });
      console.log(createTicket);
    }
  } else if (transactionStatus == "settlement") {
    // TODO set transaction status on your database to 'success'
    // and response with 200 OK
    const isTicketExist = await prisma.ticket.findUnique({
      where: {
        transaction_id: orderId
      }
    });
    if (isTicketExist) {
      console.log("Tiket sudah ada");
      return;
    }
    const updateTransaction = await prisma.transaction.update({
      where: {
        id: orderId
      },
      data: {
        status: "Berhasil"
      }
    });
    const createTicket = await prisma.ticket.create({
      data: {
        ticket_id: ticketId,
        transaction_id: orderId,
        expired_at: expiredAt,
      },
    });
    console.log(createTicket);
  } else if (
    transactionStatus == "cancel" ||
    transactionStatus == "deny" ||
    transactionStatus == "expire"
  ) {
    // TODO set transaction status on your database to 'failure'
    // and response with 200 OK
  } else if (transactionStatus == "pending") {
    // TODO set transaction status on your database to 'pending' / waiting payment
    // and response with 200 OK
  }
}
module.exports = { createTransaction, webhook, getTransaction, getUserTransaction };
