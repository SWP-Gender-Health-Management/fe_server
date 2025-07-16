import React from 'react';
import QuestionList from '../QuestionList/QuestionList';

const MyQuestionsTab = ({
  loading,
  questions,
  searchText,
  setSearchText,
  statusFilter,
  currentPage,
  pageSize,
  totalQuestions,
  onRefresh,
  onSearch,
  onStatusChange,
  onPageChange,
  formatDate,
  setActiveTab,
  userInfo,
}) => {
  return (
    <QuestionList
      loading={loading}
      questions={questions}
      searchText={searchText}
      setSearchText={setSearchText}
      statusFilter={statusFilter}
      currentPage={currentPage}
      pageSize={pageSize}
      totalQuestions={totalQuestions}
      onRefresh={onRefresh}
      onSearch={onSearch}
      onStatusChange={onStatusChange}
      onPageChange={onPageChange}
      formatDate={formatDate}
      setActiveTab={setActiveTab}
      userInfo={userInfo}
    />
  );
};

export default MyQuestionsTab;
