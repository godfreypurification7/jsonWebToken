const { sign } = require('jsonwebtoken');

const createAccessToken = userId => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

const createRefreshToken = userId => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

const sendAccessToken = (res, accessToken, email) => {
  res.send({
    accessToken,
    email,
  });
};

const sendRefreshToken = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    path: '/refresh_token',
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
};