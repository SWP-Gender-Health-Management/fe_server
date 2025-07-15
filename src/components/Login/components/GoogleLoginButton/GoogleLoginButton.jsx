import { GoogleLogin } from '@react-oauth/google';
import React from 'react';

const GoogleLoginButton = ({ onSuccess, onError }) => (
  <GoogleLogin
    onSuccess={onSuccess}
    onError={onError}
    theme="outline"
    size="large"
    text="signin_with"
    shape="rectangular"
    width="100%"
  />
);

export default GoogleLoginButton; 