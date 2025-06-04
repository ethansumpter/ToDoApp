import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({ children }: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              {children}
            </div>
            <div className="bg-[#416FC5] relative hidden md:flex justify-center items-center">
              <img
                src="/authimg.png"
                alt="Authentication"
                className="object-contain w-[80%] h-auto dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}