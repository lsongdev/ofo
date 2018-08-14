const ofo = require('..');

const waitForInput = prompt => new Promise((resolve, reject) => {
  process.stdout.write(prompt);
  process.stdin
    .once('error', reject)
    .once('data', line => resolve(`${line}`.trim()));
});

(async () => {
  
  const location = { lat: 48.85, lng: 2.37 };

  let token = await waitForInput('Do you have user token ? ');
  if(!token){
    const ccc = await waitForInput('What\'s your country code ? ');
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