const randomstring = require('randomstring')

const genReferralCode = () => {
    return randomstring.generate({ length: 8, charset: 'alphanumeric' })
}

module.exports = genReferralCode