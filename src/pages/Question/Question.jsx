import React, { useEffect, useState } from 'react';
import QuestionList from '@components/QaA/QuestionList/QuestionList';
import QuestionForm from '@components/QaA/QuestionForm/QuestionForm';
import HospitalInfo from '@components/Info//HospitalInfo';
import './Question.css';
import axios from 'axios';
import { Divider } from 'antd';
import { CommentOutlined } from '@ant-design/icons';

const Question = () => {
  const [questions, setQuestions] = useState([]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/questions');
      setQuestions(res.data || []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleNewQuestion = (newQuestion) => {
    setQuestions([newQuestion, ...questions]);
  };

  return (
    <div className="question-page">
      <div className="question-left">
        <h2>
          <CommentOutlined style={{ marginRight: 8 }} />
          Câu hỏi thường gặp
        </h2>

        <QuestionList questions={questions} />

        <Divider />

        <h3>Đặt câu hỏi</h3>
        <QuestionForm onSubmitSuccess={handleNewQuestion} />
      </div>

      <div className="question-right">
        <HospitalInfo />
      </div>
    </div>
  );
};

export default Question;
