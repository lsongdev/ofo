const xttp = require('xttp');

const ofo =  {
  lat: '',
  lng: '',
  source: 0,
  post(url, body){
    return xttp(url, {
      method: 'post',
      body
    }).then(res => res.json());
  },
  set(name, value){
    this[name] = value;
    return this;
  },
  location(lat, lng){
    return Object.assign(this, { lat, lng });
  },
  code(tel, ccc = '86'){
    const { lat, lng } = this;
    return this.post('http://one.ofo.com/verifyCode_v2', { 
      ccc, tel, type: 1, lat, lng
    });
  },
  login(tel, code, ccc = '86'){
    const { lat, lng } = this;
    return this.post('http://one.ofo.com/api/login_v2', { 
      tel, code, ccc, lat, lng 
    });
  },
  near(){
    const { lat, lng, source, token } = this;
    return this.post('http://one.ofo.com/nearbyofoCar', { 
      token, source, lat, lng
    });
  },
  start(carno){
    const { lat, lng, token, source } = this;
    return this.post('https://san.ofo.so/ofo/Api/v2/carno', {
      carno, lat, lng, token, source
    });
  },
  end(orderno){
    const { lat, lng, token, source } = this;
    return this.post('https://san.ofo.so/ofo/Api/v2/end', {
      orderno, token, source, lat, lng
    });
  },
  pay(orderno){
    const { lat, lng, token, source } = this;
    return this.post('https://san.ofo.so/ofo/Api/v2/pay', {
      orderno, token, source, lat, lng
    });
  }
}

ofo.createServer = () => {
  ofo.Server = require('./server');
  return new http.Server(ofo.Server);
};

module.exports = ofo;