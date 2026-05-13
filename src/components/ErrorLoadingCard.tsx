import { CircleX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorLoadingCardProps {
  message?: string;
  className?: string;
}

const ErrorLoadingCard = ({
  message = "Error when loading your data.",
  className,
}: ErrorLoadingCardProps) => {
  return (
    <div className={cn("my-5 flex justify-center px-0", className)}>
      <Card className="w-full max-w-xl border-destructive/20 bg-gradient-to-b from-destructive/5 to-card shadow-sm">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <CircleX className="size-10" aria-hidden="true" />
          </div>
          <p className="mt-4 text-base font-semibold text-foreground">
            {message}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorLoadingCard;
