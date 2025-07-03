const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = (data) => prisma.user.create({ data });

const getUserById = (id) => prisma.user.findUnique({ where: { id } });

const getUserByEmail = (email) => prisma.user.findUnique({ where: { email } });

const updateUserPassword = (id, password) =>
  prisma.user.update({
    where: { id },
    data: { password },
  });

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserPassword,
};
