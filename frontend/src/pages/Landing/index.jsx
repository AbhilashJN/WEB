import Footer from "../../components/Footer"
import NavBar from "../../components/NavBar"

const LandingPage = () => {

    return (
        <>
            {/* Navbar --> */}
            <NavBar isLoggedIn={false} />

            {/* Hero Section  */}
            <section className="bg-blue-500 text-white py-20">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4">Start Trading Smarter</h2>
                    <p className="text-lg mb-6">Real-time data. Simple tools. No nonsense.</p>
                    <a href="/register" className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-200">Get Started</a>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-2">Live Market Updates</h3>
                        <p className="text-gray-600">Stay ahead with real-time stock prices and trends.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-2">Easy Portfolio Tracking</h3>
                        <p className="text-gray-600">Monitor your investments with a clean, simple dashboard.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-2">Low Fees</h3>
                        <p className="text-gray-600">Trade without breaking the bank. Transparent pricing.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gray-800 text-white py-12">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Take Control?</h2>
                    <p className="text-lg mb-6">Join thousands of traders who trust us daily.</p>
                    <a href="/register" className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600">Sign Up Now</a>
                </div>
            </section>

            {/* Footer  */}
            <Footer />
        </>
    )
}


export default LandingPage