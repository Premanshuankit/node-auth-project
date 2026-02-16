const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {
        this.users = data
    }
}

const fsPromises = require('fs/promises')
const path = require('path')
const bcrypt = require('bcrypt')
const ROLES_LIST = require('../config/roles_list')

const handleNewUser = async (req, res) => {
    const {user, pwd, roles} = req.body

    if (!user || !pwd) {
        return res.status(400).send('username and pwd are required')
    }
    const duplicate = usersDB.users.find((person) => person.username === user)
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

        const newUser = {
            username: user,
            roles: assignedRoles,
            password: hashedPwd
        }
        usersDB.setUsers([...usersDB.users, newUser])

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users, null, 2)
        )
        console.log(usersDB.users)
        res.status(201).send(`user with name '${user}' was created!!!`)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = { handleNewUser }