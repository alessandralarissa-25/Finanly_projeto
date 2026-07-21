import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { deleteTransaction, getTransactions } from '@/lib/storage';

const categoryEmoji = {
  lanche: '🍔', transporte: '🚌', lazer: '🎮', roupas: '👕',
  estudos: '📚', mesada: '💵', trabalho: '💼', outros: '📦'
};

const COLORS = ['#7C3AED', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6', '#EC4899', '#6B7280'];

export default function Transactions() {
  const queryClient = useQueryClient();
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => getTransactions(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.setQueryData(['transactions'], getTransactions());
    },
  });

  const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const despesas = transactions.filter((t) => t.type === 'despesa');
  const chartData = Object.entries(
    despesas.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-900 mb-6">Meus Gastos 📊</h1>

      {chartData.length > 0 && (
        <div className="bg-card rounded-3xl p-4 mb-6 shadow-sm border border-border">
          <p className="font-700 text-sm mb-3 text-muted-foreground">Gastos por categoria</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name }) => categoryEmoji[name]}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend formatter={(v) => `${categoryEmoji[v] || '📦'} ${v}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-600">Nenhuma transação ainda</p>
          </div>
        ) : (
          transactions.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
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
              <div className="flex items-center gap-3">
                <p className={`font-800 text-sm ${t.type === 'receita' ? 'text-green-500' : 'text-destructive'}`}>
                  {t.type === 'receita' ? '+' : '-'}{fmt(t.amount)}
                </p>
                <button
                  onClick={() => deleteMutation.mutate(t.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
