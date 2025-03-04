import React from 'react';
import { Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

// Gradiente moderno de azul
const CustomBar = ({ x, y, width, height, fill }) => {
  return (
    <g>
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="url(#barGradient)"
        rx={4}
        ry={4}
        className="transition-all duration-300 hover:opacity-80"
        style={{ cursor: 'pointer' }}
      />
    </g>
  );
};

const ProfissionaisPorCategoria = ({ profissionais, setProfissionaisFiltrados }) => {
  // Preparar dados para o gráfico
  const categoriasProfissionais = Object.entries(_.groupBy(profissionais, 'tipo'))
    .map(([tipo, profs]) => ({
      categoria: tipo,
      quantidade: profs.length
    }))
    .sort((a, b) => b.quantidade - a.quantidade);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium text-gray-800">{payload[0].payload.categoria}</p>
          <p className="text-blue-600 font-medium">
            {payload[0].value} profissionais
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      {/* Cabeçalho */}
      <div className="flex items-center mb-6">
        <Users className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="font-semibold text-lg">Profissionais por Categoria</h3>
      </div>

      {/* Gráfico */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoriasProfissionais}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            barSize={24}
          >
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="categoria" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: '#6b7280',
                fontSize: 12,
                fontWeight: 500
              }}
              width={150}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'transparent' }}
            />
            <Bar
              dataKey="quantidade"
              shape={<CustomBar />}
              onClick={(data) => {
                setProfissionaisFiltrados(
                  profissionais.filter(p => p.tipo === data.categoria)
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Botão para resetar filtros */}
      <button
        onClick={() => setProfissionaisFiltrados(profissionais)}
        className="mt-6 w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg
                   hover:bg-blue-50 transition-colors duration-200 font-medium"
      >
        Limpar Filtros
      </button>
    </div>
  );
};

export default ProfissionaisPorCategoria;