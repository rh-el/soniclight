import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.user.upsert({
		where: { username: "admin" },
		update: { isAdmin: true },
		create: { username: "admin", isAdmin: true },
	});
	console.log("Seeded admin user");
}

main()
	.catch((err) => {
		console.error(err);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
