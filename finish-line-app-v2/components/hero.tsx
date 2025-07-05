import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex flex-col gap-8 text-center max-w-4xl mx-auto px-4">
        {/* Main headline */}
        <h1
          className="text-4xl md:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          style={{ fontFamily: "'Indigo', sans-serif" }}
        >
          Finish Line
        </h1>
        
        {/* Subheadline */}
        <h2 className="text-xl md:text-2xl text-muted-foreground font-medium">
          The ultimate collaborative task management platform for university students
        </h2>
        
        {/* Description */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your group projects from chaos to success. Organize tasks, track progress, 
          and collaborate seamlessly with your teammates to cross every finish line together.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
          <Button size="lg" className="px-8 py-3 text-lg">
            Get Started Free
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
            View Demo
          </Button>
        </div>
      </div>
      
      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <Card className="text-center">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-muted-foreground">
              Invite classmates, assign roles, and work together in real-time on your group projects.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Task Management</h3>
            <p className="text-muted-foreground">
              Break down projects into manageable tasks with deadlines, priorities, and progress tracking.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Academic Integration</h3>
            <p className="text-muted-foreground">
              Connect with your university schedule, sync deadlines, and never miss an important milestone.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Social proof */}
      <div className="text-center max-w-2xl mx-auto px-4">
        <p className="text-muted-foreground mb-6">
          Trusted by students at top universities worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="text-lg font-semibold">Stanford</div>
          <div className="text-lg font-semibold">MIT</div>
          <div className="text-lg font-semibold">Harvard</div>
          <div className="text-lg font-semibold">UC Berkeley</div>
          <div className="text-lg font-semibold">Oxford</div>
        </div>
      </div>
    </div>
  );
}
