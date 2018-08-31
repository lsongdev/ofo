const ofo = require('..');

const waitForInput = prompt => new Promise((resolve, reject) => {
  process.stdout.write(prompt);
  process.stdin
    .once('error', reject)
    .once('data', line => resolve(`${line}`.trim()));
});

(async () => {

  ofo.location(48.85, 2.37);
  ofo.token = 'afe2a210-c150-11e8-9219-a9f7cfa3d708';
  const res = await ofo.near();
  console.log(res);
  // const res = await ofo.start('n81ZWY');
  // console.log(res);

})();