const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {
        this.users = data
    }
}

const fsPromises = require('fs/promises')
const path = require('path')

const handleLogout =  async (req, res) => {
    // on client , also delete the accesstoken
    const cookies = req.cookies

    if (!cookies?.jwt) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true})
        return res.status(400).sendStatus(204)
    }
    const refreshToken = cookies.jwt

    // is refresh token in the db?
    const foundUser = usersDB.users.find((person) => person.refreshToken === refreshToken)
    if (!foundUser) {
        return res.sendStatus(403)
    }

    // delete refresh token in the db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)
    const currentUser = { ...foundUser, refreshToken: ''}
    usersDB.setUsers([ ...otherUsers, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users, null , 2)
    )
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true}) // secure: true  -- only serves on https
    res.sendStatus(204)
}

module.exports = { handleLogout }