import { investmentExpLevels, investmentGoalsValues, riskToleranceLevels } from "../../constants";

const ProfileInfo = ({ profileInfo, setProfileInfo, errorMsg, onSubmit }) => {

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

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Account Info</h2>
                <p className="text-gray-600"><strong>Username:</strong> <span id="username">{profileInfo.username}</span></p>
                <p className="text-gray-600"><strong>Email:</strong> <span id="email">{profileInfo.email}</span></p>
                <p id="errorMsg" className="text-red-500 text-sm mt-2"></p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Profile</h2>
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
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        type="text" value={profileInfo.annual_income} onChange={setAnnualIncome} />
                </p>
                <p className="text-gray-600"><strong>Cash Holding:</strong><br />
                    <input
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        type="text" value={profileInfo.cash_holding} onChange={setCashHolding} />
                </p>
                <p className="text-gray-600"><strong>Debt:</strong><br />
                    <input
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        type="text" value={profileInfo.debt} onChange={setDebt} />
                </p>
                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600" type="button"
                    onClick={onSubmit}
                >Update</button>
                <p id="errorMsg" className="text-red-500 text-sm mt-2">{errorMsg}</p>
            </div>
        </>
    )
}

export default ProfileInfo;