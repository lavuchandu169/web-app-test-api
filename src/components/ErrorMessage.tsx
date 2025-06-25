
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <Card className="space-card p-6 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <div className="text-6xl">🚫</div>
        <h3 className="text-xl font-bold text-red-400">Houston, we have a problem!</h3>
        <p className="text-muted-foreground">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className="cosmic-button">
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ErrorMessage;
