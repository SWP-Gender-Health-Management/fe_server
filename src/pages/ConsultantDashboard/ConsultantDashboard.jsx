import ConsultantAppointment from '@/pages/ConsultantDashboard/components/ConsultAppointment/ConsultantAppointment';
import ConsultantBlog from '@/pages/ConsultantDashboard/components/ConsultBlog/ConsultantBlog';
import ConsultantQuestion from '@/pages/ConsultantDashboard/components/ConsultQuest/ConsultantQuestion';
import ConsultantProfile from '@pages/ConsultantDashboard/components/ConsultProfile/ConsultantProfile';
import axios from 'axios';
import Cookies from 'js-cookie'; // Thêm import Cookies
import React, { useEffect, useState } from 'react';
import {
  useNavigate
} from 'react-router-dom';
import {
  HomeOutlined,
  CalendarOutlined,
  EditOutlined,
  UserOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import Sidebar from '../../components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import './ConsultantDashboard.css';
import WorkspaceLoading from '../../components/ui/WorkspaceLoading';

const API_URL = 'http://localhost:3000';

const ConsultantDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [consultantData, setConsultantData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);



  // Menu items for consultant
  const menuItems = [
    {
      id: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Overview',
      description: 'Main dashboard'
    },
    {
      id: 'appointments',
      icon: <CalendarOutlined />,
      label: 'Appointment Management',
      description: 'View and manage appointments'
    },
    {
      id: 'blogs',
      icon: <EditOutlined />,
      label: 'Blog Management',
      description: 'Write and manage blogs'
    },
    {
      id: 'questions',
      icon: <QuestionCircleOutlined />,
      label: 'Q&A',
      description: 'Answer questions'
    },
    {
      id: 'profile',
      icon: <UserOutlined />,
      label: 'Personal Profile',
      description: 'Personal information'
    },
  ];

  // Mock consultant data - would come from API
  useEffect(() => {
    const loadConsultantData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchConsultantData();
      await fetchConsultAppointmentStat();
      await fetchBlogs();
      await fetchQuestions();
      await fetchWeekAppointment((new Date()), true);
      setIsLoading(false);
    };

    loadConsultantData();
  }, []);

  const fetchConsultantData = async () => {
    try {
      const accessToken = Cookies.get("accessToken")
      const viewResponse = await axios.post(
        `${API_URL}/account/view-account`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const ratingResponse = await axios.get(
        `${API_URL}/feedback/get-consultant-rating-feedback`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setConsultantData((prev) => ({
        ...prev,
        ...(viewResponse.data.result || {}), // Fallback to empty object if undefined
        ...(ratingResponse.data.result || {}), // Fallback to empty object if undefined
      }));

    } catch (error) {
      console.error('Error fetching consultant data:', error);
    }
  }

  const fetchConsultAppointmentStat = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      const appointmentStatResponse = await axios.get(
        `${API_URL}/consult-appointment/get-consult-appointment-stats`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setConsultantData((prev) => {
        if (appointmentStatResponse.data.result) {
          prev = { ...prev, ...appointmentStatResponse.data.result }
        }
        return prev;
      });

    } catch (error) {
      console.error('Error fetching Consult Appointment Stat: ', error);
    }
  }

  const fetchQuestions = async () => {
    // Simulate fetching questions from an API
    try {
      const accessToken = Cookies.get("accessToken");
      const accountId = Cookies.get("accountId");
      const responseUnreplied = await axios.get(
        `${API_URL}/question/get-unreplied-questions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      const responseReplied = await axios.get(
        `${API_URL}/question/get-question-by-id/consultant/${accountId}`,
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
      const accessToken = Cookies.get("accessToken");
      const accountId = Cookies.get("accountId");
      // console.log('useEffect has been called!:', accountId);
      // console.log('useEffect has been called!:', accessToken);
      const response = await axios.get(
        `${API_URL}/blog/get-blog-by-account/${accountId}`,
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
          prev = {
            ...prev,
            totalBlogs,
            publishedBlogs,
            pendingBlogs: totalBlogs - publishedBlogs,
          };
        }
        return prev;
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return;
    }
  };

  // const fetchAppointments = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/consult-appointment/get-consult-appointment-by-id/consultant/${accountId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json',
  //         }
  //       }
  //     );
  //     console.log('Consult Appointment Response:', response.data.result);
  //     setAppointments(response.data.result || []);
  //     setConsultantData((prev) => {
  //       if (response.data.result) {
  //         const totalAppointments = response.data.result.length;
  //         const completedAppointments = response.data.result.filter((app) => {
  //           return (app.status == 'completed');
  //         }).length
  //         prev = {
  //           ...prev,
  //           totalAppointments,
  //           completedAppointments
  //         }
  //       }
  //       return prev
  //     });
  //   } catch (error) {
  //     console.error("Error fetching Consult Appointment:", error);
  //     setAppointments([]);
  //   }
  // }

  const fetchWeekAppointment = async (selectedDate, isInit) => {
    try {
      const accountId = Cookies.get("accountId");
      const accessToken = Cookies.get("accessToken");
      const startWeekDay = getWeekStartDay(selectedDate || new Date());
      const startWeekDayString = startWeekDay.toISOString().split("T")[0];
      console.log("Check selected date: ", startWeekDayString);
      const response = await axios.get(
        `${API_URL}/consult-appointment/get-consult-appointment-by-week/${accountId}`,
        {
          params: {
            weekStartDate: startWeekDayString
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Consult Appointment Response:', response.data.result);
      setAppointments(response.data.result || []);
      if (isInit) {
        setUpcomingAppointments(response.data.result || []);
      }
    } catch (error) {
      console.error("Error fetching Consult Appointment:", error);
      setAppointments([]);
      return;
    }
  }

  const getWeekStartDay = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    return startOfWeek;
  };

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

  // Note: toggleSidebar function removed as it's not used

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardOverview
            consultantData={consultantData || {}}
            onSectionChange={handleSectionChange}
            upcomingAppointments={upcomingAppointments || []}
            recentQuestions={
              Array.isArray(questions)
                ? questions
                  .filter((ques) => !ques.status)
                  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                  .slice(0, 5)
                : []
            }
          />
        );
      case 'appointments':
        return (
          <ConsultantAppointment
            appointments={appointments || []}
            fetchWeekAppointment={fetchWeekAppointment}
            consultantData={consultantData || {}}
            fetchConsultAppointmentStat={fetchConsultAppointmentStat}
          />
        );
      case 'blogs':
        return <ConsultantBlog blogs={blogs || []} fetchBlogs={fetchBlogs} />;
      case 'questions':
        return (
          <ConsultantQuestion
            questions={questions || []}
            fetchQuestions={fetchQuestions}
          />
        );
      case 'profile':
        return <ConsultantProfile consultantData={consultantData || {}} />;
      default:
        return (
          <DashboardOverview
            consultantData={consultantData || {}}
            onSectionChange={handleSectionChange}
            upcomingAppointments={upcomingAppointments || []}
            recentQuestions={
              Array.isArray(questions)
                ? questions
                  .filter((ques) => !ques.status)
                  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                  .slice(0, 5)
                : []
            }
          />
        );
    }
  };

  if (isLoading) {
    return (
      <WorkspaceLoading
        className="consultant-workspace"
        title="Loading Consultant Dashboard"
        description="Preparing consultation tools and patient data... Please wait"
      />
    );
  }

  return (
    <div className="consultant-workspace">
      {/* Sidebar Navigation */}
      <Sidebar
        userData={consultantData}
        sidebarCollapsed={sidebarCollapsed}
        mobileMenuOpen={false}
        setSidebarCollapsed={setSidebarCollapsed}
        menuItems={menuItems}
        activeSection={activeSection}
        handleSectionChange={handleSectionChange}
        handleLogout={handleLogout}
        basePath="/consultant"
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
