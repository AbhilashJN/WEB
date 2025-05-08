import ChatBox from "../../components/ChatBox";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import StockAnalysis from "../../components/StockAnalysis";
import { chatApi } from "../../constants";

const AnalyzePage = () => {

    return (
        <>
            <NavBar isLoggedIn={true} />
            <div className="max-w-7xl mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column  */}
                <div className="md:col-span-1">
                    <ChatBox chatEndpoint={chatApi} initialMessage={"Hello! I can answer any questions you have regarding stock analysis."}/>
                </div>

                {/* Right Column  */}
                <div className="md:col-span-2">
                    <StockAnalysis />
                </div>
            </div>
            <Footer />
        </>
    )


}

export default AnalyzePage;