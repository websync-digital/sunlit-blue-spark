// src/pages/Products.tsx
import React from 'react';

const Product: React.FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <iframe
        src="https://skyblue-admin-two.vercel.app/"
        title="Skyblue Admin Panel"
        allowFullScreen
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-downloads"
        loading="lazy"
      />
    </div>
  );
};

export default Product;
