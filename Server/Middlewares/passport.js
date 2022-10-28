const Users = require('../Models/Users')
const { SECRET } = require('../config/config')
const { Strategy, ExtractJwt } = require('passport-jwt')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
}

 const setPassport = (passport) => {
    passport.use(
        new Strategy(options, async (payload, done) => {

            await Users.findById(payload.user_id)
                .then(user => {

                    if (user) {
                        //Morgan for loges
                        return done(null, user)
                    }

                    return done(null, false)
                })
                .catch(err => {
                    return done(null, false)

                })
        })
    )
}

module.exports = {setPassport}