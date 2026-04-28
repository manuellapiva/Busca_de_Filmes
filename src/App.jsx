import './App.css'
import { useState, useEffect } from 'react';

function App () {
  const [filme, setFilme] = useState('');
  const [lista, setLista] = useState([]);
  const [detalhes, setDetalhes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [temporada, setTemporada] = useState(1);

  useEffect(() => {
    const ultimo = localStorage.getItem('ultimaBusca');
    if (ultimo) setFilme(ultimo);
  }, []);

  return (
    <>
    
    </>
  )
}
export default App 