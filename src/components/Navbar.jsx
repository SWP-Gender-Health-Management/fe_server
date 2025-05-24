import React from "react";
import { Menu, Button } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  ReadOutlined,
  TeamOutlined,
  PhoneOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const items = [
  { label: "Trang Chủ", key: "home", icon: <HomeOutlined /> },
  { label: "Dịch vụ", key: "services", icon: <AppstoreOutlined /> },
  { label: "Tin tức", key: "news", icon: <ReadOutlined /> },
  { label: "Về chúng tôi", key: "about", icon: <TeamOutlined /> },
  {
    label: (
      <span style={{ background: "#f0f0f0", padding: "4px 8px", borderRadius: 4 }}>
        Liên hệ
      </span>
    ),
    key: "contact", 
    icon: <PhoneOutlined />,
  },
];

const Navbar = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e8e8e8",
        height: 64,
        justifyContent: "space-between",
      }}
    >
      {/* Logo + Menu */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ fontWeight: "bold", fontSize: 24, color: "#1677ff" }}>🌐</div>
        <Menu mode="horizontal" items={items} defaultSelectedKeys={["home"]} />
      </div>

      {/* Search + Login */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <SearchOutlined style={{ fontSize: 18 }} />
        <Button
          style={{
            backgroundColor: "#facc15",
            color: "#000",
            fontWeight: 600,
            border: "none",
            borderRadius: "999px",
          }}
        >
          Login/Signup
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
