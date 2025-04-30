import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {
    return NextResponse.json({ msg: 'Upload API!!' })
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

console.log('S3 Client Config:', {
    region: process.env.AWS_REGION as string,
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string ? '***' : 'Missing',
});

async function uploadFileToS3(fileBuffer: Buffer, fileName: string) {
    console.log(fileName)

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key: `${fileName}-${Date.now()}`,
        Body: fileBuffer,
    }

    const command = new PutObjectCommand(params)
    await s3Client.send(command)

    return fileName
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ msg: 'Upload Error!!', err: 'Invalid or No File Found to Upload' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = await uploadFileToS3(buffer, file.name);

        return NextResponse.json({ msg: 'File Uploaded Successfully!!', fileName });
    } catch (e) {
        console.error('Error in POST /api/upload:', e);
        const errorMessage = e instanceof Error ? e.message : JSON.stringify(e);
        return NextResponse.json({ msg: 'Upload Error!!', err: errorMessage }, { status: 500 });
    }
}