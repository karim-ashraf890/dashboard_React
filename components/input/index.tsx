import { useEffect, useRef, useState } from 'react';
import '../../global.scss';
type CustomInputProps = {
  type: string;
  className?: string;
  labeltext?: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
  error?: string[];
};

export function CustomInput({
  type,
  className,
  labeltext,
  id,
  placeholder,
  value,
  onChange,
  error,
}: CustomInputProps) {
  // const inputRef = useRef(null);
  // const [val, setVal] = useState(9);

  // function getUsers(v: any) {}

  // useEffect(() => {
  //   getUsers(val);
  // }, [val]);

  return (
    <div className='form-group'>
      <label htmlFor={id}>{labeltext}</label>
      <br />
      {/* {val}
      {val ? 'ah' : 'kok'}
      {val && 'karim'}
      {[1, 3, 4].map((value, index) => {
        return <div>{value}</div>;
      })} */}
      <input
        className={`${className} ${error?.length ? 'inputerror' : ''}`}
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        // onClick={() => setVal(20)}
      />
      {error && error.length > 0 && (
        <div className='messageerror'>
          {error.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      )}
    </div>
  );
}
