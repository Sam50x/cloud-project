const UploadSection = () => {
    return (
        <div className="bg-red-900 overflow-hidden p-6 flex flex-col items-center justify-center h-full w-full">
            <h1 className="text-2xl font-bold text-red-200 mb-10">Upload</h1>
            <div className="flex flex-row justify-center items-center gap-4 w-full text-center">
                <label htmlFor="file" className="font-semibold hidden">Upload File:</label>
                <input type="file" id="file" name="file" />
            </div>
            <button type="submit" title="Upload" className="mt-4 cursor-pointer bg-red-200 text-red-900 text-md font-semibold px-8 py-1 rounded-full">Upload Now</button>
        </div>
    )
}

export default UploadSection