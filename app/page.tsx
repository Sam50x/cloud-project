import UploadSection from "./components/UploadSection";
import DownloadSection from "./components/DownloadSection";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center h-screen w-full">
      <div className="h-1/2 lg:h-full w-full lg:w-1/2">
        <UploadSection />
      </div>
      <div className="bg-white h-1 w-full lg:w-1 lg:h-full"></div>
      <div className="h-1/2 lg:h-full w-full lg:w-1/2">
        <DownloadSection />
      </div>
    </div>
  );
}
