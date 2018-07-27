/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Build from './Build';
import Layout from '../../components/Layout';

async function action({ fetch, params }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `{build(shortid: "${
        params.id
      }"){id,author,Modules,description,title,author,coriolisShip}}`
    })
  });
  const { data } = await resp.json();
  if (!data) throw new Error('Failed to load the builds feed.');
  return {
    title: 'Orbis Zone',
    chunks: ['build'],
    component: (
      <Layout>
        <Build build={[data.build]} />
      </Layout>
    )
  };
}

export default action;
