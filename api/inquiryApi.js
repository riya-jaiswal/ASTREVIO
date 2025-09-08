import mongoose from "mongoose";
import joi from "joi";
import nodemailer from "nodemailer";

// ENV VARIABLES
const { MONGODB_URI, GMAIL_USER, GMAIL_PASS } = process.env;

// MONGODB CONNECTION (cached)
let cached = null;
const dbConnection = async () => {
  try {
    if (cached) return cached;
    cached = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      tls: true,
    });
    return cached;
  } catch (error) {
    console.log("DB Connection Error:", error);
  }
};

// INQUIRY SCHEMA
const inquirySchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "* Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "* Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: [true, "* Number is required"] },

    message: { type: String },
  },
  { timestamps: true }
);

const InquiryModel =
  mongoose.models.inquiryModel || mongoose.model("inquiryModel", inquirySchema);

// VALIDATION SCHEMA
const inquiryValidationSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().min(10).required(),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required(),

  message: joi.string(),
});

// NODEMAILER TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// SEND MAIL
const sendMail = async (from, to, subject, template) => {
  try {
    let info = await transporter.sendMail({
      from,
      to,
      subject,
      html: template,
    });
    if (info) console.log("Inquiry Mail Sent ✅");
  } catch (error) {
    console.log("Error Sending Inquiry Mail ❌", error);
  }
};

// FIRM TEMPLATE (to Admin)
const firmTemplate = (data) => {
  let { name, email, phone, subject, message } = data;

  return `
  <!DOCTYPE html>
  <html>
    <body style="font-family:Arial,sans-serif;background:#f7f7f7;padding:20px;">
      <div style="max-width:680px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 10px 20px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#1f1f1f,#444);padding:25px;text-align:center;color:#fff;font-size:26px;font-weight:bold;">
          Vastu Craft - New Inquiry
        </div>
        <div style="padding:30px;">
          <h2 style="color:#333;">📌 New Inquiry Received</h2>
          <table width="100%" cellspacing="0" cellpadding="8" style="margin-top:15px;border-collapse:collapse;">
            <tr><th align="left" style="width:30%;background:#1f1f1f;color:#fff;">Name</th><td>${name}</td></tr>
            <tr><th align="left" style="background:#1f1f1f;color:#fff;">Email</th><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><th align="left" style="background:#1f1f1f;color:#fff;">Contact</th><td><a href="tel:+91${phone}">${phone}</a></td></tr>

            <tr><th align="left" style="background:#1f1f1f;color:#fff;">Message</th><td>${message}</td></tr>
          </table>
        </div>
        <div style="background:#fcfcfc;text-align:center;padding:15px;font-size:13px;color:#777;">
          This email was generated from your website's inquiry form.
        </div>
      </div>
    </body>
  </html>
  `;
};

// USER TEMPLATE (Auto-reply)
const userTemplate = (data) => {
  let { name  } = data;
  return `
  <!DOCTYPE html>
  <html>
    <body style="font-family:Arial,sans-serif;background:#f7f7f7;padding:20px;">
      <div style="max-width:680px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 10px 20px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#1f1f1f,#444);padding:25px;text-align:center;color:#fff;font-size:26px;font-weight:bold;">
          Vastu Craft
        </div>
        <div style="padding:30px;">
          <h2 style="color:#333;">✅ Inquiry Received</h2>
          <p style="color:#555;">Dear ${name}, thank you for your inquiry .
          <p>Our team will get back to you shortly.</p>
          <center>
            <a href="https://www.vastucraft.com" style="display:inline-block;background:#1f1f1f;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:600;">Visit Our Website</a>
          </center>
        </div>
        <div style="background:#fcfcfc;text-align:center;padding:15px;font-size:13px;color:#777;">
          © 2025 Vastu Craft. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
};

// MAIN HANDLER
const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ isSuccess: false, message: "Only POST method allowed" });
  }
  try {
    await dbConnection();

    let { name, phone, email,  message } = req.body;
    let { error } = inquiryValidationSchema.validate({
      name,
      phone,
      email,
     
      message,
    });

    if (error) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Validation Error", error });
    }

    // Save to DB
    let newInquiry = new InquiryModel(req.body);
    let saved = await newInquiry.save();

    if (saved) {
      await Promise.all([
        sendMail(
          GMAIL_USER,
          email,
          "Thanks for your Inquiry",
          userTemplate(req.body)
        ),
        sendMail(
          GMAIL_USER,
          GMAIL_USER,
          `New Inquiry from ${name}`,
          firmTemplate(req.body)
        ),
      ]);

      return res
        .status(201)
        .json({ isSuccess: true, message: "Inquiry Submitted Successfully" });
    } else {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Error Saving Inquiry" });
    }
  } catch (error) {
    console.log("Inquiry API Error:", error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Internal Server Error" });
  }
};

export default handler;
