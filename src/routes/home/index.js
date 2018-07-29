/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

async function action({ fetch }) {
  const resp = await fetch('/api/builds', {
    method: 'POST'
  });
  const data = await resp.json();

  if (!data) throw new Error('Failed to load the builds feed.');
  return {
    title: 'Orbis Zone',
    chunks: ['home'],
    component: (
      <Layout>
        <Home builds={data} />
      </Layout>
    )
  };
}

export default action;
