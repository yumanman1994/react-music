const axios = require('axios')
const express = require('express')
const apiRoutes = express.Router()
const app = express()
app.use('/api',apiRoutes)
app.get('/api/getDiscList', function(req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data)
    })
    .catch(e => {
      console.log(e)
    })
})





app.listen(9093, function() {
  console.log('node端口打开的是 ')
})
