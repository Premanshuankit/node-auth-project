const User = require('../model/User')

const handleLogout =  async (req, res) => {
    // on client , also delete the accesstoken
    const cookies = req.cookies

    if (!cookies?.jwt) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true})
        return res.status(400).sendStatus(204)
    }
    const refreshToken = cookies.jwt

    // is refresh token in the db?
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        return res.sendStatus(403)
    }

    // delete refresh token in the db
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log(result)
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true}) // secure: true  -- only serves on https
    res.sendStatus(204)
}

module.exports = { handleLogout }