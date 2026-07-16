import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background font-nunito">
      <main className="max-w-lg mx-auto pb-24 min-h-screen">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
