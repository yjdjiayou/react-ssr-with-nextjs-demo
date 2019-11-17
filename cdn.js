const qiniu = require('qiniu')

const ak = 'u6DNrYk6RXHnFEl3ebALbWWZhbqYX1ifK9z21bRT'
const sk = 'g4B2I8UKTDxBEzixZ4JJpXP94ggUdhZSYbIt0Mck'

const mac = new qiniu.auth.digest.Mac(ak, sk)

const options = {
  scope: 'data',
  expires: 600,
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)
