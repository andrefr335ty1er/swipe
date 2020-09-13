const mongoose = require('mongoose')
const logger = require('../log/logging')

logger.info("Start connecting to MongoDB")
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 8000
})
.then(() => {
    logger.info("Connected to MongoDB successfully")
})
.catch(err => {
    logger.error(err)
})
