// import { useContext, useState } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import { AppContent } from "../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Login = () => {
//   const navigate = useNavigate();

//   const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

//   const [state, setState] = useState("Sign Up");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const onSubmitHandler = async (e) => {
//     try {
//       e.preventDefault();

//       axios.defaults.withCredentials = true;

//       if (state === "Sign Up") {
//         const { data } = await axios.post(backendUrl + "/api/auth/register", {
//           name,
//           email,
//           password,
//         });

//         if (data.success) {
//           setIsLoggedin(true);
//         } else {
//           toast.error(data.message);
//         }
//       } else {
//         const { data } = await axios.post(backendUrl + "/api/auth/login", {
//           email,
//           password,
//         });

//         if (data.success) {
//           setIsLoggedin(true);
//           getUserData();
//           navigate("/");
//         } else {
//           toast.error(data.message);
//         }
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const sendVerificationOtp = async () => {
//     try {
//       axios.defaults.withCredentials = true;
//       const { data } = await axios.post(
//         backendUrl + "/api/auth/send-verify-otp"
//       );

//       if (data.success) {
//         navigate("/email-verify");
//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6 sm:px-0 ">
//       <div className="bg-slate-900 w-full flex justify-between sm:py-3 sm:px-5 items-center absolute top-0">
//         <div onClick={() => navigate("/")} className="flex items-center">
//           {/* <img src={assets.logo} alt="" className='w-25 sm:w-20' /> */}

//           <p className="text-white font-semibold text-3xl sm:text-2xl mx-5">
//             P.K Arts College
//           </p>
//         </div>
//       </div>

//       <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
//         <h2 className="text-3xl font-semibold text-white text-center mb-3">
//           {state === "Sign Up" ? "Create account" : "Login"}
//         </h2>
//         <p className="text-sm mb-6 text-center">
//           {state === "Sign Up"
//             ? "Create your account"
//             : "Login to your account!"}
//         </p>
//         <form
//           onSubmit={async (e) => {
//             await onSubmitHandler(e);
//             if (state === "Sign Up") {
//               await sendVerificationOtp();
//             }
//           }}
//         >
//           {state === "Sign Up" && (
//             <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
//               <img src={assets.person_icon} alt="" />
//               <input
//                 className="bg-transparent outline-none placeholder-gray-300"
//                 onChange={(e) => setName(e.target.value)}
//                 value={name}
//                 type="text"
//                 placeholder="Full Name"
//                 required
//               />
//             </div>
//           )}

//           <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
//             <img src={assets.mail_icon} alt="" />
//             <input
//               className="bg-transparent outline-none placeholder-gray-300"
//               type="email"
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//               placeholder="Email id"
//               required
//             />
//           </div>

//           <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
//             <img src={assets.lock_icon} alt="" />
//             <input
//               className="bg-transparent outline-none placeholder-gray-300"
//               type="password"
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//               placeholder="Password"
//               required
//             />
//           </div>

//           <p
//             onClick={() => navigate("/reset-password")}
//             className="mb-4 text-indigo-500 cursor-pointer"
//           >
//             Forgot Password ?
//           </p>

//           <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
//             {state}
//           </button>
//         </form>

//         {state === "Sign Up" ? (
//           <p className="text-gray-400 text-center text-sm mt-4">
//             Already have a account?{"  "}
//             <span
//               onClick={() => setState("Login")}
//               className="text-blue-400 cursor-pointer underline"
//             >
//               Login here
//             </span>
//           </p>
//         ) : (
//           <p className="text-gray-400 text-center text-sm mt-4">
//             Don't have an account?{"  "}
//             <span
//               onClick={() => setState("Sign Up")}
//               className="text-blue-400 cursor-pointer underline"
//             >
//               Sign Up
//             </span>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
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
      toast.error(error.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4">
      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900 py-4 px-6 flex items-center justify-between shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="text-white font-semibold text-2xl sm:text-3xl cursor-pointer"
        >
          P.K Arts College
        </div>
      </div>

      {/* Auth Card */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 sm:p-10 w-full max-w-md mt-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-slate-500 text-center mb-6">
          {state === "Sign Up"
            ? "Sign up to get started"
            : "Login to continue"}
        </p>

        <form
          onSubmit={async (e) => {
            await onSubmitHandler(e);
            if (state === "Sign Up") {
              await sendVerificationOtp();
            }
          }}
        >
          {state === "Sign Up" && (
            <div className="mb-4">
              <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-300">
                <img src={assets.person_icon} alt="" className="w-5 h-5" />
                <input
                  className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.mail_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email address"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-300">
              <img src={assets.lock_icon} alt="" className="w-5 h-5" />
              <input
                className="bg-transparent flex-1 outline-none text-slate-700 placeholder-slate-400"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                required
              />
            </div>
          </div>

          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-sm text-indigo-600 cursor-pointer hover:underline text-right"
            >
              Forgot Password?
            </p>
          )}

          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold text-lg shadow-md hover:from-indigo-500 hover:to-indigo-700 transition">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-slate-600 text-center text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-indigo-600 cursor-pointer font-medium hover:underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-slate-600 text-center text-sm mt-6">
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
