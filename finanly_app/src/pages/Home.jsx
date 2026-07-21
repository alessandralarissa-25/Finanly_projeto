import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getTransactions } from '@/lib/storage';

const categoryEmoji = {
  lanche: '🍔', transporte: '🚌', lazer: '🎮', roupas: '👕',
  estudos: '📚', mesada: '💵', trabalho: '💼', outros: '📦'
};

export default function Home() {
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => getTransactions(),
  });

  const receitas = transactions.filter((t) => t.type === 'receita').reduce((s, t) => s + t.amount, 0);
  const despesas = transactions.filter((t) => t.type === 'despesa').reduce((s, t) => s + t.amount, 0);
  const saldo = receitas - despesas;

  const recent = transactions.slice(0, 5);

  const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground text-sm font-semibold">Olá, jovem! 👋</p>
          <h1 className="text-2xl font-900 text-foreground">Meu Dinheiro</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Star className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 mb-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(190, 80%, 50%) 100%)' }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-6" />
        <p className="text-white/80 text-sm font-semibold mb-1">Saldo atual</p>
        <p className="text-4xl font-900">{fmt(saldo)}</p>
        <p className="text-white/70 text-xs mt-2">
          {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
        </p>

        <div className="flex gap-4 mt-5">
          <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2">
            <TrendingUp className="w-4 h-4" />
            <div>
              <p className="text-white/70 text-[10px]">Entradas</p>
              <p className="font-800 text-sm">{fmt(receitas)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2">
            <TrendingDown className="w-4 h-4" />
            <div>
              <p className="text-white/70 text-[10px]">Saídas</p>
              <p className="font-800 text-sm">{fmt(despesas)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-accent/20 border border-accent/30 rounded-2xl p-4 mb-6 flex gap-3 items-start"
      >
        <span className="text-2xl">💡</span>
        <div>
          <p className="font-700 text-sm text-foreground">Dica do dia</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Antes de comprar algo, espere 24 horas. Se ainda quiser, aí sim vale a pena! ✨
          </p>
        </div>
      </motion.div>

      <div className="mb-4">
        <h2 className="font-800 text-base mb-3">Últimas movimentações</h2>
        {recent.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-600">Nenhuma transação ainda</p>
            <p className="text-sm">Toque em + para adicionar!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg">
                    {categoryEmoji[t.category] || '📦'}
                  </div>
                  <div>
                    <p className="font-700 text-sm capitalize">{t.description || t.category}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                </div>
                <p className={`font-800 text-sm ${t.type === 'receita' ? 'text-green-500' : 'text-destructive'}`}>
                  {t.type === 'receita' ? '+' : '-'}{fmt(t.amount)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
