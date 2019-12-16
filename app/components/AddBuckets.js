import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import {getBuckets} from '../actions/getBuckets';
import {CheckFolder} from '../actions/CheckFolder';
import {BucketsTreeView} from '../actions/BucketsTreeView';

const credentials = require('../actions/credentials');

const path = require('path');
const fs = require("fs");
const jp = require("jsonpath");


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%',
    overflowX: 'auto',
  },  
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    left: '5%',
    width: '40px',
    height: '40px',
  },
  SelectBox: {
    minWidth: 550,
  },
}));

export default function AddBucketsForm(openBox) {

  const classes = useStyles();
  const [Buckets, setBuckets] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [values, setValues] = useState([]);

  async function setS3Buckets(){
    const data = await getBuckets();
    console.log('Get Buckets');
    setBuckets(data);
    //return data;
  }
  function getBucketsDefault(){
    const path_file = credentials.TREEVIEW_PATH;
    const fileJson = fs.readFileSync(path_file);
    const json_tree = JSON.parse(fileJson);
    const data_tree = jp.query(json_tree, '$.*.id');
    const default_values = []
      for (const bucket_name of jp.query(json_tree, '$.*.id')) {
        default_values.push({Name:bucket_name.slice(0, -1)});
      };
      setValues(default_values);
  }
  const handleAddClose = () => {
    setOpenAdd(false);
  };

  const handleAddClickOpen = () => {
    setOpenAdd(true);
    setS3Buckets();
    getBucketsDefault();
  };

return (
          <div>
           <Fab aria-label='Add' className={classes.fab} onClick={handleAddClickOpen}>
            <AddIcon />
          </Fab>

           <Dialog
                 open={openAdd}
                 onClose={handleAddClose}
                 aria-labelledby="add-s3-buckets"
                 
             >
              <DialogTitle id="add-s3-buckets">
               Add Bucket
              </DialogTitle>
              <DialogContent>
                      <Autocomplete
                        multiple
                        id="combo-box-autocomplete"
                        color="secondary" 
                        options={Buckets}
                        freeSolo
                        filterSelectedOptions='true'
                        className={classes.SelectBox}
                        filterSelectedOptions
                        defaultValue={values}
                        getOptionLabel={option => option.Name}
                        onChange={(event, newValue) => {
                                    setValues(newValue);
                                   }}
                        renderInput={params => (
                          <TextField {...params} label="S3 Bucket" variant="filled" color="secondary" fullWidth />
                        )}
                      />
               </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleAddClose}>
                  Cancel
                </Button>
                <Button onClick={() => { BucketsTreeView(values); handleAddClose();location.reload();}} >
                  Save
                </Button>
              </DialogActions>
          </  Dialog>
          </div>
)
}

