import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import SettingsIcon from "@mui/icons-material/Settings";
import CarRentalIcon from "@mui/icons-material/CarRental";
import MenuIcon from "@mui/icons-material/Menu";
import ComputerIcon from "@mui/icons-material/Computer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupsIcon from "@mui/icons-material/Groups";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import CreateVehicle from "../pages/CreateVehicle";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import LockResetIcon from "@mui/icons-material/LockReset";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from "@mui/icons-material/Home";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import PowerIcon from "@mui/icons-material/Power";
import FiberDvrIcon from "@mui/icons-material/FiberDvr";
import LanIcon from "@mui/icons-material/Lan";
import StorageIcon from "@mui/icons-material/Storage";
import PrintIcon from "@mui/icons-material/Print";
import PhonelinkRingIcon from "@mui/icons-material/PhonelinkRing";
import ScaleIcon from "@mui/icons-material/Scale";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TimelineIcon from "@mui/icons-material/Timeline";
import FilledInput from "@mui/material/FilledInput";
import BarChartIcon from "@mui/icons-material/BarChart";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import LightModeIcon from "@mui/icons-material/LightMode";
import { blue } from "@mui/material/colors";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 10px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
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
})(({ theme, open }) => ({
  width: drawerWidth,

  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const HeaderMenu = ({ setDarkTheme, darkTheme }) => {
  //HEADER
  const [tab, setTab] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState([]);
  const [userId, setUserId] = useState("");
  const [editUser, setEditUser] = useState({});
  const token = localStorage.getItem("token");
  const [showProfile, setShowProfile] = useState(false);
  const [alert, setAlert] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  //For Profile
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAnchor = Boolean(anchorEl);
  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorEl(null);
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const [caps, setCaps] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  useEffect(() => {
    const verifyUser = async () => {
      if (
        !token &&
        window.location.pathname !== "/scan" &&
        window.location.pathname.includes("/pick-up") &&
        window.location.pathname.includes("/drop-off")
      ) {
        navigate("/login");
      }
      const { data } = await axios.post("http://192.168.0.147:5555/auth", {
        token,
      });
      const { status, user, role, id } = data;
      setUsername(user);
      setUserRole(role);
      setUserId(id);
      setEditUser({
        _id: id,
        username: user,
        role: role,
        password: "",
      });
      return status ||
        window.location.pathname === "/scan" ||
        window.location.pathname.includes("/pick-up") ||
        window.location.pathname.includes("/drop-off")
        ? toast(`${user}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        : (localStorage.removeItem("token"), navigate("/login"));
    };
    verifyUser();
  }, [token, navigate]);
  const Logout = () => {
    handleCloseProfile();
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleClick = (e) => {
    setTab(e.target.id);
  };

  const location = useLocation().pathname;
  useEffect(() => {
    if (location === "/vehicles") {
      setTab("vehicles");
    } else if (location === "/vehicles/create") {
      setTab("create");
    } else if (location === "/users") {
      setTab("users");
    }
  }, [location]);

  const handleChangePass = () => {
    handleCloseProfile();
    setShowProfile(true);
  };
  const handleClose = () => {
    setShowProfile(false);
  };
  const handleChange = (e) => {
    editUser
      ? setEditUser({ ...editUser, password: e.target.value })
      : setEditUser("asd");
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://192.168.0.147:5555/auth/updatepswrd",
        {
          ...editUser,
        }
      );
      const { status, message } = data;

      setShowProfile(false);
      setEditUser({ ...editUser, password: "" });
      setAlert(true);
    } catch (error) {
      console.log(error);
    }
    setShowProfile(false);
    setEditUser({ ...editUser, password: "" });
  };
  const handleDialog = (action) => {
    setDialogAction(action);
  };
  //DRAWER
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [expandVeh, setExpandVeh] = useState(false);
  const [expandIT, setExpandIT] = useState(false);
  const [expandHR, setExpandHR] = useState(false);
  const [expandCool, setExpandCool] = useState(false);
  const [expandSettings, setExpandSettings] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleExpandVeh = () => {
    setExpandVeh(!expandVeh);
  };
  const handleExpandIT = () => {
    setExpandIT(!expandIT);
  };
  const handleExpandHR = () => {
    setExpandHR(!expandHR);
  };
  const handleExpandCool = () => {
    setExpandCool(!expandCool);
  };
  const handleExpandSettings = () => {
    setExpandSettings(!expandSettings);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  return username && userId ? (
    <Box>
      <Collapse
        in={alert}
        sx={{ position: "absolute", top: "80px", left: "80px" }}
      >
        <Alert
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Паролата е сменена успешно!
        </Alert>
      </Collapse>
      <Dialog
        open={showProfile}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">СМЯНА НА ПАРОЛА</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div>
            <header>{username}</header>
            <span>ID: </span>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <span>{userId}</span>
              <span style={{ color: "red" }}> {caps ? "CAPSLOCK ON" : ""}</span>
            </Box>
          </div>

          <div className="my-2">
            <FormControl sx={{ minWidth: "400px" }} fullWidth variant="filled">
              <InputLabel htmlFor="filled-adornment-password">
                Нова Парола
              </InputLabel>

              <FilledInput
                value={editUser.password}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.getModifierState("CapsLock")) {
                    setCaps(true);
                  } else {
                    setCaps(false);
                  }
                }}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {/* <TextField
              fullWidth
              type="password"
              name="password"
              id="password"
              label="Нова Парола:"
              variant="filled"
              value={editUser.password}
              onChange={handleChange}
            /> */}
          </div>
          {/* <div className="my-2">
            <FormControl sx={{ m: 1 }} variant="filled" fullWidth>
              <InputLabel htmlFor="standard-adornment-password">
                Повтори Парола
              </InputLabel>
              <Input
                fullWidth
                value={editUser.password2}
                onChange={handleChange}
                id="password2"
                name="password2"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div> */}
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={handleClose}
            autoFocus
          >
            Отказ
          </Button>
          <Button variant="contained" onClick={handleUpdate} autoFocus>
            Обнови
          </Button>
        </DialogActions>
      </Dialog>{" "}
      <AppBar
        position="fixed"
        open={open}
        sx={
          {
            // display: "flex",
            // bgcolor: "gray",
            // height: "50px",
          }
        }
      >
        <Toolbar sx={{ margin: "-5px" }}>
          <Box display="flex" flexGrow={1} justifyContent={"space-between"}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  marginRight: 5,

                  ...(open && { display: "none" }),
                },
                username === "USER" && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {/* Mini variant drawer */}
            </Typography>
            {/* <Box>
              <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">
                  asd
                </Link>
                <Link underline="hover" color="inherit" href="/">
                  asd
                </Link>
              </Breadcrumbs>
            </Box> */}
            <Box></Box>
          </Box>

          <Box>
            <IconButton
              variant="outlined"
              color="white"
              onClick={() => {
                console.log(darkTheme);
                setDarkTheme((darkTheme) => !darkTheme);
                localStorage.setItem("darkTheme", !darkTheme);
              }}
            >
              {darkTheme ? <NightlightRoundIcon /> : <LightModeIcon />}
            </IconButton>
            <Chip
              size="large"
              variant="contained"
              color="primary"
              style={{ cursor: "pointer" }}
              onClick={handleClickProfile}
              label={username}
              icon={<PersonIcon />}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openAnchor}
              onClose={handleCloseProfile}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {/* <MenuItem onClick={handleCloseProfile}>Profile</MenuItem> */}
              <MenuItem onClick={handleChangePass}>
                <LockResetIcon />
                Смяна парола
              </MenuItem>
              <MenuItem onClick={Logout}>
                <LogoutIcon />
                Изход
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={[username === "USER" && { display: "none" }]}
        // PaperProps={{

        // }
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* {["Начало", "Автопарк", "Човешки ресурси", "Потребители"].map(
            (text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )
          )} */}
          <ListItem key={1} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              component={Link}
              to={"/"}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {<HomeIcon />}
              </ListItemIcon>
              <ListItemText primary={"Начало"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem key={2} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              // component={Link}
              // to={"/it"}
              onClick={handleExpandVeh}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {<TimeToLeaveIcon />}
              </ListItemIcon>
              <ListItemText
                primary={"Автомобили"}
                sx={{ opacity: open ? 1 : 0 }}
              />
              {expandVeh ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={expandVeh} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    pl: 4,
                  }}
                  component={Link}
                  to={"/vehicles"}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {<TimeToLeaveIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Списък Автомобили"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
                {/* <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    pl: 4,
                  }}
                  component={Link}
                  to={"/charts"}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {<BarChartIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Справки"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton> */}
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    pl: 4,
                  }}
                  component={Link}
                  to={"/records"}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {<TimelineIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Движение"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    pl: 4,
                  }}
                  // disabled={
                  //   userRole === "admin" || userRole === "hr" ? false : true
                  // }
                  component={Link}
                  to={"/scan"}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {<CarRentalIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Взимане"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    pl: 4,
                  }}
                  // disabled={
                  //   userRole === "admin" || userRole === "hr" ? false : true
                  // }
                  component={Link}
                  to={"/drivers"}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {<PersonIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Водачи"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key={10} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              // component={Link}
              // to={"/it"}
              onClick={handleExpandIT}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {<ComputerIcon />}
              </ListItemIcon>
              <ListItemText
                primary={"ИТ Техника"}
                sx={{ opacity: open ? 1 : 0 }}
              />
              {expandIT ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={expandIT} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {/* <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ScaleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Везни" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <PhonelinkRingIcon />
                  </ListItemIcon>
                  <ListItemText primary="Хенди" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <PrintIcon />
                  </ListItemIcon>
                  <ListItemText primary="Принтери" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ComputerIcon />
                  </ListItemIcon>
                  <ListItemText primary="Компютри" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary="Сървъри" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <LanIcon />
                  </ListItemIcon>
                  <ListItemText primary="Мрежова техника" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <FiberDvrIcon />
                  </ListItemIcon>
                  <ListItemText primary="DVR" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <PowerIcon />
                  </ListItemIcon>
                  <ListItemText primary="UPS" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ReceiptLongIcon />
                  </ListItemIcon>
                  <ListItemText primary="Фискални у-ва" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <PriceCheckIcon />
                  </ListItemIcon>
                  <ListItemText primary="Каси" />
                </ListItemButton> */}
              </List>
            </Collapse>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key={10} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              // component={Link}
              // to={"/it"}
              onClick={handleExpandHR}
              disabled={
                userRole.includes("admin") || userRole.includes("hr")
                  ? false
                  : true
              }
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {<AssignmentIndIcon />}
              </ListItemIcon>
              <ListItemText
                primary={"Човешки ресурси"}
                sx={{ opacity: open ? 1 : 0 }}
              />
              {expandHR ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={expandHR} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    pl: 4,
                  }}
                  disabled={
                    userRole.includes("admin") || userRole.includes("hr")
                      ? false
                      : true
                  }
                  component={Link}
                  to={"/hr"}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {<GroupsIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Персонал"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    pl: 4,
                  }}
                  disabled={
                    userRole.includes("admin") || userRole.includes("hr")
                      ? false
                      : true
                  }
                  component={Link}
                  to={"/sites"}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {<StoreMallDirectoryIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Обекти"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>

          <Divider />
          {/* {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))} */}
        </List>

        <List>
          <ListItem key={10} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              // component={Link}
              // to={"/it"}
              onClick={handleExpandCool}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {<AcUnitIcon />}
              </ListItemIcon>
              <ListItemText
                primary={"Хладилна техника"}
                sx={{ opacity: open ? 1 : 0 }}
              />
              {expandCool ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={expandCool} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    pl: 4,
                  }}
                  disabled={
                    userRole.includes("admin") || userRole.includes("hr")
                      ? false
                      : true
                  }
                  component={Link}
                  to={"/hr"}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {<GroupsIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Персонал"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    pl: 4,
                  }}
                  disabled={
                    userRole.includes("admin") || userRole.includes("hr")
                      ? false
                      : true
                  }
                  component={Link}
                  to={"/sites"}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {<StoreMallDirectoryIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Обекти"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>

          <Divider />
        </List>
        <List
        // style={{ position: "absolute", bottom: "0" }}
        >
          <ListItem key={10} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              // component={Link}
              // to={"/it"}
              onClick={handleExpandSettings}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {<SettingsIcon />}
              </ListItemIcon>
              <ListItemText
                primary={"Настройки"}
                sx={{ opacity: open ? 1 : 0 }}
              />
              {expandSettings ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={expandSettings} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    pl: 4,
                  }}
                  component={Link}
                  to={"/users"}
                  disabled={userRole.includes("admin") ? false : true}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {<PersonIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Потребители"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    pl: 4,
                  }}
                  component={Link}
                  to={"/settings"}
                  // disabled={userRole === "admin" ? false : true}
                  disabled
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {<SettingsIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Настройки"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>

          <ListItem key={9} disablePadding sx={{ display: "block" }}>
            {" "}
            v.{process.env.REACT_APP_VERSION}
          </ListItem>
        </List>
      </Drawer>
    </Box>
  ) : (
    ""
  );
};

export default HeaderMenu;
