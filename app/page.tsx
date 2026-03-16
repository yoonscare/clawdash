import Header from '@/components/layout/Header';
import DashboardGrid from '@/components/layout/DashboardGrid';
import ClockWidget from '@/components/widgets/ClockWidget';
import WeatherCard from '@/components/widgets/WeatherCard';
import AgentOffice from '@/components/widgets/AgentOffice';
import QuickNote from '@/components/widgets/QuickNote';
import CalendarWidget from '@/components/widgets/CalendarWidget';
import CronMonitor from '@/components/widgets/CronMonitor';
import ChatLog from '@/components/widgets/ChatLog';
import MissionTracker from '@/components/widgets/MissionTracker';
import TodoList from '@/components/widgets/TodoList';
import AIDigest from '@/components/widgets/AIDigest';
import HealthTracker from '@/components/widgets/HealthTracker';
import TaskTracker from '@/components/widgets/TaskTracker';
import AgentChat from '@/components/widgets/AgentChat';

export default function Home() {
  return (
    <main className="max-w-[1600px] mx-auto">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 p-3">
        {/* Row 1: Clock+Weather (1col) + AgentOffice (3col) */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <ClockWidget />
          <WeatherCard />
        </div>
        <div className="lg:col-span-3">
          <AgentOffice />
        </div>

        {/* Row 2: TodoList (1col) + AgentChat (2col) + TaskTracker (1col) */}
        <div className="lg:col-span-1">
          <TodoList />
        </div>
        <div className="lg:col-span-2">
          <AgentChat />
        </div>
        <div className="lg:col-span-1">
          <TaskTracker />
        </div>

        {/* Row 3: Calendar (1col) + ChatLog (1col) + MissionTracker (1col) + QuickNote (1col) */}
        <div className="lg:col-span-1">
          <CalendarWidget />
        </div>
        <div className="lg:col-span-1">
          <ChatLog />
        </div>
        <div className="lg:col-span-1">
          <MissionTracker />
        </div>
        <div className="lg:col-span-1">
          <QuickNote />
        </div>

        {/* Row 4: CronMonitor (1col) + AIDigest (2col) + HealthTracker (1col) */}
        <div className="lg:col-span-1">
          <CronMonitor />
        </div>
        <div className="lg:col-span-2">
          <AIDigest />
        </div>
        <div className="lg:col-span-1">
          <HealthTracker />
        </div>
      </div>
    </main>
  );
}
