import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { sendEmail } from './emailService';
import { emailTemplates } from './emailService';

// For this example, we'll use a simple implementation
// In a production environment, you might use a third-party service like Zoom, Google Meet, or Jitsi

interface ScheduleVideoConferenceParams {
  clientName: string;
  clientEmail: string;
  consultationId: string;
  scheduledDate: Date;
  duration?: number; // in minutes, default 60
}

interface VideoConferenceDetails {
  conferenceId: string;
  joinUrl: string;
  hostUrl: string;
  scheduledDate: Date;
  duration: number;
}

// Schedule a video conference
export const scheduleVideoConference = async ({
  clientName,
  clientEmail,
  consultationId,
  scheduledDate,
  duration = 60,
}: ScheduleVideoConferenceParams): Promise<VideoConferenceDetails> => {
  try {
    // Generate unique conference ID
    const conferenceId = uuidv4();
    
    // In a real application, you would integrate with a video conferencing API here
    // For this example, we'll create fictional URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mcslawofficeph.com';
    const joinUrl = `${baseUrl}/video-conference/${conferenceId}`;
    const hostUrl = `${baseUrl}/video-conference/${conferenceId}?host=true`;
    
    // Store video conference details in Firestore
    const conferenceData = {
      conferenceId,
      consultationId,
      clientName,
      clientEmail,
      scheduledDate,
      duration,
      joinUrl,
      hostUrl,
      status: 'scheduled',
      createdAt: serverTimestamp(),
    };
    
    const conferenceRef = await addDoc(collection(db, 'video-conferences'), conferenceData);
    
    // Update the consultation with the conference details
    await updateDoc(doc(db, 'consultations', consultationId), {
      videoConferenceId: conferenceRef.id,
      scheduledDate,
      status: 'scheduled',
    });
    
    // Send email notification to the client
    const formattedDate = scheduledDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    
    const emailTemplate = emailTemplates.consultationScheduled(clientName, formattedDate, joinUrl);
    
    await sendEmail({
      to: clientEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });
    
    return {
      conferenceId,
      joinUrl,
      hostUrl,
      scheduledDate,
      duration,
    };
  } catch (error) {
    console.error('Error scheduling video conference:', error);
    throw error;
  }
};

// Cancel a scheduled video conference
export const cancelVideoConference = async (
  conferenceId: string,
  consultationId: string
): Promise<void> => {
  try {
    // Update video conference status
    await updateDoc(doc(db, 'video-conferences', conferenceId), {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
    });
    
    // Update consultation status
    await updateDoc(doc(db, 'consultations', consultationId), {
      status: 'cancelled',
    });
    
    // In a real implementation, you would also call the video conferencing API
    // to cancel the meeting and potentially notify participants
  } catch (error) {
    console.error('Error cancelling video conference:', error);
    throw error;
  }
};

// Reschedule a video conference
export const rescheduleVideoConference = async (
  conferenceId: string,
  consultationId: string,
  newScheduledDate: Date
): Promise<void> => {
  try {
    // Update video conference with new date
    await updateDoc(doc(db, 'video-conferences', conferenceId), {
      scheduledDate: newScheduledDate,
      status: 'rescheduled',
      updatedAt: serverTimestamp(),
    });
    
    // Update consultation with new date
    await updateDoc(doc(db, 'consultations', consultationId), {
      scheduledDate: newScheduledDate,
    });
    
    // In a real implementation, you would also update the meeting in the
    // video conferencing service and notify participants
  } catch (error) {
    console.error('Error rescheduling video conference:', error);
    throw error;
  }
};

// Generate a room name for the video conference
// This helps ensure unique room names and can include custom prefixes
export const generateRoomName = (prefix = 'mcslaw'): string => {
  const randomId = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${randomId}`;
};

// Simple video conference component for the frontend
// This could be expanded with more features like screen sharing, chat, etc.
export const createVideoConferenceRoom = (roomName: string, isHost: boolean) => {
  // In a real implementation, this would integrate with a video conferencing SDK
  // For this example, we'll return placeholder configuration
  
  return {
    roomName,
    config: {
      startWithAudioMuted: !isHost,
      startWithVideoMuted: false,
      prejoinPageEnabled: true,
      disableDeepLinking: true,
    },
    interfaceConfig: {
      TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
      ],
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      DEFAULT_BACKGROUND: '#3c3c3c',
      DEFAULT_REMOTE_DISPLAY_NAME: 'Client',
      DEFAULT_LOCAL_DISPLAY_NAME: isHost ? 'Attorney' : 'You',
    },
  };
};