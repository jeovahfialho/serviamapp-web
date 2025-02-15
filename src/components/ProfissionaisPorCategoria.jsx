import React from 'react';
import { Users } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

const COLORS = [
  '#2563eb', // blue-600
  '#7c3aed', // violet-600
  '#db2777', // pink-600
  '#ea580c', // orange-600
  '#059669', // emerald-600
  '#dc2626', // red-600
  '#ca8a04', // yellow-600
  '#0891b2', // cyan-600
  '#9333ea', // purple-600
  '#16a34a', // green-600
  '#4f46e5', // indigo-600
  '#be123c', // rose-600
];

const ProfissionaisPorCategoria = ({ profissionais, setProfissionaisFiltrados }) => {
  // Prepara dados para o gráfico
  const categoriasProfissionais = Object.entries(_.groupBy(profissionais, 'tipo'))
    .sort((a, b) => b[1].length - a[1].length);

  const dadosGrafico = categoriasProfissionais.map(([tipo, profs], index) => ({
    name: tipo,
    value: profs.length,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <Users className="h-5 w-5 text-blue-500 mr-2" />
        Profissionais por Categoria
      </h3>
      
      <div className="h-96 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dadosGrafico}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                name
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius * 1.4;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                // Pontos da linha conectora
                const lineX1 = cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN);
                const lineY1 = cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN);
                const lineX2 = cx + (radius - 10) * Math.cos(-midAngle * RADIAN);
                const lineY2 = cy + (radius - 10) * Math.sin(-midAngle * RADIAN);

                return (
                  <g>
                    <path
                      d={`M ${lineX1},${lineY1} L ${lineX2},${lineY2}`}
                      stroke="#999"
                      fill="none"
                      strokeWidth={1}
                    />
                    <text
                      x={x}
                      y={y}
                      fill="#333"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      className="text-xs font-medium"
                    >
                      {name} ({value})
                    </text>
                  </g>
                );
              }}
              onClick={(data) => {
                setProfissionaisFiltrados(profissionais.filter(p => p.tipo === data.name));
              }}
            >
              {dadosGrafico.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white shadow-lg rounded-lg p-3 text-sm">
                      <p className="font-medium">{payload[0].name}</p>
                      <p className="text-gray-600">{payload[0].value} profissionais</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {dadosGrafico.map((entry) => (
          <button
            key={entry.name}
            onClick={() => setProfissionaisFiltrados(profissionais.filter(p => p.tipo === entry.name))}
            className="flex items-center space-x-2 text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}</span>
            <span className="font-medium">{entry.value}</span>
          </button>
        ))}
      </div>

      {/* Botão para resetar filtros */}
      <button
        onClick={() => setProfissionaisFiltrados(profissionais)}
        className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors"
      >
        Limpar Filtros
      </button>
    </div>
  );
};

export default ProfissionaisPorCategoria;