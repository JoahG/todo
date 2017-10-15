'use strict';

const API_URL = `/api/v1`;

const $ = (options) => {
  let request = new XMLHttpRequest(),
    time = new Date(),
    params = options.params ? `?${ Object.keys(options.params)
                  .map((opt) => {
                    return `${ opt }=${ options.params[opt] }`;
                  }).join(`&`) }` : ``;



  request.onreadystatechange = () => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200 && !request._hasError) {
      options.success && options.success(JSON.parse(request.responseText));
    } else {
      options.error && options.error(JSON.parse(request.responseText));
    }
  };

  request.open(
      options.type || `GET`, 
      `${ API_URL }${ options.url }${ params }`);
  
  if (options.hasOwnProperty(`contentType`)) {
    request.setRequestHeader(`Content-Type`, options.contentType);
  } else {
    request.setRequestHeader(`Content-Type`, `application/json`);
  }

  request.send(JSON.stringify(options.body) || undefined);
};


export { $ };
