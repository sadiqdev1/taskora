import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AlertError({ errors, title = 'Error' }) {
    if (!errors || (Array.isArray(errors) && errors.length === 0)) {
        return null;
    }

    const errorList = Array.isArray(errors) ? errors : [errors];

    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {errorList.length === 1 ? (
                    <p>{errorList[0]}</p>
                ) : (
                    <ul className="list-disc list-inside space-y-1">
                        {errorList.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
            </AlertDescription>
        </Alert>
    );
}
