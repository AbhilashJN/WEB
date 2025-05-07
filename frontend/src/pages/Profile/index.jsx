import { useEffect, useState } from "react";
import ChatBox from "../../components/ChatBox";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import TradeHistory from "../../components/TradeHistory";
import WatchList from "../../components/WatchList";
import { chatApi, financialProfileApi, investmentExpLevels, investmentGoalsValues, profileApi, riskToleranceLevels, serverUrl, tradeApi, watchlistApi } from "../../constants";
import ProfileInfo from "../../components/ProfileInfo";

const initialChatLog = { role: 'ai', msg: 'Hello! How can I assist you with trading today?' };
const initialUserProfile = {
  username: '',
  email: '',
  investment_experience_level: investmentExpLevels[0],
  risk_tolerance_level: riskToleranceLevels[0],
  investment_goal: investmentGoalsValues[0],
  annual_income: 0,
  cash_holding: 0,
  debt: 0
}

const ProfilePage = ({ username, email }) => {
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([initialChatLog]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [isAILoading, setIsAILoading] = useState(false);
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

  const onChatInput = (e) => {
    setChatInput(e.target.value);
  }

  const onChatSubmit = async () => {
    const message = chatInput.trim();
    if (!message) return;

    // Add user's message
    const userMsg = { role: 'user', msg: message };
    setChatLog(prevLog => [...prevLog, userMsg]);
    setIsAILoading(true);
    // Send message to backend AI route
    try {
      const url = serverUrl + chatApi;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      const aiResponse = { role: 'ai', msg: data.reply };
      setIsAILoading(false);
      setChatLog(prevLog => [...prevLog, aiResponse]);
    } catch (err) {
      console.error('AI Error:', err);
      const aiResponse = { role: 'ai', msg: "Something went wrong", isError: true };
      setIsAILoading(false);
      setChatLog(prevLog => [...prevLog, aiResponse]);
    }
    setChatInput('');
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

      <div className="max-w-6xl mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column  */}
        <div className="md:col-span-1">
          <ProfileInfo profileInfo={userProfile} setProfileInfo={setUserProfile} errorMsg={profileErrorMsg} onSubmit={updateFinancialProfile} />
        </div>

        {/* Right Column  */}
        <div className="md:col-span-2">
          <TradeHistory tradeHistoryItems={tradeHistory} />
          <WatchList watchListItems={watchList} />
          <ChatBox chatInputValue={chatInput} onChatInput={onChatInput} onChatSubmit={onChatSubmit} chatLog={chatLog} isLoading={isAILoading} />
        </div>
      </div>


      <Footer />
    </>
  );
}


export default ProfilePage