export default function ChakraIcon({
  size = 24,
  spin = false,
}: {
  size?: number;
  spin?: boolean;
}) {
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={spin ? { animation: "chakra-spin 2.5s linear infinite" } : undefined}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke="#1e3a8a" strokeWidth="4" />
      {spokes.map((deg) => (
        <line
          key={deg}
          x1="50"
          y1="50"
          x2="50"
          y2="8"
          stroke="#1e3a8a"
          strokeWidth="2.5"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="6" fill="#1e3a8a" />
    </svg>
  );
}
