#!/bin/bash
mkdir -p js
cp static/js/auth0-spa-js.js js/
sed -i "s/YOUR_CLIENT_SECRET/$AUTH0_CLIENT_SECRET/" static/admin/config.yml
npm install