import express                          from 'express';
import React                            from 'react';
import { renderToString }               from 'react-dom/server';
import { RouterContext, match }         from 'react-router';
import { Provider }                     from 'react-redux';
import { createStore, combineReducers } from 'redux';
import createLocation                   from 'history/lib/createLocation';
import routes                           from 'routes';
import * as reducers                    from 'reducers';

const app = express();

app.use((req, res) => {
  const location  = createLocation(req.url);
  const reducer   = combineReducers(reducers);
  const store     = createStore(reducer);

  match({ routes, location }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end('Internal server error');
    }
    if (!renderProps) {
      return res.status(404).end('Not found.');
    }

    const InitialComponent = (
      <Provider store={ store }>
        <RouterContext { ...renderProps } />
      </Provider>
    );
    const componentHTML = renderToString(InitialComponent);
    const initialState = store.getState();

    const HTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
          <title>Tic Tac Toe Demo</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
          <link href='https://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
          <script type="text/javascript">
            window.__INITIAL_STATE__ = ${ JSON.stringify(initialState) };
          </script>
        </head>
        <body>
          <div id="main" class="container">${ componentHTML }</div>
          <script type="application/javascript" src="/bundle.js"></script>
        </body>
      </html>
    `
    res.end(HTML);
  });
});

export default app;