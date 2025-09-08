import mongoose from "mongoose";
import joi from "joi";
import nodemailer from "nodemailer";

// ENV VARIABLED IMPORT
const { MONGODB_URI, GMAIL_USER, GMAIL_PASS } = process.env;

// MONGODB DATABASE CONNECTION
let cached = null;
const dbConnection = async () => {
  try {
    if (cached) {
      return cached;
    }
    cached = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      tls: true,
    });
    return cached;
  } catch (error) {
    console.log("Error While Connecting Database", error);
  }
};

// MONGODB SCHEMA
const contactSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "* Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "* Email is required"],
      lowercase: true,
      unique: true,
      trim: true,
    },
    phone: { type: Number, required: [true, "* Number is required"] },
    message: { type: String },
  },
  { timestamps: true }
);

const ContactModel =
  mongoose.models.contactModel || mongoose.model("contactModel", contactSchema);

// VALIDATION SCHEMA
const contactValidationSchema = joi.object({
  name: joi.string().required(),
  phone: joi.number().required(),
  email: joi.string().email({ tlds: { allow: false } }).required(),
});

// ✅ Gmail Transporter
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
    let info = await transporter.sendMail({ from, to, subject, html: template });
    if (info) {
      console.log("Mail Sent Successfully");
    }
  } catch (error) {
    console.log("Error While Sending Mail", error);
  }
};

// firm Template (For Admin)
const firmTemplate = (data) => {
  let { name, email, phone, message } = data;

  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; background:#f7f7f7; padding:20px;">
        <div style="max-width:680px; margin:auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 10px 20px rgba(0,0,0,0.1)">
          <div style="background:linear-gradient(135deg,#f56015,#ffa94d); padding:25px; text-align:center; color:#fff; font-size:26px; font-weight:bold;">
            Vastu Craft
          </div>
          <div style="padding:30px;">
            <h2 style="color:#333;">📩 New Contact Form Submission</h2>
            <table width="100%" cellspacing="0" cellpadding="8" style="margin-top:15px; border-collapse:collapse;">
              <tr><th align="left" style="width:30%; background:#f56015; color:#fff;">Name</th><td>${name}</td></tr>
              <tr><th align="left" style="background:#f56015; color:#fff;">Email</th><td><a href="mailto:${email}">${email}</a></td></tr>
              <tr><th align="left" style="background:#f56015; color:#fff;">Contact</th><td><a href="tel:+91${phone}">${phone}</a></td></tr>
              <tr><th align="left" style="background:#f56015; color:#fff;">Message</th><td>${message}</td></tr>
            </table>
          </div>
          <div style="background:#fcfcfc; text-align:center; padding:15px; font-size:13px; color:#777;">
            This email was generated from your website's contact form.
          </div>
        </div>
      </body>
    </html>
  `;
};

// user Template (For User)
const userTemplate = (data) => {
  let { name } = data;
  return `
  <!DOCTYPE html>
  <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background:#f7f7f7; padding:20px;">
      <div style="max-width:680px; margin:auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 10px 20px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#f56015,#ffa94d); padding:25px; text-align:center; color:#fff; font-size:26px; font-weight:bold;">
          Vastu Craft
        </div>
        <div style="padding:30px;">
          <h2 style="color:#333;">✅ Thank You for Your Submission</h2>
          <p style="color:#555;">Dear ${name}, thank you for contacting <b>Vastu Craft</b>! We’ve received your message and will get back to you soon.</p>
          <p style="margin-top:20px;">Meanwhile, you can explore our website to learn more about our services.</p>
          <center><a href="https://www.vastucraft.com" style="display:inline-block; background:linear-gradient(90deg,#f56015,#f87e42); color:#fff; padding:12px 28px; border-radius:50px; text-decoration:none; font-weight:600;">Visit Our Website</a></center>
        </div>
        <div style="background:#fcfcfc; text-align:center; padding:15px; font-size:13px; color:#777;">
          © 2025 Vastu Craft. All rights reserved.
        </div>
      </div>
    </body>
  </html>`;
};

// MAIN FUNCTION
const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ isSuccess: false, message: "Only Post Method Is Allowed" });
  }
  try {
    await dbConnection();
    let { name, phone, email, message } = req.body;
    let { error } = contactValidationSchema.validate({ name, phone, email });
    if (error) {
      return res.status(400).json({ isSuccess: false, message: "Validation Error", error });
    }

    let isDataExist = await ContactModel.findOne({ $or: [{ email }, { phone }] });
    if (isDataExist) {
      return res.status(409).json({ isSuccess: false, message: "Data Already Exists" });
    }

    let newContact = new ContactModel({...req.body,phone:Number(phone)});
    let isSaved = await newContact.save();
    if (isSaved) {
      await Promise.all([
        sendMail(GMAIL_USER, email, "Thanks for Contacting Vastu Craft", userTemplate(req.body)),
        sendMail(GMAIL_USER, GMAIL_USER, `New Contact Request from ${name}`, firmTemplate(req.body)),
      ]);
      res.status(201).json({ isSuccess: true, message: "New Contact Details Added Successfully" });
    } else {
      return res.status(400).json({ isSuccess: false, message: "Error While Inserting Contact Details" });
    }
  } catch (error) {
    return res.status(500).json({ isSuccess: false, message: "Internal Server Error" });
  }
};

export default handler;
