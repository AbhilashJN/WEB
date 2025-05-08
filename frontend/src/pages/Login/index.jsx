import { useState } from "react"
import { serverUrl, loginAPI } from "../../constants";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');

    const onSubmit = async () => {
        try {
            const url = serverUrl + loginAPI;
            const formData = { email, password };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                setMessageColor('red');
                setMessage(data.message || 'Invalid credentials.')
                return;
            }

            const data = await response.json();

            // Save token
            localStorage.setItem('token', data.token);
            setMessage('Login successful. Redirecting to Profile page')
            setMessageColor('green');
            setTimeout(() => {
                window.location.href = '/portfolio';
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            setMessageColor('red');
            setMessage("Something went wrong. Please try again.");
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Log In</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                    <input
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" id="email" placeholder="Enter your email" required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                    <input
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" id="password" placeholder="Enter your password" required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600" type="button"
                    onClick={onSubmit}
                >
                    Log In
                </button>
                <div
                    id="message" className="mt-4 text-center text-sm"
                    style={{ color: messageColor }}
                >
                    {message}
                </div>
                <p className="text-center text-gray-600 mt-4">Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign Up</a></p>
            </div>
        </div>
    )
}


export default LoginPage;