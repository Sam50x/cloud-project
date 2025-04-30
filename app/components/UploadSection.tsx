'use client'

import { useState } from "react";

const UploadSection = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a file first.');
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            console.log(data)

            if (!res.ok) {
                throw new Error(data.error || data.message || 'Failed to upload file');
            }

            if (data.err) {
                setError(data.err);
                return;
            }

            setError('File Uploaded Successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            setError(error instanceof Error ? error.message : 'Upload failed. Check console for details.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-red-900 overflow-hidden p-6 flex flex-col items-center justify-center h-full w-full">
            <h1 className="text-2xl font-bold text-red-200 mb-10">Upload</h1>

            <div className="flex flex-col items-center gap-4 w-full max-w-md">
                <label className="w-full">
                    <div className="mb-2 text-red-200 font-semibold">Choose a file:</div>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={handleFileChange}
                        className="block w-full text-red-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-200 file:text-red-900 hover:file:bg-red-300"
                        accept="*"
                    />
                </label>

                <button
                    onClick={handleUpload}
                    disabled={isUploading || !file}
                    className={`mt-4 cursor-pointer bg-red-200 text-red-900 text-md font-semibold px-8 py-2 rounded-full hover:bg-red-300 transition-colors ${isUploading || !file ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {isUploading ? 'Uploading...' : 'Upload Now'}
                </button>

                {error && (
                    <div className="mt-4 p-2 bg-red-800 text-red-200 rounded">
                        Msg: {typeof error === 'string' ? error : 'An unknown error occurred.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadSection;