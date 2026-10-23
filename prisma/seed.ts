import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("Seeding Formchat initial forms, users, and submissions...");

  // Delete existing records to avoid duplicates on re-seeding
  await prisma.answer.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.question.deleteMany();
  await prisma.form.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@formchat.app",
      name: "Demo Admin",
      password: hashPassword("password123"),
    },
  });

  // Create sample published form 1: Sunny Side Bakery (Cake Order)
  const form1 = await prisma.form.create({
    data: {
      userId: demoUser.id,
      title: "Sunny Side Bakery",
      description: "Cake ordering form for celebrations, weddings, and events.",
      published: true,
      botName: "Bakery Assistant",
      botAvatar: "🥐",
      themeColor: "#a96325",
      welcomeMessage: "Hi! 👋 Ordering a celebration cake? I’ll take your details in a few quick questions.",
      completionMessage: "Thanks! We’ll email you a quote today. 🎂 (This was a demo — response saved!)",
      questions: {
        create: [
          {
            order: 0,
            type: "text",
            title: "What’s your name?",
            placeholder: "e.g. Maya Lin",
            required: true,
          },
          {
            order: 1,
            type: "email",
            title: "Which email should we send the quote to?",
            placeholder: "maya@example.com",
            required: true,
          },
          {
            order: 2,
            type: "multiple_choice",
            title: "Which flavour would you like?",
            options: JSON.stringify(["Chocolate fudge", "Lemon drizzle", "Carrot & walnut", "Vanilla berry"]),
            required: true,
          },
          {
            order: 3,
            type: "yes_no",
            title: "Do you need it delivered?",
            required: true,
          },
          {
            order: 4,
            type: "text",
            title: "Anything else we should know?",
            placeholder: "Dietary restrictions, decoration ideas, or delivery date...",
            required: false,
          },
        ],
      },
    },
    include: {
      questions: true,
    },
  });

  // Create sample submissions for Form 1
  const questions1 = form1.questions;
  const qName = questions1.find((q) => q.type === "text" && q.order === 0);
  const qEmail = questions1.find((q) => q.type === "email");
  const qFlavour = questions1.find((q) => q.type === "multiple_choice");
  const qDelivery = questions1.find((q) => q.type === "yes_no");
  const qNotes = questions1.find((q) => q.order === 4);

  if (qName && qEmail && qFlavour && qDelivery && qNotes) {
    await prisma.submission.create({
      data: {
        formId: form1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        answers: {
          create: [
            { questionId: qName.id, value: "Maya Lin" },
            { questionId: qEmail.id, value: "maya@example.com" },
            { questionId: qFlavour.id, value: "Chocolate fudge" },
            { questionId: qDelivery.id, value: "Yes" },
            { questionId: qNotes.id, value: "Needs gluten-free if possible! For a birthday on Saturday." },
          ],
        },
      },
    });

    await prisma.submission.create({
      data: {
        formId: form1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14), // 14 hours ago
        answers: {
          create: [
            { questionId: qName.id, value: "Arthur Pendelton" },
            { questionId: qEmail.id, value: "arthur@manor.co.uk" },
            { questionId: qFlavour.id, value: "Lemon drizzle" },
            { questionId: qDelivery.id, value: "No" },
            { questionId: qNotes.id, value: "Will pick up from the bakery at 10 AM sharp." },
          ],
        },
      },
    });

    await prisma.submission.create({
      data: {
        formId: form1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28), // 28 hours ago
        answers: {
          create: [
            { questionId: qName.id, value: "Clara Oswald" },
            { questionId: qEmail.id, value: "clara.o@tardis.org" },
            { questionId: qFlavour.id, value: "Vanilla berry" },
            { questionId: qDelivery.id, value: "Yes" },
            { questionId: qNotes.id, value: "Include 'Happy 30th Anniversary' piped in gold." },
          ],
        },
      },
    });
  }

  // Create sample form 2: Website Lead Qualification
  await prisma.form.create({
    data: {
      userId: demoUser.id,
      title: "Website Lead Qualification",
      description: "Embed on your landing page to qualify inbound customer inquiries.",
      published: true,
      botName: "SalesBot",
      botAvatar: "💼",
      themeColor: "#df9644",
      welcomeMessage: "Hi there! 👋 Interested in working together? Tell us a bit about your project.",
      completionMessage: "Thanks! We'll review your details and reach out within 24 hours.",
      questions: {
        create: [
          {
            order: 0,
            type: "text",
            title: "What is your company or project name?",
            placeholder: "e.g. Acme Studio",
            required: true,
          },
          {
            order: 1,
            type: "email",
            title: "What work email should we reach you at?",
            placeholder: "you@company.com",
            required: true,
          },
          {
            order: 2,
            type: "multiple_choice",
            title: "What is your expected timeline?",
            options: JSON.stringify(["Immediately (< 2 weeks)", "1 - 2 Months", "Planning for next quarter", "Just exploring"]),
            required: true,
          },
          {
            order: 3,
            type: "yes_no",
            title: "Do you have a dedicated budget allocated?",
            required: true,
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
