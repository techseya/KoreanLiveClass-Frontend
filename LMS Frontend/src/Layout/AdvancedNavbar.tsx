import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import "../Common/styles/style.css";
import "../Common/styles/navbar.css";
import { LogoutOutlined, Mail, MenuOutlined, NotificationsNone, OndemandVideo, PostAdd, WysiwygOutlined } from "@mui/icons-material";
import logo from "../Assets/Images/logo.jpeg";
import man from "../Assets/Images/man.png";
import Dialogbox from "../Common/Components/DialogBox";
import {
  DashboardOutlined,
  UserAddOutlined,
  BlockOutlined,
  BookOutlined,
  PieChartOutlined,
  PlayCircleFilled,
  PlayCircleOutlined
} from "@ant-design/icons";
import chatImg from "../Assets/Images/conversation.png"
import { getUnread } from "src/Services/SignalR/chat_api"
import newMsgIcon from "../Assets/Images/new-message.png"
import { debounce } from "lodash";

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 0),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "rgb(255, 255, 255)",
  color: "#ffffff", // White text/icons
  borderBottom: "0.5px solid grey",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  boxShadow: "0px 1px 2px rgba(230, 224, 224, 0.24)",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    backgroundColor: "rgb(255, 255, 255)",
    color: "#ffffff",
    borderRight: "1px solid grey",
  },
  variants: [
    {
      props: ({ open }: { open: boolean }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }: { open: boolean }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

interface Props {
  children: React.ReactElement;
}

export default function AdvancedNavbar({ children }: Readonly<Props>) {

  const [open, setOpen] = React.useState(true);
  const [wasAutoClosed, setWasAutoClosed] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isUnread, setIsUnread] = React.useState(false)

  const isMobile = useMediaQuery("(max-width:800px)");
  const navigate = useNavigate();
  const location = useLocation();

  const isVerySmallScreen = useMediaQuery("(max-width:376px)");

  const token = localStorage.getItem("token")

  const debouncedGetUnread = React.useMemo(
    () => debounce(() => handleGetUnread(), 2000), // 2 seconds debounce
    []
  );

  React.useEffect(() => {
    const handleUserActivity = () => {
      debouncedGetUnread();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      debouncedGetUnread.cancel(); // Cleanup debounce
    };
  }, [debouncedGetUnread]);

  // Auto-close logic
  React.useEffect(() => {
    if (token === null) {
      navigate("/")
    }
    if (isMobile) {
      setOpen(false);
      setWasAutoClosed(true);
    } else {
      if (wasAutoClosed) {
        setOpen(true);
        setWasAutoClosed(false);
      }
    }
    handleGetUnread()
    let timeoutId: NodeJS.Timeout;
    if (open) {
      timeoutId = setTimeout(() => {
        const userElement = document.querySelector(".drawer-user");
        if (userElement) {
          (userElement as HTMLElement).style.opacity = "1";
        }
      }, 50);
    } else {
      const userElement = document.querySelector(".drawer-user");
      if (userElement) {
        (userElement as HTMLElement).style.opacity = "0";
      }
    }

    return () => clearTimeout(timeoutId);
  }, [isMobile, location.pathname]);

  const handleGetUnread = async () => {
    try {
      const res = await getUnread(1)
      setIsUnread(res.data)
    } catch (error) {
      console.error(error);
    }
  }

  // Manual drawer toggle
  const handleDrawerOpen = () => {
    setOpen((prev) => !prev);
    console.log(open);

  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("token");
  };

  React.useEffect(() => {
    const path = location.pathname;
    if (path === "/dashboard") {
      setActive(1);
    } else if (path === "/category-maintenance") {
      setActive(2);
    } else if (path === "/course-maintenance") {
      setActive(3);
    } else if (path === "/section-maintenance") {
      setActive(4);
    } else if (path === "/recording-maintenance") {
      setActive(5);
    } else if (path === "/quiz-maintenance") {
      setActive(6);
    } else if (path === "/user-maintenance") {
      setActive(7);
    } else if (path === "/notice") {
      setActive(8);
    } else if (path === "/k-lesson") {
      setActive(9);
    } else if (path === "/video-maintenance") {
      setActive(10);
    } else {
      setActive(0);
    }
  }, [location.pathname]);

  const handleClickDashboard = () => navigate("/dashboard");
  const handleClickUserMaintenance = () => navigate("/user-maintenance");
  const handleClickCategory = () => navigate("/category-maintenance")
  const handleClickCourse = () => navigate("/course-maintenance")
  const handleClickSection = () => navigate("/section-maintenance")
  const handleClickRecording = () => navigate("/recording-maintenance")
  const handleClickQuiz = () => navigate("/quiz-maintenance")
  const handleClickNotice = () => navigate("/notice")
  const handleClickWord = () => navigate("/k-lesson")
  const handleClickVideos = () => navigate("/video-maintenance")

  const drawerItems = [
    {
      name: "Dashboard",
      icon: <DashboardOutlined style={{ fontSize: "20px" }} />,
      onClick: handleClickDashboard,
    },
    {
      name: "Category",
      icon: <BlockOutlined style={{ fontSize: "20px" }} />,
      onClick: handleClickCategory,
    },
    {
      name: "Course",
      icon: <BookOutlined style={{ fontSize: "20px" }} />,
      onClick: handleClickCourse,
    },
    {
      name: "Section",
      icon: <PieChartOutlined style={{ fontSize: "20px" }} />,
      onClick: handleClickSection,
    },
    {
      name: "Recording",
      icon: <PlayCircleOutlined style={{ fontSize: "20px" }} />,
      onClick: handleClickRecording,
    },
    {
      name: "Quiz",
      icon: <PostAdd style={{ fontSize: "20px" }} />,
      onClick: handleClickQuiz,
    },
    {
      name: "Users",
      icon: <UserAddOutlined style={{ fontSize: "20px" }} />,
      onClick: handleClickUserMaintenance,
    },
    {
      name: "Notice",
      icon: <NotificationsNone style={{ fontSize: "20px" }} />,
      onClick: handleClickNotice,
    },
    {
      name: "Korean Lessons",
      icon: <WysiwygOutlined style={{ fontSize: "20px" }} />,
      onClick: handleClickWord,
    },
    {
      name: "Korean Videos",
      icon: <OndemandVideo style={{ fontSize: "20px" }} />,
      onClick: handleClickVideos,
    },
  ];

  const handleNavChats = () => navigate("/messages")

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh" }}
    >
      <div className="chat-outer" onClick={handleNavChats}>
        <div className="chat-i1">{isUnread && <img className="mail-icon" src={newMsgIcon} alt="" />}</div>
        <img className="chat-img" src={chatImg} alt="" />

      </div>
      <Dialogbox
        open={isOpen}
        title="Logout Confirmation"
        content="Are you sure you want to logout? Logging out will end your current session and any unsaved changes may be lost."
        agreeButtonText="Yes, Logout"
        disagreeButtonText="No"
        onAgree={handleLogout}
        onDisagree={handleClose}
        onClose={handleClose}
      />
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar className="toolbar">
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 2,
                color: "black !important"
              },
            ]}
          >
            <MenuOutlined />

          </IconButton>

          <div className="toolbar-inner">
            <nav className="navbar" style={{ height: "60px !important", padding: "0 25px" }}>
            </nav>
            <img
              className="man-icon"
              src={man}
              alt=""
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <div className="drawer-header">
          <img className="drawer-logo" src={logo} alt="" />
          <span className="drawer-logo-txt">KLC ADMIN</span>
        </div>
        <List>
          <List>
            {drawerItems.map((item, index) => (
              <ListItem disablePadding sx={{ display: "block" }} key={index}>
                <ListItemButton
                  onClick={item.onClick}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    backgroundColor: index === active - 1 ? "rgb(255, 255, 255)" : "transparent",
                    color: index === active - 1 ? "#3b82f6" : "black", // White for active, Grey for inactive
                    borderLeft: index === active - 1 ? "5px solid #3b82f6" : "none",
                    "&:hover": {
                      backgroundColor: "rgba(98, 232, 242, 0.15)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      color: index === active - 1 ? "#3b82f6" : "black", // White for active, Grey for inactive
                      mr: open ? 2 : "auto",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{ fontSize: "14px" }}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

        </List>

        <Divider />
        <Divider />

        <div
          className="drawer-user"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            opacity: 0,
            transition: "opacity 0.3s ease-in-out",
            borderTop: open ? "1px solid grey" : "none",
          }}
        >
          <span className="drawer-user-icon" onClick={handleOpen}><LogoutOutlined /></span>
          {open && (<span className="drawer-username">Logout</span>)}
        </div>
      </Drawer>
      {!(isVerySmallScreen && open) && (
        <Box
          component="main"
          bgcolor={"rgba(207, 205, 205, 0.38)"}
          sx={{
            flexGrow: 1,
            p: 0,
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
          }}
        >
          <DrawerHeader />
          {children}
        </Box>
      )}

    </Box>
  );
}
