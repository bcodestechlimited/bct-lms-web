import {useState} from "react";

const VideoPlayer = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative group aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}

        {/* https://drive.google.com/file/d/1mFcZYQvZYPZjAho3-Jb44YbNAE0eDFNP/view?usp=sharing */}

        {/* Video Frame */}
        <iframe
          src="https://drive.google.com/file/d/1mFcZYQvZYPZjAho3-Jb44YbNAE0eDFNP/preview"
          title="ERP System Tutorial Video"
          className="w-full h-full object-cover"
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Custom Controls Overlay (Optional) */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center h-full px-4 space-x-4">
            <button className="text-white hover:text-blue-400 transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4l15 8-15 8V4z" />
              </svg>
            </button>
            <div className="flex-1 bg-gray-700 h-1 rounded-full">
              <div className="bg-blue-500 h-1 w-1/3 rounded-full"></div>
            </div>
            <button className="text-white hover:text-blue-400 transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77zm-4 0c-4.01.91-7 4.49-7 8.77 0 4.28 2.99 7.86 7 8.77v-2.06c-2.89-.86-5-3.54-5-6.71s2.11-5.85 5-6.71V3.23z" />
              </svg>
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default VideoPlayer;
