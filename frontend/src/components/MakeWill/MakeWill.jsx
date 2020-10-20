import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField} from "@material-ui/core/";
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    height: "100vh",
  },
  
}));

const StyledTextField = styled(TextField)`
    .MuiOutlinedInput-notchedOutline {
        border: 2px white solid;
        color: 'red'
        | 'pink'
    }
`;

function MakeWill() {
  const classes = useStyles();
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <StyledTextField
        id="outlined-helperText"
        label="Heir Name"
        defaultValue="Heir name..."
        helperText="Enter the name of a heir/ beneficiary of your will"
        variant="outlined"
      />
      <StyledTextField
        InputProps={{
          className: classes.multilineColor,
        }}
        id="outlined-helperText"
        label="Heir Address"
        defaultValue="Address"
        helperText="Enter the Ethereum Address of the heir"
        variant="outlined"
      />
    </form>
  );
}

export default MakeWill;
