declare namespace Prisma {
    export interface PrismaClient {
        genre: Prisma.GenreDelegate<ExtArgs, ClientOptions>;
    }
}