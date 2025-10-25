import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { loginUser, clearErrors } from "@/store/auth-slice";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoading, loginError } = useAppSelector((state) => state.auth);
    const [form, setForm] = useState({
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
        if (loginError)
            dispatch(clearErrors());
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await dispatch(loginUser(form));
        if (loginUser.fulfilled.match(data) && data.payload.success) {
            navigate("/", { replace: true });
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 px-4", children: _jsxs("div", { className: "w-full max-w-md bg-white p-8 shadow-xl border border-gray-200 rounded-lg", children: [_jsx("h1", { className: "text-3xl font-bold text-center text-gray-800 mb-6 uppercase", children: "Login" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { htmlFor: "email", className: "mb-1 text-sm font-medium text-gray-700", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: form.email, onChange: handleChange, autoComplete: "off", required: true, className: `px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${loginError?.errors?.email
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-amber-400"}` }), loginError?.errors?.email && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: loginError.errors.email.join(", ") }))] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { htmlFor: "password", className: "mb-1 text-sm font-medium text-gray-700", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", value: form.password, onChange: handleChange, required: true, className: `px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${loginError?.errors?.password
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-amber-400"}` }), loginError?.errors?.password && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: loginError.errors.password.join(", ") }))] }), loginError?.message && (_jsx("p", { className: "text-red-600 text-center text-sm mb-2", children: loginError.message })), _jsx(Button, { type: "submit", className: "w-full bg-amber-500 hover:bg-amber-600 transition", disabled: isLoading, children: isLoading ? "Logging in..." : "Login" }), _jsxs("div", { className: "text-center text-sm text-gray-600", children: ["Don't have an account?", " ", _jsx(Link, { to: "/register", className: "text-blue-600 font-medium hover:underline", children: "Sign up here" })] })] })] }) }));
};
export default Login;
