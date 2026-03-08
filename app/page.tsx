import Header from '@/components/layout/Header';
import DashboardGrid from '@/components/layout/DashboardGrid';
import ClockWidget from '@/components/widgets/ClockWidget';
import WeatherCard from '@/components/widgets/WeatherCard';
import AgentStatus from '@/components/widgets/AgentStatus';
import QuickNote from '@/components/widgets/QuickNote';
import CalendarWidget from '@/components/widgets/CalendarWidget';
import CronMonitor from '@/components/widgets/CronMonitor';
import ChatLog from '@/components/widgets/ChatLog';
import MissionTracker from '@/components/widgets/MissionTracker';
import TodoList from '@/components/widgets/TodoList';
import AIDigest from '@/components/widgets/AIDigest';
import HealthTracker from '@/components/widgets/HealthTracker';
import TaskTracker from '@/components/widgets/TaskTracker';
import DocsViewer from '@/components/widgets/DocsViewer';
import AgentChat from '@/components/widgets/AgentChat';

export default function Home() {
  return (
    <main className="max-w-[1600px] mx-auto">
      <Header />
      <DashboardGrid>
        <ClockWidget />
        <WeatherCard />
        <AgentStatus />
        <TodoList />
        <TaskTracker />
        <HealthTracker />
        <CalendarWidget />
        <ChatLog />
        <AgentChat />
        <MissionTracker />
        <DocsViewer />
        <QuickNote />
        <CronMonitor />
        <AIDigest />
      </DashboardGrid>
    </main>
  );
}
