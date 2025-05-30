import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface DashboardBreadcrumbProps {
  items: BreadcrumbItem[];
  homeHref: string;
}

export default function DashboardBreadcrumb({
  items,
  homeHref,
}: DashboardBreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to={homeHref}
            className="text-muted-foreground hover:text-foreground flex items-center"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {index === items.length - 1 ? (
              <span className="ml-2 text-sm font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="ml-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
