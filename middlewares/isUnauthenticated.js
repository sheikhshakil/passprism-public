module.exports = () => {
    return (req, res, next) => {
        if(!req.session.isLoggedIn) {
            return next()
        }
        else {
            res.redirect('/panel')
        }
    }
}