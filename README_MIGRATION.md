# Pusat Informasi Migration Guide

This project has been migrated to Next.js with Tailwind CSS and Supabase support.

## Getting Started

1.  **Install dependencies** (if you haven't):
    ```bash
    npm install
    ```

2.  **Supabase Setup**:
    *   Create a new project on [Supabase.com](https://supabase.com/).
    *   Go to the **SQL Editor** in Supabase and run the contents of `schema.sql`.
        *   This will create the tables (profiles, categories, posts) and set up the Admin/Superadmin roles.
    *   Go to **Project Settings > API**.
    *   Copy the `URL` and `anon` public key.
    *   Create a `.env.local` file in the root of `pusat-informasi-web`:
        ```env
        NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
        NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
        ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Project Structure

*   `src/app/page.tsx`: Homepage (Public).
*   `src/app/login/page.tsx`: Login page (Admin & Superadmin).
*   `src/app/admin/dashboard`: Blue-themed Admin Dashboard.
*   `src/app/superadmin/dashboard`: Purple-themed Superadmin Dashboard.
*   `src/components`: Reusable components (Navbar, Sidebar, etc.).
*   `src/lib/supabase`: Supabase client configuration.

## Deployment

This project is ready for Vercel.
1.  Push this folder to GitHub.
2.  Import into Vercel.
3.  Add the Environment Variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) in Vercel settings.
