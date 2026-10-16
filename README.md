# FormCraft — Interactive Form Builder with Chatbot Widget

> **Software Engineer Intern Project Deliverable**  
> Full-Stack Web Application built with Next.js (App Router), React, TypeScript, Tailwind CSS v3, Prisma ORM, and SQLite.

![FormCraft Banner](https://img.shields.io/badge/FormCraft-Interactive_Forms_%26_Chatbot-indigo?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=flat-square&logo=sqlite)

---

## 🚀 Key Features

### 1. Modern Responsive Landing Page
- **Hero Section**: Catchy value proposition, dynamic call-to-action buttons ("Open Dashboard", "Try Live Demo"), and trust metrics.
- **Live Chatbot Widget Demo**: Embedded directly on the landing page so visitors can immediately test the conversational form experience.
- **Platform Features**: Highlights conversational UX, multi-type questions, 1-click script embed, and instant response analytics.
- **Workflow Guide**: 3-step illustrated walkthrough from creating questions to embedding on external sites.
- **Footer**: Navigation links, feature tags, and quick-access resources.

### 2. User Dashboard
- **Analytics Metrics**: Real-time summary cards for Total Forms, Total Submissions Collected, Active/Published Forms, and Completion Rate.
- **Search & Filter**: Search forms by title/description, filter by status (`All`, `Published`, `Draft`).
- **Form Management**: 1-click publish/unpublish toggle, edit form, view submissions, grab embed code, and delete with cascade cleanup.
- **Instant Creation**: Create blank forms or start from templates.

### 3. Interactive Form Builder
- **Supported Question Types**:
  - `text` — Short or long open-ended text.
  - `email` — Built-in email format regex validation.
  - `multiple_choice` — Customizable choice pills with add/edit/delete options.
  - `yes_no` — Binary thumbs up / thumbs down quick-reply buttons.
- **Question Management**:
  - Add, edit, and delete questions.
  - Move questions up or down to reorder the conversational sequence.
  - "Required" toggle to enforce mandatory fields before proceeding.
- **Live Interactive Dual Preview**:
  - Side-by-side interactive testing directly inside the editor.
  - Changes made in the builder (bot name, questions, brand colors) reflect live in real time.
- **Persona & Brand Customization**:
  - Custom bot name and emoji avatar picker (`🤖`, `✨`, `⚡`, `💼`, etc.).
  - Brand theme color swatches + custom hex color picker.
  - Custom welcome greetings and completion thank-you messages.

### 4. Conversational Chatbot Widget
- **Step-by-Step Delivery**: Displays questions one at a time with realistic typing animations.
- **Smart Validation**: Validates required questions and email formats with real-time feedback bubbles.
- **Celebration Effects**: Confetti animation and completion cards upon form completion.
- **Restart Capability**: Reset and restart the conversation at any time.
- **Multiple Deployment Modes**:
  1. **Direct Public Form Link**: `/f/[id]` — Clean, standalone full-screen conversational page.
  2. **Inline iFrame Embed**: `/embed/[id]` — Edge-to-edge embed for blog posts, documentation, and page containers.
  3. **Floating Website Widget (`/embed.js`)**: Injects a sleek floating launcher button that expands a responsive chat popup on external sites.

### 5. Responses & Submission Management
- **Unique Shareable URLs**: Share direct links (`/f/[id]`) across email campaigns or social media.
- **Submissions Table**: Individual records with formatted timestamps, time-ago indicators, and answers per question.
- **Visual Analytics Breakdown**:
  - Multiple choice & Yes/No question bar charts with percentages and counts.
  - Response text lists for open-ended questions.
- **Data Export**: 1-click **Export to CSV** and **Export to JSON**.
- **Publish Toggle**: Instant control to publish or pause receiving submissions.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript |
| **Frontend** | React 19 |
| **Styling** | Tailwind CSS v3 (with PostCSS and Autoprefixer) |
| **Icons** | Lucide React |
| **Database** | SQLite via Prisma ORM 6 |
| **Effects** | Canvas Confetti |

---

## 📦 Getting Started & Setup Instructions

### 1. Prerequisites
- **Node.js**: `v18+` (v20+ recommended)
- **npm**: `v9+`

### 2. Installation
Clone or navigate to the project directory:
```bash
cd interactive-form-builder
npm install
```

### 3. Initialize Database & Seed Sample Data
Push the Prisma schema to generate the SQLite database and seed starter forms:
```bash
npm run db:push
npm run db:seed
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **User Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **External Embed Test Site**: [http://localhost:3000/test-embed.html](http://localhost:3000/test-embed.html)

---

## 🌐 Website Embed Instructions

To embed the floating chatbot widget on any external website (HTML, WordPress, Webflow, Shopify, React, etc.), paste the following script tag before the closing `</body>` tag:

```html
<!-- FormCraft Chatbot Widget Embed -->
<script
  src="http://localhost:3000/embed.js"
  data-form-id="YOUR_FORM_ID"
  data-color="#4f46e5"
  data-position="right"
  defer
></script>
```

### Attributes:
- `data-form-id` *(required)*: The unique ID of the form from your dashboard.
- `data-color` *(optional)*: Hex color code for the floating launcher button.
- `data-position` *(optional)*: `right` (default) or `left`.

You can also test this immediately by visiting the included mock website at:  
👉 **[http://localhost:3000/test-embed.html](http://localhost:3000/test-embed.html)**

---

## 📂 Project Directory Structure

```text
interactive-form-builder/
├── prisma/
│   ├── schema.prisma       # Prisma data model (Form, Question, Submission, Answer)
│   └── seed.ts             # Initial starter forms and submissions seed script
├── public/
│   ├── embed.js            # Standalone floating chatbot embed script
│   └── test-embed.html     # Mock external third-party site demo
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── forms/      # REST API endpoints (CRUD, publish toggle, submissions)
│   │   ├── dashboard/      # Dashboard and Submissions management views
│   │   ├── embed/[id]/     # Iframe embed target route
│   │   ├── f/[id]/         # Public standalone form route
│   │   ├── globals.css     # Tailwind v3 directives & custom glassmorphism styles
│   │   ├── layout.tsx      # Root layout with Inter font and metadata
│   │   └── page.tsx        # Responsive landing page with live chatbot demo
│   ├── components/
│   │   ├── ChatbotWidget.tsx  # Conversational chat component with typing animations
│   │   ├── FormBuilder.tsx    # Drag-and-drop/reorder editor with live dual preview
│   │   ├── EmbedModal.tsx     # Copy script & iframe modal
│   │   ├── Navbar.tsx         # Responsive navigation bar
│   │   └── Footer.tsx         # Modern footer
│   ├── lib/
│   │   ├── prisma.ts       # Singleton Prisma client instance
│   │   └── utils.ts        # Formatting, class merging, and email validation
│   └── types/
│       └── index.ts        # TypeScript data contracts
├── tailwind.config.ts      # Tailwind CSS v3 configuration
├── postcss.config.js       # PostCSS configuration
└── package.json            # Scripts and dependencies
```

---

## ✅ Completion Criteria Verification

| Requirement | Implementation Status | Verification Details |
|---|---|---|
| **1. Landing Page** | ✅ Complete | Hero, features, workflow, footer, and live chatbot widget demo verified. |
| **2. User Dashboard** | ✅ Complete | Displays total forms and responses, status badges, create, edit, delete, and publish toggling. |
| **3. Form Builder** | ✅ Complete | Add/edit/reorder/delete questions (text, email, multiple choice, yes/no), required flag, live dual preview. |
| **4. Chatbot Widget** | ✅ Complete | One-question-at-a-time, typing indicator, text input, choice pills, validation, celebration, floating embed script. |
| **5. Responses & Publishing** | ✅ Complete | Database-backed submissions in SQLite, public URLs (`/f/[id]`), submission timestamps, analytics breakdown, CSV/JSON export. |
| **6. Tech Stack** | ✅ Complete | Next.js, React, TypeScript, Tailwind CSS v3, Prisma ORM, SQLite. |
| **7. External Site Embed** | ✅ Complete | Verified on mock external site (`public/test-embed.html`) via floating launcher button. |
