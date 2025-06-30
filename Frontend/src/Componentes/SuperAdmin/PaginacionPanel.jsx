import React from 'react';

const PaginacionPanel = ({ paginaActual, totalPaginas, onChange }) => {
  if (totalPaginas <= 1) return null;
  return (
    <div className="panel-pagination">
      <button
        onClick={() => onChange(paginaActual - 1)}
        disabled={paginaActual === 1}
      >
        &lt;
      </button>
      {Array.from({ length: totalPaginas }, (_, i) => (
        <button
          key={i + 1}
          className={paginaActual === i + 1 ? 'active' : ''}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
      >
        &gt;
      </button>
    </div>
  );
};

export default PaginacionPanel;