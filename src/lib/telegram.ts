const TELEGRAM_TOKEN = '8703522924:AAHEyGayTaCgNZwVXcUTuFy0CvMZEcmlGwE'; // Substitua pelo seu Token
const CHAT_ID = '-5243764853'; // Substitua pelo Chat ID do seu grupo

export const sendTelegramNotification = async (message: string) => {
  if (TELEGRAM_TOKEN === '8703522924:AAHEyGayTaCgNZwVXcUTuFy0CvMZEcmlGwE' || CHAT_ID === '-5243764853') return;

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('Erro ao enviar notificação para o Telegram:', error);
  }
};
