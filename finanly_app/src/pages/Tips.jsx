import { motion } from 'framer-motion';

const tips = [
  {
    emoji: '🐷',
    title: 'Regra dos 50/30/20',
    color: 'bg-purple-100 border-purple-200',
    textColor: 'text-purple-700',
    content: 'Divida seu dinheiro em 3 partes: 50% para necessidades, 30% para lazer e 20% para guardar. Simples assim!',
  },
  {
    emoji: '☕',
    title: 'O efeito latte',
    color: 'bg-amber-100 border-amber-200',
    textColor: 'text-amber-700',
    content: 'Gastar R$5 todo dia no lanche = R$150/mês = R$1.800/ano. Pequenos gastos fazem grande diferença no bolso!',
  },
  {
    emoji: '🛍️',
    title: 'Compra por impulso',
    color: 'bg-pink-100 border-pink-200',
    textColor: 'text-pink-700',
    content: 'Antes de comprar algo que não estava planejado, espere 24 horas. Na maioria das vezes você vai perceber que não precisava tanto.',
  },
  {
    emoji: '🎯',
    title: 'Defina metas concretas',
    color: 'bg-blue-100 border-blue-200',
    textColor: 'text-blue-700',
    content: '"Quero economizar" é vago. "Vou guardar R$50 por semana para comprar um headset em 2 meses" é uma meta real!',
  },
  {
    emoji: '📱',
    title: 'Cuidado com assinaturas',
    color: 'bg-green-100 border-green-200',
    textColor: 'text-green-700',
    content: 'Streaming, jogos, apps… Some todas as suas assinaturas. Muita gente se surpreende com o total gasto por mês sem perceber.',
  },
  {
    emoji: '🤝',
    title: 'Divida com amigos',
    color: 'bg-cyan-100 border-cyan-200',
    textColor: 'text-cyan-700',
    content: 'Dividir assinaturas, caronas ou compras em grupo pode reduzir muito seus gastos mensais. Trabalho em equipe também vale no bolso!',
  },
  {
    emoji: '📈',
    title: 'Dinheiro parado perde valor',
    color: 'bg-violet-100 border-violet-200',
    textColor: 'text-violet-700',
    content: 'Com a inflação, guardar embaixo do colchão é prejuízo. Mesmo um cofrinho virtual que rende juros já é melhor que nada!',
  },
  {
    emoji: '🏆',
    title: 'Recompense seu progresso',
    color: 'bg-orange-100 border-orange-200',
    textColor: 'text-orange-700',
    content: 'Atingiu uma meta? Comemore de forma simples! Criar rituais de conquista te motiva a continuar economizando.',
  },
];

export default function Tips() {
  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="text-2xl font-900 mb-2">Dicas Financeiras 💡</h1>
      <p className="text-muted-foreground text-sm mb-6">Aprenda a cuidar do seu dinheiro desde jovem!</p>

      <div className="flex flex-col gap-4">
        {tips.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`rounded-3xl p-5 border-2 ${tip.color}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{tip.emoji}</span>
              <h3 className={`font-800 text-base ${tip.textColor}`}>{tip.title}</h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{tip.content}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl p-6 text-white text-center"
        style={{ background: 'linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(190, 80%, 50%) 100%)' }}>
        <p className="text-3xl mb-2">🚀</p>
        <p className="font-800 text-lg mb-1">Você está no caminho certo!</p>
        <p className="text-white/80 text-sm">Cuidar do dinheiro desde jovem é o segredo das pessoas bem-sucedidas. Continue assim!</p>
      </div>
    </div>
  );
}
