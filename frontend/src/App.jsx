import { useState } from 'react';

const initialForm = { N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '' };
const fields = [
  { name: 'N', label: 'Nitrogênio (N)', hint: 'Quantidade no solo, em kg/ha' },
  { name: 'P', label: 'Fósforo (P)', hint: 'Quantidade no solo, em kg/ha' },
  { name: 'K', label: 'Potássio (K)', hint: 'Quantidade no solo, em kg/ha' },
  { name: 'temperature', label: 'Temperatura', hint: 'Temperatura média, em °C' },
  { name: 'humidity', label: 'Umidade', hint: 'Umidade relativa, em %' },
  { name: 'ph', label: 'pH do solo', hint: 'Acidez ou alcalinidade do solo' },
  { name: 'rainfall', label: 'Chuva', hint: 'Precipitação, em mm' },
];

function App() {
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const payload = Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, Number(value)]));
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const details = await response.json().catch(() => null);
        throw new Error(details?.detail || 'Não foi possível obter a recomendação.');
      }
      setResult(await response.json());
    } catch (err) {
      setError(err.message || 'Não foi possível conectar à API. Verifique se o servidor está ativo.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData(initialForm);
    setResult(null);
    setError('');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container brand-row">
          <div className="brand-mark" aria-hidden="true">🌱</div>
          <div><p className="eyebrow">AGRICULTURA INTELIGENTE</p><h1>RecomendaCultura</h1></div>
        </div>
      </header>

      <main className="container page-content">
        <section className="intro">
          <p className="eyebrow">RECOMENDAÇÃO DE CULTURAS</p>
          <h2>Encontre a cultura ideal para o seu solo.</h2>
          <p>Informe as condições do solo e do clima. Nosso modelo analisa os dados e sugere a cultura mais adequada.</p>
        </section>

        <div className="content-grid">
          <section className="panel form-panel">
            <div className="panel-heading"><div><h3>Condições da plantação</h3><p>Preencha os sete indicadores para receber uma recomendação.</p></div><span className="step-badge">7 dados</span></div>
            <form onSubmit={handleSubmit}>
              <div className="field-grid">
                {fields.map(({ name, label, hint }) => (
                  <div className="field" key={name}>
                    <label htmlFor={name}>{label}</label>
                    <input id={name} name={name} type="number" step="any" value={formData[name]} onChange={handleChange} placeholder="0,0" required />
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
              <div className="form-actions">
                <button className="button-primary" type="submit" disabled={loading}>{loading ? 'Analisando…' : 'Descobrir cultura'}</button>
                <button className="button-secondary" type="button" onClick={resetForm}>Limpar</button>
              </div>
            </form>
          </section>

          <aside className="panel result-panel" aria-live="polite">
            <div className="result-icon" aria-hidden="true">🌾</div>
            <p className="eyebrow">SUA RECOMENDAÇÃO</p>
            {result ? <>
              <h3 className="crop-name">{String(result.crop).replaceAll('_', ' ')}</h3>
              <p className="result-copy">Esta cultura apresentou a melhor compatibilidade com as condições informadas.</p>
              <div className="confidence"><div className="confidence-label"><span>Confiança do modelo</span><strong>{result.confidence}%</strong></div><div className="progress-track"><span style={{ width: `${Math.max(0, Math.min(100, result.confidence))}%` }} /></div></div>
            </> : error ? <div className="message-error" role="alert">{error}</div> : <>
              <h3>Aguardando seus dados</h3><p className="result-copy">A recomendação aparecerá aqui depois que você preencher o formulário.</p>
            </>}
            <div className="result-note">A sugestão é uma estimativa baseada nos dados fornecidos. Considere também fatores locais e orientação agronômica.</div>
          </aside>
        </div>
        <footer>RecomendaCultura <span>•</span> Apoio à decisão no campo</footer>
      </main>
    </div>
  );
}

export default App;
