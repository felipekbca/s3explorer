import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

import FolderIcon from '@material-ui/icons/Folder';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';

import InputRoundedIcon from '@material-ui/icons/InputRounded';

import AddBucketsForm from './AddBuckets';

//import SimpleTable from './table';
import {CheckFolder} from '../actions/CheckFolder';
import {getData} from '../actions/getData';
import {uploadS3, deleteS3} from '../actions/actions';
const credentials = require('../actions/credentials');
const { clipboard } = require('electron');


const path = require('path');
const drawerWidth = 340;


const useTreeItemStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
    '&:focus > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
      padding: theme.spacing(0),
      margin: theme.spacing(0),
    },
  },
  
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(0),
    borderBottomRightRadius: theme.spacing(0),
    paddingRight: theme.spacing(0),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
   // marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(0),
      paddingTop:theme.spacing(0),
    },
  },
  expanded: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0),
    margin: theme.spacing(0),
    userSelect: 'none',
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
    userSelect: 'none',
  },
}));


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%',
    overflowX: 'auto',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#424242',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
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
    minWidth: '5px',
    justifyContent: 'initial',
    textTransform: 'none',
    fontSize: '0.875rem',
  },
  PaperTable:{
    width: '100%',
    display: 'flex',
    overflowX: 'auto',
    //height: '60%',
  },
  FixTable:{
    width: '100%',
    maxHeight: '800px',
    overflow: 'auto',
  },
  tableHeader:{
    backgroundColor: '#424242',
  },
  tableButton: {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
    minWidth: '5px',
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
  barBread:{
   minHeight:'30px',
  },
   treeviewroot: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
    backgroundColor: '#424242',
  },
  dragger: {
    width: '5px',
    cursor: 'ew-resize',
    padding: '4px 0 0',
    borderTop: '1px solid #ddd',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: '100',
    backgroundColor: '#393939'
  },
  codestyle:{
    width: '100%',
    overflow: 'auto',
    fontSize: '0.875rem',
    padding: '10px',
    border: '1px solid #313131',
  },
  ButtonActions:{
   // marginLeft: '9px',
  },
  IconButtonActions:{
   padding: '7px',
  },
  progress:{
    width: '100%',

    //margin: theme.spacing(2),
    //padding: theme.spacing(2),
    //height: '5px',
    '& > * + *': {
      marginTop: theme.spacing(2),
     },
  }
}));


export default function LeftDrawer() {
  const classes = useStyles();
  const [newWidth, setNewWidth] = useState({ width: drawerWidth } );
  const [fakeWidth, setFakeWidth] = useState({ width: 0 } );
  const [rows, setRows] = useState([]);
  const [breadcrumb, setBread] = useState([]);
  const [open, setOpen] = useState(false);
  const [PathLocalFile, setPathLocalFile] = useState('');
  const [PathS3, setPathS3] = useState('');
  const [ProcessOn, setProcessOn] = useState(false);
  const [openDelBox, setOpenDelBox] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [FilePathDel, setFilePathDel] = useState('');
  
  
  async function setData(Bucket,Prefix){
    //console.log(Bucket,Prefix);
    const TreeFolders = CheckFolder(Bucket,Prefix);

    const row = await getData(Bucket,Prefix);

    setRows(row);
    let breadpath = `${Bucket}/${Prefix}`;
    let bread = [];
    let breadcrumb = breadpath.split('/');
    breadcrumb = breadcrumb.filter(Boolean);
    breadcrumb.map((breadcrumb)=> {
                                   if(Bucket==breadcrumb){
                                     bread.push({ bucket:Bucket, name: breadcrumb, prefix: ''   })
                                   } else{
                                     bread.push({ bucket:Bucket, name: breadcrumb, prefix: Prefix.slice(0, (Prefix.indexOf(breadcrumb) + breadcrumb.length + 1))   })
                                   };
                                   
                                 } );
    //console.log(path.join('s3://', Bucket, Prefix));
    setBread(bread);
    setPathS3('s3://'+ path.join( Bucket, Prefix));

  };

  function setConfirmDel(filepath){
    setOpenDelBox(true);
    setFilePathDel(filepath);
    

  }

  function setDel(filepath){
    
    setOpenDelBox(false);
    setDeleteS3(filepath.FilePathDel)
    let myNotification = new Notification('The file say goodbye!!', {body: filepath.FilePathDel });

  }
  
  async function setUploadS3(PathS3,PathLocalFile){
     setProcessOn(true);
     
     const uploadFile = await uploadS3(PathS3,PathLocalFile);
     setProcessOn(false);
     handleClose();
     
     let Bucket = PathS3.replace('s3://','').split('/');
     Bucket=Bucket[0];
     const Prefix = PathS3.replace('s3://'.concat(Bucket).concat('/'),'');
     
     setData(Bucket, Prefix);
    
  }

  async function setDeleteS3(PathS3){
     const deleteFile = await deleteS3(PathS3);
     const filename = path.basename(PathS3);
     
     let Bucket = PathS3.replace('s3://','').split('/');
     Bucket=Bucket[0];
     let Prefix = PathS3.replace('s3://'.concat(Bucket).concat('/'),'');
     Prefix = Prefix.replace(filename,'');
     //console.log(Prefix);
     setData(Bucket, Prefix);
    
    
  }



  let mobileOpen = false ;
  let isResizing = false ;
  let lastDownX  =  drawerWidth ;

  function handleMousedown(e){
    isResizing = true ;
    lastDownX = e.clientX ;
    //console.log(lastDownX);
    
  };

  function handleMousemove(e){
    //console.log(isResizing);
    if (!isResizing) {
      return;
    }
    else{

    //if(e){
      let offsetRight = e.clientX;
      let minWidth = drawerWidth;
      let maxWidth = 600;
      if (offsetRight > minWidth && offsetRight < maxWidth) {
        setNewWidth( { width: offsetRight } );
        setFakeWidth({ width: offsetRight-drawerWidth} );
        //console.log(offsetRight);
      }
    //}
    }
    
    
  };

  function handleMouseup(e){
    isResizing = false ;
  };

    useEffect(() => {
     // window.addEventListener("mousemove", logMousePosition);
      document.addEventListener('mousemove', handleMousemove);
      document.addEventListener('mouseup', handleMouseup);

     document.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();

          for (const f of e.dataTransfer.files) {
             console.log('File(s) you dragged here: ', f.path)
             setPathLocalFile(f.path);
            }
            if(PathS3.length > 1){
              setOpen(true);
            }
          });

    document.addEventListener('dragover', (e) => {
               e.preventDefault();
               e.stopPropagation();
            });
   
      });
  

  const handleDelClickOpen = () => {
    setOpenDelBox(true);
  };

  const handleDelClose = () => {
    setOpenDelBox(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
  };




//Treeview
  function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { labelText, labelIcon: LabelIcon, labelInfo, Bucket, Prefix, color, bgColor, ...other } = props;
  
  
  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
           <IconButton className={classes.button} aria-label="delete"  onClick={() => { setData(Bucket,Prefix)} }>
             <VisibilityIcon />
           </IconButton>
          </div>
      }
      
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
  Bucket: PropTypes.string,
  Prefix: PropTypes.string
};

const getTreeItemsFromData = treeItems => {
  return treeItems.map(treeItemData => {
    let children = undefined;
    if (treeItemData.children && treeItemData.children.length > 0) {
      children = getTreeItemsFromData(treeItemData.children);
    }
    return (
      <StyledTreeItem
        key={treeItemData.id}
        nodeId={treeItemData.id}
        labelText={treeItemData.name}
        labelIcon={FolderIcon}
        Bucket={treeItemData.Bucket}
        Prefix={treeItemData.Prefix}
        labelInfo="90"
        color="#1a73e8"
        bgColor="#e8f0fe"
        children={children}
      />

    );
  });
};

const DataTreeView = ({ treeItems }) => {
  let classes = useTreeItemStyles();
  

  const onNodeToggle = (nodeId, isExpanded) => {
   // setCount(count + 1);
    SetExpanded(isExpanded);
    //console.log(isExpanded);

  };

  return (
    <TreeView
      className={classes.root}
      //defaultExpanded={Expanded}
      onNodeToggle={onNodeToggle}
      expanded={Expanded}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
               
    >
    
      {getTreeItemsFromData(treeItems)}
    </TreeView>
  );
};

//Treeview

   function JsonTree(){
   const fs = require("fs");
   
   const fileJson = fs.readFileSync(credentials.TREEVIEW_PATH);
   const json_tree = JSON.parse(fileJson);
   return json_tree
   }
  
  var json = new JsonTree();

  const [Expanded, SetExpanded] = useState([]);

    return (
      
    <div id="drop" className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        SlideProps={{ style: newWidth }}
        PaperProps={{ style: newWidth }}
        >
          
          <AddBucketsForm/>

          <div className={classes.toolbar} />
  
          <DataTreeView treeItems={json} />
          
          <div
              id="dragger"
              onMouseDown={event => {
                handleMousedown(event);
              }}
              className={classes.dragger}
              
            />
      </Drawer>
           <div style={fakeWidth} />

   <main className={classes.content}>

        <div className={classes.barBread} />
        <Breadcrumbs className={classes.breadcrumb} aria-label="breadcrumb">
          {breadcrumb.map(breadcrumb => (
              <Button size="small" className={classes.button} onClick={() => setData(breadcrumb.bucket, breadcrumb.prefix) } >{breadcrumb.name}</Button>
            ))}
          
        </Breadcrumbs> 

        <Paper className={classes.PaperTable}>
        <div className={classes.FixTable}>
          <Table stickyHeader className={classes.table} size="small" aria-label="a dense table">
            <TableHead >
              <TableRow>
                <TableCell className={classes.tableHeader}>Name</TableCell>
                <TableCell className={classes.tableHeader} align="right">Last Modified</TableCell>
                <TableCell className={classes.tableHeader} align="right">Size</TableCell>
                <TableCell className={classes.tableHeader} align="right">Actions</TableCell>
    
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                   <div className={classes.labelRoot}>
                    {row.folder ? <FolderIcon /> : ''} 
                    {row.folder ? <Button size="small" className={classes.tableButton} onClick={() => { setData(row.bucket,row.prefix)}} >  {row.name}</Button> : ''}
                    {row.folder ? '' : <Typography variant="body2" className={classes.labelText}>{row.name}</Typography>}
                    
                   </div>
                  </TableCell>
                  <TableCell align="right">{row.lastmodified}</TableCell>
                  <TableCell align="right">{row.size}</TableCell>
                  <TableCell align="right"><IconButton className={classes.IconButtonActions} onClick={() => { 
                                                                        clipboard.writeText(row.filepath);
                                                                        let myNotification = new Notification('Copy to Clipboard', {
                                                                                    body: row.filepath
                                                                                    });
                                                                       }} > 
                                            <InputRoundedIcon fontSize="small" className={classes.ButtonActions}/> 
                                            </IconButton>
                      {row.folder ? <IconButton className={classes.IconButtonActions}> <InfoIcon fontSize="small" className={classes.ButtonActions}/> </IconButton> :<IconButton className={classes.IconButtonActions} onClick={() => { 
                                                                                               setConfirmDel(row.filepath);
                                                                                                }} > <DeleteIcon fontSize="small" className={classes.ButtonActions}/> </IconButton>}
                    </TableCell>
                    
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </Paper>
      </main>
        <div> 
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Upload File"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                    <Fade in={ProcessOn}>
                      <LinearProgress className={classes.progress} />
                    </Fade>
   
                    <Typography variant="body2" className={classes.labelText}>Do you can upload file</Typography>
                    <Paper className={classes.codestyle} color="primary" > {PathLocalFile} </Paper>   
                    <Typography variant="body2" className={classes.labelText}>on</Typography>
                    <Paper className={classes.codestyle}> {PathS3} </Paper> 
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} > 
                NO
              </Button>
              <Button onClick={() => setUploadS3(PathS3, PathLocalFile,'' ) } autoFocus>
                YES
              </Button>
            </DialogActions>
          </Dialog>
          </div>
          <div>
          <Dialog
                 open={openDelBox}
                 onClose={handleDelClickOpen}
                 aria-labelledby="draggable-dialog-title"
           >
              <DialogTitle id="draggable-dialog-title">
                Delete Object
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this object?
                </DialogContentText>
                <DialogContentText>
                  {FilePathDel}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleDelClose}>
                  Cancel
                </Button>
                <Button onClick={() => { setDel({FilePathDel}); }} >
                  Yes
                </Button>
              </DialogActions>
          </  Dialog>
          </div>
    </div>
  
);

};
