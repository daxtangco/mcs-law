"use client";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const DocumentForm = () => {
  const user = useAuthRedirect(); // Ensures only logged-in users access this form

  if (!user) return null;

  return (
    <form> {/* Form content remains the same */} </form>
  );
};

export default DocumentForm;
