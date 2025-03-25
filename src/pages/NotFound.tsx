
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-accord-lightGray">
      <div className="text-center max-w-md px-6">
        <div className="glass p-8 rounded-2xl shadow-lg animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-accord-blue">404</h1>
          <p className="text-xl text-accord-darkGray mb-6">
            The contract you're looking for doesn't exist
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-accord-teal text-white rounded-lg hover:shadow-md transition-all"
          >
            <ArrowLeft size={16} className="mr-2" />
            Return to Accord AI
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
