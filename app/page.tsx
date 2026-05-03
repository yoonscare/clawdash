import Header from '@/components/layout/Header';
import CollaborationBoard from '@/components/widgets/CollaborationBoard';

export default function Home() {
  return (
    <main className="max-w-[1600px] mx-auto">
      <Header />
      <CollaborationBoard />
    </main>
  );
}
