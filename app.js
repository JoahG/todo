'use strict';

const express = require(`express`),
      app = express(),
      api = require(`./api/v1/index.js`),
      bodyParser = require(`body-parser`),
      fs = require(`fs`);

let PORT = process.env.PORT || 3000;

let getGitHead = (next) => {
  if (process.env.SOURCE_VERSION && process.env.SOURCE_VERSION.length > 0) {
    app.set(`git_head`, process.env.SOURCE_VERSION);
    return next();
  }

  app.set(`git_head`, ``);

  fs.readFile(`.git/HEAD`, `utf8`, (err, data) => {
    if (err) {
      console.log(`ref error 01`);
      return next();
    } 

    let arr = /ref:\s(.*)\n/gi.exec(data);
    if (arr.length > 1) {
      fs.readFile(`.git/${ arr[1] }`, `utf8`, (err, data) => {
        if (err) {
          console.log(`ref error 03`);
          next();
        } else {
          data = data.replace(/\n/gi, ``);

          app.set(`git_head`, data);
          return next();
        }
      });
    } else {
      console.log(`ref error 02`);
      return next();
    }
  });
}

app.use(bodyParser.json());
app.use(`/api/v1`, api);

app.use(express.static(`dist`));
app.use(express.static(`static`)); 

app.get(`/*`, (req, res) => {
  res.end(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Simple List</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="description" content="Create todo lists quickly and share them with a single link.">
        <meta name="keywords" content="Productivity,Todo List,Todo,To do,List,Simple List">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700" rel="stylesheet">
        <link rel="stylesheet" href="/styles.bundle.css?${ app.get(`git_head`) }">
        <link rel="icon" href="/favicon.png">
      </head>
      <body>
        <div id="app"></div>

        <script type="text/javascript" src="/vendor.bundle.min.js?${ app.get(`git_head`) }"></script>
        <script type="text/javascript" src="/app.bundle.min.js?${ app.get(`git_head`) }"></script>

        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-92424942-4"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-92424942-4');
        </script>
      </body>
    </html>
  `.replace(/\n/g, ``).replace(/\s+/g, ` `).replace(/\>\s\</g, `><`));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
});

getGitHead(() => {
  app.listen(PORT, () => {
    console.log(`http server listening on port ${ PORT }`);
  });
});
