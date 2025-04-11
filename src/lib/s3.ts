import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});

export async function uploadFile(file: File, userId: string): Promise<string> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME is not defined');
  }

  const fileName = `images/${userId}/${file.name}`;
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read', // Make the uploaded file publicly readable
  };

  try {
    await s3.upload(params).promise();
    // Construct the correct S3 URL
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

export async function listFiles(userId: string): Promise<string[]> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME is not defined');
    }
  
    const prefix = `images/${userId}/`;
    const params = {
      Bucket: bucketName,
      Prefix: prefix,
    };
  
    try {
      const data = await s3.listObjectsV2(params).promise();
      if (data.Contents) {
        return data.Contents.map(item => `https://${bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${item.Key}`);
      }
      return [];
    } catch (error) {
      console.error('Error listing files from S3:', error);
      throw error;
    }
  }
  

    