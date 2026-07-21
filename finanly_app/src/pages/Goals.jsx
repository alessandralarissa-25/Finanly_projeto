import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createGoal, deleteGoal, getGoals, updateGoal } from '@/lib/storage';

const emojis = ['🎮', '👟', '📱', '🎵', '🚴', '✈️', '📚', '🎨', '🍕', '💻'];

export default function Goals() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [addingTo, setAddingTo] = useState(null);
  const [addAmount, setAddAmount] = useState('');

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => getGoals(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => createGoal(data),
    onSuccess: () => {
      queryClient.setQueryData(['goals'], getGoals());
      setShowForm(false);
      setTitle('');
      setTarget('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateGoal(id, data),
    onSuccess: () => {
      queryClient.setQueryData(['goals'], getGoals());
      setAddingTo(null);
      setAddAmount('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteGoal(id),
    onSuccess: () => {
      queryClient.setQueryData(['goals'], getGoals());
    },
  });

  const handleAddMoney = (goal) => {
    const val = parseFloat(addAmount);
    if (!val) return;
    const newSaved = (goal.saved_amount || 0) + val;
    updateMutation.mutate({
      id: goal.id,
      data: { saved_amount: newSaved },
    });
  };

  const fmt = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-900">Minhas Metas 🎯</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-md"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-card rounded-3xl p-5 mb-6 border-2 border-primary/20 shadow-lg"
        >
          <h3 className="font-800 mb-4">Nova meta de economia</h3>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {emojis.map((e) => (
              <button key={e} onClick={() => setEmoji(e)}
                className={`text-2xl py-2 rounded-xl transition-all ${emoji === e ? 'bg-primary/20 scale-110' : 'bg-muted'}`}>
                {e}
              </button>
            ))}
          </div>
          <Input placeholder="Nome da meta (ex: Novo tênis 👟)" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-2xl mb-3" />
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-700 text-muted-foreground">R$</span>
            <Input type="number" placeholder="Valor total" value={target} onChange={(e) => setTarget(e.target.value)} className="pl-10 rounded-2xl" />
          </div>
          <Button onClick={() => createMutation.mutate({ title, target_amount: parseFloat(target), emoji, saved_amount: 0 })}
            disabled={!title || !target} className="w-full rounded-2xl">
            Criar Meta 🚀
          </Button>
        </motion.div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-600">Nenhuma meta ainda</p>
          <p className="text-sm">Crie sua primeira meta de economia!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {goals.map((goal, i) => {
            const pct = Math.min(((goal.saved_amount || 0) / goal.target_amount) * 100, 100);
            return (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`rounded-3xl p-5 border-2 ${goal.completed ? 'border-green-300 bg-green-50' : 'border-border bg-card'} shadow-sm`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{goal.emoji || '🎯'}</span>
                    <div>
                      <p className="font-800">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">{fmt(goal.saved_amount || 0)} de {fmt(goal.target_amount)}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteMutation.mutate(goal.id)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${goal.completed ? 'bg-green-500' : 'bg-primary'}`}
                  />
                </div>

                {goal.completed ? (
                  <p className="text-green-600 font-800 text-center text-sm">🏆 Meta conquistada! Parabéns!</p>
                ) : (
                  addingTo === goal.id ? (
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Valor" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className="rounded-xl" />
                      <Button onClick={() => handleAddMoney(goal)} className="rounded-xl px-3">✓</Button>
                      <Button variant="outline" onClick={() => setAddingTo(null)} className="rounded-xl px-3">✕</Button>
                    </div>
                  ) : (
                    <button onClick={() => setAddingTo(goal.id)}
                      className="w-full py-2 text-sm font-700 text-primary bg-primary/10 rounded-2xl hover:bg-primary/20 transition-colors">
                      + Adicionar dinheiro
                    </button>
                  )
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
