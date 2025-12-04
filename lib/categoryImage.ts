export function svgForCategory(name: string, size = 600) {
  const colors = [
    "#F59E0B", "#06B6D4", "#7C3AED", "#EF4444",
    "#10B981", "#F472B6", "#FB923C", "#60A5FA"
  ];

  const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const bg = colors[hash % colors.length];

  const initials = (name.split(" ").slice(0, 2).map(s => s[0]).join("")).toUpperCase();

  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
      <rect width='100%' height='100%' rx='24' fill='${bg}' />
      <text x='50%' y='50%' font-size='${size * 0.18}'
        fill='white' font-family='Inter, Arial' text-anchor='middle'
        dominant-baseline='central' font-weight='700'
      >
        ${initials}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
