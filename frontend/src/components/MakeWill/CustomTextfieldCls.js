import React from "react";
import { TextField } from "@material-ui/core";
import { makeStyles, useStyles } from "./CustomTextFieldClsStyles";

const useStyles = makeStyles(()=> ({
    root: {
        'notchedOutline': {
            borderColor: 'orange'
        }
    },
    notchedOutline: {

    },
    focused: {

    }
}));

function CustomTextfieldCls() {
  const classes = useStyles();
  return (
    <TextField
      label="Heir Name"
      defaultValue="Heir name..."
      helperText="Enter the name of a heir/ beneficiary of your will"
      variant="outlined"
      InputProps={{
          classes: {
              root: classes.root,
              notchedOutline: classes.notchedOutline,
              focused: classes.focused
          }
      }}
    ></TextField>
  );
}

export default CustomTextfieldCls;
