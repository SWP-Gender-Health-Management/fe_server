import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import axios from 'axios';
import './QuestionForm.css';

const QuestionForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, content } = formData;
    if (!name || !email || !content) {
      return message.warning('Vui lòng điền đầy đủ thông tin');
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/questions', formData);
      onSubmitSuccess(res.data);
      message.success('Gửi câu hỏi thành công!');
      setFormData({ name: '', email: '', content: '' });
    } catch (err) {
      console.error(err);
      message.error('Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-form">
      <div className="question-form-row">
        <div className="question-form-field">
          <label>Họ tên</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Vui lòng nhập Họ & tên"
          />
        </div>
        <div className="question-form-field">
          <label>Email</label>
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Vui lòng nhập Email"
          />
        </div>
      </div>
      <div className="question-form-field">
        <label>Nội dung</label>
        <Input.TextArea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Vui lòng nhập nội dung câu hỏi"
          rows={4}
        />
      </div>
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={loading}
        style={{ marginTop: 16 }}
      >
        Gửi câu hỏi
      </Button>
    </div>
  );
};

export default QuestionForm;
