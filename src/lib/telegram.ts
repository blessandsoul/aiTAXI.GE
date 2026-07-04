interface SendTelegramNotificationParams {
  phone?: string;
  name?: string;
  email?: string;
  message?: string;
}

export async function sendTelegramNotification(
  params: SendTelegramNotificationParams,
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Telegram bot token or chat ID not configured");
  }

  const lines = [`📞 *ახალი მოთხოვნა (aiTAXI)*`, ``];
  if (params.name) lines.push(`👤 სახელი: ${params.name}`);
  if (params.phone) lines.push(`📞 ტელეფონი: \`${params.phone}\``);
  if (params.email) lines.push(`📧 ელფოსტა: ${params.email}`);
  if (params.message) lines.push(``, `💬 ${params.message}`);
  lines.push(``, `_aitaxi.ge · კონტაქტის ფორმა_`);
  const text = lines.join("\n");

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Telegram API error: ${error.description || "Unknown error"}`,
    );
  }

  return response.json();
}

interface SendLeadNotificationParams {
  phone: string;
  name?: string;
  projectType?: string;
  budgetRange?: string;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  source?: string;
}

export async function sendLeadNotification(
  params: SendLeadNotificationParams,
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Telegram bot token or chat ID not configured");
  }

  const lines = [
    `🚕 *ახალი ლიდი (aiTAXI early access)*`,
    ``,
    `ტელეფონი: \`${params.phone}\``,
  ];

  if (params.name) {
    lines.push(`სახელი: ${params.name}`);
  }

  if (params.message) {
    lines.push(`💬 ${params.message}`);
  }

  if (params.source) {
    lines.push(``, `🔗 source: ${params.source}`);
  }

  if (params.utmSource || params.utmCampaign || params.utmContent) {
    lines.push(
      `📊 UTM: ${params.utmSource || "·"} · ${params.utmCampaign || "·"} · zone: ${params.utmContent || "·"}`,
    );
  }

  lines.push(``, `_aitaxi.ge · early access_`);

  const text = lines.join("\n");
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Telegram API error: ${error.description || "Unknown error"}`,
    );
  }

  return response.json();
}
