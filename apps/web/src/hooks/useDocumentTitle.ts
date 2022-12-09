import React, { useEffect } from 'react';

const useDocumentTitle = (title = '', dependencyArr: React.DependencyList = []) => {
  const handlePageVisible = () => {
    if (document.visibilityState === 'hidden') {
      document.title = '再待一会儿呗~';
    } else {
      document.title = title;
    }
  };

  useEffect(() => {
    document.title = title;
    document.addEventListener('visibilitychange', handlePageVisible);

    return () => document.removeEventListener('visibilitychange', handlePageVisible);
  }, dependencyArr);
};

export default useDocumentTitle;
