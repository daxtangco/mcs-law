import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();
const db = admin.firestore();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password",
  },
});

// Send Email on Document Submission
export const sendDocumentSubmissionEmail = functions.firestore
  .document("documentSubmissions/{docId}")
  .onCreate(async (snapshot) => {
    const data = snapshot.data();
    if (!data) return null;

    const mailOptions = {
      from: "your-email@gmail.com",
      to: data.userEmail,
      subject: "Document Submission Confirmation",
      text: `Your document '${data.documentType}' has been successfully submitted.`,
    };

    return transporter.sendMail(mailOptions);
  });

// Send Email on Consultation Booking
export const sendConsultationEmail = functions.firestore
  .document("consultations/{consultId}")
  .onCreate(async (snapshot) => {
    const data = snapshot.data();
    if (!data) return null;

    const mailOptions = {
      from: "your-email@gmail.com",
      to: data.userEmail,
      subject: "Consultation Booking Confirmation",
      text: `Your consultation on '${data.topic}' is scheduled for ${data.appointmentDate.toDate()}.`,
    };

    return transporter.sendMail(mailOptions);
  });
