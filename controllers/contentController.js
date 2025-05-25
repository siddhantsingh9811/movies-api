const prisma = require('../models')

const searchContent = async (req, res) => {
	try {
		const { q, type, category, by, page = 1, limit = 15 } = req.query;
		const user = req.user.userId;
		let u = await prisma.user.findUnique({
			where: {
				id: user
			}
		});
		let userAge = u.age;
		console.log(userAge)
		
		const skip = (page - 1) * limit
		
		const where = {}
		
		if (q) {
			if(by=="title"){
				where.OR = [
					{ title: { contains: q, mode: 'insensitive' } }
				]
			}
			else if(by=="cast"){
				where.OR = [
					{ cast: { contains: q, mode: 'insensitive' } }
				]
			}
			else{
				where.OR = [
					{ title: { contains: q, mode: 'insensitive' } },
					{ cast: { contains: q, mode: 'insensitive' } }
				]
			}
		}
		
		if (type) {
			where.type = type
		}

		if (category) {
			where.listed_in = {
				contains: category,
				mode: 'insensitive'
			};
		}
		// Add age restriction filter if user is under 18
		if (userAge && userAge < 18) {
				where.NOT = {
						rating: 'R'
				};
		}
				
		const [content, total] = await Promise.all([
			prisma.movies_app.findMany({
				where,
				skip: parseInt(skip),
				take: parseInt(limit),
				orderBy: { title: 'asc' }
			}),
			prisma.movies_app.count({ where })
		])
		
		res.json({
			data: content,
			pagination: {
				total,
				page: parseInt(page),
				limit: parseInt(limit),
				totalPages: Math.ceil(total / limit)
			}
		})
	} catch (error) {
		console.error('Search error:', error)
		res.status(500).json({ message: 'Something went wrong' })
	}
}

module.exports = { searchContent }