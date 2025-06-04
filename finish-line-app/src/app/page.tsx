import { Button } from "@/components/ui/button"

export default function HeroPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to Finish Line
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Make it easier to manage your uni group projects today!
        </p>
        <div className="flex justify-center gap-4">
          <Button className="px-6 py-3 text-lg font-semibold rounded-full bg-white text-blue-600 hover:bg-gray-200">
            Create a Board
          </Button>
        </div>
      </div>
    </div>
  );
}
