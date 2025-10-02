import nodemailer from "nodemailer";
import Mailgen from "mailgen";

export const sendEmail = async (options) => {
  try {
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "SkillSwap",
        link: "https://mailgen.js/",
        logo: "https://mailgen.js/img/logo.png",
      },
    });

    // Generate an HTML email with the provided contents
    const emailBody = mailGenerator.generate(options.mailgencontent);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    const emailText = mailGenerator.generatePlaintext(options.mailgencontent);

    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
      },
    });

    const mailConfig = {
      from: process.env.SMTP_USER || '',
      to: options.email,
      subject: options.subject,
      text: emailText,
      html: emailBody,
    };

    try {
      await transporter.sendMail(mailConfig);
      console.log("Mail Sent....");
    } catch (error) {
      console.error("Error in sending mail", error.message);
    }
  } catch (error) {
    console.error("Error in mail generator", error.message);
  }
};

export const verificationEmailTemplate = (username, verifyURL) => {
  return {
    body: {
      name: `${username} !`,
      intro:
        "Thanks for signing up for Mailgen. We're very excited to have you on board.",
      action: {
        instructions:
          "To get started using Mailgen, please confirm your account below:",
        button: {
          color: "#22BC66", // Green like in screenshot
          text: "Confirm your account",
          link: `${process.env.FRONTEND_URL}/verify-email/${verifyURL}`,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export const resetPasswordTemplate = (username, verifyURL) => {
  return {
    body: {
      name: username,
      intro:
        "You have received this email because a password reset request for your account was received.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#DC4D2F", // red/pink button color
          text: "Reset your password →",
          link: `http://localhost:5000/api/v1/user/changepassword/${verifyURL}`,
        },
      },
      outro:
        "If you did not request a password reset, no further action is required on your part.",
    },
  };
};
