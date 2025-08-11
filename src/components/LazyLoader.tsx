import React, { Suspense, lazy, ComponentType } from 'react';
import LoadingSpinner from './LoadingSpinner';
interface LazyLoaderProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
}
const LazyLoader: React.FC<LazyLoaderProps> = ({ component, fallback }) => {
  const LazyComponent = lazy(component);
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
};
export default LazyLoader;