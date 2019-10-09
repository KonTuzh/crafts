const path = require('path');
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `CraftHub <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
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
      subject: 'Добро пожаловать на CraftHub!'
    };
    const html = this.renderHtml('welcome', data);
    await this.send(html, data.subject);
  }

  async sendPasswordReset() {
    const data = {
      firstName: this.firstName,
      url: this.url,
      subject: '[CraftHub] Сбросить пароль'
    };
    const html = this.renderHtml('passwordReset', data);
    await this.send(html, data.subject);
  }

  async sendPasswordResetAfter() {
    const data = {
      firstName: this.firstName,
      url: this.url,
      subject: '[CraftHub] Ваш пароль был сброшен'
    };
    const html = this.renderHtml('passwordResetAfter', data);
    await this.send(html, data.subject);
  }

  async sendCommentNotification(comment) {
    console.log('sendCommentNotification', comment);
    const data = {
      firstName: this.firstName,
      comment,
      url: this.url,
      subject: '[CraftHub] Новый комментарий'
    };
    const html = this.renderHtml('commentNotification', data);
    await this.send(html, data.subject);
  }
};
