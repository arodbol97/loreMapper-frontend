import React, { useEffect, useState } from 'react';

const Section = ( {comp , handleComponentChange , user}) => {
  const sectionStyles = {
      backgroundColor: '#191a21',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '90vh',
      overflowY: 'auto'
  };

  return (
    <section style={sectionStyles}>
      {React.cloneElement(comp, { handleComponentChange, user })}
    </section>
  );
};

export default Section;