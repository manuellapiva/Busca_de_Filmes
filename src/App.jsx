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

    const buscarFilmes = async () => {
    if (!filme.trim()) return;

    setLoading(true);
    setErro(null);
    setLista([]);
    setDetalhes(null);

    try {
      const res = await fetch(
        `https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(filme)}`
      );

      if (!res.ok) throw new Error('Erro na requisição');

      const data = await res.json();

      if (!data.description || data.description.length === 0) {
        throw new Error('Nenhum resultado encontrado');
      }

      setLista(data.description);
      localStorage.setItem('ultimaBusca', filme);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

    const buscarDetalhes = async (id) => {
    setLoading(true);
    setErro(null);

    try {
      const res = await fetch(
        `https://imdb.iamidiotareyoutoo.com/search?tt=${id}&lsn=${temporada}`
      );

      if (!res.ok) throw new Error('Erro ao buscar detalhes');

      const data = await res.json();
      setDetalhes(data);

    } catch (err) {
      setErro('Erro ao carregar detalhes', err.message);
    } finally {
      setLoading(false);
    }
  };

    const limparBusca = () => {
    setFilme('');
    setLista([]);
    setDetalhes(null);
    setErro(null);
  };

  return (
    <>
      <div className="container">
        <div className="titulo">
          <h1>🎞️ BUSCA DE FILMES 🎞️</h1>
        </div>

        <input
          type="text"
          placeholder="Digite o nome do filme..."
          value={filme}
          onChange={(e) => setFilme(e.target.value)}
        />
      </div>
    </>
  )
}
export default App 