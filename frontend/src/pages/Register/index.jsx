import { useState } from "react";
import { serverUrl, registerAPI } from "../../constants";
import { investmentExpLevels, investmentGoalsValues, riskToleranceLevels } from "../../constants";


const initialUserProfile = {
    username: '',
    email: '',
    password:'',
    investment_experience_level: investmentExpLevels[0],
    risk_tolerance_level: riskToleranceLevels[0],
    investment_goal: investmentGoalsValues[0],
    annual_income: 0,
    cash_holding: 0,
    debt: 0
  }

const RegisterPage = () => {
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');
    const [profileInfo, setProfileInfo] = useState(initialUserProfile);

    const setUsername = (e) => {
        setProfileInfo(existing => { return { ...existing, username: e.target.value } });
    }

    const setEmail = (e) => {
        setProfileInfo(existing => { return { ...existing, email: e.target.value } });
    }

    const setPassword = (e) => {
        setProfileInfo(existing => { return { ...existing, password: e.target.value } });
    }

    const setInvExpLevel = (e) => {
        setProfileInfo(existing => { return { ...existing, investment_experience_level: e.target.value } });
    }

    const setRiskTolerance = (e) => {
        setProfileInfo(existing => { return { ...existing, risk_tolerance: e.target.value } });
    }

    const setInvGoal = (e) => {
        setProfileInfo(existing => { return { ...existing, investment_goal: e.target.value } });
    }

    const setAnnualIncome = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setProfileInfo(existing => { return { ...existing, annual_income: e.target.value } });
        }
    }

    const setCashHolding = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setProfileInfo(existing => { return { ...existing, cash_holding: e.target.value } });
        }
    }

    const setDebt = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setProfileInfo(existing => { return { ...existing, debt: e.target.value } });
        }
    }

    const onSubmit = async () => {
        const url = serverUrl + registerAPI;
        const formData = profileInfo;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setMessage('User registered successfully');
                setMessageColor('green');
            } else if (response.status === 400) {
                // error handling 
                setMessage('User Already exist. Please try a different email or username.');
                setMessageColor('red');
            } else {
                const errorMessage = await response.text();
                setMessage(errorMessage);
                setMessageColor('red');
            }
        } catch (err) {
            console.error('Error', err);
            setMessageColor('red');
            setMessage('Something went wrong. Please try again later');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4 text-center">Create An Account</h1>
                <form id="registerForm" className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            placeholder="Your username here"
                            id="username"
                            name="username"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                            onChange={setUsername}
                            value={profileInfo.username}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Type your email here"
                            id="email"
                            name="email"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                            onChange={setEmail}
                            value={profileInfo.email}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Your password here"
                            id="password"
                            name="password"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                            onChange={setPassword}
                            value={profileInfo.password}
                        />
                    </div>
                    <p className="text-gray-600"><strong>Investment Experience Level:</strong><br />
                        <select className="mb-4 p-2" onChange={setInvExpLevel} value={profileInfo.investment_experience_level}>
                            {
                                investmentExpLevels.map(level => {
                                    const capitalized = level.charAt(0).toUpperCase() + level.slice(1);
                                    return <option key={level} value={level}>{capitalized}</option>
                                })
                            }
                        </select>
                    </p>
                    <p className="text-gray-600"><strong>Risk Tolerance:</strong><br />
                        <select className="mb-4 p-2" onChange={setRiskTolerance} value={profileInfo.risk_tolerance}>
                            {
                                riskToleranceLevels.map(level => {
                                    const capitalized = level.charAt(0).toUpperCase() + level.slice(1);
                                    return <option key={level} value={level}>{capitalized}</option>
                                })
                            }
                        </select>
                    </p>
                    <p className="text-gray-600"><strong>Investment Goal:</strong><br />
                        <select className="mb-4 p-2" onChange={setInvGoal} value={profileInfo.investment_goal}>
                            {
                                investmentGoalsValues.map(level => {
                                    const capitalized = level.charAt(0).toUpperCase() + level.slice(1);
                                    return <option key={level} value={level}>{capitalized}</option>
                                })
                            }
                        </select>
                    </p>
                    <p className="text-gray-600"><strong>Annual Income:</strong><br />
                        <input
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text" value={profileInfo.annual_income} onChange={setAnnualIncome} />
                    </p>
                    <p className="text-gray-600"><strong>Cash Holding:</strong><br />
                        <input
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text" value={profileInfo.cash_holding} onChange={setCashHolding} />
                    </p>
                    <p className="text-gray-600"><strong>Debt:</strong><br />
                        <input
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text" value={profileInfo.debt} onChange={setDebt} />
                    </p>
                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                        onClick={onSubmit}
                    >
                        Register
                    </button>
                </form>
                <div
                    id="message" className="mt-4 text-center text-sm"
                    style={{ color: messageColor }}
                >
                    {message}<br />
                    <a href="/login">Login</a>
                </div>
            </div>
        </div>
    )
}


export default RegisterPage;