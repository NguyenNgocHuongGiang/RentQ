import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VerifySuccess() {
  return (
    <div className="flex flex-col items-center justify-center px-20 py-10 bg-white z-10 rounded-2xl">
      <CheckCircle size={80} className="text-green-500" />
      <h1 className="text-2xl font-bold mt-4">Email Verified Successfully!</h1>
      <p className="text-gray-600 mt-2">You can now log in to your account.</p>
      <Link to="/auth/login" className="hover:cursor-pointer mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
        Go to Login
      </Link>
    </div>
  );
}