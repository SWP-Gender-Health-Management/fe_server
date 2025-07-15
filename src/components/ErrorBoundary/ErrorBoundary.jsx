import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '16px', color: 'red' }}>
          <h3>Đã xảy ra lỗi</h3>
          <p>{this.state.error?.message || 'Không thể hiển thị nội dung.'}</p>
          <Button onClick={() => window.location.reload()}>Tải lại trang</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;