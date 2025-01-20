import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    return await prisma.user.findMany();
  }

  if (method === 'POST') {
    const body = await readBody(event);
    return await prisma.user.create({ data: body });
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    const { id, ...data } = body;
    return await prisma.user.update({ where: { id }, data });
  }

  if (method === 'DELETE') {
    const query = getQuery(event);
    const id = Number(query.id);
    return await prisma.user.delete({ where: { id } });
  }
});
