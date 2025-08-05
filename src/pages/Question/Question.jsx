import React, { useEffect, useState } from 'react';
import './Question.css';
import { Modal, message } from 'antd';
import { useAuth } from '@context/AuthContext';
import Cookies from 'js-cookie';
import HospitalInfo from './components/Info/HospitalInfo';

// Import components
import QuestionHeader from './components/MyQuestionTab/QuestionHeader';
import TabNavigation from './components/TabNavigation/TabNavigation';
import MyQuestionsTab from './components/MyQuestionTab/MyQuestionsTab';
import AskQuestionForm from './components/AskQuestionForm/AskQuestionForm';
import api from '@/api/api';
import LoginRequiredModal from '../../components/LoginRequiredModal/LoginRequiredModal';

const Question = () => {
  const [activeTab, setActiveTab] = useState('my-questions');
  const [myQuestions, setMyQuestions] = useState([]);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const customerId = Cookies.get('accountId');

  // Form states
  const [newQuestion, setNewQuestion] = useState({
    content: '',
    customer_id: customerId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoggedIn, userInfo } = useAuth();

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  // const [totalPages, setTotalPages] = useState(1); // Không dùng
  const pageSize = 10;

  const fetchMyQuestions = async (
    page = 1,
    search = searchText
  ) => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
             console.log('=== API CALL START ===');
       console.log('Requesting page:', page);
       console.log('Search term:', search);

             const res = await api.get(
         `/question/get-question-by-id/customer/${customerId}`,
         {
           params: {
             page: page, // Nếu backend cần page bắt đầu từ 0, thay bằng: page - 1
             limit: pageSize,
             search: search || undefined,
             // Tạm thời bỏ status và sort ở backend, xử lý ở frontend
             // status: status === 'all' ? undefined : status,
             // sort: sort || undefined,
           },
         }
       );

      console.log('API Question Response:', res.data.result);
      console.log(
        'Received questions count:',
        res.data.result.questions?.length || 0
      );
      console.log('Total from API:', res.data.result.total);
      console.log('=== API CALL END ===');

      setMyQuestions(
        Array.isArray(res.data.result.questions)
          ? res.data.result.questions
          : []
      );
      setTotalQuestions(res.data.result.total || 0);
      // setTotalPages(Math.ceil((res.data.result.total || 0) / pageSize)); // Không dùng

      // Chỉ cập nhật currentPage nếu page khác với currentPage hiện tại
      if (page !== currentPage) {
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Failed to fetch my questions:', error);
      message.error('Không thể tải danh sách câu hỏi của bạn.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      setCurrentPage(1);
      fetchMyQuestions(1, '');
    } else {
      setIsLoginModalVisible(true);
    }
  }, [isLoggedIn]);

  const handleSubmitQuestion = async () => {
    if (!isLoggedIn) {
      setIsLoginModalVisible(true);
      return;
    }

    if (!newQuestion.content.trim()) {
      message.warning('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customer_id: customerId,
      content: newQuestion.content,
    };

    try {
      await api.post('/question/create-question', payload);

      // Reset về trang 1 sau khi tạo câu hỏi mới
      setCurrentPage(1);
      setSearchText('');
      setStatusFilter('all');
      await fetchMyQuestions(1, '');

      setNewQuestion({ content: '' });
      setActiveTab('my-questions');
      message.success(
        'Câu hỏi đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.'
      );
    } catch (error) {
      console.error('Failed to submit question:', error);
      message.error('Không thể gửi câu hỏi. Vui lòng thử lại.');
    }
    setIsSubmitting(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handler functions for components
  const handleRefresh = () => {
    fetchMyQuestions(currentPage, searchText);
  };

  const handleSearch = (value) => {
    setCurrentPage(1);
    setSearchText(value); // Cập nhật searchText state
    fetchMyQuestions(1, value);
  };

  const handleStatusChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
    // Không cần gọi API lại vì filter được xử lý ở frontend
    // fetchMyQuestions(1, searchText);
  };



  const handlePageChange = async (page) => {
    console.log('=== PAGINATION CLICK ===');
    console.log('User clicked page:', page);
    console.log('Current page before change:', currentPage);
    console.log('Will call API with page:', page);

    // Cập nhật state trước
    setCurrentPage(page);

    // Gọi API với page mới
    await fetchMyQuestions(page, searchText);

    console.log('=== PAGINATION COMPLETE ===');
  };

  const handleClearForm = () => {
    setNewQuestion({ content: '' });
  };

  // Không cần filter ở frontend nữa vì đã filter ở backend
  const displayQuestions = myQuestions;

  // Thêm logic sort ở frontend để đảm bảo hoạt động
  const getSortedQuestions = (questions, sortType) => {
    if (!questions || questions.length === 0) return questions;
    
    const sortedQuestions = [...questions];
    
    switch (sortType) {
      case 'newest':
        return sortedQuestions.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
      case 'oldest':
        return sortedQuestions.sort((a, b) => 
          new Date(a.created_at) - new Date(b.created_at)
        );
      case 'answered':
        return sortedQuestions.sort((a, b) => {
          const aHasReply = !!a.reply;
          const bHasReply = !!b.reply;
          if (aHasReply && !bHasReply) return -1;
          if (!aHasReply && bHasReply) return 1;
          return new Date(b.created_at) - new Date(a.created_at);
        });
      case 'pending':
        return sortedQuestions.sort((a, b) => {
          const aHasReply = !!a.reply;
          const bHasReply = !!b.reply;
          if (!aHasReply && bHasReply) return -1;
          if (aHasReply && !bHasReply) return 1;
          return new Date(b.created_at) - new Date(a.created_at);
        });
      default:
        return sortedQuestions;
    }
  };

  const sortedQuestions = getSortedQuestions(displayQuestions, 'newest');



  // Kết hợp search và filter
  const getFilteredAndSearchedQuestions = (questions, status, search) => {
    if (!questions || questions.length === 0) return questions;
    
    let filteredQuestions = questions;
    
    // Filter theo status
    switch (status) {
      case 'answered':
        filteredQuestions = questions.filter(q => !!q.reply);
        break;
      case 'pending':
        filteredQuestions = questions.filter(q => !q.reply);
        break;
      case 'all':
      default:
        filteredQuestions = questions;
    }
    
    // Search trong kết quả đã filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filteredQuestions = filteredQuestions.filter(q => 
        q.content.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredQuestions;
  };

  const filteredAndSortedQuestions = getFilteredAndSearchedQuestions(
    sortedQuestions, 
    statusFilter, 
    searchText
  );

  if (!isLoggedIn) {
    return (
      <div className="question-page">
        <LoginRequiredModal
          visible={isLoginModalVisible}
          onCancel={() => setIsLoginModalVisible(false)}
          onLoginSuccess={() => {
            setIsLoginModalVisible(false);
            // Reload trang sau khi đăng nhập thành công
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }}
          message="Bạn cần đăng nhập để sử dụng tính năng hỏi đáp!"
        />
        <div className="question-right">
          <HospitalInfo />
        </div>
      </div>
    );
  }

  return (
    <div className="question-page">
      <div className="question-container">
        <QuestionHeader
          totalQuestions={totalQuestions}
          answeredCount={displayQuestions.filter((q) => q.reply).length}
        />

        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          totalQuestions={totalQuestions}
        />

        <div className="tab-content">
                     {activeTab === 'my-questions' && (
             <MyQuestionsTab
               loading={loading}
               questions={filteredAndSortedQuestions}
               searchText={searchText}
               setSearchText={setSearchText}
               statusFilter={statusFilter}
               currentPage={currentPage}
               pageSize={pageSize}
               totalQuestions={totalQuestions}
               onRefresh={handleRefresh}
               onSearch={handleSearch}
               onStatusChange={handleStatusChange}
               onPageChange={handlePageChange}
               formatDate={formatDate}
               setActiveTab={setActiveTab}
               userInfo={userInfo}
             />
           )}

          {activeTab === 'ask-question' && (
            <AskQuestionForm
              newQuestion={newQuestion}
              setNewQuestion={setNewQuestion}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmitQuestion}
              onClear={handleClearForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
