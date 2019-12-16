import React,{ useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import FolderIcon from '@material-ui/icons/Folder';

import {getData} from '../actions/getData';


const useStyles =  makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
    width: '100%',
    overflowX: 'auto',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#424242',
  },
 
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  breadcrumb:{
    padding: theme.spacing(1),
  },

    button: {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
    justifyContent: 'initial',
    textTransform: 'none',
    fontSize: '0.875rem',
  },
    tableButton: {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
    justifyContent: 'initial',
    textTransform: 'none',
    fontSize: '0.875rem',
    marginLeft: '6px',
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
    marginLeft: '10px',
  },  
  labelRoot: {
    display: 'flex',
    alignItems: 'center',

  },
  hiddenBar:{
  height: 30,
  },
  toolbar: theme.mixins.toolbar,
   treeviewroot: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
    backgroundColor: '#424242',
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: 'auto',
    backgroundColor: 'white',
  },
  FooterRoot: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },

}));
//const [tablesrows, setTableRows] = useState([]);
//function setTable(rows){
//setTableRows({asd:'123'});
//}

export default function SimpleTable(props) {
  const classes = useStyles();
  
  if(props){
  //setTable({asd:'123'});
  }
  let rows = [];
  rows = props.rows;


  //console.log(bread);
  return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Paper className={classes.root}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Last Modified</TableCell>
                <TableCell align="right">Size</TableCell>
    
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                   <div className={classes.labelRoot}>
                    {row.folder ? <FolderIcon /> : ''} 
                    {row.folder ? <Button size="small" className={classes.tableButton} onClick={() => getData(bucketName,PrefixBred.concat(row.name).concat('/') )} >  {row.name}</Button> : ''}
                    {row.folder ? '' : <Typography variant="body2" className={classes.labelText}>{row.name}</Typography>}
                    
              </div>
    
                  </TableCell>
                  <TableCell align="right">{row.lastmodified}</TableCell>
                  <TableCell align="right">{row.size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
          

      </main>
    
  );
}