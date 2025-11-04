import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "../Componets/Navbar";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  HomeIcon,
  ImageIcon,
} from "lucide-react";
import Tooltip from "@mui/material/Tooltip";

import DashboardIcon from "@mui/icons-material/Dashboard";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import CollectionsIcon from "@mui/icons-material/Collections";
import CategoryIcon from "@mui/icons-material/Category";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

const Layout = () => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "dashboard", icon: DashboardIcon },

    {
      name: "Home",
      icon: HomeIcon, // 🏠 main home icon
      children: [
        { name: "Video", path: "video" },
        { name: "Image", path: "image" },
      ],
    },

    {
      name: "Product",
      icon: Inventory2Icon,
      children: [
        { name: "Add Product", path: "addproduct" },
        { name: "List Product", path: "listproduct" },
      ],
    },

    {
      name: "Contact Us",
      icon: ContactSupportIcon,
      children: [{ name: "Enquiry", path: "enquiry" }],
    },
  ];

  const toggleSubmenu = (name) => {
    // If collapsed, expand the sidebar first (keeps UX simple)
    if (collapsed) {
      setCollapsed(false);
      setOpenSubmenu(name);
      return;
    }
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const isActivePath = (p) =>
    location.pathname === `/${p}` || location.pathname.endsWith(`/${p}`);

  /* put these helpers above your component (same file) */
  const fontStack =
    '"Inter", "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif';

  const colors = {
    bg: "#ffffff",
    border: "#E5E7EB",
    text: "#344054",
    textMuted: "#667085",
    hoverBg: "#F5F7FF",
    activeText: "#1D4ED8",
    bullet: "#C7D2FE",
    divider: "#F2F4F7",
  };

  const baseItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 12px",
    borderRadius: 8,
    fontWeight: 500,
    transition: "background 160ms ease, color 160ms ease",
    textDecoration: "none",
    color: colors.textMuted,
  };

  const childItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 12px",
    borderRadius: 6,
    textDecoration: "none",
    fontWeight: 500,
    color: colors.textMuted,
    transition: "background 160ms ease, color 160ms ease",
  };

  return (
    <div
      className="flex flex-col min-h-screen w-full"
      style={{ fontFamily: fontStack }}
    >
      <Navbar />

      <div className="flex flex-1 w-full" style={{ background: "#fff" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: collapsed ? 80 : 280,
            background: colors.bg,
            color: colors.text,
            display: "flex",
            flexDirection: "column",
            padding: 16,
            boxShadow: "inset -1px 0 0 " + colors.border,
            transition: "width 200ms ease",
          }}
        >
          {/* Collapse / Expand toggle */}
          <div
            onClick={() => setCollapsed((v) => !v)}
            style={{
              position: "absolute",
              left: collapsed ? 70 : 270, // aligns with sidebar width
              top: "50%",
              transform: "translateY(-50%)",
              width: 24,
              height: 80,
              borderRadius: "0 8px 8px 0",
              background: "#F8FAFC",
              border: "1px solid " + colors.border,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              zIndex: 20,
              transition: "left 200ms ease",
            }}
          >
            {collapsed ? (
              <ChevronsRight
                style={{ width: 18, height: 18, color: colors.textMuted }}
              />
            ) : (
              <ChevronsLeft
                style={{ width: 18, height: 18, color: colors.textMuted }}
              />
            )}
          </div>
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 6,
              fontSize: 14,
            }}
          >
            {menuItems.map((item) => {
              const active = isActivePath(item.path);
              const ParentIcon = item.icon;

              // top-level item (no children)
              if (!item.children) {
                const linkEl = (
                  <Link
                    to={item.path}
                    style={{
                      ...baseItemStyle,
                      background: active ? colors.hoverBg : "transparent",
                      color: active ? colors.activeText : colors.textMuted,
                    }}
                  >
                    {ParentIcon && (
                      <span style={{ fontSize: 18, lineHeight: 0 }}>
                        <ParentIcon />
                      </span>
                    )}
                    {!collapsed && (
                      <span style={{ fontSize: 15.5 }}>{item.name}</span>
                    )}
                  </Link>
                );

                return (
                  <div key={item.name} style={{}}>
                    {collapsed ? (
                      <Tooltip title={item.name} placement="right">
                        <div>{linkEl}</div>
                      </Tooltip>
                    ) : (
                      linkEl
                    )}
                  </div>
                );
              }

              // parent with submenu
              const btnEl = (
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  style={{
                    ...baseItemStyle,
                    justifyContent: "space-between",
                    width: "100%",
                    background:
                      openSubmenu === item.name
                        ? colors.hoverBg
                        : "transparent",
                    color:
                      openSubmenu === item.name
                        ? colors.activeText
                        : colors.textMuted,
                    border: "1px solid transparent",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    {ParentIcon && (
                      <span style={{ fontSize: 18, lineHeight: 0 }}>
                        <ParentIcon />
                      </span>
                    )}
                    {!collapsed && (
                      <span style={{ fontSize: 15.5 }}>{item.name}</span>
                    )}
                  </div>
                  {!collapsed &&
                    (openSubmenu === item.name ? (
                      <ChevronUp style={{ width: 16, height: 16 }} />
                    ) : (
                      <ChevronDown style={{ width: 16, height: 16 }} />
                    ))}
                </button>
              );

              return (
                <div key={item.name}>
                  {collapsed ? (
                    <Tooltip title={item.name} placement="right">
                      <div>{btnEl}</div>
                    </Tooltip>
                  ) : (
                    btnEl
                  )}

                  {/* Submenu */}
                  {!collapsed && openSubmenu === item.name && (
                    <div
                      style={{
                        marginLeft: 20,
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 6,
                        borderLeft: "1px solid " + colors.divider,
                        paddingLeft: 12,
                      }}
                    >
                      {item.children.map((child) => {
                        const isChildActive = isActivePath(child.path);
                        return (
                          <Link
                            key={child.name}
                            to={child.path}
                            style={{
                              ...childItemStyle,
                              background: isChildActive
                                ? colors.hoverBg
                                : "transparent",
                              color: isChildActive
                                ? colors.activeText
                                : colors.textMuted,
                            }}
                          >
                            {/* bullet */}
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: 999,
                                background: isChildActive
                                  ? colors.activeText
                                  : colors.bullet,
                              }}
                            />
                            <span style={{ fontSize: 15 }}>{child.name}</span>

                            {isChildActive && (
                              <span
                                style={{
                                  marginLeft: "auto",
                                  width: 3,
                                  height: 20,
                                  borderRadius: 999,
                                  background: colors.activeText,
                                }}
                              />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className="flex-1"
          style={{
            padding: 24,
            width: "100%",
            height: "100%",
            color: "#111827",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
