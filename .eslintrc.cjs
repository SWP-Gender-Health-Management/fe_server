module.exports = {
  env: {
    browser: true,    // Môi trường browser (có document, window...)
    es2021: true,    // Hỗ trợ ES2021 features
  },
  extends: [
    'eslint:recommended',       // Rules recommended bởi ESLint
    'plugin:react/recommended', // React recommended rules
    'plugin:react-hooks/recommended', // React Hooks rules
    'plugin:jsx-a11y/recommended',   // Accessibility rules
    'prettier',                // Tắt rules xung đột với Prettier
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,      // Cho phép phân tích JSX
    },
    ecmaVersion: 'latest', // Phiên bản ECMAScript mới nhất
    sourceType: 'module',  // Sử dụng ES modules
  },
  plugins: ['react'],      // Sử dụng plugin React
  rules: {
    'react/react-in-jsx-scope': 'off', // Không bắt buộc import React trong React 17+
    'react/prop-types': 'off',         // Tắt kiểm tra prop-types (có thể bật nếu dùng)
  },
  settings: {
    react: {
      version: 'detect', // Tự động phát hiện version React
    },
  },
};