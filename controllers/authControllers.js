const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {
        this.users = data
    }
}

const bcrypt = require('bcrypt')

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
        res.send('successfully logged in')
    } else {
        res.status(401).send('please enter correct password')
    }
}

module.exports = { handleLogin }