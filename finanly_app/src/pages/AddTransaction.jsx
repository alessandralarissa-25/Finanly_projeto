import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createTransaction, getTransactions } from '@/lib/storage';

const categories = {
  despesa: [
    { id: 'lanche', label: 'Lanche', emoji: '🍔' },
    { id: 'transporte', label: 'Transporte', emoji: '🚌' },
    { id: 'lazer', label: 'Lazer', emoji: '🎮' },
    { id: 'roupas', label: 'Roupas', emoji: '👕' },
    { id: 'estudos', label: 'Estudos', emoji: '📚' },
    { id: 'outros', label: 'Outros', emoji: '📦' },
  ],
  receita: [
    { id: 'mesada', label: 'Mesada', emoji: '💵' },
    { id: 'trabalho', label: 'Trabalho', emoji: '💼' },
    { id: 'outros', label: 'Outros', emoji: '📦' },
  ],
};

export default function AddTransaction() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [type, setType] = useState('despesa');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => createTransaction(data),
    onSuccess: () => {
      queryClient.setQueryData(['transactions'], getTransactions());
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    },
  });

  const handleSubmit = () => {
    if (!amount || !category) return;
    mutation.mutate({
      type,
      amount: parseFloat(amount.replace(',', '.')),
      category,
      description,
      date: new Date().toISOString().split('T')[0],
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <CheckCircle className="w-20 h-20 text-green-500" />
        </motion.div>
        <p className="font-800 text-xl">Adicionado! 🎉</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-800">Nova Transação</h1>
      </div>

      <div className="flex gap-3 mb-6">
        {['receita', 'despesa'].map((t) => (
          <button
            key={t}
            onClick={() => { setType(t); setCategory(''); }}
            className={`flex-1 py-3 rounded-2xl font-700 text-sm transition-all ${
              type === t
                ? t === 'receita'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                  : 'bg-destructive text-white shadow-lg shadow-red-200'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {t === 'receita' ? '💰 Receita' : '💸 Despesa'}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="text-sm font-700 text-muted-foreground mb-2 block">Quanto?</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-800 text-muted-foreground">R$</span>
          <Input
            type="number"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-10 text-2xl font-800 h-16 rounded-2xl border-2 border-border focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-700 text-muted-foreground mb-3 block">Categoria</label>
        <div className="grid grid-cols-3 gap-2">
          {categories[type].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`p-3 rounded-2xl text-center transition-all border-2 ${
                category === cat.id
                  ? 'border-primary bg-primary/10'
                  : 'border-transparent bg-muted hover:bg-muted/70'
              }`}
            >
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <p className="text-xs font-700">{cat.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="text-sm font-700 text-muted-foreground mb-2 block">Descrição (opcional)</label>
        <Input
          placeholder="Ex: Burguer King com os amigos"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-2xl border-2"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!amount || !category || mutation.isPending}
        className="w-full h-14 rounded-2xl text-base font-800 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
      >
        {mutation.isPending ? 'Salvando...' : 'Salvar 🚀'}
      </Button>
    </div>
  );
}
