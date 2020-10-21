import React from 'react';
import './App.css';
import {makeStyles} from '@material-ui/core/styles';
import {CssBaseline} from '@material-ui/core';
import {Nav, MakeWill} from './components';

//custom CSS
const useStyles = makeStyles((theme)=>({
root:{
  minHeight: '100vh',
  backgroundImage: `url(${process.env.PUBLIC_URL + '/assets/space.jpg'})`,
  backgroundRepeat:'no-repeat',
  backgroundSize: 'cover'
},

}));

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <Nav/>
      <MakeWill/>
    </div>
  );
}

export default App;
