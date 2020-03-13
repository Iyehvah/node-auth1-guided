const Users = require("../users/users-model")
const bcrypt = require("bcryptjs")

async function restrict() {

    const authError = {
        message: "Invalid Credentials"
    }

    return async (req, res, next) => {
        try {
            //GRABS USERNAME AND PW FROM HEADERS REQ
            const { username, password } = req.headers
            //make sure values arnt wrong
            if(!username || !password) {
                return res.status(401).json(authError)
            }
            //make sure user exists
            const user = await Users.findBy({ username }).first()
            if(!user) {
                return res.status(401).json(authError)
            }

            const passwordValid = await bcrypt.compare(password, user.password)

            if(!passwordValid) {
                return res.status(401).json(authError)
            }
            // if we reach this point the user is authenticated
            next()
        } catch(error) {
            next(error)
        }
    }
}

module.exports = restrict