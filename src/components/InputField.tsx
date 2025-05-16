import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register?: any;
  name: string;
  value?: string | number;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Add onChange
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  value, // Support value prop for controlled components
  defaultValue,
  error,
  hidden,
  inputProps,
  onChange, // Support onChange for controlled components
}: InputFieldProps) => {
  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...(register ? register(name) : {})}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...inputProps}
        value={value} // Use value prop
        onChange={onChange} // Use onChange handler
        defaultValue={defaultValue} // Still support defaultValue
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
