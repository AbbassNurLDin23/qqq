const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-4 border-t border-gray-200 mt-8">
      <p className="text-gray-600">
        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
