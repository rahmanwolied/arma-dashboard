import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma';
import { env } from '../env';

const adapter = new PrismaPg({ connectionString: env.NEON_DB_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
