import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { registerUser, clearErrors } from "@/store/auth-slice";

interface RegisterField {
  id: number;
  name: string;
  type: string;
  key: keyof RegisterFormData;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const registerData: RegisterField[] = [
  { id: 1, name: "Username", type: "text", key: "username" },
  { id: 2, name: "Email", type: "email", key: "email" },
  { id: 3, name: "Password", type: "password", key: "password" },
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, registerError } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState<RegisterFormData>({
    username: "",
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

    if (registerError) dispatch(clearErrors());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(data) && data.payload.success) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 uppercase">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {registerData.map((item) => (
            <div key={item.id} className="flex flex-col">
              <label
                htmlFor={item.key}
                className="mb-1 text-sm font-medium text-gray-700"
              >
                {item.name}
              </label>
              <input
                id={item.key}
                name={item.key}
                type={item.type}
                value={form[item.key]}
                onChange={handleChange}
                autoComplete="off"
                required
                className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
                  registerError?.errors?.[item.key]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-amber-400"
                }`}
              />
              {registerError?.errors?.[item.key] && (
                <p className="text-red-600 text-sm mt-1">
                  {registerError.errors[item.key]?.join(", ")}
                </p>
              )}
            </div>
          ))}

          {registerError?.message && (
            <p className="text-red-600 text-center text-sm mb-2">
              {registerError.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 transition"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
