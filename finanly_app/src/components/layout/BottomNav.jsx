import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Target, Lightbulb, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Início' },
  { path: '/transacoes', icon: BarChart2, label: 'Gastos' },
  { path: '/adicionar', icon: PlusCircle, label: 'Adicionar' },
  { path: '/metas', icon: Target, label: 'Metas' },
  { path: '/dicas', icon: Lightbulb, label: 'Dicas' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          const isAdd = path === '/adicionar';
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200',
                isAdd
                  ? 'bg-primary text-primary-foreground -mt-5 shadow-lg shadow-primary/40 rounded-2xl p-3'
                  : isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <Icon className={cn('w-5 h-5', isAdd && 'w-6 h-6')} />
              {!isAdd && <span className="text-[10px] font-700">{label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
