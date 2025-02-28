import Login from "./login"; // Importing the Login component

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">こんにちは</h1> {/* Display Japanese text */}
      <Login /> {/* Display the Login component */}
    </div>
  );
}
