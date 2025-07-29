import React from 'react';

const WorkspaceLoading = ({ title, description, className = '' }) => (
  <div className={className}>
    <div className="workspace-loading">
      <div className="loading-spinner"></div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

export default WorkspaceLoading; 