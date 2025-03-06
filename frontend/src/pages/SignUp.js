import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/signup", { username, password });
            alert("Signup successful! Please login.");
            navigate("/login");
        } catch (err) {
            alert("Error signing up.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md mb-4" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md mb-4" required />
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">Register</button>
                </form>
                <p className="mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
            </div>
        </div>
    );
};

export default SignUp;
