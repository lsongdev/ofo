## ofo ![ofo](https://img.shields.io/npm/v/ofo.svg)

> free bike for everyone

### Installation

```bash
$ npm i ofo
```

### Example

```js
const ofo = require('ofo');

(async () => {
  
  const location = { lat: 48.85, lng: 2.37 };

  let token = await waitForInput('Do you have user token ? ');
  if(!token){
    const ccc    = await waitForInput('What\'s your country code ? ');
    const mobile = await waitForInput('What\'s your mobile phone number ? ');
    const result = await ofo.code(mobile, { ccc });
    console.log('sms code sent:', result);
    
    const code = await waitForInput('please input OTP code:> ');
    ({ token } = await ofo.login(mobile, code, location));
    console.log('user token:', token);
  }

  const bikes = await ofo.near(token, location);
  console.log('near bikes', bikes);

})();
```

output:

```bash
~$ node example
Do you have user token ?
What's your country code ? 86
What's your mobile phone number ? 18510100102
sms code sent: {}
please input OTP code:> 1866
user token: efdef560-9fba-11e8-8cc1-ed96632744a7
near bikes { cars:
   [ { carno: 'gEgdNq',
       bomNum: '3DA',
       userIdLast: '1',
       lng: 2.3686030741643,
       lat: 48.850329008564 },
     { carno: 'm9qdDA',
       bomNum: '5CA',
       userIdLast: '1',
       lng: 2.371883877277,
       lat: 48.846629926471 } ],
  expPrice:
   { price: '0.50',
     actualPrice: '0.50',
     orderTime: 1200,
     currency: '€',
     type: 1 },
  icon:
   'http://ofo-testmeixi-image.oss-us-west-1.aliyuncs.com//report/6fc78646df3a375416f9c1884728fa50.png',
  bikeIcon:
   [ { bomNum: '0',
       icon:
        'http://ofo-testmeixi-image.oss-us-west-1.aliyuncs.com//report/6fc78646df3a375416f9c1884728fa50.png',
       animationUrl: '' } ] }
```

for more example see [examples](./exmaple) .

### APIs

+ code
+ login
+ near
+ Server
+ createServer

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT

This work is licensed under the [MIT license](./LICENSE).

---