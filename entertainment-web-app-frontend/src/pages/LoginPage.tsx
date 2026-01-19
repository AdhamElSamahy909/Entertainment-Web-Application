import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/api/authApiSlice";
import toast from "react-hot-toast";
import GoogleSignin from "../ui/GoogleSignin";

interface LoginInputs {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginInputs>();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  async function onSubmit({ email, password }: LoginInputs) {
    try {
      await login({ email, password }).unwrap();

      toast.success("Login successful");

      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Login Failed");
    }
  }

  return (
    <div className="h-full w-full mb-auto mt-[5rem] flex flex-col items-center gap-[3rem] max-w-lg mx-auto text-[1rem]">
      <img src="./assets/logo.svg" alt="Logo" className="w-[2rem] h-[1.6rem]" />

      <div className="bg-accent w-[20.5rem] sm:w-[25rem] px-7 py-11 font-light font-outfit rounded-xl">
        <h2 className="text-secondary dark:text-white text-[2rem] capitalize">
          {location.pathname === "/login" ? "Login" : "Sign Up"}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-start"
        >
          <div className="flex flex-col gap-[1rem] mt-[1.5rem] mb-[2.5rem] w-full">
            <div className="border-solid border-b-[1px] border-b-display px-3 py-3">
              <input
                type="email"
                placeholder="Email address"
                required
                className="bg-transparent w-full outline-none text-secondary dark:text-white opacity-[0.5]"
                {...register("email")}
              />
              {errors?.email && <span>{errors.email.message}</span>}
            </div>

            <div className="border-solid w-full border-b-[1px] border-b-display px-3 py-3">
              <input
                type="password"
                placeholder="Password"
                required
                className="bg-inherit outline-none text-secondary dark:text-white opacity-[0.5]"
                {...register("password")}
              />
              {errors?.password && <span>{errors.password.message}</span>}
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              type="submit"
              className="bg-primary w-full text-secondary dark:text-white py-4 px-2 rounded-md"
              disabled={isLoggingIn}
            >
              Login to your account
            </button>

            <div className="w-full [&>*]:w-full">
              <GoogleSignin />
            </div>
          </div>

          <div className="w-full flex gap-[1rem] mt-[1.5rem] text-center justify-center text-secondary dark:text-white">
            <p>Don't have an account?</p>
            <Link className="text-primary" to={"/signup"}>
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
