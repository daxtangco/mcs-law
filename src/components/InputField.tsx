interface InputFieldProps {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ placeholder, value, onChange, type = "text" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value} // ✅ Allows controlled input
      onChange={onChange} // ✅ Handles user input changes
      className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black transition"
    />
  );
};

export default InputField;
