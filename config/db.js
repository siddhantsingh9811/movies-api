const prisma = require('../models')

const checkDB = async () => {
  try {
    await prisma.$runCommandRaw({ ping: 1 })
    console.log('✅ MongoDB connection verified')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}

module.exports = checkDB