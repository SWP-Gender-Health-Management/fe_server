import React, { useEffect, useState } from 'react';
import QuestionModal from '@components/ConsultDshBrd/QuestionModal/QuestionModal';
import './ConsultantQuestion.css';
import axios from 'axios';
import Cookies from 'js-cookie'; // Thêm import Cookies

const ConsultantQuestion = () => {
  const [filter, setFilter] = useState('Unreply');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data cho questions - fake data for testing
  const [questionsUnreplied, setQuestionsUnreplied] = useState([
    {
      ques_id: 'Q001',
      content:
        'Tôi bị đau bụng dưới thường xuyên, đặc biệt là sau chu kỳ kinh nguyệt. Điều này có bình thường không? Tôi có nên đi khám không?',
      created_at: '2024-01-15T08:30:00.000Z',
      customer: {
        full_name: 'Nguyễn Thị Lan',
      },
      reply: null,
    },
    {
      ques_id: 'Q002',
      content:
        'Tôi đang chuẩn bị kết hôn và muốn tìm hiểu về các biện pháp tránh thai an toàn. Bạn có thể tư vấn giúp tôi không?',
      created_at: '2024-01-16T14:20:00.000Z',
      customer: {
        full_name: 'Trần Văn Minh',
      },
      reply: null,
    },
    {
      ques_id: 'Q003',
      content:
        'Chu kỳ kinh nguyệt của tôi không đều, có khi 28 ngày, có khi 35 ngày. Tôi có cần lo lắng và đi khám không?',
      created_at: '2024-01-17T10:15:00.000Z',
      customer: {
        full_name: 'Lê Thị Hương',
      },
      reply: null,
    },
    {
      ques_id: 'Q004',
      content:
        'Gần đây tôi thấy có khí hư bất thường, màu vàng và có mùi khó chịu. Điều này có nghiêm trọng không?',
      created_at: '2024-01-18T16:45:00.000Z',
      customer: {
        full_name: 'Phạm Thị Mai',
      },
      reply: null,
    },
    {
      ques_id: 'Q005',
      content:
        'Tôi 35 tuổi và đang muốn có con nhưng chưa được sau 8 tháng cố gắng. Tôi có nên đi khám vô sinh không?',
      created_at: '2024-01-19T09:30:00.000Z',
      customer: {
        full_name: 'Võ Thị Nga',
      },
      reply: null,
    },
  ]);

  const [questionsReplied, setQuestionsReplied] = useState([
    {
      ques_id: 'Q006',
      content:
        'Tôi bị viêm âm đạo thường xuyên, có cách nào phòng ngừa không? Tôi đã điều trị nhiều lần nhưng vẫn tái phát.',
      created_at: '2024-01-10T11:20:00.000Z',
      customer: {
        full_name: 'Đặng Thị Linh',
      },
      reply: {
        content:
          'Viêm âm đạo tái phát thường do nhiều nguyên nhân. Để phòng ngừa hiệu quả, bạn nên: 1) Giữ vệ sinh vùng kín đúng cách (rửa từ trước ra sau) 2) Mặc đồ lót cotton thoáng khí 3) Tránh sử dụng xà phòng thơm hoặc dung dịch vệ sinh mạnh 4) Không tự ý sử dụng kháng sinh 5) Tăng cường sức đề kháng. Nếu tái phát thường xuyên, bạn nên đi khám để xác định nguyên nhân cụ thể và có phác đồ điều trị phù hợp.',
        created_at: '2024-01-10T14:30:00.000Z',
        consultant: {
          full_name: 'BS. Nguyễn Văn Đức',
        },
      },
    },
    {
      ques_id: 'Q007',
      content:
        'Tôi đã kết hôn 2 năm nhưng chưa có con. Cả hai vợ chồng có nên đi khám cùng lúc không? Chi phí khoảng bao nhiêu?',
      created_at: '2024-01-12T15:45:00.000Z',
      customer: {
        full_name: 'Nguyễn Văn Long',
      },
      reply: {
        content:
          'Đối với các cặp vợ chồng hiếm muộn, tôi khuyên nên cả hai cùng đi khám để có kết quả chẩn đoán chính xác nhất. Quy trình thường bao gồm: khám lâm sàng, siêu âm, xét nghiệm hormone, tinh dịch đồ (nam), và các xét nghiệm chuyên sâu khác nếu cần. Chi phí dao động từ 2-5 triệu tùy theo mức độ thăm khám. Quan trọng là phát hiện sớm nguyên nhân để có hướng điều trị hiệu quả.',
        created_at: '2024-01-12T17:20:00.000Z',
        consultant: {
          full_name: 'BS. Trần Thị Hạnh',
        },
      },
    },
    {
      ques_id: 'Q008',
      content:
        'Con gái tôi 16 tuổi, lần đầu đến chu kỳ kinh nguyệt. Tôi cần lưu ý những gì để chăm sóc con?',
      created_at: '2024-01-13T08:30:00.000Z',
      customer: {
        full_name: 'Lê Thị Hoa',
      },
      reply: {
        content:
          'Đây là giai đoạn quan trọng trong sự phát triển của con gái bạn. Một số lưu ý: 1) Giải thích cho con về chu kỳ kinh nguyệt một cách tích cực 2) Hướng dẫn vệ sinh đúng cách 3) Chọn băng vệ sinh phù hợp 4) Theo dõi chu kỳ trong 6 tháng đầu 5) Bổ sung đủ chất dinh dưỡng, đặc biệt là sắt 6) Khuyến khích vận động nhẹ nhàng. Nếu chu kỳ bất thường hoặc đau nhiều, nên đưa con đi khám.',
        created_at: '2024-01-13T11:15:00.000Z',
        consultant: {
          full_name: 'BS. Phạm Thị Lan',
        },
      },
    },
    {
      ques_id: 'Q009',
      content:
        'Tôi đang mang thai 12 tuần, có nên quan hệ tình dục không? Có ảnh hưởng gì đến thai nhi không?',
      created_at: '2024-01-14T13:20:00.000Z',
      customer: {
        full_name: 'Bùi Thị Thu',
      },
      reply: {
        content:
          'Trong thai kỳ bình thường, quan hệ tình dục là an toàn và không ảnh hưởng đến thai nhi. Tuy nhiên, cần lưu ý: 1) Tư thế thoải mái cho mẹ 2) Động tác nhẹ nhàng 3) Vệ sinh trước và sau quan hệ 4) Tránh nếu có dấu hiệu chảy máu, đau bụng 5) Một số trường hợp bác sĩ có thể khuyên hạn chế (tiền sản giật, nhau bám thấp...). Bạn nên tham khảo ý kiến bác sĩ sản khoa để được tư vấn cụ thể.',
        created_at: '2024-01-14T15:45:00.000Z',
        consultant: {
          full_name: 'BS. Hoàng Văn Nam',
        },
      },
    },
  ]);

  // Comment out the useEffect for API calls and use fake data instead
  /*
  useEffect(() => {
    async function fetchQuestions() {
      const accountId = await Cookies.get('accountId');
      const accessToken = await Cookies.get('accessToken');
      // console.log('useEffect has been called!:', accountId);
      console.log('useEffect has been called!:', accessToken);

      const responseUnreply = await axios.get(
        `http://localhost:3000/question/get-unreplied-questions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Response:', responseUnreply.data);
      setQuestionsUnreplied(responseUnreply.data.result || []);
      const responseReplied = await axios.get(
        `http://localhost:3000/question/get-question-by-id/consultant/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Response:', responseReplied.data);
      setQuestionsReplied(responseReplied.data.result || []);

    }
    fetchQuestions();
  }, [showModal]); // Re-fetch questions when modal is closed
  */

  // Filter questions based on status
  const filteredQuestions =
    filter === 'Unreply' ? questionsUnreplied : questionsReplied;

  // Handle question click
  const handleQuestionClick = (question) => {
    console.log('Selected Question:', question);
    if (!question || !question.ques_id) {
      console.error('Question data is invalid:', question);
      return;
    }
    setSelectedQuestion(question);
    setShowModal(true);
  };

  // Handle reply submission
  const handleReplySubmit = async (questionId, reply) => {
    try {
      // For demo purposes, move question from unreplied to replied
      const question = questionsUnreplied.find((q) => q.ques_id === questionId);
      if (question) {
        const newReply = {
          content: reply,
          created_at: new Date().toISOString(),
          consultant: {
            full_name:
              'BS. ' + (sessionStorage.getItem('full_name') || 'Tư vấn viên'),
          },
        };

        question.reply = newReply;
        setQuestionsReplied((prev) => [...prev, question]);
        setQuestionsUnreplied((prev) =>
          prev.filter((q) => q.ques_id !== questionId)
        );

        alert('Trả lời đã được gửi thành công!');
        setShowModal(false);
      }

      /*
      const response = await axios.post(
        `http://localhost:3000/reply/create-reply`,
        {
          ques_id: questionId,
          content: reply,
          consultant_id: Cookies.get('accountId') || '',
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
            'Content-Type': 'application/json',
          }
        }
      ).then(() => {
        alert('Trả lời đã được gửi thành công!');
        // Refresh the questions after reply submission 
        setShowModal(false);
      });
      */
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại sau.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('vi-VN') +
      ' ' +
      date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <div className="consultant-question">
      <div className="question-header">
        <h1>Câu Hỏi Từ Khách Hàng</h1>
        <div className="question-stats">
          <div className="stat-item">
            <span className="stat-number">{questionsUnreplied.length}</span>
            <span className="stat-label">Chưa trả lời</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{questionsReplied.length}</span>
            <span className="stat-label">Đã trả lời</span>
          </div>
        </div>
      </div>

      <div className="question-filters">
        {['Unreply', 'Replied'].map((filterOption) => (
          <button
            key={filterOption}
            className={`filter-btn ${filter === filterOption ? 'active' : ''}`}
            onClick={() => setFilter(filterOption)}
          >
            {filterOption === 'Unreply' ? 'Chưa trả lời' : 'Đã trả lời'}
            <span className="filter-count">
              (
              {filterOption === 'Unreply'
                ? questionsUnreplied.length
                : questionsReplied.length}
              )
            </span>
          </button>
        ))}
      </div>

      <div className="questions-list">
        {filteredQuestions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❓</div>
            <h3>Không có câu hỏi nào</h3>
            <p>
              {filter === 'Unreply'
                ? 'Hiện tại chưa có câu hỏi nào cần trả lời.'
                : 'Bạn chưa trả lời câu hỏi nào.'}
            </p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question.ques_id}
              className={`question-card ${question.reply ? 'replied' : 'unreplied'}`}
              onClick={() => handleQuestionClick(question)}
            >
              <div className="question-info">
                <div className="question-header-info">
                  <div className="customer-info">
                    <span className="customer-name">
                      {question.customer.full_name}
                    </span>
                    <span className="question-date">
                      {formatDate(question.created_at)}
                    </span>
                  </div>
                  <div
                    className={`status-badge status-${question.reply ? 'replied' : 'unreplied'}`}
                  >
                    {question.reply ? 'Đã trả lời' : 'Chưa trả lời'}
                  </div>
                </div>
                <div className="question-content">
                  <p>{question.content}</p>
                </div>
                {question.reply && (
                  <div className="reply-preview">
                    <strong>Trả lời:</strong>
                    <p>{question.reply.content}</p>
                    <div className="reply-info">
                      <span>Bởi {question.reply.consultant.full_name}</span>
                      <span>{formatDate(question.reply.created_at)}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="question-actions">
                <button className="btn btn-primary">
                  {question.reply ? '👁️ Xem chi tiết' : '👁️ Xem & Trả lời'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <QuestionModal
          question={selectedQuestion}
          onClose={() => setShowModal(false)}
          onReply={handleReplySubmit}
        />
      )}
    </div>
  );
};

export default ConsultantQuestion;
