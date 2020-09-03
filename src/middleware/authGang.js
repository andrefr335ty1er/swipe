const Gang = require('../models/gang')
const error = require('../util/error')

const authGang = async (req, res, next) => {
    try {
        const gang = await Gang.findById(req.params.id)

        if (!gang) {
            return error(res, 404, 'Cant find any gang.', '')
        }

        if(!gang.members.includes(req.user._id)){
            return error(res, 403, 'You are not a member of this gang', '')
        }

        req.gang = gang
        next()
    } catch (e) {
        return error(res, 401, 'Please authenticate.', '')
    }
}

module.exports = authGang