import { Button } from "@/components/ui/button";

const registerData = [
  { id: 1, name: "Username" },
  { id: 2, name: "Email" },
  { id: 3, name: "Password" },
];
const Register = () => {
  return (
    <div className="mx-auto min-h-screen flex justify-center items-center">
      <div className="flex flex-col p-4 shadow-2xl border rounded-lg lg:w-[30%]">
        <h1 className="shadow-2xl text-4xl uppercase flex items-center justify-center">
          Register
        </h1>
        <form action="">
          <div className="flex flex-col gap-5 mt-5">
            {registerData.map((registerForm) => (
              <div className="flex justify-between gap-3" key={registerForm.id}>
                <label className="font-bold">{registerForm.name}</label>
                <input
                  type="text"
                  className="border border-gray-500 px-2 py-1"
                />
              </div>
            ))}
            <Button className="cursor-pointer">Register</Button>
            <div>
              <p>
                <span className="text-sm">Already Registered:</span>
                <span className="text-blue-600 uppercase font-semibold cursor-pointer mx-5">
                  {" "}
                  Login
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
