import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const isAuthenticated =
    typeof window !== "undefined" && localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center border-b border-gray-200">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        MyApp
      </Link>
      <nav className="flex space-x-4">
        {isAuthenticated && (
          <Link
            href="/cart"
            className="text-gray-800 hover:text-blue-600 transition"
          >
            Cart
          </Link>
        )}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="text-gray-800 hover:text-red-500 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="text-gray-800 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-gray-800 hover:text-blue-600 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
