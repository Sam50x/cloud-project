import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {
    return NextResponse.json({ msg: 'Upload API!!' })
}

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
});

console.log('S3 Client Config:', {
    region: process.env.NEXT_PUBLIC_AWS_REGION as string,
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string ? '***' : 'Missing',
});

async function uploadFileToS3(fileBuffer: Buffer, fileName: string) {
    console.log(fileName)

    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
        Key: `${fileName}-${Date.now()}`,
        Body: fileBuffer,
    }

    const command = new PutObjectCommand(params)
    await s3Client.send(command)

    const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${params.Key}`;

    return fileUrl;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ msg: 'Upload Error!!', err: 'Invalid or No File Found to Upload' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileUrl = await uploadFileToS3(buffer, file.name);

        return NextResponse.json({ msg: 'File Uploaded Successfully!!', fileUrl });
    } catch (e) {
        console.error('Error in POST /api/upload:', e);
        const errorMessage = e instanceof Error ? e.message : JSON.stringify(e);
        return NextResponse.json({ msg: 'Upload Error!!', err: errorMessage }, { status: 500 });
    }
}