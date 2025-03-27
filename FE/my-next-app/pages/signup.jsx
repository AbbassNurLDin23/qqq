import AuthForm from "../components/AuthForm";

const Signup = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <AuthForm formType="signup" />
    </div>
  );
};

export default Signup;
