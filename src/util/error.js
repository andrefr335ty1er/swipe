const error = (res, statusCode, description, instance) => {
    res.status(statusCode).send({
        statusCode,
        description,
        instance
    })
}

module.exports = error