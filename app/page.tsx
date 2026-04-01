import Header from '@/components/layout/Header';
import ClockWidget from '@/components/widgets/ClockWidget';
import WeatherCard from '@/components/widgets/WeatherCard';
import AgentOffice from '@/components/widgets/AgentOffice';
import QuickNote from '@/components/widgets/QuickNote';
import ChatLog from '@/components/widgets/ChatLog';
import MissionTracker from '@/components/widgets/MissionTracker';
import TodoList from '@/components/widgets/TodoList';
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 p-3">
        {/* Row 1: Clock+Weather (1col) + AgentOffice (3col) */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <ClockWidget />
          <WeatherCard />
        </div>
        <div className="lg:col-span-3">
          <AgentOffice />
        </div>

        {/* Row 2: AgentChat - 에이전트 대화 (전체 너비) */}
        <div className="lg:col-span-4">
          <AgentChat />
        </div>

        {/* Row 3: TodoList (1col) + ChatLog (1col) + MissionTracker (1col) + TaskTracker (1col) */}
        <div className="lg:col-span-1">
          <TodoList />
        </div>
        <div className="lg:col-span-1">
          <ChatLog />
        </div>
        <div className="lg:col-span-1">
          <MissionTracker />
        </div>
        <div className="lg:col-span-1">
          <TaskTracker />
        </div>

        {/* Row 4: QuickNote (1col) + HealthTracker (1col) + AutoresearchWidget (1col) + SecurityWidget (1col) */}
        <div className="lg:col-span-1">
          <QuickNote />
        </div>
        <div className="lg:col-span-1">
          <HealthTracker />
        </div>
        <div className="lg:col-span-1">
          <AutoresearchWidget />
        </div>
        <div className="lg:col-span-1">
          <SecurityWidget />
        </div>

        {/* Row 5: RoleDashboard (full width) */}
        <div className="lg:col-span-4">
          <RoleDashboard />
        </div>
      </div>
    </main>
  );
}
