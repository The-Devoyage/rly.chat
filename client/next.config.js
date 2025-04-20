const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // optional
});

module.exports = withPWA({
  reactStrictMode: true,
});

