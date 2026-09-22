function requirePasswordResetVerification(req, res, next) {

    if (
        !req.session.passwordResetVerified ||
        !req.session.passwordResetUserId
    ) {
        return res.redirect("/respass.html");
    }

    next();
}
           module.exports =  requirePasswordResetVerification ;