const prisma = require("../database/prisma");
const { jwtExpiresIn } = require("../config/env");
const ms = require("ms");

const createToken = (token) => {
  const expiresAt = new Date(Date.now() + ms(jwtExpiresIn));

  return prisma.tokenBlacklist.create({
    data: {
      token,
      expiresAt,
    },
  });
};

const getTokenById = (id) =>
  prisma.tokenBlacklist.findUnique({ where: { id } });

const getTokenByValue = (value) =>
  prisma.tokenBlacklist.findUnique({ where: { token: value } });

module.exports = {
  createToken,
  getTokenById,
  getTokenByValue,
};
