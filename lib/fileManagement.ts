import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage, db } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

// File types allowed for upload
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

// Maximum file size in bytes (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface UploadFileParams {
  file: File;
  userId: string;
  caseId?: string;
  category: 'consultation' | 'document-review' | 'case-document';
  metadata?: Record<string, string>;
}

interface UploadedFileInfo {
  id: string;
  name: string;
  url: string;
  contentType: string;
  size: number;
  path: string;
  category: string;
  userId: string;
  caseId?: string;
  metadata?: Record<string, string>;
  createdAt: Date;
}

// Validate file before upload
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload PDF, Word document, or image files.',
    };
  }

  return { valid: true };
};

// Upload file to Firebase Storage and store metadata in Firestore
export const uploadFile = async ({
  file,
  userId,
  caseId,
  category,
  metadata = {},
}: UploadFileParams): Promise<UploadedFileInfo> => {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate a unique file ID
    const fileId = uuidv4();
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop() || '';
    
    // Create a reference to the file location in Firebase Storage
    const storagePath = `${category}/${userId}/${caseId ? `${caseId}/` : ''}${fileId}-${fileName}`;
    const fileRef = ref(storage, storagePath);
    
    // Upload file to Firebase Storage
    await uploadBytes(fileRef, file, {
      customMetadata: {
        ...metadata,
        userId,
        category,
        originalName: fileName,
        ...(caseId && { caseId }),
      },
    });
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(fileRef);
    
    // Store file metadata in Firestore
    const fileData: Omit<UploadedFileInfo, 'id'> = {
      name: fileName,
      url: downloadUrl,
      contentType: file.type,
      size: file.size,
      path: storagePath,
      category,
      userId,
      ...(caseId && { caseId }),
      metadata,
      createdAt: new Date(),
    };
    
    const docRef = await addDoc(collection(db, 'files'), {
      ...fileData,
      createdAt: serverTimestamp(),
    });
    
    return {
      id: docRef.id,
      ...fileData,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Delete file from Firebase Storage and Firestore
export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    // Get file data from Firestore
    const fileDoc = await getDocs(query(collection(db, 'files'), where('id', '==', fileId)));
    
    if (fileDoc.empty) {
      throw new Error('File not found');
    }
    
    const fileData = fileDoc.docs[0].data();
    const fileRef = ref(storage, fileData.path);
    
    // Delete file from Firebase Storage
    await deleteObject(fileRef);
    
    // Delete file metadata from Firestore
    await deleteDoc(doc(db, 'files', fileDoc.docs[0].id));
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Get all files for a specific case
export const getFilesByCaseId = async (caseId: string): Promise<UploadedFileInfo[]> => {
  try {
    const filesQuery = query(collection(db, 'files'), where('caseId', '==', caseId));
    const filesSnapshot = await getDocs(filesQuery);
    
    return filesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<UploadedFileInfo, 'id'>),
    }));
  } catch (error) {
    console.error('Error getting case files:', error);
    throw error;
  }
};

// Get all files for a user
export const getFilesByUserId = async (userId: string, category?: string): Promise<UploadedFileInfo[]> => {
  try {
    let filesQuery;
    
    if (category) {
      filesQuery = query(
        collection(db, 'files'),
        where('userId', '==', userId),
        where('category', '==', category)
      );
    } else {
      filesQuery = query(collection(db, 'files'), where('userId', '==', userId));
    }
    
    const filesSnapshot = await getDocs(filesQuery);
    
    return filesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<UploadedFileInfo, 'id'>),
    }));
  } catch (error) {
    console.error('Error getting user files:', error);
    throw error;
  }
};

// Client-side file upload component function
export const handleFileUpload = async (
  files: FileList | null,
  userId: string,
  category: 'consultation' | 'document-review' | 'case-document',
  caseId?: string
): Promise<UploadedFileInfo[]> => {
  if (!files || files.length === 0) {
    return [];
  }
  
  const uploadedFiles: UploadedFileInfo[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        console.error(`Validation error for ${file.name}: ${validation.error}`);
        continue;
      }
      
      // Upload file
      const uploadedFile = await uploadFile({
        file,
        userId,
        caseId,
        category,
      });
      
      uploadedFiles.push(uploadedFile);
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
    }
  }
  
  return uploadedFiles;
};