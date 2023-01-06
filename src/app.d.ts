/// <reference types="unplugin-icons/types/svelte" />

declare namespace App {
	interface Session {
		issued: Date;
		expires?: Date;
		user: {
			id: string;
			name: string;
			email: string;
			role: {
				name: string;
				permissions: string[];
			}
		}
	}

	// interface Error {}
	interface Locals {
		session?: Session;
		sessionIssuer: import('$lib/server/auth/session-issuer').default<Session>;
		db: import("@prisma/client").PrismaClient;
	}
	// interface PageData {}
	// interface Platform {}
}
