const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              frame-src https://nowpayments.io;
              script-src 'self' https://nowpayments.io;
              style-src 'self' 'unsafe-inline';
              img-src 'self' https://*.nowpayments.io data:;
              connect-src 'self' https://api.nowpayments.io;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig