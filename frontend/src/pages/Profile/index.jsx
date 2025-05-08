import { useEffect, useState } from "react";
import ChatBox from "../../components/ChatBox";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import TradeHistory from "../../components/TradeHistory";
import WatchList from "../../components/WatchList";
import { aiAdviceApi, financialProfileApi, investmentExpLevels, investmentGoalsValues, profileApi, riskToleranceLevels, serverUrl, tradeApi, watchlistApi } from "../../constants";
import ProfileInfo from "../../components/ProfileInfo";

const initialUserProfile = {
  username: '',
  email: '',
  investment_experience_level: investmentExpLevels[0],
  risk_tolerance: riskToleranceLevels[0],
  investment_goal: investmentGoalsValues[0],
  annual_income: 0,
  cash_holding: 0,
  debt: 0
}

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const token = localStorage.getItem('token');


  const fetchProfile = async () => {
    try {
      const url = serverUrl + profileApi;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Token invalid or expired');

      const userData = await res.json();
      setUserProfile(existing => ({ ...existing, ...userData }));
    } catch (err) {
      console.error('Profile load failed:', err);
      setProfileErrorMsg('Session expired. Redirecting to login...');
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }, 1500);
    }
  }

  const fetchFinancialProfile = async () => {
    try {
      const url = serverUrl + financialProfileApi;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        setTimeout(() => {
          setProfileErrorMsg('Token expired, redirecting to login');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }, 1500);
      }

      if (!res.ok) throw new Error('Something went wrong. Please try again later.');
      const userData = await res.json();
      setUserProfile(existing => ({ ...existing, ...userData }));
      setProfileErrorMsg('');
    } catch (err) {
      console.error('Profile load failed:', err);
      setProfileErrorMsg(err);
    }
  }

  const updateFinancialProfile = async () => {
    try {
      const url = serverUrl + financialProfileApi;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userProfile)
      });
      

      if (res.status === 401) {
        setTimeout(() => {
          setProfileErrorMsg('Token expired, redirecting to login');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }, 1500);
      }

      if (!res.ok) throw new Error('Something went wrong. Please try again later.');

      const userData = await res.json();
      setUserProfile(existing => ({ ...existing, ...userData }));
      setProfileErrorMsg("Updated successfully");
    } catch (err) {
      console.error('Profile load failed:', err);
      setProfileErrorMsg(err);
    }
  }




  async function loadWatchlist() {
    try {
      const url = serverUrl + watchlistApi
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch watchlist');

      const data = await res.json();
      setWatchList(data.slice(0, 4));
    } catch (err) {
      console.error('Watchlist load error:', err);
    }
  }


  async function loadTradesList() {
    try {
      const url = serverUrl + tradeApi;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch trades list');
      const data = await res.json();
      setTradeHistory(data.slice(0, 4));
    } catch (err) {
      console.error('trades list load error:', err);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchFinancialProfile();
  }, [])


  useEffect(() => {
    loadTradesList();
    loadWatchlist();
  }, []);

  return (
    <>
      <NavBar isLoggedIn={true} />

      <div className="max-w-7xl mx-auto py-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Column  */}
        <div className="md:col-span-1">
          <ProfileInfo profileInfo={userProfile} setProfileInfo={setUserProfile} errorMsg={profileErrorMsg} onSubmit={updateFinancialProfile} />
        </div>

        {/* Right Column  */}
        <div className="md:col-span-2">
          <TradeHistory tradeHistoryItems={tradeHistory} />
          <WatchList watchListItems={watchList} />
        </div>

        <div className="md:col-span-2">
        <ChatBox chatEndpoint={aiAdviceApi} initialMessage={"Hello! Do you need any recommendations on your portfolio, spending, savings or investments?"}/> 
        </div>

      </div>


      <Footer />
    </>
  );
}


export default ProfilePage