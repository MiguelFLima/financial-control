import GlobalStyle from '../styles/globals';
import Head from 'next/head';
import Header  from '../components/Header';
import Resume from '../components/Resumo';
import Form from '../components/Form';
import { useState, useEffect } from 'react';



function MyApp({ Component, pageProps }) {

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [total, setTotal] = useState(0);
  const [transactionsList, setTransactionsList] = useState([]);
  
  useEffect(() => {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER)  {
      const data = localStorage.getItem('transactions')
      setTransactionsList( data ? JSON.parse(data) : [])
    };
  }, [])

  useEffect(() => {
    const amountExpense = transactionsList
      .filter((item) => item.expense)
      .map((transaction) => Number(transaction.amount));
    const amountIncome = transactionsList
      .filter((item) => !item.expense)
      .map((transaction) => Number(transaction.amount));

      const expense = amountExpense.reduce((acc, cur) => acc + cur, 0).toFixed(2);
      const income = amountIncome.reduce((acc, cur) => acc + cur, 0).toFixed(2);

      const total = Math.abs(income - expense).toFixed(2);

      setIncome(`RS ${income}`);
      setExpense(`RS ${expense}`);
      setTotal(`${Number(income) < Number(expense) ? "-" : ''} RS ${total}`);
  },[transactionsList]);

  const handleAdd = (transaction) => {
    const newArrayTransaction = [...transactionsList, transaction];

    setTransactionsList(newArrayTransaction);
    localStorage.setItem('transactions', JSON.stringify(newArrayTransaction));
  }

  

  return (
      <>
        <GlobalStyle />
        <Head>
          <title>Financial │ Control</title>
        </Head>
        <Header />
        <Resume income={income} expense={expense} total={total} />
        <Form handleAdd={handleAdd} transactionsList={transactionsList} setTransactionsList={setTransactionsList}/>
        <Component {...pageProps} />
      </>
    )
}

export default MyApp;
