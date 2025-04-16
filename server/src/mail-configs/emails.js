import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  EMAIL_CREATED_SUCCESS_TEMPLATE,
} from "./emailTemplate.js";
import transporter from "./config.js";

const sendVerificationEmail = async (email, verificationToken) => {
  console.log("email from sendverification: ", email);
  console.log("verificationToken from sendverification: ", verificationToken);

  try {
    const mailOptions = {
      from: process.env.SMTP_SENDER_EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{VerificationCode}",
        verificationToken
      ),
    };
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (err) {
    console.log(`Error at sending verification email: ${err}`);
  }
};

const sendWelcomeEmail = async (name, email) => {
  let emailBody = EMAIL_CREATED_SUCCESS_TEMPLATE.replace(
    "{{params.email}}",
    email
  );
  emailBody = emailBody.replace("{{name}}", name);

  console.log("Email Body (Option 1):\n", emailBody);
  try {
    const mailOptions = {
      from: process.env.SMTP_SENDER_EMAIL,
      to: email,
      subject: "Welcome Email",
      html: emailBody,
    };
    await transporter.sendMail(mailOptions);
    console.log("Welcome Email sent Successfully");
  } catch (err) {
    console.log(`Error at sending Welcome email: ${err}`);
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_SENDER_EMAIL,
      to: email,
      subject: "Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    };
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (err) {
    console.log(`Error at sending password reset email: ${err}`);
  }
};

const sendResetSuccessEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_SENDER_EMAIL,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{{name}}", name),
    };
    await transporter.sendMail(mailOptions);
    console.log("Password Reset email sent successfully");
  } catch (err) {
    console.log(`Error at sending Password Reset email: ${err}`);
  }
};

export {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
