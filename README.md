# 🩺 Patients Management App

A simple patients register and query application built with **Vite**, **React**, **Tailwind CSS**, **shadcn/ui**, and **pglite** (a lightweight, browser-based SQLite database).

## ✨ Features

- 📋 Patient registration form with full validation
- 🎨 Beautiful UI powered by shadcn/ui and Tailwind CSS
- ⚡ Fast development experience with Vite
- 🧠 Client-side database storage using pglite (no backend required)
- 🧾 Emergency contact, insurance details, and medical history tracking

## 📦 Tech Stack

- **Vite** – Next-gen frontend tooling
- **React** – Component-based UI
- **Tailwind CSS** – Utility-first CSS framework
- **shadcn/ui** – Beautifully styled UI components
- **pglite** – In-browser SQLite database powered by WebAssembly
- **zod** – Schema validation for form inputs

## 🛠️ Setup and Usage

### 🔧 Prerequisites

- Node.js (v18 or above)
- [pnpm](https://pnpm.io/) (recommended, but you can use npm or yarn too)

### 📥 Installation

```bash
pnpm install
# or
npm install
```

### 📁 Project Structure
```bash
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components (e.g., PatientForm)
├── lib/            # Utility and helper functions
├── db/             # pglite database setup and queries
└── App.tsx         # Main application component
```
