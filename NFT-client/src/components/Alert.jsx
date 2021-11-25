import { useState } from 'react';
import { SlAlert, SlIcon } from '@shoelace-style/shoelace/dist/react';

const Alert = ({ type, iconName, text }) => {
  const [open, setOpen] = useState(true);

  function handleHide() {
    setOpen(false);
    // setTimeout(() => setOpen(true), 2000);
  }

  return (

    <SlAlert
      type={type}
      open={open}
      closable
      onSlAfterHide={handleHide}
      className="Alert"
    >
      <SlIcon slot="icon" name={iconName} />
      <strong>{text}</strong>
    </SlAlert>
  )
};
export default Alert;