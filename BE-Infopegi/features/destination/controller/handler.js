const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getAllDestination(req, res) {
    try {
        const destinations = await prisma.destination.findMany();
        res.status(200).json(destinations);
    } catch (error) {
        console.error('Error getting destinations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getDestionationById(req, res){
    try{
        const {id} = req.params;
        const destination = await prisma.destination.findUnique({
            where: {id}
        });
        const totalReview = await prisma.review.count({
            where: {
                destination_id: id
            }
        });
        res.status(200).json({ ...destination, totalReview });
    } catch (error) {
        console.error('Error getting destination by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPrice(req, res){
    try{
        const { id } = req.params;
        const destination = await prisma.destination.findUnique({
            where: {
                id
            }
        });
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }
        const { anak, dewasa } = destination;
        res.status(200).json({ anak, dewasa });
    } catch (error) {
        console.error('Error getting price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getAllDestination, getDestionationById, getPrice };
