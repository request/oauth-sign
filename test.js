
var fs = require('fs')
  , path = require('path')
  , tape = require('tape')
  , oauth = require('./index')
  , hmacsign = oauth.hmacsign
  , rsasign = oauth.rsasign
  , rsa_private_pem = fs.readFileSync(path.join(__dirname, 'test.key'))
  , qs = require('querystring')


// Tests from Twitter documentation https://dev.twitter.com/docs/auth/oauth
tape('reqsign', function(t) {
  var reqsign = hmacsign('POST', 'https://api.twitter.com/oauth/request_token',
    { oauth_callback: 'http://localhost:3005/the_dance/process_callback?service_provider_id=11'
    , oauth_consumer_key: 'GDdmIQH6jhtmLUypg82g'
    , oauth_nonce: 'QP70eNmVz8jvdPevU3oJD2AfF7R7odC2XJcn4XlZJqk'
    , oauth_signature_method: 'HMAC-SHA1'
    , oauth_timestamp: '1272323042'
    , oauth_version: '1.0'
    }, 'MCD8BKwGdgPHvAuvgvz4EQpqDAtx89grbuNMRd7Eh98')

  t.equal(reqsign, '8wUi7m5HFQy76nowoCThusfgB+Q=')
  t.end()
})

tape('reqsign_rsa', function(t) {
  var reqsign_rsa = rsasign('POST', 'https://api.twitter.com/oauth/request_token',
    { oauth_callback: 'http://localhost:3005/the_dance/process_callback?service_provider_id=11'
    , oauth_consumer_key: 'GDdmIQH6jhtmLUypg82g'
    , oauth_nonce: 'QP70eNmVz8jvdPevU3oJD2AfF7R7odC2XJcn4XlZJqk'
    , oauth_signature_method: 'RSA-SHA1'
    , oauth_timestamp: '1272323042'
    , oauth_version: '1.0'
    }, rsa_private_pem, 'this parameter is not used for RSA signing')

  t.equal(reqsign_rsa, 'MXdzEnIrQco3ACPoVWxCwv5pxYrm5MFRXbsP3LfRV+zfcRr+WMp/dOPS/3r+Wcb+17Z2IK3uJ8dMHfzb5LiDNCTUIj7SWBrbxOpy3Y6SA6z3vcrtjSekkTHLek1j+mzxOi3r3fkbYaNwjHx3PyoFSazbEstnkQQotbITeFt5FBE=')
  t.end()
})

tape('accsign', function(t) {
  var accsign = hmacsign('POST', 'https://api.twitter.com/oauth/access_token',
    { oauth_consumer_key: 'GDdmIQH6jhtmLUypg82g'
    , oauth_nonce: '9zWH6qe0qG7Lc1telCn7FhUbLyVdjEaL3MO5uHxn8'
    , oauth_signature_method: 'HMAC-SHA1'
    , oauth_token: '8ldIZyxQeVrFZXFOZH5tAwj6vzJYuLQpl0WUEYtWc'
    , oauth_timestamp: '1272323047'
    , oauth_verifier: 'pDNg57prOHapMbhv25RNf75lVRd6JDsni1AJJIDYoTY'
    , oauth_version: '1.0'
    }, 'MCD8BKwGdgPHvAuvgvz4EQpqDAtx89grbuNMRd7Eh98', 'x6qpRnlEmW9JbQn4PQVVeVG8ZLPEx6A0TOebgwcuA')

  t.equal(accsign, 'PUw/dHA4fnlJYM6RhXk5IU/0fCc=')
  t.end()
})

tape('accsign_rsa', function(t) {
  var accsign_rsa = rsasign('POST', 'https://api.twitter.com/oauth/access_token',
    { oauth_consumer_key: 'GDdmIQH6jhtmLUypg82g'
    , oauth_nonce: '9zWH6qe0qG7Lc1telCn7FhUbLyVdjEaL3MO5uHxn8'
    , oauth_signature_method: 'RSA-SHA1'
    , oauth_token: '8ldIZyxQeVrFZXFOZH5tAwj6vzJYuLQpl0WUEYtWc'
    , oauth_timestamp: '1272323047'
    , oauth_verifier: 'pDNg57prOHapMbhv25RNf75lVRd6JDsni1AJJIDYoTY'
    , oauth_version: '1.0'
    }, rsa_private_pem)

  t.equal(accsign_rsa, 'gZrMPexdgGMVUl9H6RxK0MbR6Db8tzf2kIIj52kOrDFcMgh4BunMBgUZAO1msUwz6oqZIvkVqyfyDAOP2wIrpYem0mBg3vqwPIroSE1AlUWo+TtQxOTuqrU+3kDcXpdvJe7CAX5hUx9Np/iGRqaCcgByqb9DaCcQ9ViQ+0wJiXI=')
  t.end()
})

tape('upsign', function(t) {
  var upsign = hmacsign('POST', 'http://api.twitter.com/1/statuses/update.json',
    { oauth_consumer_key: 'GDdmIQH6jhtmLUypg82g'
    , oauth_nonce: 'oElnnMTQIZvqvlfXM56aBLAf5noGD0AQR3Fmi7Q6Y'
    , oauth_signature_method: 'HMAC-SHA1'
    , oauth_token: '819797-Jxq8aYUDRmykzVKrgoLhXSq67TEa5ruc4GJC2rWimw'
    , oauth_timestamp: '1272325550'
    , oauth_version: '1.0'
    , status: 'setting up my twitter 私のさえずりを設定する'
    }, 'MCD8BKwGdgPHvAuvgvz4EQpqDAtx89grbuNMRd7Eh98', 'J6zix3FfA9LofH0awS24M3HcBYXO5nI1iYe8EfBA')

  t.equal(upsign, 'yOahq5m0YjDDjfjxHaXEsW9D+X0=')
  t.end()
})

tape('upsign_rsa', function(t) {
  var upsign_rsa = rsasign('POST', 'http://api.twitter.com/1/statuses/update.json',
    { oauth_consumer_key: 'GDdmIQH6jhtmLUypg82g'
    , oauth_nonce: 'oElnnMTQIZvqvlfXM56aBLAf5noGD0AQR3Fmi7Q6Y'
    , oauth_signature_method: 'RSA-SHA1'
    , oauth_token: '819797-Jxq8aYUDRmykzVKrgoLhXSq67TEa5ruc4GJC2rWimw'
    , oauth_timestamp: '1272325550'
    , oauth_version: '1.0'
    , status: 'setting up my twitter 私のさえずりを設定する'
    }, rsa_private_pem)

  t.equal(upsign_rsa, 'fF4G9BNzDxPu/htctzh9CWzGhtXo9DYYl+ZyRO1/QNOhOZPqnWVUOT+CGUKxmAeJSzLKMAH8y/MFSHI0lzihqwgfZr7nUhTx6kH7lUChcVasr+TZ4qPqvGGEhfJ8Av8D5dF5fytfCSzct62uONU0iHYVqainP+zefk1K7Ptb6hI=')
  t.end()
})

tape('rfc5849 example', function(t) {
  var params = qs.parse('b5=%3D%253D&a3=a&c%40=&a2=r%20b' + '&' + 'c2&a3=2+q')
  params.oauth_consumer_key = '9djdj82h48djs9d2'
  params.oauth_token = 'kkk9d7dh3k39sjv7'
  params.oauth_nonce = '7d8f3e4a'
  params.oauth_signature_method = 'HMAC-SHA1'
  params.oauth_timestamp = '137131201'

  var rfc5849sign = hmacsign('POST', 'http://example.com/request',
    params, 'j49sk3j29djd', 'dh893hdasih9')

  t.equal(rfc5849sign, 'r6/TJjbCOr97/+UU0NsvSne7s5g=')
  t.end()
})

tape('rfc5849 RSA example', function(t) {
  var params = qs.parse('b5=%3D%253D&a3=a&c%40=&a2=r%20b' + '&' + 'c2&a3=2+q')
  params.oauth_consumer_key = '9djdj82h48djs9d2'
  params.oauth_token = 'kkk9d7dh3k39sjv7'
  params.oauth_nonce = '7d8f3e4a'
  params.oauth_signature_method = 'RSA-SHA1'
  params.oauth_timestamp = '137131201'

  var rfc5849sign = rsasign('POST', 'http://example.com/request',
    params, rsa_private_pem)

  t.equal(rfc5849sign, 'Bqok90c5M9gPqjsxJ61crI7IXcZHyVIe3HluLFlMSWBqbPcj8cJFmcbxauErNBAPfpQ8CD5UpION3ZETca6ETnPbyMt/f2eMlmh1fNe3N/V7bAjpardOLdCLmcC65+vkI2c3lcDtiy5cCFZQDEdOdHw7SgoxMKStVEuDI9QNwss=')
  t.end()
})

tape('handle objects in params (useful for Wordpress REST API)', function(t) {
  var upsign = hmacsign('POST', 'http://wordpress.com/wp-json',
    { oauth_consumer_key: 'GDdmIQH6jhtmLUypg82g'
    , oauth_nonce: 'oElnnMTQIZvqvlfXM56aBLAf5noGD0AQR3Fmi7Q6Y'
    , oauth_signature_method: 'HMAC-SHA1'
    , oauth_token: '819797-Jxq8aYUDRmykzVKrgoLhXSq67TEa5ruc4GJC2rWimw'
    , oauth_timestamp: '1272325550'
    , oauth_version: '1.0'
    , filter: { number: '-1' }
    }, 'MCD8BKwGdgPHvAuvgvz4EQpqDAtx89grbuNMRd7Eh98', 'J6zix3FfA9LofH0awS24M3HcBYXO5nI1iYe8EfBA')

  t.equal(upsign, 'YrJFBdwnjuIitGpKrxLUplcuuUQ=')
  t.end()
})

tape('PLAINTEXT', function(t) {
  var plainSign = oauth.sign('PLAINTEXT', 'GET', 'http://dummy.com', {}, 'consumer_secret', 'token_secret')
  t.equal(plainSign, 'consumer_secret&token_secret')

  plainSign = oauth.plaintext('consumer_secret', 'token_secret')
  t.equal(plainSign, 'consumer_secret&token_secret')
  t.end()
})
