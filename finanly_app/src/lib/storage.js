const STORAGE_KEYS = {
  user: 'finanly_user',
  transactions: 'finanly_transactions',
  goals: 'finanly_goals',
};

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

const readStorage = (key, fallback) => {
  const storage = getStorage();
  if (!storage) return fallback;

  try {
    const rawValue = storage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    console.warn(`Unable to read ${key} from storage`, error);
    return fallback;
  }
};

const writeStorage = (key, value) => {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(key, JSON.stringify(value));
};

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getStoredUser = () => readStorage(STORAGE_KEYS.user, null);
export const saveStoredUser = (user) => writeStorage(STORAGE_KEYS.user, user);
export const clearStoredUser = () => {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(STORAGE_KEYS.user);
};

export const getTransactions = () => readStorage(STORAGE_KEYS.transactions, []);
export const saveTransactions = (transactions) => writeStorage(STORAGE_KEYS.transactions, transactions);
export const createTransaction = (data) => {
  const transaction = {
    id: createId(),
    date: data.date || new Date().toISOString().split('T')[0],
    amount: Number(data.amount) || 0,
    category: data.category || 'outros',
    description: data.description || '',
    type: data.type || 'despesa',
  };

  const transactions = [...getTransactions(), transaction];
  saveTransactions(transactions);
  return transaction;
};

export const deleteTransaction = (id) => {
  const transactions = getTransactions().filter((transaction) => transaction.id !== id);
  saveTransactions(transactions);
  return transactions;
};

export const getGoals = () => readStorage(STORAGE_KEYS.goals, []);
export const saveGoals = (goals) => writeStorage(STORAGE_KEYS.goals, goals);
export const createGoal = (data) => {
  const goal = {
    id: createId(),
    title: data.title || 'Nova meta',
    target_amount: Number(data.target_amount) || 0,
    saved_amount: Number(data.saved_amount) || 0,
    emoji: data.emoji || '🎯',
    completed: (Number(data.saved_amount) || 0) >= (Number(data.target_amount) || 0),
    created_date: new Date().toISOString(),
  };

  const goals = [...getGoals(), goal];
  saveGoals(goals);
  return goal;
};

export const updateGoal = (id, updates) => {
  const goals = getGoals().map((goal) => {
    if (goal.id !== id) return goal;

    const nextGoal = { ...goal, ...updates };
    if (typeof nextGoal.saved_amount === 'number' && typeof nextGoal.target_amount === 'number') {
      nextGoal.completed = nextGoal.saved_amount >= nextGoal.target_amount;
    }

    return nextGoal;
  });

  saveGoals(goals);
  return goals.find((goal) => goal.id === id);
};

export const deleteGoal = (id) => {
  const goals = getGoals().filter((goal) => goal.id !== id);
  saveGoals(goals);
  return goals;
};
