// PageHeader.jsx
const PageHeader = ({ title, breadcrumbs = [], action, subtitle, className = '' }) => {
  return (
    <div className={`flex items-start justify-between gap-4 mb-6 ${className}`}>
      <div className="flex flex-col gap-1">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-gray-600">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-700">/</span>}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="hover:text-gray-400 transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className={i === breadcrumbs.length - 1 ? 'text-gray-400' : ''}>
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-xl font-black uppercase tracking-tight text-gray-100 leading-none">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Action slot */}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;