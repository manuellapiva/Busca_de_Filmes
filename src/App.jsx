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

        <input
        type="number"
        min="1"
        placeholder="Digite a temporada (somente para séries)"
        value={temporada}
        onChange={(e) => setTemporada(e.target.value)}
      />

        <div className="botoes">
        <button onClick={buscarFilmes} disabled={loading}>
          {loading ? 'Carregando...' : 'Buscar'}
        </button>

        <button onClick={limparBusca}>Limpar</button>
      </div> 
      {loading && <p>⌛ Carregando...</p>}
      {erro && <p>❌ {erro}</p>}

            <div className="lista">
        {lista.map((item, index) => (
          <div
            className="card"
            key={index}
            onClick={() => buscarDetalhes(item["#IMDB_ID"])}
          >
            <img
              src={
                item["#IMG_POSTER"] && item["#IMG_POSTER"] !== "N/A"
                  ? item["#IMG_POSTER"]
                  : "https://via.placeholder.com/150"
              }
              alt={item["#TITLE"]}
            />

            <p><strong>Título : {item["#TITLE"]}</strong></p>
            <p><b>Ano : </b>{item["#YEAR"]}</p>
            <p><b>Atores : </b>{item["#ACTORS"]}</p>
          </div>
        ))}
      </div>
      {detalhes && (
        <div className="detalhes">
          <h2>🎬 Detalhes</h2>

          <img
            src={detalhes?.image || "https://via.placeholder.com/200"}
            alt={detalhes?.name}
          />

          <p><strong>{detalhes.name}</strong></p>
          <p>{detalhes.description}</p>

          <a href={detalhes.url} target="_blank" rel="noreferrer">
            Ver no IMDb
          </a>
          {detalhes?.review && (
            <div className="review">
              <h3>⭐ Review ⭐</h3>
              <p><strong>Autor:</strong> {detalhes.review.author}</p>
              <p>{detalhes.review.content}</p>
              <p><strong>Nota:</strong> {detalhes.review.rating}</p>
            </div>
          )}
        </div>
      )}
      </div>
    </>
  )
}
export default App 