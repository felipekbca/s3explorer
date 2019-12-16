import React from 'react';

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
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const fs = require("fs");
const path = require('path');
const credentials = require('../actions/credentials');

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
  },
  SelectBox: {
    minWidth: 200,
  },
  bottom: {
    width: '100%',
  },

}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HomePage() {
  const classes = useStyles();
  const homedir   = require('os').homedir();
  const path_file = credentials.SETTINGS_PATH;
  const fileJson  = fs.readFileSync(path_file);
  const json_settings = JSON.parse(fileJson);

  const [values, setValues] = React.useState(json_settings);
  const [open, setOpen] = React.useState(false);
  const [HiddenPass, setHiddenPass] = React.useState(false);

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };
  
  

  const settingSave = () => {
    //console.log(values);
    fs.writeFile(path_file, JSON.stringify(values), (err) => {
      if (err) throw err;
      console.log('Save Settings');
      setOpen(false);
        });

  };

  const handleClickShowPassword = () => {
    setHiddenPass(!HiddenPass);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense" >
          <Typography variant="h6" noWrap>
            <img className={classes.icon} src={S3ExplorerIcon} /> S3 Explorer
          </Typography>
          <IconButton className={classes.settings} onClick={handleClickOpen}>
            
              <SettingsIcon />
            
         </IconButton>
        </Toolbar>
      </AppBar>
        
        <LeftDrawer />
        

    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Settings
            </Typography>
            <Button autoFocus color="inherit" onClick={settingSave} className={classes.settings}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.toolbar} />
        <Grid item xs={12} md={6}>
           <List >
                <ListItem>
                  <FormControl fullWidth className={classes.margin} variant="filled" >
                    <InputLabel htmlFor="aws-access-key" color="secondary">AWS Access Key ID</InputLabel>
                    <FilledInput id="aws-access-key" value={values.AWSAccessKeyID} onChange={handleChange('AWSAccessKeyID')}/>
                  </FormControl>
                </ListItem>
                <ListItem>
                  <FormControl fullWidth className={classes.margin} variant="filled">
                    <InputLabel htmlFor="aws-secret-access-key" color="secondary">AWS Secret Access Key</InputLabel>
                    <FilledInput id="aws-secret-access-key" value={values.AWSSecretAccessKey} onChange={handleChange('AWSSecretAccessKey')}/>
                  </FormControl>
                </ListItem>
                <ListItem>
                  <FormControl variant="filled" className={classes.SelectBox}>
                    <InputLabel id="aws-region" color="secondary" >AWS Region</InputLabel>
                    <Select
                      labelId="aws-region"
                      id="aws-region"
                      value={values.AWSRegion}
                      onChange={handleChange('AWSRegion')}
                    >
                      <MenuItem value={'us-east-1'}>US East (N. Virginia)</MenuItem>
                      <MenuItem value={'us-east-2'}>US East (Ohio)</MenuItem>
                      <MenuItem value={'us-west-1'}>US West (N. California)</MenuItem>
                      <MenuItem value={'us-west-2'}>US West (Oregon)</MenuItem>
                      <MenuItem value={'ap-east-1'}>Asia Pacific (Hong Kong)</MenuItem>
                      <MenuItem value={'ap-south-1'}>Asia Pacific (Mumbai)</MenuItem>
                      <MenuItem value={'ap-northeast-3'}>Asia Pacific (Osaka-Local)</MenuItem>
                      <MenuItem value={'ap-northeast-2'}>Asia Pacific (Seoul)</MenuItem>
                      <MenuItem value={'ap-southeast-1'}>Asia Pacific (Singapore)</MenuItem>
                      <MenuItem value={'ap-southeast-2'}>Asia Pacific (Sydney)</MenuItem>
                      <MenuItem value={'ap-northeast-1'}>Asia Pacific (Tokyo)</MenuItem>
                      <MenuItem value={'ca-central-1'}>Canada (Central)</MenuItem>
                      <MenuItem value={'eu-central-1'}>EU (Frankfurt)</MenuItem>
                      <MenuItem value={'eu-west-1'}>EU (Ireland)</MenuItem>
                      <MenuItem value={'eu-west-2'}>EU (London)</MenuItem>
                      <MenuItem value={'eu-west-3'}>EU (Paris)</MenuItem>
                      <MenuItem value={'eu-north-1'}>EU (Stockholm)</MenuItem>
                      <MenuItem value={'me-south-1'}>Middle East (Bahrain)</MenuItem>
                      <MenuItem value={'sa-east-1'}>South America (São Paulo)</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
            </List>
        </Grid>
        
      </Dialog>
    </div>
        
  );
}

