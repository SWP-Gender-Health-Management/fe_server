import React from 'react';

export const Input = ({ ...props }) => (
  <input
    {...props}
    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);
