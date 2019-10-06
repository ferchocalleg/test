exports.passwordValidation = () => (req, res, next) => {
    passPolicy(req.body.password) ? next() : 
    res.status(200).send({"msg":"El password suministrador no cumple la política sugerida"})
}

exports.emailValidation = () => (req, res, next) => {
    nameRegex = new RegExp(/(?:^[a-z]{1,15})\.(?:[a-z]{1,15})@(?:[a-z]{1,15})\.(?:[a-z\.]{1,7})/i);
    nameRegex.test(req.body.email) ? next() : 
    res.status(400).send({"msg":"nombre de usuario no válido"})
}

function passPolicy (password){

    passPolicyRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,64}$)");
    return passPolicyRegex.test(password)

}
