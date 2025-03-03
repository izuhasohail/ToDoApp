# To-Do App

This is a **To-Do List** application built with **Next.js**, **TypeScript**, and **Prisma**, featuring authentication, task management, and CRUD operations.

## Features
- User authentication with **NextAuth.js**
- Create, Read, Update, Delete (CRUD) tasks
- Task completion tracking
- API routes for handling tasks
- Secure database integration with **Prisma & PostgreSQL**
- Deployment ready with **Vercel**

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Authentication:** NextAuth.js
- **Database:** PostgreSQL
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** (or a cloud database like Supabase)

### Installation

Clone the repository:

```bash
git clone https://github.com/izuhasohail/ToDoApp
cd ToDoApp

Install dependencies:
 - npm install
# or
 - yarn install

Environment Variables:
Create a .env file in the root directory and add the following:

- DATABASE_URL
- NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET


API Routes
GET /api/tasks/[taskId] → Fetch a single task
PATCH /api/tasks/[taskId] → Update a task
DELETE /api/tasks/[taskId] → Delete a task
POST /api/tasks → Create a new task





