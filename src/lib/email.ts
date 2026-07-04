import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface SendContactEmailParams {
  name: string;
  email: string;
  company?: string;
  idea: string;
  model: "PAID" | "NOT_SURE";
}

const MODEL_LABELS: Record<SendContactEmailParams["model"], string> = {
  PAID: "Fixed Price",
  NOT_SURE: "Not Sure Yet",
};

export async function sendContactEmail(params: SendContactEmailParams) {
  const { name, email, company, idea, model } = params;

  const contactEmail = process.env.CONTACT_EMAIL || "CONTACT@aiNOW.GE";

  const { data, error } = await getResend().emails.send({
    from: "aiTAXI Website <noreply@aitaxi.ge>",
    to: [contactEmail],
    replyTo: email,
    subject: `New Project Inquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      `Preferred Model: ${MODEL_LABELS[model]}`,
      ``,
      `Idea:`,
      idea,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
