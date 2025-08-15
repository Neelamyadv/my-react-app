import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { LazyLoaderProps } from '../types';

const LazyLoader: React.FC<LazyLoaderProps> = ({ component, fallback }) => {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
};

export default LazyLoader;