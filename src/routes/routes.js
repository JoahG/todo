'use strict';

import App from '../components/App.jsx';

const buildRoute = (name, path) => {
  return {
    path: `/${ path !== undefined ? path : name }`,
    getComponent: (location, cb) => {
      System.import(`./${ name }.jsx`)
        .then((module) => cb(null, { main: module.default }));
        // .catch((err) => console.debug(`Dynamic page loading failed ${ err }`));
    }
  };
};

export default {
  component: App,
  childRoutes: [
    buildRoute(`list`, ``),
    buildRoute(`list`, `:id`),
  ]
};
