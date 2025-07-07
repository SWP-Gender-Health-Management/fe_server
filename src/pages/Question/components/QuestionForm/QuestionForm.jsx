import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import axios from 'axios';
import { useAuth } from '@context/AuthContext.jsx'; // Điều chỉnh đường dẫn nếu cần
import './QuestionForm.css';
import Cookies from 'js-cookie'; // Sử dụng js-cookie để quản lý cookies

const QuestionForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, userInfo } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      return message.warning('Vui lòng đăng nhập để gửi câu hỏi!');
    }

    if (!formData.content) {
      return message.warning('Vui lòng điền nội dung câu hỏi!');
    }

    const accessToken = Cookies.getI('accessToken');
    if (!accessToken) {
      return message.warning('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
    }

    const customerId = userInfo.accountId || 'default_customer_id'; // Sử dụng accountId hoặc giá trị tạm thời
    const payload = {
      customer_id: customerId,
      content: formData.content,
      status: true,
    };

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/question/create-question', payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      onSubmitSuccess(res.data); // Truyền câu hỏi mới lên parent component
      message.success('Gửi câu hỏi thành công!');
      setFormData({ content: '' });
    } catch (err) {
      console.error('Failed to submit question:', err);
      message.error('Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-form">
      <div className="question-form-field">
        <label>Nội dung</label>
        <Input.TextArea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Vui lòng nhập nội dung câu hỏi"
          rows={4}
          disabled={!isLoggedIn}
        />
      </div>
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={loading}
        style={{ marginTop: 16 }}
        disabled={!isLoggedIn}
      >
        Gửi câu hỏi
      </Button>
    </div>
  );
};

export default QuestionForm;