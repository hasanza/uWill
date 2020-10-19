import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, IconButton, Toolbar, Collapse } from "@material-ui/core";
import SortIcon from "@material-ui/icons/Sort";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import styles from "./Nav.module.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  nav: {
    background: "none",
    fontFamily: "Archivo",
  },
  icon: {
    color: "#fff",
    fontSize: "2rem",
  },
  logo: {
    flexGrow: "1",
    fontFamily: "Montserrat",
    fontSize: "2.5rem",
  },
  navWrapper: {
    width: "80%",
    margin: "0 auto",
  },
  container: {
    textAlign: "center",
  },
  goDown: {
    color: "#fff",
    fontSize: "2em",
  },
}));

function Nav() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  React.useEffect(() => {
    setChecked(true);
  }, []);
  return (
    <div className={classes.root}>
      <AppBar className={classes.nav} elevation={0}>
        <Toolbar className={classes.navWrapper}>
          <h1 className={classes.logo}>
            <span className={styles.u}>u</span>Will.
          </h1>
          <IconButton>
            <SortIcon className={classes.icon} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Collapse in={checked} {...(true ? { timeout: 2000 } : {})}
      collapsedHeight={50}
      >
        <div className={classes.container}>
          <span style={{ fontSize: "45px", color: "#fff" }}>Welcome to</span>{" "}
          <span className={styles.d}>decentralised inheritance.</span>
          <h1 style={{marginTop: "8rem"}}>
            <IconButton>
              <ExpandMoreIcon className={classes.goDown} />
            </IconButton>
          </h1>
        </div>
      </Collapse>
    </div>
  );
}

export default Nav;
