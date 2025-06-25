
const LoadingSpinner = ({ message = "Loading cosmic data..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-cosmic-200/20 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-cosmic-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        <div className="w-8 h-8 bg-cosmic-400 rounded-full absolute top-4 left-4 animate-twinkle"></div>
      </div>
      <p className="text-cosmic-300 font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
