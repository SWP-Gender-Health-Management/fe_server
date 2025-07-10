import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultantSidebar from './components/ConsultantSidebar';
import DashboardOverview from './components/DashboardOverview';
import ConsultantAppointment from '@components/ConsultDshBrd/ConsultAppoint/ConsultantAppointment';
import ConsultantBlog from '@components/ConsultDshBrd/ConsultBlog/ConsultantBlog';
import ConsultantQuestion from '@components/ConsultDshBrd/ConsultQuest/ConsultantQuestion';
import ConsultantProfile from '@components/ConsultDshBrd/ConsultProfile/ConsultantProfile';
import './ConsultantDashboard.css';
import Cookies from 'js-cookie'; // Thêm import Cookies
import axios from 'axios';

const ConsultantDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [consultantData, setConsultantData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const accessToken = Cookies.get("accessToken");
  const accountId = Cookies.get("accountId");

  // Mock consultant data - would come from API
  useEffect(() => {
    const loadConsultantData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // setConsultantData({
      //   account_id: 'CNS001',
      //   full_name: 'Dr. Nguyễn Mai',
      //   avatar: '/api/placeholder/80/80',
      //   specialization: 'Sức khỏe sinh sản',
      //   averageFeedBackRating: 4.8,
      //   totalFeedBack: 89,
      //   totalAppointments: 245,
      //   totalBlogs: 18,
      //   created_at: '2023-01-15',
      //   email: 'dr.mai@clinic .com',
      //   phone: '0123456789',
      //   status: 'active',
      //   gender: "Nam"
      // });
      await fetchConsultantData();
      await fetchBlogs();
      await fetchQuestions();
      await fetchAppointments();
      setIsLoading(false);
    };

    loadConsultantData();
  }, []);

  const fetchConsultantData = async () => {
    try {
      const accessToken = Cookies.get("accessToken")
      const viewResponse = await axios.post(
        'http://localhost:3000/account/view-account',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const ratingResponse = await axios.get(
        'http://localhost:3000/feedback/get-consultant-rating-feedback',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setConsultantData((prev) => {
        if (viewResponse.data.result) {
          prev = { ...prev, ...viewResponse.data.result }
        }
        if (ratingResponse.data.result) {
          prev = { ...prev, ...ratingResponse.data.result }
        }
        return prev;
      });

    } catch (error) {
      console.error('Error fetching consultant data:', error);
    }
  }

  const fetchQuestions = async () => {
    // Simulate fetching questions from an API
    try {
      const responseUnreplied = await axios.get(
        'http://localhost:3000/question/get-unreplied-questions',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      const responseReplied = await axios.get(
        `http://localhost:3000/question/get-question-by-id/consultant/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      const unrepliedQuestions = responseUnreplied.data.result || [];
      const repliedQuestions = responseReplied.data.result || [];
      setQuestions([...unrepliedQuestions, ...repliedQuestions]);
      setConsultantData((prev) => {
        if (responseReplied.data.result) {
          const questionsAnswered = responseReplied.data.result.length;
          prev = { ...prev, questionsAnswered }
        }
        if (responseUnreplied.data.result) {
          const unansweredQuestions = responseUnreplied.data.result.length;
          prev = { ...prev, unansweredQuestions }
        }
        return prev;
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  const fetchBlogs = async function () {
    try {
      // console.log('useEffect has been called!:', accountId);
      // console.log('useEffect has been called!:', accessToken);
      const response = await axios.get(
        `http://localhost:3000/blog/get-blog-by-account/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      // console.log('Blog Response:', response.data.result);
      setBlogs(response.data.result || []);
      setConsultantData((prev) => {
        if (response.data.result) {
          const totalBlogs = response.data.result.length;
          const publishedBlogs = response.data.result.filter((blog) => {
            return blog.status == 'true' || blog.status == true
          }).length;
          prev = { ...prev, totalBlogs, publishedBlogs, pendingBlogs: totalBlogs - publishedBlogs }
        }
        return prev;
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return;
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/consult-appointment/get-consult-appointment-by-id/consultant/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Consult Appointment Response:', response.data.result);
      setAppointments(response.data.result || []);
      setConsultantData((prev) => {
        if (response.data.result) {
          const totalAppointments = response.data.result.length;
          const completedAppointments = response.data.result.filter((app) => {
            return (app.status == 'completed');
          }).length
          prev = {
            ...prev,
            totalAppointments,
            completedAppointments
          }
        }
        return prev
      });
    } catch (error) {
      console.error("Error fetching Consult Appointment:", error);
      setAppointments([]);
    }
  }

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      // Clear authentication data
      Cookies.remove('accessToken');
      Cookies.remove('accountId');
      navigate('/');
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardOverview
            consultantData={consultantData}
            onSectionChange={handleSectionChange}
            upcomingAppointments={appointments.filter((app) => {
              const date = new Date(app.consultant_pattern.date);
              return !isNaN(date) && date >= new Date();
            }).sort((a, b) => new Date(a.consultant_pattern.date) - new Date(b.consultant_pattern.date)).slice(0, 5)}
            recentQuestions={questions.filter((ques) => !ques.status).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).slice(0, 5)}
          />
        );
      case 'appointments':
        return <ConsultantAppointment appointments={appointments} fetchAppointments={fetchAppointments} />;
      case 'blogs':
        return <ConsultantBlog blogs={blogs} fetchBlogs={fetchBlogs} />;
      case 'questions':
        return <ConsultantQuestion questions={questions} fetchQuestions={fetchQuestions} />;
      case 'profile':
        return <ConsultantProfile consultantData={consultantData} />;
      default:
        return (
          <DashboardOverview
            consultantData={consultantData}
            onSectionChange={handleSectionChange}
            upcomingAppointments={appointments.filter((app) => {
              const date = new Date(app.consultant_pattern.date);
              return !isNaN(date) && date >= new Date();
            }).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5)}
            recentQuestions={questions.filter((ques) => !ques.status).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).slice(0, 5)}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="consultant-workspace">
        <div className="workspace-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <h3>Đang tải workspace...</h3>
            <p>Chuẩn bị không gian làm việc của bạn</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="consultant-workspace">
      {/* Sidebar Navigation */}
      <ConsultantSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
        consultantData={consultantData}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main Content Area */}
      <div
        className={`workspace-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      >
        {/* Content Container */}
        <div className="content-container">{renderContent()}</div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
};

export default ConsultantDashboard;
