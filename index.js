var repeatAmt = 10
const express = require('express');

const app = express();

app.get('/', function(req, res) {
  res.redirect('https://tg.adarshrkumar.dev/4GPT')
  // res.sendFile(`${__dirname}/index.html`)
});

app.get('/index*', function(req, res) {
  if (req.hostname.includes('rockgamerak')) {
    res.redirect(`https://${req.hostname.replace('rockgamerak', 'adarshrkumar')}/${req.originalUrl}`)
  }
  else {
    res.sendFile(`${__dirname}/.html`)
  }
});

function encode(val) {
  let i = 1
  while (i < repeatAmt) {
    val = `${process.env.KEY_JUNK}${val}${process.env.KEY_JUNK}`
    val = btoa(val)
    i++
  }
  return(val)
}

app.get('/apiKey', function(_, res) {
  res.send(`var openaiApiKey = ${encode(process.env.OPENAI_API_KEY)}`)
});

app.get('/keyJunk', function(_, res) {
  let i = 1
  let val = process.env.KEY_JUNK
  while (i < repeatAmt) {
    val = btoa(val)
    i++
  }
  res.send(val)
});

app.get('/encodeAmt', function(_, res) {
  res.send(`${repeatAmt/16}rem`)
});

app.get('*', (req, res) => {
  let fExt = ''
  if (!!req.path.includes('.') === false) {
    fExt = '.html'
  }
  if (req.hostname.includes('rockgamerak')) {
    res.redirect(`https://${req.hostname.replace('rockgamerak', 'adarshrkumar')}/${req.originalUrl}`)
  }
  else {
    res.sendFile(`${__dirname}/${req.path}${fExt}`)
  }
});

app.listen(5000, () => {
  console.log('server started');
});
