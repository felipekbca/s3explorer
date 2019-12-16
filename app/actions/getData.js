import React, { useState,useEffect } from 'react';
const S3 = require('aws-sdk/clients/s3');
const dateFormat = require('dateformat');

const credentials = require('./credentials');

export async function getData(Bucket,Preset){
    //alert(JSON.stringify(Preset));
    //console.log(Bucket);
    //console.log(Preset);
    if(!Bucket){
      const row = [];
      return row;
    }
      
    const s3 = new S3({ accessKeyId: credentials.ACCESSKEYID , secretAccessKey: credentials.SECRETACCESSKEY, region: credentials.REGION });
    let Prefix = Preset.toString();
    Prefix = Prefix.replace(Bucket.concat('/'),'');
    //console.log(Prefix);
    const params = { Bucket: Bucket, Delimiter:'/', Prefix:Prefix };
    let listBucket = '';

  function humanFileSize(bytes, si) {
    let thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    let units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
    }
  
  function createData(name, lastmodified, size, folder, bucket, prefix, filepath) {
    return { name, lastmodified, size, folder, bucket, prefix, filepath }; 
  }
    
    const data = await s3.listObjectsV2(params).promise();
    //  console.log('Success');
    //  console.log(data.Contents);
  
   let row = [];
     
   
     for(const prefix of data.CommonPrefixes){
         let FormattedPrefix = prefix.Prefix.replace(Prefix,'');
         row.push( createData(FormattedPrefix.slice(0, -1) ,'' ,'' ,true, Bucket, prefix.Prefix, 's3://' + Bucket + '/' + prefix.Prefix) );
         //console.log(Bucket,prefix.Prefix);
         
     }
       // console.log(data.Contents);
       for (const cont of data.Contents){
          if(cont.Key){
            if(cont.Key !== Prefix){
              let Key = cont.Key.replace(Prefix,'');
              let LastModified = dateFormat(cont.LastModified,"yyyy-mm-dd hh:MM:ss");
              let Size = humanFileSize(cont.Size);
              //console.log( Key, LastModified, Size );
              row.push( createData( Key, LastModified, Size ,false,Bucket,Prefix, 's3://' + Bucket + '/' + Prefix + Key ));
            }
          }
       }

   //console.log(row);
   let breadcrumb = `${Bucket}/${Prefix}`;
   breadcrumb = breadcrumb.split('/');
   //setRows(row);
   //setBread(breadcrumb.filter(Boolean)) ;
   //setBucket(Bucket);
   //setPrefixBred(Prefix);
   //console.log(breadcrumb.filter(Boolean));
   return row;
   
};

//export default getData;
