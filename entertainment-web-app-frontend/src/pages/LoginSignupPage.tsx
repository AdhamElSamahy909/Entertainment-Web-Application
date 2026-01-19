// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import {
//   useLoginMutation,
//   useSignInWithGoogleMutation,
//   useSignupMutation,
// } from "../services/api/authApiSlice";
// import toast from "react-hot-toast";
// import Loader from "../ui/Loader";
// import { GoogleLogin } from "@react-oauth/google";
// import { useMemo } from "react";

// function LoginSignUpPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [signInWithGoogle, { isLoading: isSigningInWithGoogle }] =
//     useSignInWithGoogleMutation();
//   const { register, formState, getValues, handleSubmit, reset, setError } =
//     useForm();

//   const [
//     login,
//     { data: dataLogin, isLoading: isLogingIn, isError: isErrorLogin },
//   ] = useLoginMutation();
//   const [
//     signup,
//     { data: dataSignup, isLoading: isSigningUp, isError: isErrorSignup },
//   ] = useSignupMutation();

//   const { errors } = formState;

//   const isLogin = location.pathname === "/login";

//   async function onSubmit({ email, password, passwordConfirm }) {
//     try {
//       isLogin
//         ? await login({ email, password }).unwrap()
//         : await signup({ email, password, passwordConfirm }).unwrap();

//       toast.success("User successful");

//       navigate("/");
//     } catch (err) {
//       toast.error(
//         err?.data?.message || `${isLogin ? "Login" : "Signup"} Failed`
//       );
//     }
//   }

//   const nonce = useMemo(() => crypto.randomUUID(), []);

//   async function handleGoogleSignInSuccess(codeResponse) {
//     try {
//       console.log("Google Sign In");
//       console.log("Code Response: ", codeResponse);
//       // const idToken = codeResponse.credential;
//       // console.log("Google JWT: ", idToken);
//       const userData = await signInWithGoogle({
//         code: codeResponse.code,
//         nonce,
//       }).unwrap();
//       console.log("User Data Signing In With Google: ", userData);
//       navigate("/");
//     } catch (error) {
//       console.log("Error Signing In With Google: ", error);
//     }
//   }

//   function handleGoogleSignInError() {
//     toast.error("Google Sign In Failed. Try again.");
//   }

//   console.log(isErrorLogin);

//   if (isLogingIn || isSigningInWithGoogle || isSigningUp) return <Loader />;

//   return (
//     <div className="h-full w-full mb-auto mt-[5rem] flex flex-col items-center gap-[3rem] max-w-lg mx-auto text-[1rem]">
//       <img src="./assets/logo.svg" alt="Logo" className="w-[2rem] h-[1.6rem]" />

//       <div className="bg-accent w-[20.5rem] sm:w-[25rem] px-7 py-11 font-light font-outfit rounded-xl">
//         <h2 className="text-secondary dark:text-white text-[2rem] capitalize">
//           {location.pathname === "/login" ? "Login" : "Sign Up"}
//         </h2>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="flex flex-col items-start"
//         >
//           <div className="flex flex-col gap-[1rem] mt-[1.5rem] mb-[2.5rem] w-full">
//             <div className="border-solid border-b-[1px] border-b-display px-3 py-3">
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 required
//                 className="bg-transparent w-full outline-none text-secondary dark:text-white opacity-[0.5]"
//                 {...register("email")}
//               />
//               {errors?.email && <span>{errors.email.message}</span>}
//             </div>

//             <div className="border-solid w-full border-b-[1px] border-b-display px-3 py-3">
//               <input
//                 type="password"
//                 placeholder="Password"
//                 required
//                 className="bg-inherit outline-none text-secondary dark:text-white opacity-[0.5]"
//                 {...register("password")}
//               />
//               {errors?.password && <span>{errors.password.message}</span>}
//             </div>

//             {location.pathname === "/signup" && (
//               <div className="border-solid border-b-[1px] border-b-display px-3 py-3">
//                 <input
//                   type="password"
//                   placeholder="Repeat Password"
//                   required
//                   className="bg-inherit w-full outline-none text-secondary dark:text-white opacity-[0.5]"
//                   {...register("passwordConfirm")}
//                 />
//                 {errors?.passwordConfirm && (
//                   <span>{errors.passwordConfirm.message}</span>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="w-full flex flex-col gap-3">
//             <button
//               type="submit"
//               className="bg-primary w-full text-secondary dark:text-white py-4 px-2 rounded-md"
//               disabled={isLogingIn || isSigningUp}
//             >
//               {location.pathname === "/login"
//                 ? "Login to your account"
//                 : "Create an account"}
//             </button>

//             <GoogleLogin
//               flow="auth-code"
//               onSuccess={handleGoogleSignInSuccess}
//               onError={handleGoogleSignInError}
//               nonce={nonce}
//               locale="en"
//             />
//           </div>

//           <div className="w-full flex gap-[1rem] mt-[1.5rem] text-center justify-center text-secondary dark:text-white">
//             <p>
//               {location.pathname === "/login"
//                 ? "Don't have an account?"
//                 : "Already have an account?"}
//             </p>
//             <Link
//               className="text-primary"
//               to={location.pathname === "/login" ? "/signup" : "/login"}
//             >
//               {location.pathname === "/login" ? "Sign Up" : "Login"}
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default LoginSignUpPage;
