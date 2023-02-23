# Todo List

## Demo Video
[TodoList demo video](https://www.loom.com/share/5bd490dc69fd449292e60e74a8739ccc)

## Architecture
![arch](https://user-images.githubusercontent.com/315504/220501996-4dd69d57-569f-4760-a190-521c16d5a9ca.png)

## DB

```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY,
    task_description TEXT NOT NULL,
    task_order INTEGER NOT NULL
);
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/todos](http://localhost:3000/api/todos/index.ts). This endpoint can be edited in `pages/api/todos/index.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
