import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface RouteContextType {
  pathname: string;
  search: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  params: Record<string, string>;
}

const RouteContext = createContext<RouteContextType>({
  pathname: '/',
  search: '',
  navigate: () => {},
  params: {},
});

export const useRouter = () => useContext(RouteContext);

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, replace = false, onClick, children, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !rest.target && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to, { replace });
    }
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUrl, setCurrentUrl] = useState(() => {
    return {
      pathname: window.location.pathname || '/',
      search: window.location.search || '',
    };
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl({
        pathname: window.location.pathname || '/',
        search: window.location.search || '',
      });
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    let targetPath = to;
    let targetSearch = '';

    const queryIndex = to.indexOf('?');
    if (queryIndex !== -1) {
      targetPath = to.substring(0, queryIndex);
      targetSearch = to.substring(queryIndex);
    }

    if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }

    if (options?.replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }

    setCurrentUrl({ pathname: targetPath, search: targetSearch });
    window.scrollTo(0, 0);
  };

  const contextValue = useMemo(() => ({
    pathname: currentUrl.pathname,
    search: currentUrl.search,
    navigate,
    params: {},
  }), [currentUrl]);

  return (
    <RouteContext.Provider value={contextValue}>
      {children}
    </RouteContext.Provider>
  );
};

export function matchPath(pattern: string, pathname: string): { matched: boolean; params: Record<string, string> } {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return { matched: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    const actual = pathParts[i];

    if (p.startsWith(':')) {
      params[p.slice(1)] = decodeURIComponent(actual);
    } else if (p !== actual) {
      return { matched: false, params: {} };
    }
  }

  return { matched: true, params };
}
