import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + "/api/auth/login", {
        email,
        password,
      });

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate("/"); // redirect to home page
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 relative">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900 py-4 px-6 flex justify-between shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="text-white font-semibold text-2xl cursor-pointer"
        >
          P.K Arts College
        </div>
      </div>

      {/* Card */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md mt-28">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
          Welcome Back
        </h2>
        <p className="text-slate-500 text-center mb-6">Login to continue</p>

        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.mail_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email address"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.lock_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                required
              />
            </div>
          </div>

          <button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold text-lg shadow-md flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
