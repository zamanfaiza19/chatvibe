import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial forms and submissions...");

  // Delete existing records to avoid duplicates on re-seeding
  await prisma.answer.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.question.deleteMany();
  await prisma.form.deleteMany();

  // Create sample published form 1: Product Feedback & Discovery
  const form1 = await prisma.form.create({
    data: {
      title: "Product Feedback & Discovery",
      description: "Gather feedback from early adopters and understand key customer needs.",
      published: true,
      botName: "PulseBot",
      botAvatar: "⚡",
      themeColor: "#4f46e5",
      welcomeMessage: "Hey there! 👋 We'd love your quick feedback to help us build a better experience for you.",
      completionMessage: "Thank you so much! 🎉 Your feedback is incredibly valuable to our team.",
      questions: {
        create: [
          {
            order: 0,
            type: "text",
            title: "What is your full name?",
            description: "Let us know how to address you.",
            placeholder: "e.g. Alex Morgan",
            required: true,
          },
          {
            order: 1,
            type: "email",
            title: "What is your best email address?",
            description: "We will only send a quick thank-you note.",
            placeholder: "alex@company.com",
            required: true,
          },
          {
            order: 2,
            type: "multiple_choice",
            title: "How did you find out about us?",
            description: "Select the option that best matches.",
            options: JSON.stringify(["Twitter / X", "LinkedIn", "Google Search", "Product Hunt", "Friend or Colleague"]),
            required: true,
          },
          {
            order: 3,
            type: "yes_no",
            title: "Would you recommend our tool to colleagues or peers?",
            description: "Be completely honest with us!",
            required: true,
          },
          {
            order: 4,
            type: "text",
            title: "What is one feature you would love to see next?",
            description: "Optional, but we read every single suggestion.",
            placeholder: "I'd love to see...",
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
  const qSource = questions1.find((q) => q.type === "multiple_choice");
  const qRec = questions1.find((q) => q.type === "yes_no");
  const qIdea = questions1.find((q) => q.order === 4);

  if (qName && qEmail && qSource && qRec && qIdea) {
    const sub1 = await prisma.submission.create({
      data: {
        formId: form1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        answers: {
          create: [
            { questionId: qName.id, value: "Sarah Connor" },
            { questionId: qEmail.id, value: "sarah.connor@cyberdyne.org" },
            { questionId: qSource.id, value: "Product Hunt" },
            { questionId: qRec.id, value: "Yes" },
            { questionId: qIdea.id, value: "Real-time webhook notifications when a submission is received!" },
          ],
        },
      },
    });

    const sub2 = await prisma.submission.create({
      data: {
        formId: form1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
        answers: {
          create: [
            { questionId: qName.id, value: "David Miller" },
            { questionId: qEmail.id, value: "david.m@innovate.co" },
            { questionId: qSource.id, value: "LinkedIn" },
            { questionId: qRec.id, value: "Yes" },
            { questionId: qIdea.id, value: "Exporting analytics to Google Sheets" },
          ],
        },
      },
    });

    const sub3 = await prisma.submission.create({
      data: {
        formId: form1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
        answers: {
          create: [
            { questionId: qName.id, value: "Elena Rostova" },
            { questionId: qEmail.id, value: "elena@startup.io" },
            { questionId: qSource.id, value: "Twitter / X" },
            { questionId: qRec.id, value: "No" },
            { questionId: qIdea.id, value: "More theme color customizability and font options." },
          ],
        },
      },
    });
  }

  // Create sample form 2: Website Lead Qualification
  await prisma.form.create({
    data: {
      title: "Website Lead Qualification",
      description: "Embed on your landing page to qualify inbound customer inquiries.",
      published: true,
      botName: "SalesBot",
      botAvatar: "💼",
      themeColor: "#059669",
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
