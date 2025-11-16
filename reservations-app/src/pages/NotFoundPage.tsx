import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-6xl font-bold text-slate-900">404</h1>
        <h2 className="text-xl font-semibold text-slate-900">Page not found</h2>
        <p className="text-slate-600">The page you are looking for does not exist.</p>
      </div>

      <Button
        onClick={() => navigate('/')}
        className="flex items-center gap-2"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
