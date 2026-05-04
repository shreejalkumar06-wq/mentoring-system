import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

const Spline3D = ({ 
  scene = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode", 
  style = { width: '100%', height: '100%' }, 
  className = "" 
}) => {
  return (
    <div style={{ position: 'relative', ...style }} className={className}>
      <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Loading 3D Scene...</div>}>
        <Spline scene={scene} />
      </Suspense>
    </div>
  );
};

export default Spline3D;
