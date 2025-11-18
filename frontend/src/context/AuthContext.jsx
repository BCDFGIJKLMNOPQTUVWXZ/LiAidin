import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------
  // LOAD TOKEN ON PAGE REFRESH
  // ----------------------------------------
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setToken(savedToken);

      // 🔥 Attach token to every axios request globally
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

      fetchProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------
  // FETCH PROFILE USING TOKEN
  // ----------------------------------------
  const fetchProfile = async (tok) => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/auth/profile", {
        headers: {
          Authorization: `Bearer ${tok}`,
        },
      });

      setUser(res.data.user);
    } catch (err) {
      console.log("Profile fetch failed:", err);
      setUser(null); // token invalid or expired
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // LOGIN FUNCTION
  // ----------------------------------------
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/login", {
        email,
        password,
      });

      const { accessToken, user } = res.data;

      // Save token locally
      localStorage.setItem("accessToken", accessToken);

      // Update state
      setToken(accessToken);
      setUser(user);

      // 🔥 VERY IMPORTANT: Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // ----------------------------------------
  // SIGNUP FUNCTION
  // ----------------------------------------
  //Yeah I should be using this function in SignUpPage.jsx but didn't want to refactor at the last minute but making a note of it here
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/signup",
        { name, email, password }
      );

      const { accessToken, user } = res.data;

      // Save token
      localStorage.setItem("accessToken", accessToken);

      setToken(accessToken);
      setUser(user);

      // 🔥 Attach token globally
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return true;
    } catch (err) {
      console.error("Signup failed:", err);
      return false;
    }
  };

  // ----------------------------------------
  // LOGOUT FUNCTION
  // ----------------------------------------
  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);

    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,

        // Required for Navbar
        isLoggedIn: !!user,
        userRole: user?.role || "user",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Easy use hook
export const useAuth = () => useContext(AuthContext);
