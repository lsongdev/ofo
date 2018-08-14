const http = require('http');
const https = require('https');
const qs = require('querystring');

const fetch = (path, data) => new Promise((resolve, reject) => {
  const req = https.request({
    method: 'post',
    hostname: 'one.ofo.com',
    path,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, res => {
    let buffer = '';
    res
      .on('error', reject)
      .on('data', chunk => buffer += chunk)
      .on('end', () => {
        const { errorCode, msg, values } = JSON.parse(buffer);
        if(errorCode === 200){
          resolve(values)
        }else{
          const error = new Error(msg);
          error.code = errorCode;
          error.values = values;
          reject(error);
        }
      });
  });
  req.write(qs.stringify(data));
  req.end();
});

const ofo =  {
  code(tel, { lat, lng, ccc = '86' } = {}){
    return fetch('/verifyCode_v2', { tel, type: 1, lat, lng, ccc });
  },
  login(tel, code, { lat, lng, ccc = '86' } = {}){
    return fetch('/api/login_v2', { tel, code, ccc, lat, lng });
  },
  near(token, { lat, lng, source = 2 } = {}){
    return fetch('/nearbyofoCar', { lat, lng, token, source });
  }
}

ofo.Server = require('./server');
ofo.createServer = () => {
  return new http.Server(ofo.Server);
};

module.exports = ofo;