import { Button } from "@/components/ui/button";

const loginData = [
  { id: 1, name: "Email" },
  { id: 2, name: "Password" },
];

const Login = () => {
  return (
    <div className="mx-auto min-h-screen flex justify-center items-center">
      <div className="flex flex-col p-4 shadow-2xl border rounded-lg">
        <h1 className="shadow-2xl text-4xl uppercase flex items-center justify-center">
          Login
        </h1>
        <form action="">
          <div className="flex flex-col gap-5 mt-5">
            {loginData.map((loginForm) => (
              <div className="flex justify-between gap-3" key={loginForm.id}>
                <label className="font-bold">{loginForm.name}</label>
                <input
                  type="text"
                  className="border border-gray-500 px-2 py-1"
                />
              </div>
            ))}
            <Button className="cursor-pointer">Login</Button>
            <div>
              <p>
                <span className="text-sm">Didn't have account:</span>
                <span className="text-blue-600 uppercase font-semibold cursor-pointer mx-5">
                  {" "}
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
