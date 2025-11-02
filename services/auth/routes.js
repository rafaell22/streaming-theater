import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';

import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CLIENT_ID = '';
const RESPONSE_TYPE = 'code';

export default function addAuthRoutes(app) {
  const state = crypto.randomUUID();
  app.get('/auth', (req, res) => {
    res.redirect(`https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=http://localhost:8080/auth/redirect&response_type=${RESPONSE_TYPE}&state=${state}&scope=channel%3Amanage%3Abroadcast+user%3Abot+user%3Aread%3Achat+user%3Awrite%3Achat`);
  });

  app.use('/authorized', express.static(join(__dirname, 'public/auth/authorized.html')));
}
