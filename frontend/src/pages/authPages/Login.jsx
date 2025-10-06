aaimport { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // common loader

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      setLoading(true); // Start loading
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          await sendVerificationOtp();
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const sendVerificationOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp",
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 sm:px-6 relative">
      {/* 🔄 Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-white border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="mt-3 sm:mt-4 text-white font-medium text-sm sm:text-base">
            {state === "Sign Up"
              ? "Creating your account..."
              : "Logging in..."}
          </p>
        </div>
      )}

      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="text-white font-semibold text-xl sm:text-2xl md:text-3xl cursor-pointer"
        >
          P.K Arts College
        </div>
      </div>

      {/* Auth Card */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md mt-24 sm:mt-28 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-2">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-slate-500 text-center mb-6 text-sm sm:text-base">
          {state === "Sign Up" ? "Sign up to get started" : "Login to continue"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4">
              <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
                <img src={assets.person_icon} alt="" className="w-5 h-5" />
                <input
                  className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.mail_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email address"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.lock_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-xs sm:text-sm text-indigo-600 cursor-pointer hover:underline text-right"
            >
              Forgot Password?
            </p>
          )}

          {/* Submit */}
          <button
            className="w-full py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold text-base sm:text-lg shadow-md hover:from-indigo-500 hover:to-indigo-700 transition cursor-pointer"
            disabled={loading}
          >
            {loading
              ? state === "Sign Up"
                ? "Creating..."
                : "Logging in..."
              : state}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        {state === "Sign Up" ? (
          <p className="text-slate-600 text-center text-xs sm:text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-indigo-600 cursor-pointer font-medium hover:underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-slate-600 text-center text-xs sm:text-sm mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-indigo-600 cursor-pointer font-medium hover:underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // common loader

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      setLoading(true); // Start loading
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          await sendVerificationOtp();
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const sendVerificationOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp",
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 sm:px-6 relative">
      {/* 🔄 Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-white border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="mt-3 sm:mt-4 text-white font-medium text-sm sm:text-base">
            {state === "Sign Up"
              ? "Creating your account..."
              : "Logging in..."}
          </p>
        </div>
      )}

      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="text-white font-semibold text-xl sm:text-2xl md:text-3xl cursor-pointer"
        >
          P.K Arts College
        </div>
      </div>

      {/* Auth Card */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md mt-24 sm:mt-28 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-2">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-slate-500 text-center mb-6 text-sm sm:text-base">
          {state === "Sign Up" ? "Sign up to get started" : "Login to continue"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4">
              <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
                <img src={assets.person_icon} alt="" className="w-5 h-5" />
                <input
                  className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.mail_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email address"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.lock_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-xs sm:text-sm text-indigo-600 cursor-pointer hover:underline text-right"
            >
              Forgot Password?
            </p>
          )}

          {/* Submit */}
          <button
            className="w-full py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold text-base sm:text-lg shadow-md hover:from-indigo-500 hover:to-indigo-700 transition cursor-pointer"
            disabled={loading}
          >
            {loading
              ? state === "Sign Up"
                ? "Creating..."
                : "Logging in..."
              : state}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        {state === "Sign Up" ? (
          <p className="text-slate-600 text-center text-xs sm:text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-indigo-600 cursor-pointer font-medium hover:underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-slate-600 text-center text-xs sm:text-sm mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-indigo-600 cursor-pointer font-medium hover:underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // common loader

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      setLoading(true); // Start loading
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          await sendVerificationOtp();
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const sendVerificationOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp",
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 sm:px-6 relative">
      {/* 🔄 Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-white border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="mt-3 sm:mt-4 text-white font-medium text-sm sm:text-base">
            {state === "Sign Up"
              ? "Creating your account..."
              : "Logging in..."}
          </p>
        </div>
      )}

      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="text-white font-semibold text-xl sm:text-2xl md:text-3xl cursor-pointer"
        >
          P.K Arts College
        </div>
      </div>

      {/* Auth Card */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md mt-24 sm:mt-28 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-2">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-slate-500 text-center mb-6 text-sm sm:text-base">
          {state === "Sign Up" ? "Sign up to get started" : "Login to continue"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4">
              <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
                <img src={assets.person_icon} alt="" className="w-5 h-5" />
                <input
                  className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.mail_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email address"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.lock_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-xs sm:text-sm text-indigo-600 cursor-pointer hover:underline text-right"
            >
              Forgot Password?
            </p>
          )}

          {/* Submit */}
          <button
            className="w-full py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold text-base sm:text-lg shadow-md hover:from-indigo-500 hover:to-indigo-700 transition cursor-pointer"
            disabled={loading}
          >
            {loading
              ? state === "Sign Up"
                ? "Creating..."
                : "Logging in..."
              : state}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        {state === "Sign Up" ? (
          <p className="text-slate-600 text-center text-xs sm:text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-indigo-600 cursor-pointer font-medium hover:underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-slate-600 text-center text-xs sm:text-sm mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-indigo-600 cursor-pointer font-medium hover:underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // common loader

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      setLoading(true); // Start loading
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          await sendVerificationOtp();
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const sendVerificationOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp",
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 sm:px-6 relative">
      {/* 🔄 Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-white border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="mt-3 sm:mt-4 text-white font-medium text-sm sm:text-base">
            {state === "Sign Up"
              ? "Creating your account..."
              : "Logging in..."}
          </p>
        </div>
      )}

      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="text-white font-semibold text-xl sm:text-2xl md:text-3xl cursor-pointer"
        >
          P.K Arts College
        </div>
      </div>

      {/* Auth Card */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md mt-24 sm:mt-28 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-2">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-slate-500 text-center mb-6 text-sm sm:text-base">
          {state === "Sign Up" ? "Sign up to get started" : "Login to continue"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4">
              <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
                <img src={assets.person_icon} alt="" className="w-5 h-5" />
                <input
                  className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.mail_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email address"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.lock_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-xs sm:text-sm text-indigo-600 cursor-pointer hover:underline text-right"
            >
              Forgot Password?
            </p>
          )}

          {/* Submit */}
          <button
            className="w-full py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold text-base sm:text-lg shadow-md hover:from-indigo-500 hover:to-indigo-700 transition cursor-pointer"
            disabled={loading}
          >
            {loading
              ? state === "Sign Up"
                ? "Creating..."
                : "Logging in..."
              : state}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        {state === "Sign Up" ? (
          <p className="text-slate-600 text-center text-xs sm:text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-indigo-600 cursor-pointer font-medium hover:underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-slate-600 text-center text-xs sm:text-sm mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-indigo-600 cursor-pointer font-medium hover:underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // common loader

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      setLoading(true); // Start loading
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          await sendVerificationOtp();
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const sendVerificationOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp",
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 sm:px-6 relative">
      {/* 🔄 Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-white border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="mt-3 sm:mt-4 text-white font-medium text-sm sm:text-base">
            {state === "Sign Up"
              ? "Creating your account..."
              : "Logging in..."}
          </p>
        </div>
      )}

      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="text-white font-semibold text-xl sm:text-2xl md:text-3xl cursor-pointer"
        >
          P.K Arts College
        </div>
      </div>

      {/* Auth Card */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md mt-24 sm:mt-28 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-2">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-slate-500 text-center mb-6 text-sm sm:text-base">
          {state === "Sign Up" ? "Sign up to get started" : "Login to continue"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4">
              <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
                <img src={assets.person_icon} alt="" className="w-5 h-5" />
                <input
                  className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.mail_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email address"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.lock_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-xs sm:text-sm text-indigo-600 cursor-pointer hover:underline text-right"
            >
              Forgot Password?
            </p>
          )}

          {/* Submit */}
          <button
            className="w-full py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold text-base sm:text-lg shadow-md hover:from-indigo-500 hover:to-indigo-700 transition cursor-pointer"
            disabled={loading}
          >
            {loading
              ? state === "Sign Up"
                ? "Creating..."
                : "Logging in..."
              : state}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        {state === "Sign Up" ? (
          <p className="text-slate-600 text-center text-xs sm:text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-indigo-600 cursor-pointer font-medium hover:underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-slate-600 text-center text-xs sm:text-sm mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-indigo-600 cursor-pointer font-medium hover:underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
