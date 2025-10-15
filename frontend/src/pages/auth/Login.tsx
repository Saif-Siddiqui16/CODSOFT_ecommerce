import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { loginUser, clearErrors } from "@/store/auth-slice";
import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, loginError } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    if (loginError) dispatch(clearErrors());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(data) && data.payload.success) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-xl border border-gray-200 rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 uppercase">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
              required
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
                loginError?.errors?.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-amber-400"
              }`}
            />
            {loginError?.errors?.email && (
              <p className="text-red-600 text-sm mt-1">
                {loginError.errors.email.join(", ")}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
                loginError?.errors?.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-amber-400"
              }`}
            />
            {loginError?.errors?.password && (
              <p className="text-red-600 text-sm mt-1">
                {loginError.errors.password.join(", ")}
              </p>
            )}
          </div>

          {loginError?.message && (
            <p className="text-red-600 text-center text-sm mb-2">
              {loginError.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 transition"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
