import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { registerUser, clearErrors } from "@/store/auth-slice";
const registerData = [
    { id: 1, name: "Username", type: "text", key: "username" },
    { id: 2, name: "Email", type: "email", key: "email" },
    { id: 3, name: "Password", type: "password", key: "password" },
];
const Register = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoading, registerError } = useAppSelector((state) => state.auth);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
    useEffect(() => {
        dispatch(clearErrors());
    }, [dispatch]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
        if (registerError)
            dispatch(clearErrors());
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await dispatch(registerUser(form));
        if (registerUser.fulfilled.match(data) && data.payload.success) {
            navigate("/login", { replace: true });
        }
    };
    return (_jsx("div", { className: "min-h-screen flex justify-center items-center bg-gray-50 px-4", children: _jsxs("div", { className: "w-full max-w-md bg-white p-8 shadow-xl rounded-lg border border-gray-200", children: [_jsx("h1", { className: "text-3xl font-bold text-center text-gray-800 mb-6 uppercase", children: "Register" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [registerData.map((item) => (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { htmlFor: item.key, className: "mb-1 text-sm font-medium text-gray-700", children: item.name }), _jsx("input", { id: item.key, name: item.key, type: item.type, value: form[item.key], onChange: handleChange, autoComplete: "off", required: true, className: `px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${registerError?.errors?.[item.key]
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-amber-400"}` }), registerError?.errors?.[item.key] && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: registerError.errors[item.key]?.join(", ") }))] }, item.id))), registerError?.message && (_jsx("p", { className: "text-red-600 text-center text-sm mb-2", children: registerError.message })), _jsx(Button, { type: "submit", className: "w-full bg-amber-500 hover:bg-amber-600 transition", disabled: isLoading, children: isLoading ? "Registering..." : "Register" }), _jsxs("div", { className: "text-center text-sm text-gray-600", children: ["Already registered?", " ", _jsx(Link, { to: "/login", className: "text-blue-600 font-medium hover:underline", children: "Login here" })] })] })] }) }));
};
export default Register;
