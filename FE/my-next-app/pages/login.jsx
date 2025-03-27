import AuthForm from "../components/AuthForm";

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <AuthForm formType="login" />
    </div>
  );
};

export default Login;
