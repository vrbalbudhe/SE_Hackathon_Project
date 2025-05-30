import React, { useState, useEffect } from "react";

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev); // Toggle visibility every 3 seconds
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    isVisible && (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-md z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  );
};

export default LoadingScreen;
