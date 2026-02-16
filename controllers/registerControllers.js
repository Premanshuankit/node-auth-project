const User = require('../model/User')
const bcrypt = require('bcrypt')
const ROLES_LIST = require('../config/roles_list')

const handleNewUser = async (req, res) => {
    const {user, pwd, roles} = req.body

    if (!user || !pwd) {
        return res.status(400).send('username and pwd are required')
    }
    // check the duplicate user in the DB
    const duplicate = await User.findOne({ username: user}).exec()
    if (duplicate) {
        return res.status(409).send('username already exist, please try with another username')
    }

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10)

        let assignedRoles = {}

        if (roles && Array.isArray(roles)) {
            roles.forEach(role => {
                if (ROLES_LIST[role]) {
                    assignedRoles[role] = ROLES_LIST[role]
                }
            })
        }

        if (Object.keys(assignedRoles).length === 0) {
            assignedRoles = { User: ROLES_LIST.User }
        }

        // create and store the new user
        const newUser = await User.create({
            username: user,
            roles: assignedRoles,
            password: hashedPwd
        })
        console.log(newUser)
        res.status(201).send(`user with name '${user}' was created!!!`)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = { handleNewUser }