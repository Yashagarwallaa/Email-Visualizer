import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import BarChartComp from "./BarChart";
import LineChartComp from "./LineChart";
import axios from "axios";
import Cookies from "js-cookie";
import './dashboard.css';

function Dashboard() {
  const [email, setEmail] = useState("");
  const [ageRange, setAgeRange] = useState("15-25"); 
  const [gender, setGender] = useState("Male"); 
  const [dateRange, setDateRange] = useState(["2022/10/04", "2022/10/11"]); 
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState(null);
  const [urlInput, setUrlInput] = useState(""); 
  const [isLineChartVisible, setIsLineChartVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To access the URL parameters

  useEffect(() => {
    function checkToken() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setEmail(decodedToken.email);
        } catch (error) {
          console.error("Failed to decode token:", error);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    }
    checkToken();
  }, []);

  // Load filters from cookie
  useEffect(() => {
    const savedFilters = Cookies.get("filters");
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      setAgeRange(filters.ageRange || "15-25");
      setGender(filters.gender || "Male");
      setDateRange(filters.dateRange || ["2022/10/04", "2022/10/11"]);
    }
  }, []);

  // Function to fetch data based on the selected filters (from URL)
  const fetchData = async () => {
    const urlParams = new URLSearchParams(location.search);
    const startDate = urlParams.get("startDate");
    const endDate = urlParams.get("endDate");
    const age = urlParams.get("ageRange");
    const genderFilter = urlParams.get("gender");

    const response = await axios.post("https://emailvisualizerbackend.onrender.com/api/bar-chart-data", {
      startDate,
      endDate,
      filters: [age, genderFilter], // Use filters from URL
    });

    const data = Object.entries(response.data).map(([key, value]) => ({
      feature: key,
      total: Math.round(value / 60),
    }));
    setBarChartData(data);
  };

  useEffect(() => {
    fetchData();
  }, [location.search]); 

  const handleBarClick = async (feature) => {
    const urlParams = new URLSearchParams(location.search);
    const startDate = urlParams.get("startDate");
    const endDate = urlParams.get("endDate");

    const response = await axios.post("https://emailvisualizerbackend.onrender.com/api/line-chart-data", {
      feature,
      startDate,
      endDate,
    });
    const data = response.data.map((entry) => ({
      day: entry.day, 
      timeSpent: entry.timeSpent, 
    }));
    setLineChartData(data); 
    setIsLineChartVisible(true);
  };

  const handleAgeChange = (event) => {
    setAgeRange(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value); 
  };

  const handleDateChange = (type, value) => {
    const updatedDateRange = [...dateRange];
    updatedDateRange[type === "start" ? 0 : 1] = value;
    setDateRange(updatedDateRange); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Saving filters to cookie
    const filters = { ageRange, gender, dateRange };
    Cookies.set("filters", JSON.stringify(filters), { expires: 7 }); 

 
    const filtersParams = new URLSearchParams({
      ageRange,
      gender,
      startDate: dateRange[0],
      endDate: dateRange[1],
    }).toString();

    navigate(`/dashboard?${filtersParams}`);
  };

  const handleClearFilters = () => {
    setAgeRange("15-25");
    setGender("Male");
    setDateRange(["2022/10/04", "2022/10/11"]);
    Cookies.remove("filters"); 
    navigate("/dashboard");
  };

  const generateShareableUrl = () => {
    const filters = new URLSearchParams({
      ageRange,
      gender,
      startDate: dateRange[0],
      endDate: dateRange[1],
    }).toString();
    return `http://localhost:5173/dashboard?${filters}`;
  };

  const handleCopyUrl = () => {
    const url = generateShareableUrl();
    navigator.clipboard.writeText(url).then(() => {
      alert("URL copied to clipboard!");
    });
  };

  const handleUrlChange = (e) => {
    setUrlInput(e.target.value); 
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (urlInput) {
     
      const cleanUrl = urlInput.replace("http://localhost:5173/dashboard", "");
  
      navigate(`/dashboard${cleanUrl}`);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Analytics Dashboard</h1>
      <div className="flex-container">
        {/* Filters Section */}
        <div className="filters-section-container">
          <form onSubmit={handleSubmit}>
            <div className="filters-section">
              {/* Age Filter */}
              <div className="filter-group">
                <h3>Age Range</h3>
                <select value={ageRange} onChange={handleAgeChange} className="select">
                  <option value="15-25">15 - 25</option>
                  <option value=">25">Greater than 25</option>
                </select>
              </div>

              {/* Gender Filter */}
              <div className="filter-group">
                <h3>Gender</h3>
                <select value={gender} onChange={handleGenderChange} className="select">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="filter-group">
                <h3>Date Range</h3>
                <input
                  type="date"
                  value={dateRange[0]}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  className="date-input"
                />
                <input
                  type="date"
                  value={dateRange[1]}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  className="date-input"
                />
              </div>
            </div>

            {/* Apply Filter Button */}
            <button type="submit" className="apply-filter-button">
              Apply Filter
            </button>
          </form>

          {/* Clear Filter Button */}
          <button onClick={handleClearFilters} className="clear-filter-button">
            Clear Filters
          </button>

          {/* Share Filters URL Button */}
          <button onClick={handleCopyUrl} className="share-filter-url-button">
            Share Filters URL
          </button>

          {/* Paste URL Input */}
          <div className="url-input-section">
            <input
              type="text"
              value={urlInput}
              onChange={handleUrlChange}
              placeholder="Paste URL here"
              className="url-input"
            />
            <button onClick={handleUrlSubmit} className="navigate-button">
              Navigate
            </button>
          </div>
        </div>

        {/* Bar Chart and Line Chart */}
        <div className="charts-container">
          <div className="bar-chart-container">
          <BarChartComp data={barChartData} onBarClick={handleBarClick} isLineChartVisible={isLineChartVisible} />

          </div>
          {isLineChartVisible && (
            <div className="line-chart-container">
              <LineChartComp data={lineChartData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
