import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType?: string;
  }>;
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

// Send email
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: options.from || `"MCS LAW" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });
    
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email templates
export const emailTemplates = {
  // Consultation request received
  consultationReceived: (name: string) => ({
    subject: 'MCS LAW: We Have Received Your Inquiry',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://mcslawofficeph.com/logo.png" alt="MCS LAW Logo" style="max-width: 150px;">
        </div>
        
        <h2 style="color: #333; text-align: center;">Your Legal Inquiry Has Been Received</h2>
        
        <p>Dear ${name},</p>
        
        <p>Thank you for submitting your legal inquiry to MCS LAW. We have received your request and our legal team will review it within 24 hours.</p>
        
        <p>We will reach out to you via email or phone to discuss your case in more detail. If you need urgent assistance, please contact us at <a href="mailto:info@mcslawofficeph.com">info@mcslawofficeph.com</a>.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>What happens next?</strong></p>
          <ol style="margin-top: 10px; padding-left: 20px;">
            <li>Our legal team reviews your inquiry (within 24 hours)</li>
            <li>We'll send you a fixed-fee quote based on your needs</li>
            <li>Once you accept, we'll schedule a video consultation</li>
            <li>We'll provide you with legal guidance and solutions</li>
          </ol>
        </div>
        
        <p>Thank you for choosing MCS LAW as your legal partner. We look forward to assisting you.</p>
        
        <p>Best regards,<br>The MCS LAW Team</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© 2025 MCS LAW. All rights reserved.</p>
          <p>San Fernando, Pampanga, Philippines</p>
        </div>
      </div>
    `,
  }),
  
  // Consultation scheduled
  consultationScheduled: (name: string, date: string, videoLink: string) => ({
    subject: 'MCS LAW: Your Legal Consultation is Scheduled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://mcslawofficeph.com/logo.png" alt="MCS LAW Logo" style="max-width: 150px;">
        </div>
        
        <h2 style="color: #333; text-align: center;">Your Legal Consultation is Confirmed</h2>
        
        <p>Dear ${name},</p>
        
        <p>Your consultation with MCS LAW has been scheduled for <strong>${date}</strong>.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <p style="margin: 0;"><strong>Video Conference Link</strong></p>
          <p style="margin-top: 10px;">
            <a href="${videoLink}" style="display: inline-block; background-color: #1a73e8; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Join Meeting</a>
          </p>
          <p style="margin-top: 10px; font-size: 12px;">Or copy this link: ${videoLink}</p>
        </div>
        
        <h3>Preparing for Your Consultation</h3>
        <ul>
          <li>Be in a quiet location with good internet connection</li>
          <li>Have any relevant documents ready to share</li>
          <li>Prepare specific questions you'd like to ask</li>
          <li>Allow approximately 60 minutes for the consultation</li>
        </ul>
        
        <p>If you need to reschedule, please reply to this email at least 24 hours before your appointment.</p>
        
        <p>We look forward to meeting with you!</p>
        
        <p>Best regards,<br>The MCS LAW Team</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
          <p>© 2025 MCS LAW. All rights reserved.</p>
          <p>San Fernando, Pampanga, Philippines</p>
        </div>
      </div>
    `,
  }),
  
  // Document review received
  documentReviewReceived: (name: string, documentType: string) => ({
    subject: 'MCS LAW: Your Document Review Request Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://mcslawofficeph.com/logo.png" alt="MCS LAW Logo" style="max-width: 150px;">
        </div>
        
        <h2 style="color: #333; text-align: center;">Document Review Request Received</h2>
        
        <p>Dear ${name},</p>
        
        <p>Thank you for submitting your ${documentType} for review. Our legal team will carefully analyze your document and provide detailed insights and recommendations.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>What to expect:</strong></p>
          <ul style="margin-top: 10px; padding-left: 20px;">
            <li>Document review typically takes 48 hours</li>
            <li>You'll receive an email notification once the review is complete</li>
            <li>A comprehensive review report will be available in your dashboard</li>
            <li>We may contact you if we need additional information</li>
          </ul>
        </div>
        
        <p>You can check the status of your document review anytime by logging into your account dashboard.</p>
        
        <p>If you have any questions, please contact us at <a href="mailto:info@mcslawofficeph.com">info@mcslawofficeph.com</a>.</p>
        
        <p>Thank you for choosing MCS LAW for your legal needs.</p>
        
        <p>Best regards,<br>The MCS LAW Team</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© 2025 MCS LAW. All rights reserved.</p>
          <p>San Fernando, Pampanga, Philippines</p>
        </div>
      </div>
    `,
  }),
  
  // Document review completed
  documentReviewCompleted: (name: string, documentType: string) => ({
    subject: 'MCS LAW: Your Document Review is Complete',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://mcslawofficeph.com/logo.png" alt="MCS LAW Logo" style="max-width: 150px;">
        </div>
        
        <h2 style="color: #333; text-align: center;">Your Document Review is Complete</h2>
        
        <p>Dear ${name},</p>
        
        <p>We're pleased to inform you that our legal team has completed the review of your ${documentType}.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <p style="margin: 0;"><strong>Next Steps</strong></p>
          <p style="margin-top: 10px;">
            <a href="https://mcslawofficeph.com/dashboard" style="display: inline-block; background-color: #1a73e8; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">View Review Report</a>
          </p>
        </div>
        
        <p>In the review report, you'll find:</p>
        <ul>
          <li>Detailed legal analysis of your document</li>
          <li>Identified potential risks and issues</li>
          <li>Recommended revisions and improvements</li>
          <li>Specific comments on key clauses</li>
        </ul>
        
        <p>If you have questions about the review or would like to discuss implementing the suggested changes, please schedule a follow-up consultation through your dashboard.</p>
        
        <p>Thank you for trusting MCS LAW with your legal needs.</p>
        
        <p>Best regards,<br>The MCS LAW Team</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
          <p>© 2025 MCS LAW. All rights reserved.</p>
          <p>San Fernando, Pampanga, Philippines</p>
        </div>
      </div>
    `,
  }),
};

// Cloud Function to send consultation confirmation email
// This would typically be triggered by a Firestore trigger when a new consultation is created
export const sendConsultationConfirmationEmail = async (
  data: { name: string; email: string; }
): Promise<void> => {
  const { name, email } = data;
  
  const template = emailTemplates.consultationReceived(name);
  
  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

// Cloud Function to send document review confirmation email
export const sendDocumentReviewConfirmationEmail = async (
  data: { name: string; email: string; documentType: string; }
): Promise<void> => {
  const { name, email, documentType } = data;
  
  const template = emailTemplates.documentReviewReceived(name, documentType);
  
  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};