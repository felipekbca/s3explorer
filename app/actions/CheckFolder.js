const AWS = require("aws-sdk");
const S3 = require('aws-sdk/clients/s3');
const path = require('path');
const fs = require("fs");
const jp = require("jsonpath");
const credentials = require('./credentials');

export function CheckFolder(Bucket,Prefix){
  const homedir = require('os').homedir();
  const path_file = credentials.TREEVIEW_PATH;
  const fileJson = fs.readFileSync(path_file);
  const json_tree = JSON.parse(fileJson);
  const node_value = jp.nodes(json_tree,'$..*');
  //console.log(node_value);
  const s3 = new S3({ accessKeyId: credentials.ACCESSKEYID , secretAccessKey: credentials.SECRETACCESSKEY, region: credentials.REGION });
  let listBucket = '';
  let children = []
  let query = `${Bucket}/${Prefix}`;
  let node_path = jp.query(node_value,`$[?(@.value=="${query}")]`);
  let node_query = jp.stringify(node_path[0].path);
  //console.log(node_path);
  //console.log(node_query);
  //jp.apply(json_tree, node_query.replace("id", "children"), function(value) { return value = children });
  children = jp.value(json_tree, node_query.replace("id", "children"))
  //console.log(children);
  //if(children.length > 0){
  //    console.log('De boas');
  //} else {
       return new Promise((resolve, reject) => {
                 s3.listObjectsV2(
                     {Bucket:Bucket,
                     Delimiter:'/',
                     Prefix:Prefix
                     },
                      (err, data) => {
                  if (err) {
                   reject(err);
                  } else {
                   resolve(data);
                       //console.log(data.CommonPrefixes);
                       if(data.CommonPrefixes.length > 0){
                       const children = []
                       for (const new_prefix of data.CommonPrefixes) {
                           
                           var name = new_prefix.Prefix.split("/"); 
                           children.push({id:`${Bucket}/${new_prefix.Prefix}`,name:name[name.length-2],Bucket:Bucket ,Prefix:new_prefix.Prefix ,children:[]})
                 
                           //const query = `${Bucket}/${Prefix}`;
                           //const node_path = jp.query(node_value,`$[?(@.value=="${query}")]`);
                           //const node_query = jp.stringify(node_path[0].path);
                 
                           jp.apply(json_tree, node_query.replace("id", "children"), function(value) { return value = children });
                           
                           //console.log(children);
                          const recur_prefix = new_prefix.Prefix.toString();
                 
                          // S3listPrefix(Bucket,recur_prefix.replace(`${Bucket}/`, ""));
                       }
                         fs.writeFile(path_file,JSON.stringify(json_tree), (err) => {
                             if (err) throw err;
                             console.log('Data written to file');
                             });
                   }

                 
                  }
                 });
                  });
                 //}

}

//CheckFolder('olx-dataservices','terraform/bigdata-explorer/');