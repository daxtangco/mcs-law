import InputField from "./InputField";
import GoogleLoginButton from "./GoogleLoginButton";

const SignInBlock = () => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-lg font-bold text-green-900">Sign in to your account</h2>

      <div className="mt-3">
        <InputField placeholder="Enter email, phone, username" />
        <button className="w-full bg-green-700 text-white px-6 py-2 rounded-md mt-3 font-semibold">
          Continue
        </button>
      </div>

      <div className="flex items-center justify-center my-3">
        <hr className="w-full border-gray-300" />
        <span className="px-3 text-gray-500">OR</span>
        <hr className="w-full border-gray-300" />
      </div>

      {/* Google Login Button */}
      <GoogleLoginButton />

      <div className="mt-4">
        <a href="#" className="text-green-700 font-semibold text-sm hover:underline">Create an account</a>
      </div>
    </div>
  );
};

export default SignInBlock;
