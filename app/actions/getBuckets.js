const S3 = require('aws-sdk/clients/s3');
const credentials = require('./credentials');

export async function getBuckets(){
  const s3 = new S3({ accessKeyId: credentials.ACCESSKEYID , secretAccessKey: credentials.SECRETACCESSKEY, region: credentials.REGION });
  const params = {};
  const data = await s3.listBuckets(params).promise();
  const Buckets = data['Buckets'];
  return Buckets;
}