import Header from '@/components/layout/Header';
import ClockWidget from '@/components/widgets/ClockWidget';
import WeatherCard from '@/components/widgets/WeatherCard';
import AgentOffice from '@/components/widgets/AgentOffice';
import ChatLog from '@/components/widgets/ChatLog';
import MissionTracker from '@/components/widgets/MissionTracker';
import HealthTracker from '@/components/widgets/HealthTracker';
import TaskTracker from '@/components/widgets/TaskTracker';
import AgentChat from '@/components/widgets/AgentChat';
import AutoresearchWidget from '@/components/widgets/AutoresearchWidget';
import RoleDashboard from '@/components/widgets/RoleDashboard';
import SecurityWidget from '@/components/widgets/SecurityWidget';

export default function Home() {
  return (
    <main className="max-w-[1600px] mx-auto">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        {/* Row 1: Clock + Weather (compact, side by side) */}
        <div className="lg:col-span-2">
          <ClockWidget />
        </div>
        <div className="lg:col-span-2">
          <WeatherCard />
        </div>

        {/* Row 2: AgentOffice (full width) */}
        <div className="lg:col-span-4">
          <AgentOffice />
        </div>

        {/* Row 2: AgentChat (full width) */}
        <div className="lg:col-span-4">
          <AgentChat />
        </div>

        {/* Row 3: RoleDashboard (full width) */}
        <div className="lg:col-span-4">
          <RoleDashboard />
        </div>

        {/* Row 4: ChatLog + MissionTracker + TaskTracker + HealthTracker */}
        <div className="lg:col-span-1">
          <ChatLog />
        </div>
        <div className="lg:col-span-1">
          <MissionTracker />
        </div>
        <div className="lg:col-span-1">
          <TaskTracker />
        </div>
        <div className="lg:col-span-1">
          <HealthTracker />
        </div>

        {/* Row 5: AutoresearchWidget + SecurityWidget */}
        <div className="lg:col-span-2">
          <AutoresearchWidget />
        </div>
        <div className="lg:col-span-2">
          <SecurityWidget />
        </div>
      </div>
    </main>
  );
}
