import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const CONTACT_METHODS = {
  phone: 'Звонок по телефону',
  telegram: 'Telegram',
  max: 'MAX',
};
const FORM_TYPES = {
  price: 'Уточнить цену',
  selection: 'Помощь в подборе',
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[character]);
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Неверный формат данных' }, { status: 400 });
  }

  try {
    const method = String(data.contact_method || '');
    const contact = String(data.contact_value || '').trim();
    const formType = String(data.form_type || '');

    if (!CONTACT_METHODS[method] || !FORM_TYPES[formType] || !contact || !data.agreeToPrivacy) {
      return NextResponse.json({ success: false, message: 'Проверьте контактные данные и согласие на обработку.' }, { status: 400 });
    }

    const submittedAt = new Date().toLocaleString('ru-RU');
    const pageUrl = String(data.pageUrl || 'не указано');
    const clientIp = request.headers.get('x-forwarded-for') || 'не доступно';

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.log('SMTP не настроен, логируем заявку:', { method, contact, formType, pageUrl, submittedAt });
      return NextResponse.json({
        success: true,
        message: 'Заявка принята (SMTP не настроен)',
        note: 'Заявка записана в лог',
        timestamp: new Date().toISOString(),
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 465,
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const safeContact = escapeHtml(contact);
    const safePageUrl = escapeHtml(pageUrl);
    const safeIp = escapeHtml(clientIp);
    const formLabel = FORM_TYPES[formType];
    const methodLabel = CONTACT_METHODS[method];
    const mailText = `НОВАЯ ЗАЯВКА С САЙТА TRUCK-IMPORT\n\nТип заявки: ${formLabel}\nСпособ связи: ${methodLabel}\nКонтакт: ${contact}\nСогласие с политикой: ДА\nДата: ${submittedAt}\nСтраница: ${pageUrl}\nIP: ${clientIp}`;
    const mailHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;color:#333"><h2>Новая заявка с сайта Truck Import</h2><p><b>Тип заявки:</b> ${escapeHtml(formLabel)}</p><p><b>Способ связи:</b> ${escapeHtml(methodLabel)}</p><p><b>Контакт:</b> ${safeContact}</p><p><b>Согласие с политикой:</b> Да</p><p><b>Дата:</b> ${escapeHtml(submittedAt)}</p><p><b>Страница:</b> ${safePageUrl}</p><p><b>IP:</b> ${safeIp}</p></body></html>`;

    await transporter.sendMail({
      from: `"Truck Import - Заявка" <${process.env.SMTP_USER}>`,
      to: process.env.ORDER_EMAIL || process.env.SMTP_USER,
      subject: `Новая заявка: ${formLabel}`,
      text: mailText,
      html: mailHTML,
    });

    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Ошибка отправки заявки:', error);
    const message = error.code === 'EAUTH'
      ? 'Ошибка авторизации почтового сервера'
      : error.code === 'ECONNECTION'
        ? 'Ошибка подключения к почтовому серверу'
        : 'Ошибка при отправке заявки';
    return NextResponse.json({ success: false, message, error: error.message }, { status: 500 });
  }
}
