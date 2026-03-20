import { useEffect, useRef, useState } from 'react';

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
        className={className}
        type={type}
        id={id}
        placeholder={placeholder}
        // onClick={() => setVal(20)}
      />
    </div>
  );
}
