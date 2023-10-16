import { S3Client } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'

const s3 = new S3Client(
    {
        region: 'eu-west-2',
        credentials: {
            accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
            secretAccessKey: `${process.env.AWS_SECRET_KEY}`
        }
    }
)

const uploadS3Image = (bucketName: string): multer.Multer => {
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: bucketName,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname })
            },
            key: function (req, file, cb) {
                cb(null, `expense-${Date.now().toString()}`)
            }
        })
    })
}


export default uploadS3Image