import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './DoctorList.css';

const API_BASE = 'http://localhost:3000';
const DoctorList = ({ onDoctorSelect }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');

  // Mock data cho danh sách bác sĩ
  // const mockDoctors = [
  //   {
  //     id: 1,
  //     name: 'BS. Nguyễn Văn An',
  //     specialty: 'Tim mạch',
  //     avatar: '/src/assets/doctor.jpg',
  //     rating: 4.8,
  //     reviewCount: 124,
  //     price: 500000,
  //     experience: '15 năm kinh nghiệm',
  //     location: 'Bệnh viện Chợ Rẫy',
  //   },
  //   {
  //     id: 2,
  //     name: 'BS. Trần Thị Bình',
  //     specialty: 'Da liễu',
  //     avatar: '/src/assets/doctor.jpg',
  //     rating: 4.5,
  //     reviewCount: 89,
  //     price: 400000,
  //     experience: '12 năm kinh nghiệm',
  //     location: 'Bệnh viện Đại học Y Dược',
  //   },
  //   {
  //     id: 3,
  //     name: 'BS. Lê Văn Cường',
  //     specialty: 'Nhi khoa',
  //     avatar: '/src/assets/doctor.jpg',
  //     rating: 4.9,
  //     reviewCount: 156,
  //     price: 450000,
  //     experience: '18 năm kinh nghiệm',
  //     location: 'Bệnh viện Nhi Đồng 1',
  //   },
  //   {
  //     id: 4,
  //     name: 'BS. Phạm Thị Dung',
  //     specialty: 'Sản phụ khoa',
  //     avatar: '/src/assets/doctor.jpg',
  //     rating: 4.7,
  //     reviewCount: 98,
  //     price: 600000,
  //     experience: '20 năm kinh nghiệm',
  //     location: 'Bệnh viện Từ Dũ',
  //   },
  //   {
  //     id: 5,
  //     name: 'BS. Hoàng Minh Đức',
  //     specialty: 'Thần kinh',
  //     avatar: '/src/assets/doctor.jpg',
  //     rating: 4.6,
  //     reviewCount: 76,
  //     price: 550000,
  //     experience: '14 năm kinh nghiệm',
  //     location: 'Bệnh viện 115',
  //   },
  //   {
  //     id: 6,
  //     name: 'BS. Ngô Thị Hoa',
  //     specialty: 'Tim mạch',
  //     avatar: '/src/assets/doctor.jpg',
  //     rating: 4.8,
  //     reviewCount: 142,
  //     price: 520000,
  //     experience: '16 năm kinh nghiệm',
  //     location: 'Bệnh viện Thống Nhất',
  //   },
  // ];

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = Cookies.get('accessToken');
      if (!token) {
        setDoctors([]);
        setFilteredDoctors([]);
        return;
      }
      try {
        const response = await axios.get(
          `${API_BASE}/consult-appointment/get-consultants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: 1,
              limit: 9,
            },
          }
        );
        const fetchedDoctors = (response.data?.result?.consultants || []).map(
          (doctor) => ({
            ...doctor,
            consultant_id: doctor.account_id,
            price: calculatePrice(doctor.rating),
          })
        );
        // console.log('Dữ liệu bác sĩ:', response.data?.result);
        // console.log(
        //   'Consultant IDs:',
        //   fetchedDoctors.map((d) => d.consultant_id)
        // );
        setDoctors(fetchedDoctors);
        setFilteredDoctors(fetchedDoctors);
      } catch (error) {
        console.error('Lỗi khi gọi API bác sĩ:', error);
        setDoctors([]);
        setFilteredDoctors([]);
      }
    };
    fetchDoctors();
  }, []);

  const calculatePrice = (rating) => {
    const basePrice = 10 * 1000;
    if(rating < 3) {
      return basePrice;
    } else if(rating < 4) {
      
    } else if(rating <= 5) {
      return basePrice + 100 * 1000;
    }
    return basePrice;
  }

  useEffect(() => {
    let filtered = doctors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(
        (doctor) => doctor.specialty === selectedSpecialty
      );
    }

    // Filter by rating
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter((doctor) => doctor.rating >= minRating);
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, selectedRating, doctors]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ★
        </span>
      );
    }

    return stars;
  };

  const specialties = [
    'all',
    'Tim mạch',
    'Da liễu',
    'Nhi khoa',
    'Sản phụ khoa',
    'Thần kinh',
  ];

  return (
    <div className="doctor-list">
      <div className="doctor-list-header">
        <h1>Đặt lịch tư vấn trực tuyến</h1>
        <p>Chọn bác sĩ phù hợp để được tư vấn sức khỏe chuyên nghiệp</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên bác sĩ hoặc chuyên khoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Chuyên khoa:</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả chuyên khoa</option>
              {specialties.slice(1).map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Đánh giá tối thiểu:</label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả đánh giá</option>
              <option value="4.5">4.5★ trở lên</option>
              <option value="4.0">4.0★ trở lên</option>
              <option value="3.5">3.5★ trở lên</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="doctors-grid">
        {filteredDoctors.length > 0 ? (
          filteredDoctors
            .filter((doctor) => doctor.full_name && doctor.rating !== undefined)
            .map((doctor) => (
              <div key={doctor.id || doctor.account_id} className="doctor-card">
                <div className="doctor-avatar">
                  <img
                    src={doctor.avatar || '/src/assets/doctor.jpg'}
                    alt={doctor.full_name}
                  />
                  <div className="online-status"></div>
                </div>

                <div className="doctor-info">
                  <h3 className="doctor-name">{doctor.full_name}</h3>
                  <div className="doctor-rating">
                    <div className="stars">
                      {renderStars(doctor.rating ?? 0)}
                    </div>
                    <span className="rating-text">
                      {doctor.rating ?? 'N/A'}/5
                    </span>
                  </div>
                  <div className="doctor-specialty">
                    <span className="specialty-label">Chuyên khoa:</span>
                    <span className="specialty-value">
                      {doctor.specialty ?? 'Chưa có chuyên khoa'}
                    </span>
                  </div>
                  <div className="doctor-price">
                    <span className="price-label">Phí tư vấn:</span>
                    <span className="price-value">
                      {formatPrice(doctor.price)}
                    </span>
                  </div>
                  <div className="doctor-description">
                    <span>{doctor.description ?? 'Chưa có mô tả'}</span>
                  </div>
                  <button
                    className="book-button"
                    onClick={() => {
                      console.log(doctor);
                      onDoctorSelect(doctor);
                    }}
                  >
                    📅 Xem lịch & Đặt lịch
                  </button>
                </div>
              </div>
            ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">😔</div>
            <h3>Không tìm thấy bác sĩ phù hợp</h3>
            <p>Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="results-count">
        Hiển thị {filteredDoctors.length} trong tổng số {doctors.length} bác sĩ
      </div>
    </div>
  );
};

export default DoctorList;
