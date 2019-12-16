
const S3 = require('aws-sdk/clients/s3');
let path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const credentials = require('./credentials');



export async function uploadS3(PathS3,PathLocalFile) {
  let Bucket = PathS3.replace('s3://','').split('/');
  Bucket=Bucket[0];

  const Prefix = PathS3.replace('s3://'.concat(Bucket).concat('/'),'');
  const readFileAsync = promisify(fs.readFile)
  
  const content = await readFileAsync(PathLocalFile);
  const basename = path.basename(PathLocalFile);
  
  const keyS3 = path.join(Prefix, basename ) ;
  const  params = {Bucket: Bucket, Key: keyS3, Body: content};
  //console.log(params);
  const s3 = new S3({ accessKeyId: credentials.ACCESSKEYID , secretAccessKey: credentials.SECRETACCESSKEY, region: credentials.REGION });
  
  var request = await s3.putObject(params).promise();
  //request.on('httpUploadProgress', function (progress) {
  //  console.log(progress.loaded + " of " + progress.total + " bytes");
  //});
  //request.send();
  
};

export async function deleteS3(PathS3) {
  let Bucket = PathS3.replace('s3://','').split('/');
  Bucket=Bucket[0];

  const Prefix = PathS3.replace('s3://'.concat(Bucket).concat('/'),'');
  
  const  params = {Bucket: Bucket, Key: Prefix};
  //console.log(params);
  const s3 = new S3({ accessKeyId: credentials.ACCESSKEYID, secretAccessKey: credentials.SECRETACCESSKEY, region: credentials.REGION });
  //console.log(params);
  const del = await s3.deleteObject(params).promise();
};




//uploadS3('olx-stage-dataservices','scripts/daily_subscribers/','/Users/felipe.amaro/Documentos/OffSite.pptx')
