const InputField = ({ placeholder }: { placeholder: string }) => {
    return (
      <input
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black transition"
      />
    );
  };
  
  export default InputField;
  