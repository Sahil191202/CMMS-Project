<<<<<<< HEAD
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
=======
// EmptyState.jsx — dark/light aware
const EmptyState = ({ icon, title, message, action, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}>
    {icon && <div className="text-gray-300 dark:text-gray-700 mb-4 [&>svg]:w-12 [&>svg]:h-12">{icon}</div>}
    {title && <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">{title}</h3>}
    {message && <p className="text-sm text-gray-400 dark:text-gray-600 max-w-xs leading-relaxed mb-6">{message}</p>}
    {action && <div>{action}</div>}
  </div>
);
>>>>>>> 5fdd7323092550931089ab4d77430191dd6ca83d

export default EmptyState;