import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./App.css";
import logo from './data.png'; 

const App = () => {
  const [userInfo, setUserInfo] = useState({});
  
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleTimeString();


    // This function to get user IP  --->
  const getUserIP = async () => {
    // You can use an API to  get the user IP
    try {
      const res = await fetch("https://api64.ipify.org?format=json");
      const data = await res.json();
      console.log("data", data);
      return data.ip;
    } catch (error) {
      console.error("Error Ip:", error);
      return "Not defined error";
    }
  };
  useEffect(() => {
    getUserIP().then((ip) => {
      const userInfo = {
        ip,
        firstVisit: formattedDate,
      };

      // Convert data to json bcoz cookie value take json value
      const userInfoJSON = JSON.stringify(userInfo);

      Cookies.set("user", userInfoJSON);
      setUserInfo(userInfo);
    });
  }, []);

  const userInteractionTracking = () => {
    const userCookie = Cookies.get("user");
    const updatedDate = new Date();

    const userObject = JSON.parse(userCookie);
    userObject.lastInteraction = updatedDate.toLocaleTimeString();
    setUserInfo(userObject);
    // Convert the user object back to a JSON string and set as  new cookie
    Cookies.set("user", JSON.stringify(userObject));
  };

  // This Function to send user data to the server
  const sendUserDataToServer = async () => {
    const userCookie = Cookies.get("user");

    try {
      // Replace this with the actual server
      const res = await fetch("http://localhost:3000/user_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCookie),
      });

      const resData = await res.json();
      console.log("Server response:", resData);
    } catch (error) {
      console.error("Error sending  data to the server:", error);
    }
  };

  return (
    <div className="app">
      <header className="header">
      <img src={logo} alt="Tracking Logo" className="logo" />
        <h1>Cookie Tracking App </h1>
      </header>
      <div className="content">
      <h1> User Tracking with Cookies</h1>
      <p>User IP: {userInfo.ip}</p>
      <p>First Visit: {userInfo.firstVisit}</p>
      <p>Last Interaction: {userInfo.lastInteraction || "No interaction "}</p>
      <button onClick={userInteractionTracking}>Track Interaction</button>
      <button onClick={sendUserDataToServer}>Send Data to Server</button>
    </div>
    <footer className="footer">
        &copy; 2023 Cookie Track Company 
      </footer>
      </div>

  );
};

export default App;
