require('dotenv').config()
const mongoose = require('mongoose')
// @ts-ignore
const springTerm2023MockData = require('./mockdata/springTerm2023.json')
// @ts-ignore
const fallTermMock2023Data = require('./mockdata/fallTerm2023.json')

const seedPresidentsDb = async (connectionString) => {
	let conn
	try {
		mongoose.set('strictQuery', false)
		conn = await mongoose.connect(connectionString)

		// POPULATE DATA ACCOORDING TO YOUR MODELS
		console.log(springTerm2023MockData)
		console.log(fallTermMock2023Data)

		console.log('@TODO: SeedDb')
	} catch (error) {
		console.error(error)
	} finally {
		if (conn) conn.disconnect()
		process.exit(0)
	}
}

seedPresidentsDb(process.env.MONGO_URI)
