/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
function createFetch(fetch, { baseUrl, cookie, schema, graphql }) {
  // NOTE: Tweak the default options to suite your application needs
  return async (url, options) =>
    url.startsWith('/api')
      ? fetch(`${baseUrl}${url}`, options)
      : fetch(url, options);
}

export default createFetch;
