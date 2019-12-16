import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from "react-dom";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';

//import getData from '../actions/getData';
import getData from '../actions/getData';

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

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { labelText, labelIcon: LabelIcon, labelInfo, Bucket, Prefix, color, bgColor, ...other } = props;

  const [rows, setRows] = useState([]);
  const [bread, setBread] = useState([]);
  const [bucketName, setBucket] = useState('');
  const [PrefixBred, setPrefixBred] = useState('');

  function setData(Bucket,Prefix){
    const [row,BucketName,PrefixBred] = getValues(Bucket,Prefix);
    setRows(row);
    setBread(breadcrumb.filter(Boolean)) ;
    setBucket(BucketName);
    setPrefixBred(PrefixBred);
  };

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
           <IconButton className={classes.button} aria-label="delete"  onClick={() => getData(Bucket,Prefix) }>
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

  return (
    <TreeView
      className={classes.root}
      //defaultExpanded={Expanded}
      //onNodeToggle={onNodeToggle}
      //expanded={Expanded}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
               
    >
    
      {getTreeItemsFromData(treeItems)}
    </TreeView>
  );
};

function JsonTree(){
const homedir = require('os').homedir();
const path = require('path')
const fs = require("fs");

const fileJson = fs.readFileSync(path.join(homedir, 's3explorer/s3explorer_treeview.json'));
const json_tree = JSON.parse(fileJson);
return json_tree
}

var json = new JsonTree();
//const [Expanded, SetExpanded] = useState([]);

export default function AWSTreeView() {
  const classes = useTreeItemStyles();

return (
    
      <DataTreeView treeItems={json} />
    
  );

 
}