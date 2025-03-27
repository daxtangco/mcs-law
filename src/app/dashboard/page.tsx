"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [documents, setDocuments] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchDocuments = async () => {
      const q = query(collection(db, "documentSubmissions"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setDocuments(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchConsultations = async () => {
      const q = query(collection(db, "consultations"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setConsultations(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchDocuments();
    fetchConsultations();
  }, [user]);

  if (!user) return <p className="text-center text-red-500">Please log in to access your dashboard.</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">Your Dashboard</h1>

      <h2 className="text-2xl font-semibold mt-6">Submitted Documents</h2>
      <ul className="mt-2 space-y-2">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <li key={doc.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <p><strong>Type:</strong> {doc.documentType}</p>
              <p><strong>Claim Date:</strong> {new Date(doc.claimDate.seconds * 1000).toLocaleDateString()}</p>
            </li>
          ))
        ) : (
          <p>No documents submitted yet.</p>
        )}
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Scheduled Consultations</h2>
      <ul className="mt-2 space-y-2">
        {consultations.length > 0 ? (
          consultations.map((consult) => (
            <li key={consult.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <p><strong>Topic:</strong> {consult.topic}</p>
              <p><strong>Date:</strong> {new Date(consult.appointmentDate.seconds * 1000).toLocaleDateString()}</p>
            </li>
          ))
        ) : (
          <p>No consultations booked yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
