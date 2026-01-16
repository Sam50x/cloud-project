'use client'

import { useState, useEffect } from 'react'

type FileMeta = {
    name: string
    url: string
}

const DownloadSection = () => {
    const [files, setFiles] = useState<FileMeta[]>([])

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('/api/files')
                const data: FileMeta[] = await response.json()
                setFiles(data)
            } catch (error) {
                console.error('Failed to fetch files:', error)
            }
        }

        fetchFiles()
    }, [])

    return (
        <div className="bg-blue-900 overflow-hidden p-6 flex flex-col items-center justify-center h-full w-full">
            <h1 className="text-2xl font-bold text-green-200">Download</h1>
            <div className="h-full w-full overflow-y-scroll max-h-120">
                {files.map((file, index) => (
                    <div key={index} className="mb-4">
                        <h2 className="text-green-100">{file.name}</h2>
                        <a
                            href={file.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-300 underline"
                        >
                            Click here to download
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DownloadSection
