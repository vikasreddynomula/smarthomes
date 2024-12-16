import React, { useState, useEffect ,useRef  } from "react";
import "./Header.css";
import { BsCart2 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "bootstrap/dist/js/bootstrap";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Popper from "@mui/material/Popper";
import InputAdornment from '@mui/material/InputAdornment';

function Header() {
  const navigate = useNavigate();
  const settings = ["Sign Out"];
  const [anchorElUser, setAnchorElUser] = useState("");
  const [anchorElHamburger, setAnchorElHamburger] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const searchInputRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenHamburgerMenu = (event) => {
    setAnchorElHamburger(event.currentTarget);
  };
  const handleCloseHamburgerMenu = () => {
    setAnchorElHamburger(null);
  };

  const handleHamburgerMenuClick = (option) => {
    switch (option) {
      case "Trending":
        navigate("/mostliked");
        break;
      case "Customer Service":
        navigate("/customerService");
        break;
      case "Inventory Report":
        navigate("/inventoryReport");
        break;
      case "Sales Report":
        navigate("/salesReport");
        break;
      case "Search Reviews":
        navigate('/searchReviews');
        break;
      case "Product Recommendation":
        navigate('/productRecommend');
        break;
      default:
        break;
    }
    handleCloseHamburgerMenu();
  };

  useEffect(() => {
    fetch(`http://localhost:8080/ServletAPI/api/cart/get?user=${userId}`)
      .then((response) => response.json())
      .then((data) => setCartItems(data))
      .catch((error) => console.error('Error fetching cart items:', error));
  }, [userId]);

  useEffect(() => {
    if (searchResults.length > 0 && searchInputRef.current) {
        searchInputRef.current.focus(); // Refocus the input field
    }
}, [searchResults]);


  const handleProfile = (event) => {
    if (event.target.id === "Sign Out") {
      navigate("/");
    }
    handleCloseUserMenu();
  };

  const handleProductClick = (product) => {
    navigate(`/viewDetails?productId=${product.id}`);  
    setAnchorEl(null); 
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
        try {
            const response = await axios.get(`http://localhost:8080/ServletAPI/api/searchProducts?query=${query}`);
            console.log(response.data); 
            console.log('anchorEl:', searchInputRef);// Check what is being returned
            setSearchResults(response.data);
            setAnchorEl(searchInputRef.current); // Set the anchor element to the input field
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    } else {
        setSearchResults([]);
        setAnchorEl(null); // Close the dropdown menu
    }
};


  return (
    <div className="header" style={{ position: "static" }}>
      <IconButton onClick={handleOpenHamburgerMenu} sx={{ color: "white", fontSize: "30px", marginRight: "20px" }}>
        <MenuIcon />
      </IconButton>
      <Menu
        id="hamburger-menu"
        anchorEl={anchorElHamburger}
        open={Boolean(anchorElHamburger)}
        onClose={handleCloseHamburgerMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        style={{ top: '40px', left: '-10px' }}
      >
        {["Trending"].map((option) => (
          <MenuItem key={option} onClick={() => handleHamburgerMenuClick(option)}>
            {option}
          </MenuItem>
        ))}
        {["Customer Service"].map((option) => (
          <MenuItem key={option} onClick={() => handleHamburgerMenuClick(option)}>
            {option}
          </MenuItem>
        ))}
        {email === "billavikas.reddy@gmail.com" && ["Inventory Report"].map((option) => (
          <MenuItem key={option} onClick={() => handleHamburgerMenuClick(option)}>
            {option}
          </MenuItem>
        ))}
        {email === "billavikas.reddy@gmail.com" && ["Sales Report"].map((option) => (
          <MenuItem key={option} onClick={() => handleHamburgerMenuClick(option)}>
            {option}
          </MenuItem>
        ))}
        {["Search Reviews"].map((option) => (
          <MenuItem key={option} onClick={() => handleHamburgerMenuClick(option)}>
            {option}
          </MenuItem>
        ))}
        {["Product Recommendation"].map((option) => (
          <MenuItem key={option} onClick={() => handleHamburgerMenuClick(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>

      <a
        href={"http://localhost:3000/Home"}
        style={{ color: "#cba167", marginLeft: "40px", fontSize: "28px", textDecoration: "none",marginRight:"100px" }}
        onClick={(e) => {
          const email = localStorage.getItem("email");
          if (email === "vnomula@hawk.iit.edu") {
            e.preventDefault();
          }
        }}
      >
        <strong>SmartHomes</strong>
      </a>

      <div>
        {/* Search Input */}
        <TextField
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products..."
          inputRef={searchInputRef} // Attach the ref here
          style={{ width: '300px',  backgroundColor: "white",height:"50px" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Search Results Dropdown using Popper */}
        <Popper
          open={Boolean(anchorEl) && searchResults.length > 0}
          anchorEl={anchorEl}
          placement="bottom-start"
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 10], // Adjust the second value to set the gap (10px in this case)
              },
            },
          ]}
          style={{ zIndex: 1200, }}
        >
          <div style={{ backgroundColor: "white", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", maxHeight: 200, overflowY: 'auto' }}>
            {searchResults.map((product) => (
              <MenuItem key={product.id} onClick={() => handleProductClick(product)}>
                {product.name}
              </MenuItem>
            ))}
          </div>
        </Popper>
      </div>

      <div className="header__nav" style={{ marginLeft: "390px", marginRight: "120px" }}>
        {email !== "billavikas.reddy@gmail.com" ? (
          <div className="header__option" style={{ marginRight: email === "vnomula@hawk.iit.edu" ? "80px" : "100px" }}>
            <a
              href={email === "vnomula@hawk.iit.edu" ? "http://localhost:3000/SignUp" : "http://localhost:3000/MyOrders"}
              style={{ textDecoration: "none", color: "white" }}
              className="header__optionLineOne"
            >
              <b>{email === "vnomula@hawk.iit.edu" ? "Add Customer" : "My Orders"}</b>
            </a>
          </div>
        ) : (
          <div className="header__option" style={{ marginRight: "180px" }}></div>
        )}

        {email !== "billavikas.reddy@gmail.com" && email !== "vnomula@hawk.iit.edu" ? (
          <div className="header__optionBasket">
            <a href="/Mycart">
              <BsCart2 style={{ textDecoration: "none", color: "white", fontSize: "20px" }} />
            </a>
            {<span className="header_optionLineTwo header_basketCount">{cartItems != null ? cartItems.length : 0}</span>}
          </div>
        ) : (
          <div style={{ marginRight: "20px" }}></div>
        )}
      </div>

      <div className="header_profile" style={{right:"0",position:"fixed"}}>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip disableHoverListener>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <AccountCircleIcon style={{ textDecoration: "none", color: "white", fontSize: "30px", padding: "0px" }} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} id={setting} onClick={handleProfile}>
                <Typography textAlign="center" id={setting} onClick={handleProfile}>
                  {setting}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </div>


      
    </div>
  );
}

export default Header;
