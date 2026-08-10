"use client";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  description,
  children,
}: PageHeaderProps) {
  const text = subtitle ?? description;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {title}
        </h1>

        {text && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {text}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}