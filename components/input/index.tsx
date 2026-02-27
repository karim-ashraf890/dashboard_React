type CustomInputProps = {
  type: string;
  className?: string;
  labeltext?: string;
  id: string;
  placeholder: string;
};

export function CustomInput({
  type,
  className,
  labeltext,
  id,
  placeholder,
}: CustomInputProps) {
  return (
    <div className='form-group'>
      <label htmlFor={id}>{labeltext}</label>
      <br />
      <input
        className={className}
        type={type}
        id={id}
        placeholder={placeholder}
      />
    </div>
  );
}
