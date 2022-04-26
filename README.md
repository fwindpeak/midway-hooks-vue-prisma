## midway-hooks-vue-prisma

demo

[midway-hooks](https://github.com/midwayjs/hooks/) + vue + vite + [prisma](https://github.com/prisma/prisma) + sqlite

## Init

```sh
yarn
yarn db-init
yarn dev
```

**如果`prisma seed`运行失败，可以手动运行`ts-node prisma/seed.ts`**

## Commands

- `npm run dev`: Starts the development server
- `npm run build`: Builds the application for production
- `npm run start`: Runs the application in production mode
- `npm run db-init`: Init database

## File Structure

- `src`: source code, include backend and frontend
  - `api`: backend code
  - `others`: frontend code
- `public`: static files
- `midway.config.ts`: project config
- `index.html`: entry file
