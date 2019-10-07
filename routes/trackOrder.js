const utils = require('../lib/utils')
const challenges = require('../data/datacache').challenges
const db = require('../data/mongodb')
const ftverify = require ('./ftverify')
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

module.exports = function trackOrder () {
  return (req, res) => {
    req.params.id = decodeURIComponent(req.params.id)
    if (ftverify.orderValidation(req.params.id)){
      console.log(entities.encode(req.params.id))
      if (utils.notSolved(challenges.reflectedXssChallenge) && utils.contains(req.params.id, '<iframe src="javascript:alert(`xss`)">')) {
        utils.solve(challenges.reflectedXssChallenge)
      }
      db.orders.find({ $where: "this.orderId === '" + req.params.id + "'" }).then(order => {
        const result = utils.queryResultToJson(order)
        if (utils.notSolved(challenges.noSqlOrdersChallenge) && result.data.length > 1) {
          utils.solve(challenges.noSqlOrdersChallenge)
        }
        if (result.data[0] === undefined) {
          result.data[0] = { orderId: req.params.id }
        }
        res.json(result)
      }, () => {
        res.status(400).json({ error: 'Wrong Param' })
      })
    }else{
      res.status(400).json({"msg":"Orden no válida"})
    }  
  }
}
