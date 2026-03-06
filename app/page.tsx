import Header from '@/components/layout/Header';
import DashboardGrid from '@/components/layout/DashboardGrid';
import ClockWidget from '@/components/widgets/ClockWidget';
import WeatherCard from '@/components/widgets/WeatherCard';
import CryptoTracker from '@/components/widgets/CryptoTracker';
import GlucoseMonitor from '@/components/widgets/GlucoseMonitor';
import AppleHealthSync from '@/components/widgets/AppleHealthSync';
import NewsFeed from '@/components/widgets/NewsFeed';
import AgentStatus from '@/components/widgets/AgentStatus';
import CronMonitor from '@/components/widgets/CronMonitor';
import QuickNote from '@/components/widgets/QuickNote';
import CalendarWidget from '@/components/widgets/CalendarWidget';

export default function Home() {
  return (
    <main className="max-w-[1600px] mx-auto">
      <Header />
      <DashboardGrid>
        <ClockWidget />
        <WeatherCard />
        <AgentStatus />
        <QuickNote />
        <AppleHealthSync />
        <CronMonitor />
        <CalendarWidget />
        <CryptoTracker />
        <GlucoseMonitor />
        <NewsFeed />
      </DashboardGrid>
    </main>
  );
}
