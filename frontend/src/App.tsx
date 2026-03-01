import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ChatPage from "./pages/ChatPage";
import InterviewPage from "./pages/InterviewPage";
import ResumePage from "./pages/ResumePage";
import CoverLetterPage from "./pages/CoverLetterPage";
import RoadmapPage from "./pages/RoadmapPage";
import JobFinderPage from "./pages/JobFinderPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="interview" element={<InterviewPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="cover-letter" element={<CoverLetterPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="jobs" element={<JobFinderPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
