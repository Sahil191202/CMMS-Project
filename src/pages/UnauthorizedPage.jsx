const UnauthorizedPage = () => {
//   const { auth, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">
          Access Denied
        </p>
        <h1 className="text-2xl font-black uppercase tracking-tight text-gray-100">
          Unauthorized
        </h1>
        <p className="text-sm text-gray-600 mt-2 mb-6">
          You don't have permission to view this page.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            // onClick={() => window.history.back()}
            className="px-4 py-2 text-sm border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-colors"
          >
            Go Back
          </button>
          <button
            // onClick={logout}
            className="px-4 py-2 text-sm bg-amber-500 text-gray-950 font-semibold hover:bg-amber-400 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;