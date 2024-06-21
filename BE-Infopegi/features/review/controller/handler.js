const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifyToken } = require('../../../helper/jwt');

async function getReview(req, res){
    const { id } = req.params;
    const review = await prisma.review.findMany({
        where: {
            destination_id: id
        }
    });
    res.status(200).json(review);
}

async function createReview(req, res){
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const userId = decoded.id;
    const userData = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    const name = userData.name;
    const { destination_id, rating, review } = req.body;
    const newReview = await prisma.review.create({
        data: {
            destination_id: destination_id,
            name: name,
            rating: rating,
            review: review
        }
    });
    res.status(201).json(newReview);
}

module.exports = {
    getReview,
    createReview
}