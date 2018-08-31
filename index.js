const url = require('url');
const http = require('http');
const https = require('https');
const qs = require('querystring');

const ofo =  {
  api: 'http://one.ofo.com',
  post(path, form){
    const { hostname } = url.parse(this.api);
    return new Promise((resolve, reject) => {
      const req = https.request({
        method: 'post',
        hostname,
        path,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, (res, buffer = '') => {
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
      req.on('error', reject);
      req.write(qs.stringify(form));
      req.end();
    });
  },
  code(tel, { lat, lng, ccc = '86' } = {}){
    return this.post('/verifyCode_v2', { tel, type: 1, lat, lng, ccc });
  },
  login(tel, code, { lat, lng, ccc = '86' } = {}){
    return this.post('/api/login_v2', { tel, code, ccc, lat, lng });
  },
  near(token, { lat, lng, source = 2 } = {}){
    return this.post('/nearbyofoCar', { lat, lng, token, source });
  }
}

ofo.Server = require('./server');
ofo.createServer = () => {
  return new http.Server(ofo.Server);
};

module.exports = ofo;