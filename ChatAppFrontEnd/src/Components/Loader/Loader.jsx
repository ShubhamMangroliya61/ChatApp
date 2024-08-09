import React from 'react';
import RingLoader from 'react-spinners/RingLoader';

const LoaderComponent = ({ isLoader }) => {
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', 
  };

  const loaderContainerStyle = {
    position: 'absolute',
    top: '50%',
    right: '50%',
    zIndex: 1001,
  };

  const loaderStyle = {
    borderColor: 'red',
  };

  return (
    isLoader && (
      <div style={overlayStyle}>
        <div style={loaderContainerStyle}>
          <RingLoader
            color="#4f46e5"
            cssOverride={loaderStyle}
            loading={isLoader}
            size={62}
            speedMultiplier={3}
          />
        </div>
      </div>
    )
  );
};

export default LoaderComponent;
