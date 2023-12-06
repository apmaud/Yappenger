import styled from "@emotion/styled";
import { AlertContext } from "../../contexts/AlertProvider";
import { Alert, AlertTitle } from "@mui/material"
import { useContext, useEffect } from "react"

const StyledDiv = styled('div')({
  position: 'fixed',
  right: 2,
  bottom: 2,
  marginBottom: "1rem",
  zIndex: 2000, // Make sure it pops up on top of everything
});

const StyledAlert = styled(Alert)({
  marginBottom: "1rem"
});

  
export default function Notification(props) {
  const { state, actions } = useContext(AlertContext);
  const handleClose = (alert) => {
    actions.removeAlert(alert);
  };
  return (
    <StyledDiv>
      {state?.alerts.length > 0 &&
        state.alerts.map((alert, index) => (
          <AlertProvider
            key={alert.id + index}
            alert={alert}
            actions={actions}
            handleClose={handleClose}
            {...props}
          />
        ))}
    </StyledDiv>
  );
}

const AlertProvider = ({ duration = 5000, alert, actions }) => {
  const handleClose = () => {
    actions.removeAlert(alert)
  }
  useEffect(() => {
    // run handleClose once duration is finished.
    const timer = setTimeout(handleClose, duration)
    return function () {
      clearTimeout(timer)
    }
  }, [])
  return (
    <StyledAlert
      // className={classes.alert}
      onClose={handleClose}
      id="alert"
      elevation={6}
      variant="filled"
      severity={alert.type}
    >
      <AlertTitle>{alert.title}</AlertTitle>
      {alert.text}
    </StyledAlert>
  )
}