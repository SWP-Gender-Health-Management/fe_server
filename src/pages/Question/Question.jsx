import React, { useEffect, useState } from 'react';
import QuestionList from './components/QuestionList/QuestionList';
import QuestionForm from './components/QuestionForm/QuestionForm';
import HospitalInfo from './components/Info/HospitalInfo';
import './Question.css';
import axios from 'axios';
import { Divider, Modal, message } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { useAuth } from '@context/AuthContext';
import Cookies from 'js-cookie';
const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoggedIn, userInfo } = useAuth();

  const fetchQuestions = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const res = await axios.get('http://localhost:3000/question/get-all-question', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setQuestions(res.data.questions || res.data || []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      message.error('Không thể tải danh sách câu hỏi. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchQuestions();
    } else {
      setIsModalVisible(true);
    }
  }, [isLoggedIn]);

  const handleAskQuestion = async (questionData) => {
    if (!isLoggedIn) {
      setIsModalVisible(true);
      return;
    }

    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      setIsModalVisible(true);
      return;
    }

    const customerId = userInfo.accountId || 'default_customer_id'; // Sử dụng accountId hoặc giá trị mặc định
    const payload = {
      customer_id: customerId,
      content: questionData.content || '',
      status: true,
    };

    try {
      const res = await axios.post(
        'http://localhost:3000/question/create-question',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setQuestions([res.data, ...questions]); // Giả định API trả về câu hỏi mới
      message.success('Câu hỏi đã được gửi thành công!');
    } catch (error) {
      console.error('Failed to ask question:', error);
      message.error('Không thể gửi câu hỏi. Vui lòng thử lại.');
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="question-page">
      <Modal
        title="Thông báo"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        <p>Hãy đăng nhập để xem trang này!</p>
      </Modal>

      {isLoggedIn ? (
        <div className="question-left">
          <h2>
            <CommentOutlined style={{ marginRight: 8 }} />
            Câu hỏi thường gặp
          </h2>

          <QuestionList questions={questions} />

          <Divider />

          <h3>Đặt câu hỏi</h3>
          <QuestionForm onSubmitSuccess={handleAskQuestion} />
        </div>
      ) : null}

      <div className="question-right">
        <HospitalInfo />
      </div>
    </div>
  );
};

export default Question;