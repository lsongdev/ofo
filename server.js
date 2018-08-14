const jade = require('jade');
const level = require('level');

const kelp = require('kelp');
const body = require('kelp-body');
const send = require('kelp-send');
const route = require('kelp-route');
const serve = require('kelp-static');
const logger = require('kelp-logger');
const config = require('kelp-config');
const render = require('kelp-render');

const app = kelp();

const db = level('ofo.db');

app.use(send);
app.use(body);
app.use(logger);
app.use(serve('public'));
app.use(render({
  templates: 'views',
  extension: 'jade',
  compiler: function (content, filename) {
    return function (locals) {
      return jade.renderFile(filename, locals);
    }
  }
}));

app.use(route('/', async (req, res) => {
  const { q: query } = req.query;
  const { accept } = req.headers;
  let password;
  try{
    if(query) password = await db.get(query);
  }catch(e){
    console.error(e.message);
  }
  if (accept && ~accept.indexOf('text/html')) {
    res.render('index', { query, password });
  } else {
    res.send(password);
  }
}));

app.use(route('/submit', async (req, res) => {
  const { q: query } = req.query;
  const { number, password } = (req.body || {});
  if (number && password) {
    db.put(number, password, err => {
      res.render('submit', { success: !err });
    });
  } else {
    res.render('submit', { query });
  }
}));

app.use(route('/tos', (_, res) => 
  res.render('terms')
));

app.use((_, res) => res.send(404));

module.exports = app;