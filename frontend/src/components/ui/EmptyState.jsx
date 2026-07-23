// EmptyState.jsx
const EmptyState = ({ icon, title, message, action, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}>
      {icon && (
        <div className="text-gray-700 mb-4 [&>svg]:w-12 [&>svg]:h-12">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
          {title}
        </h3>
      )}
      {message && (
        <p className="text-sm text-gray-600 max-w-xs leading-relaxed mb-6">
          {message}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;