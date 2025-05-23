# YTBlogX

YTBlogX is a tool that converts YouTube videos into blog posts. It leverages Next.js for a performant user interface and Prisma for database management, providing a streamlined workflow for content creation. The application includes features for video processing, transcript extraction, and blog post generation.

## 🧰 Technology Stack

| Technology        | Purpose/Role                                                                       |
| ----------------- | ---------------------------------------------------------------------------------- |
| Next.js           | React framework for server-side rendering and routing.                             |
| Prisma            | ORM for database access and schema management (PostgreSQL).                        |
| TypeScript        | Adds static typing to JavaScript.                                                  |
| Tailwind CSS      | Utility-first CSS framework for styling.                                           |
| Radix UI          | UI component library for accessible and customizable components.                   |
| Framer Motion     | Motion library for animations and transitions.                                     |
| ReactMarkdown     | Library for rendering markdown content.                                            |
| rehype-prism-plus | Syntax highlighting for code blocks in markdown.                                   |
| NextAuth.js       | Authentication library for user management and session handling (Google provider). |
| Pusher            | Real-time messaging service for live log updates.                                  |
| Shadcn UI         | UI component library for building the user interface.                              |
| Lucide-React      | React icon library.                                                                |
| Sonner            | Library for displaying toast notifications.                                        |

## 📁 File Structure and Purpose

| File Path                                                        | Description                                                                                                      |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `interfaces/*`                                                   | Type definitions for various data structures (NextAuth user, site config, table of contents, video information). |
| `components/global/*`                                            | Global UI components for layout and animations (fade-in, max-width wrapper).                                     |
| `components/dashboard/*`                                         | Components specific to the dashboard UI (left sidebar, video list, navbar, video card, transcript extractor).    |
| `lib/prisma.ts`                                                  | Provides a Prisma client instance for database interactions.                                                     |
| `lib/service-auth.ts`                                            | Handles the creation of JSON Web Tokens (JWTs) for service authentication.                                       |
| `app/(home)/*`                                                   | Components and pages for the home page (hero section, layout, main page).                                        |
| `lib/api.ts`                                                     | Defines API endpoints for fetching video data.                                                                   |
| `lib/markdown.tsx`                                               | Renders markdown content with syntax highlighting.                                                               |
| `config/site.ts`                                                 | Defines the configuration for the site (name, description, URLs).                                                |
| `prisma/migrations/*`                                            | Database migration scripts for schema changes.                                                                   |
| `app/video/[videoId]/*`                                          | Pages and components for displaying video details, blogs, and logs.                                              |
| `middleware.ts`                                                  | Middleware for authentication and route protection.                                                              |
| `app/globals.css`                                                | Global styles for the application.                                                                               |
| `package-lock.json`                                              | Lockfile for managing project dependencies.                                                                      |
| `components/ui/*`                                                | Reusable UI components (textarea, tooltip, accordion, buttons, etc.).                                            |
| `hooks/use-mobile.tsx`                                           | Hook for detecting mobile viewports.                                                                             |
| `.eslintrc.json`                                                 | ESLint configuration.                                                                                            |
| `README.md`                                                      | Project README file.                                                                                             |
| `components.json`                                                | Shadcn UI component configuration.                                                                               |
| `package.json`                                                   | Project metadata, dependencies, and scripts.                                                                     |
| `tailwind.config.ts`                                             | Tailwind CSS configuration.                                                                                      |
| `tsconfig.json`                                                  | TypeScript compiler options.                                                                                     |
| `app/not-found.tsx`                                              | 404 Not Found page.                                                                                              |
| `app/dashboard/*`                                                | Components and pages for the dashboard.                                                                          |
| `prisma/schema.prisma`                                           | Prisma schema for the database.                                                                                  |
| `lib/pusher/client.ts`                                           | Pusher client initialization.                                                                                    |
| `app/auth/sign-in/page.tsx`                                      | Sign-in page using NextAuth.js.                                                                                  |
| `components/provider/*`                                          | Provider components for global state management (toast notifications, session).                                  |
| `lib/utils.ts`                                                   | Utility functions.                                                                                               |
| `app/api/video/start-process/route.ts`                           | API route to initiate video processing.                                                                          |
| `app/video/[videoId]/blog/[blogId]/*`                            | Pages and components for displaying individual blog posts.                                                       |
| `prisma/migrations/20250316060129_added_part_blog/migration.sql` | Migration adding 'part' column to 'Blog' table.                                                                  |
| `app/api/auth/[...nextauth]/route.ts`                            | NextAuth.js authentication routes.                                                                               |
| `app/api/video/get-all/route.ts`                                 | API route to retrieve all user videos.                                                                           |
