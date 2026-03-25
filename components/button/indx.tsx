import { useEffect } from 'react';

type CustomButtonprops = {
  className: string;
  id: string;
  buttontext: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function CustomButton({
  className,
  id,
  buttontext,
  onClick,
  disabled,
}: CustomButtonprops) {
  useEffect(() => {}, []);

  return (
    <button className={className} id={id} onClick={onClick} disabled={disabled}>
      {buttontext}
    </button>
  );
}
