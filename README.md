# Formchat — Interactive Form Builder with Chatbot Widget

> **Full-Stack Conversational Form Platform & Embeddable Chatbot Widget**  
> Built with Next.js (App Router), React 19, TypeScript, Tailwind CSS v3, Prisma ORM, and PostgreSQL.

![Formchat Banner](https://img.shields.io/badge/Formchat-Interactive_Forms_%26_Chatbot-a96325?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)

---

## 🚀 Key Features

### 1. Modern Luxury Aesthetic Landing Page
- **Bronze & Umber Design System**: Editorial warm theme with luxury metallic bronze typography and sleek micro-animations.
- **Pretend Website Live Demo (`#demo`)**: Embedded directly inside a mockup browser window representing *Sunny Side Bakery*, with an interactive conversational form widget embedded on the bottom-right corner.
- **Platform Features**: Highlights conversational UX, multi-type questions, 1-script embed, instant response analytics, and data validation.
- **Workflow Guide**: 4-step illustrated walkthrough from creating questions to embedding on external sites.
- **Floating Widget on Landing Page**: Live embed widget script active on the page itself for real-time testing.

### 2. User Dashboard
- **Analytics Metrics**: Real-time summary cards for Total Forms, Total Responses Collected, Active/Published Forms, and Conversational Completion Rate.
- **Search & Filter**: Search forms by title/description, filter by status (`All`, `Published`, `Draft`).
- **Form Management**: 1-click publish/unpublish toggle, edit form, view submissions, grab embed code, and delete with cascade cleanup.
- **Instant Creation**: 1-click new form generator with pre-configured questions and persona defaults.

### 3. Interactive Form Builder
- **Supported Question Types**:
  - `text` — Short or long open-ended text answers.
  - `email` — Built-in email format regex validation.
  - `multiple_choice` — Customizable choice pills with add/edit/delete options.
  - `yes_no` — Binary thumbs up / thumbs down quick-reply buttons.
- **Question Management**:
  - Add, edit, and delete questions.
  - Move questions up or down to reorder conversational sequences.
  - "Required" toggle to enforce mandatory fields before proceeding.
- **Live Interactive Dual Preview**:
  - Side-by-side interactive testing directly inside the editor.
  - Changes made in the builder (bot name, questions, brand colors) reflect live in real time.
  - Restart conversational preview at any moment with 1 click.
- **Persona & Brand Customization**:
  - Custom bot name and emoji avatar picker (`🥐`, `💬`, `🤖`, `✨`, `⚡`, `💼`, etc.).
  - Brand theme color swatches + custom hex color picker.
  - Custom welcome greetings and completion thank-you messages.

### 4. Conversational Chatbot Widget (`/widget.js`)
- **Step-by-Step Delivery**: Displays questions one at a time with realistic typing animations.
- **Smart Validation**: Validates required questions and email formats with real-time feedback bubbles.
- **Celebration Effects**: Confetti animation and completion cards upon form completion.
- **Restart Capability**: Reset and restart the conversation at any time.
- **Multiple Deployment Modes**:
  1. **Direct Public Form Link**: `/f/[id]` — Standalone full-screen conversational page with Formchat branding.
  2. **Inline iFrame Embed**: `/embed/[id]` — Edge-to-edge embed for blog posts, documentation, and page containers.
  3. **Floating Website Widget (`/widget.js` & `/embed.js`)**: Injects an isolated floating launcher bubble that opens an iframe chat popup on external sites.

### 5. Responses & Submission Management
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
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.0 |
| **Frontend** | React 19 |
| **Styling** | Tailwind CSS v3 (Custom Bronze & Umber Design System) |
| **Icons** | Lucide React |
| **Database** | PostgreSQL via Prisma ORM 6 |
| **Effects** | Canvas Confetti |

---

## 📦 Getting Started & Setup Instructions

### 1. Prerequisites
- **Node.js**: `v18+` (v20+ recommended)
- **npm**: `v9+`
- **PostgreSQL**: `v14+` (local or hosted like Supabase/Neon)

### 2. Installation
Navigate to the project directory:
```bash
cd interactive-form-builder
npm install
```

### 3. Initialize Database & Seed Sample Data
Ensure your `.env` contains your `DATABASE_URL` (e.g. `postgresql://localhost:5432/formchat`), then push the schema to PostgreSQL and seed initial forms:
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
- **Bakery Embed Testbed**: [http://localhost:3000/test-embed.html](http://localhost:3000/test-embed.html)

---

## 🌐 Website Embed Instructions

To embed the floating chatbot widget on any external website (HTML, WordPress, Webflow, Shopify, React, etc.), paste the following script tag before the closing `</body>` tag:

```html
<!-- Formchat Widget Embed -->
<script
  src="http://localhost:3000/widget.js"
  data-form="YOUR_FORM_ID"
  async
></script>
```

### Optional Attributes:
- `data-form` *(required)*: The unique ID of the form from your dashboard.
- `data-color` *(optional)*: Hex color code override for the launcher button (defaults to the form's saved brand color).
- `data-position` *(optional)*: `right` (default) or `left`.
- `data-mode` *(optional)*: `floating` (default) or `inline`.
- `data-open` *(optional)*: Automatically opens the chat on page load.

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
│   ├── widget.js           # Standalone floating chatbot embed script
│   ├── embed.js            # Backward-compatible redirect loader
│   └── test-embed.html     # Sunny Side Bakery external mock testbed
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── forms/      # REST API endpoints (CRUD, publish toggle, config, submissions)
│   │   ├── dashboard/      # Dashboard, Editor, and Submissions management views
│   │   ├── embed/[id]/     # Iframe embed target route
│   │   ├── f/[id]/         # Public standalone form route
│   │   ├── globals.css     # Tailwind v3 directives & custom bronze-metal gradient styles
│   │   ├── layout.tsx      # Root layout with Inter font and Formchat metadata
│   │   └── page.tsx        # Responsive landing page with pretend website demo
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
├── tailwind.config.ts      # Tailwind CSS v3 configuration (umber & bronze palette)
├── postcss.config.js       # PostCSS configuration
└── package.json            # Scripts and dependencies
```

---

## ✅ Completion Criteria Verification

| Requirement | Implementation Status | Verification Details |
|---|---|---|
| **1. Landing Page** | ✅ Complete | Hero, features, workflow, footer, pretend bakery window demo, and live floating widget verified. |
| **2. User Dashboard** | ✅ Complete | Real-time stats, search/filter, form cards, publish toggling, delete with cascade cleanup. |
| **3. Form Builder** | ✅ Complete | Add/edit/reorder/delete questions (text, email, multiple choice, yes/no), required flag, live dual preview. |
| **4. Chatbot Widget** | ✅ Complete | One-question-at-a-time, typing indicator, text input, choice pills, validation, celebration confetti. |
| **5. Responses & Publishing** | ✅ Complete | Database-backed submissions in SQLite, public URLs (`/f/[id]`), submission timestamps, analytics breakdown, CSV/JSON export. |
| **6. Tech Stack** | ✅ Complete | Next.js 16, React 19, TypeScript, Tailwind CSS v3, Prisma ORM, SQLite. |
| **7. External Site Embed** | ✅ Complete | Standalone `/widget.js` script tested on Sunny Side Bakery mock site (`public/test-embed.html`). |
