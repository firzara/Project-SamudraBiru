const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function main() {
  const filePath = path.join(__dirname, 'data', 'dummy.csv');
  const destinations = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      destinations.push({
        id: row.Id,
        name: row.Nama,
        category: row.Category,
        rating: parseFloat(row.Rating),
        fasilitas: row.Fasilitas,
        hero_image: row.Gambar,
        description: row.Deskripsi,
      });
    })
    .on('end', async () => {
      console.log('CSV file successfully processed');
      
      for (const destination of destinations) {
        await prisma.destination.create({
          data: {
            id: destination.id,
            name: destination.name,
            category: destination.category,
            rating: destination.rating,
            fasilitas: destination.fasilitas,
            hero_image: destination.hero_image,
            description: destination.description,
          },
        });
      }

      console.log('All data has been saved to the database');
    });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
