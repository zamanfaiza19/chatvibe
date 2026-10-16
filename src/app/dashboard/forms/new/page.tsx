import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewFormPage() {
  const newForm = await prisma.form.create({
    data: {
      title: "New Interactive Form",
      description: "Gather feedback and answers conversationally.",
      published: true,
      botName: "FormBot",
      botAvatar: "🤖",
      themeColor: "#4f46e5",
      welcomeMessage: "Hi there! 👋 Thanks for visiting. Could you answer a few quick questions for us?",
      completionMessage: "Thank you! 🎉 We have received your responses.",
      questions: {
        create: [
          {
            order: 0,
            type: "text",
            title: "What is your full name?",
            placeholder: "e.g. Alex Morgan",
            required: true,
          },
          {
            order: 1,
            type: "email",
            title: "What is your email address?",
            placeholder: "alex@example.com",
            required: true,
          },
          {
            order: 2,
            type: "multiple_choice",
            title: "How did you hear about us?",
            options: JSON.stringify(["Twitter / X", "LinkedIn", "Google Search", "Friend / Colleague"]),
            required: true,
          },
        ],
      },
    },
  });

  redirect(`/dashboard/forms/${newForm.id}/edit`);
}
