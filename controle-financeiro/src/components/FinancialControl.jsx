import React, { useState, useEffect } from 'react';
import './styles.css';

const FinancialControl = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('entrada');

  const [totals, setTotals] = useState({
    income: 0,
    expenses: 0,
    total: 0
  });

  useEffect(() => {
    calculateTotals();
  }, [transactions]);

  const calculateTotals = () => {
    const newTotals = transactions.reduce((acc, transaction) => {
      const value = Number(transaction.amount);
      if (transaction.type === 'entrada') {
        acc.income += value;
      } else {
        acc.expenses += value;
      }
      return acc;
    }, { income: 0, expenses: 0 });

    newTotals.total = newTotals.income - newTotals.expenses;
    setTotals(newTotals);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    setTransactions([
      ...transactions,
      { description, amount: Number(amount), type, id: Date.now() }
    ]);
    setDescription('');
    setAmount('');
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      <header className="header">
        <h1 className="title">Controle Financeiro</h1>
      </header>
      
      <main className="content">
        <div className="cards-container">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Entradas</h2>
            </div>
            <p className="card-value">{formatCurrency(totals.income)}</p>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Saídas</h2>
            </div>
            <p className="card-value">{formatCurrency(totals.expenses)}</p>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Total</h2>
              <span>$</span>
            </div>
            <p className={`card-value ${totals.total < 0 ? 'negative' : ''}`}>
              {formatCurrency(totals.total)}
            </p>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="form-label">Descrição</label>
              <input
                type="text"
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Valor</label>
              <input
                type="number"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="type"
                    value="entrada"
                    checked={type === 'entrada'}
                    onChange={(e) => setType(e.target.value)}
                  />
                  Entrada
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="type"
                    value="saida"
                    checked={type === 'saida'}
                    onChange={(e) => setType(e.target.value)}
                  />
                  Saída
                </label>
              </div>
            </div>

            <button type="submit" className="button">
              ADICIONAR
            </button>
          </form>
        </div>

        <div className="transactions">
          <table className="transaction-list">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="transaction-item">
                  <td>{transaction.description}</td>
                  <td>{formatCurrency(transaction.amount)}</td>
                  <td className="transaction-type">
                    {transaction.type === 'entrada' ? (
                      <svg viewBox="0 0 24 24" className="income-arrow">
                        <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="expense-arrow">
                        <path fill="currentColor" d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z"/>
                      </svg>
                    )}
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default FinancialControl;