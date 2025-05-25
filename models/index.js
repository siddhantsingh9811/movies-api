const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['warn', 'error']
})

// Verify connection on startup
prisma.$connect()
  .then(() => console.log('Connection to Database successful'))
  .catch(err => {
    console.error('Database Connection error:', err)
    process.exit(1)
  })

module.exports = prisma