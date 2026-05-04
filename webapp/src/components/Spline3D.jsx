import React from 'react';
import Spline from '@splinetool/react-spline';

const Spline3D = ({ 
  scene = "https://prod.spline.design/6SGiRaIfL7mkmyVu/scene.splinecode", 
  style = { width: '100%', height: '100%', minHeight: '400px' }, 
  className = "" 
}) => {
  const onLoad = (splineApp) => {
    try {
      // Find and hide cursor objects
      const cursorNames = ['Cursor 3d', 'Cursor', 'Pointer', 'Mouse', 'Custom Cursor', 'cursor', 'Cursor 1'];
      cursorNames.forEach(name => {
        const obj = splineApp.findObjectByName(name);
        if (obj) {
          obj.visible = false;
        }
      });
    } catch (e) {
      console.error("Error hiding spline objects:", e);
    }
  };

  return (
    <div style={{ position: 'relative', ...style, zIndex: 10 }} className={className}>
      <Spline scene={scene} onLoad={onLoad} />
    </div>
  );
};

export default Spline3D;
