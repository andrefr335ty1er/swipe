const Gang = require('../models/gang')
const error = require('../util/error')

const authGang = async (req, res, next) => {
    try {
        const gang = await Gang.findOne({ _id: req.params.id, delete_flag: 'N' })

        if (!gang) {
            return error(res, 404, 'Cant find any gang.', '', 'authGang')
        }

        if(!gang.members.includes(req.user._id)){
            return error(res, 401, 'You are not a member of this gang', '', 'authGang')
        }

        req.gang = gang
        next()
    } catch (e) {
        return error(res, 401, e.toString(), '', 'authGang')
    }
}

module.exports = authGang