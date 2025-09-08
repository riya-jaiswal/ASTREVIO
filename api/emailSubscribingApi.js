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

// NEWSLETTER SCHEMA
const subscribeSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "* Email is required"],
      lowercase: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const SubscribeModel =
  mongoose.models.subscribeModel ||
  mongoose.model("subscribeModel", subscribeSchema);

// VALIDATION SCHEMA
const subscribeValidationSchema = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
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
    if (info) console.log("Subscription Mail Sent ✅");
  } catch (error) {
    console.log("Error Sending Subscription Mail ❌", error);
  }
};

// USER TEMPLATE
const userTemplate = (email) => {
  return `
  <!DOCTYPE html>
  <html>
    <body style="font-family:Arial,sans-serif;background:#f7f7f7;padding:20px;">
      <div style="max-width:680px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 10px 20px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#1f1f1f,#444);padding:25px;text-align:center;color:#fff;font-size:26px;font-weight:bold;">
          Vastu Craft
        </div>
        <div style="padding:30px;">
          <h2 style="color:#333;">🎉 Subscription Confirmed</h2>
          <p style="color:#555;">Thank you for subscribing to <b>Vastu Craft</b> newsletters!</p>
          <p>You will now receive updates about our latest designs, offers, and articles directly in your inbox.</p>
        </div>
        <div style="background:#fcfcfc;text-align:center;padding:15px;font-size:13px;color:#777;">
          © 2025 Vastu Craft. All rights reserved.
        </div>
      </div>
    </body>
  </html>`;
};

// ADMIN TEMPLATE
const adminTemplate = (email) => {
  return `
  <!DOCTYPE html>
  <html>
    <body style="font-family:Arial,sans-serif;background:#f7f7f7;padding:20px;">
      <div style="max-width:680px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 10px 20px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#f56015,#ffa94d);padding:25px;text-align:center;color:#fff;font-size:26px;font-weight:bold;">
          New Newsletter Subscription
        </div>
        <div style="padding:30px;">
          <h2 style="color:#333;">📩 New Subscriber</h2>
          <p>Email: <a href="mailto:${email}">${email}</a></p>
        </div>
        <div style="background:#fcfcfc;text-align:center;padding:15px;font-size:13px;color:#777;">
          Generated automatically from your website’s footer subscription form.
        </div>
      </div>
    </body>
  </html>`;
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

    let { email } = req.body;
    let { error } = subscribeValidationSchema.validate({ email });
    if (error) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Validation Error", error });
    }

    let exists = await SubscribeModel.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ isSuccess: false, message: "Already Subscribed" });
    }

    let newSub = new SubscribeModel({ email });
    let saved = await newSub.save();

    if (saved) {
      await Promise.all([
        sendMail(
          GMAIL_USER,
          email,
          "Welcome to Vastu Craft Newsletter",
          userTemplate(email)
        ),
        sendMail(
          GMAIL_USER,
          GMAIL_USER,
          "New Newsletter Subscription",
          adminTemplate(email)
        ),
      ]);

      return res
        .status(201)
        .json({ isSuccess: true, message: "Subscribed Successfully" });
    } else {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Error While Subscribing" });
    }
  } catch (error) {
    console.log("Subscribe API Error:", error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Internal Server Error" });
  }
};

export default handler;
