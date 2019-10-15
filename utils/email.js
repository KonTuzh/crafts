const path = require('path');
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.siteName = process.env.SITE_NAME;
    this.url = url;
    this.from = `${this.siteName} <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  renderHtml(template, data) {
    return pug.renderFile(
      path.join(__dirname, '..', `views/emails/${template}.pug`),
      data
    );
  }

  async send(html, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(password = null) {
    const data = {
      firstName: this.firstName,
      email: this.to,
      password,
      url: this.url,
      subject: `Добро пожаловать на ${this.siteName}!`
    };
    const html = this.renderHtml('welcome', data);
    await this.send(html, data.subject);
  }

  async sendPasswordReset() {
    const data = {
      firstName: this.firstName,
      url: this.url,
      subject: `[${this.siteName}] Сбросить пароль`
    };
    const html = this.renderHtml('passwordReset', data);
    await this.send(html, data.subject);
  }

  async sendPasswordResetAfter() {
    const data = {
      firstName: this.firstName,
      url: this.url,
      subject: `[${this.siteName}] Ваш пароль был сброшен`
    };
    const html = this.renderHtml('passwordResetAfter', data);
    await this.send(html, data.subject);
  }

  async sendCommentNotification(comment) {
    const data = {
      firstName: this.firstName,
      comment,
      url: this.url,
      subject: `[${this.siteName}] Новый комментарий`
    };
    const html = this.renderHtml('commentNotification', data);
    await this.send(html, data.subject);
  }
};
