import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { AuthContext } from '../auth';
import {useContext} from 'react';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal() {
const {auth} = useContext(AuthContext);
    const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    auth.closeModal(); 
    setOpen(false);
  };



  let toggle = false;
  if(auth.modal){
      toggle = true;
  }

  return (

    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={toggle}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={toggle}>
            <div style={style}>
            <Alert severity="error" >
                <AlertTitle>Error</AlertTitle>
                <strong>{auth.errMessage}</strong>
                <br/>
                <br/>
                <Button size="small" variant="outlined" onClick={handleClose}>Close</Button>
            </Alert>
            
            </div>
              
              
        </Fade>

        
      </Modal>
    </div>
  );
}
