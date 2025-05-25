const bcrypt = require('bcryptjs')
const prisma = require('../models')
const { generateToken } = require('../utils/jwt')

// signup controller
const signup = async(req, res) => {
	try{
		const { email, password, age } = req.body;
		
		// check for existing user
		const existingUser = await prisma.user.findUnique({
				where: {email},
		})
		if (existingUser){
				return res.status(400).json({message:'User already exists.'})
		}
		
		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		
		// create new user
		const user = await prisma.user.create({
				data:{
						email,
						password:hashedPassword,
						age,
				},
		})
		
		// generate token
		const token = generateToken(user.id);
		
		res.status(201).json({
			id:user.id,
			email: user.email,
			age: user.age,
			token,
		})
	}
	catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Something went wrong.' })
	}
}
// login controller
const login = async(req, res) => {
	try{
		const { email, password } = req.body;
		
		// check for existing user
		const user = await prisma.user.findUnique({
			where: {email},
		})
		if (!user){
			return res.status(400).json({message:'Invalid credentials.'})
		}
		
		// check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch){
			return res.status(400).json({message:'Invalid credentials.'})
		}
		
		// generate token
		const token = generateToken(user.id);
		
		res.status(200).json({
			id:user.id,
			email: user.email,
			age: user.age,
			token,
		})
	}
	catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Something went wrong.' })
	}
}

module.exports = {login,signup};