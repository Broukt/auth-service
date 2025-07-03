const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createRole = (data) => prisma.role.create({ data });

const getRoleById = (id) => prisma.role.findUnique({ where: { id } });

const getRoleByName = (name) => prisma.role.findUnique({ where: { name } });

module.exports = {
  createRole,
  getRoleById,
  getRoleByName,
};
