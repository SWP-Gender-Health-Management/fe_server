import React from 'react';
import './QuestionList.css';

const QuestionList = ({ questions }) => {
  return (
    <div className="question-list">
      {questions.length === 0 ? (
        <p>Chưa có câu hỏi nào.</p>
      ) : (
        questions.map((q, index) => (
          <div key={index} className="question-item">
            <h4>{q.title}</h4>
            <p className="answer">{q.answer || 'Đang chờ phản hồi...'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionList;
