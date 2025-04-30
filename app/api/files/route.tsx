import { NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

const s3 = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
})

export async function GET() {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!

    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
        })

        const response = await s3.send(command)

        const files = response.Contents?.map((file) => ({
            name: file.Key!,
            url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
        })) || []

        return NextResponse.json(files)
    } catch (error) {
        console.error('Error fetching files from S3:', error)
        return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
    }
}
