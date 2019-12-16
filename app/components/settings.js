import React, { useState,useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import S3ExplorerIcon from '../../assets/S3ExplorerIcon.png';
import LeftDrawer from '../components/FuncDrawer';


import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';


import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    color: theme.palette.text.primary,
  },
  colorSecondary:{

  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#424242',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  icon:{
    width: '40px',
    verticalAlign: 'middle',
  },
  settings:{
    marginLeft: 'auto',
  }

}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Settings(openDialog) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const [HiddenPass, setHiddenPass] = React.useState(false);
  if(openDialog){
    setOpen(true);
  };
  console.log('Open Dialog: ',openDialog);

  const handleClickShowPassword = () => {
    setHiddenPass(!HiddenPass);
  };

  //const handleClickOpen = () => {
  //  setOpen(true);
  //};

  const handleClose = () => {
    setOpen(false);
  };
return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Settings
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose} className={classes.settings}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.toolbar} />
        <Grid item xs={12} md={6}>
           <List >
                <ListItem>
                  <FormControl fullWidth className={classes.margin} variant="filled" >
                    <InputLabel htmlFor="filled-adornment-amount" color="secondary">AWS Access Key ID</InputLabel>
                    <FilledInput id="filled-adornment-amount"/>
                  </FormControl>
                </ListItem>
                <ListItem>
                  <FormControl fullWidth className={classes.margin} variant="filled">
                    <InputLabel htmlFor="filled-adornment-amount" color="secondary">AWS Secret Access Key</InputLabel>
                    <FilledInput id="filled-adornment-amount"/>
                  </FormControl>
                </ListItem>
                <ListItem>
                  <FormControl fullWidth className={classes.margin} variant="filled">
                    <InputLabel htmlFor="filled-adornment-amount" color="secondary">AWS Region</InputLabel>
                    <FilledInput id="filled-adornment-amount"/>
                  </FormControl>
                </ListItem>
                <ListItem>

                </ListItem>
            </List>
        </Grid>
        
      </Dialog>
)
}