type CustomButtonprops = {
  className: string;
  id: string;
  buttontext: string;
};
export default function CustomButton({
  className,
  id,
  buttontext,
}: CustomButtonprops) {
  return (
    <button className={className} id={id}>
      {buttontext}
    </button>
  );
}
