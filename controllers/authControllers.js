const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {
        this.users = data
    }
}

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const path = require('path')
const fsPromise = require('fs/promises')

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body

    if (!user || !pwd) {
        return res.status(400).send('username and pwd are required')
    }

    const foundUser = usersDB.users.find((person) => person.username === user)
    if (!foundUser) {
        return res.status(401).send('username does not exist') // unauthorised
    }

    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)

    if ( match ) {
        const roles = Object.values(foundUser.roles)
        // create JWTs
        const accessToken = jwt.sign(
            { "UserInfo": 
                {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '300s'}
        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        )
        // saving refresh token with current user
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = { ...foundUser, refreshToken}
        usersDB.setUsers([...otherUsers, currentUser])
        await fsPromise.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000})
        // res.send('successfully logged in')
        res.json({ accessToken })
    } else {
        res.status(401).send('please enter correct password')
    }
}

module.exports = { handleLogin }