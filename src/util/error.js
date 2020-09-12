const error = (res, statusCode, description, method, instance) => {
    res.status(statusCode).send({
        statusCode,
        description,
        method,
        instance
    })
}

module.exports = error