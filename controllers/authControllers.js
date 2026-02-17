const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body

    if (!user || !pwd) {
        return res.status(400).send('username and pwd are required')
    }

    const foundUser = await User.findOne({ username: user}).exec()
    if (!foundUser) {
        return res.status(401).send('username does not exist') // unauthorised
    }

    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)

    if ( match ) {
        // const roles = Object.values(foundUser.roles)
        const roles = [...foundUser.roles.values()]
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
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        console.log(result)

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000})
        // res.send('successfully logged in')
        res.json({ accessToken })
    } else {
        res.status(401).send('please enter correct password')
    }
}

module.exports = { handleLogin }