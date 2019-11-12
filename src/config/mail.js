export default {
  // smtp
  host: process.env.MAIL_HOST,
  port: process.env.PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe GymPoint <noreply@gympoint.com>',
  },
};
// amazon SES
// MailGun
// SparkGun
// Mandril MailChimp
// mailtrap(ambiente dev)
