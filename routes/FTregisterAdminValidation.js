const utils = require('../lib/utils')
const models = require('../models/index')
const insecurity = require('../lib/insecurity')

module.exports = function searchUsers () {
  return (req, res, next) => {
    flagAdminRegex = new RegExp(/true|false/)
    if (flagAdminRegex.test(req.body.isAdmin) && req.body.isAdmin == true){
      tmptoken = utils.jwtFrom(req)
      if (tmptoken !== undefined){
          temp = insecurity.verify(tmptoken)
          models.sequelize.query('SELECT * FROM Users WHERE id = :id', { replacements: {id: temp.data.id}})
          .then(([user]) => {
            if (user[0].isAdmin == 1){
              next()
            }else{
              res.status(401).send({"msg":"Creación de administrador no permitida"})
            }
          }).catch(error => {
            next(error)
          })
        }else{
          res.status(401).send({"msg":"Creación de administrador no permitida"})  
        }
    }else{
    next()
    }
  }
}