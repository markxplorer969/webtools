export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>404 - Page Not Found</h1>
        <p style={{ color: '#9CA3AF', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#3B82F6', 
            color: 'white', 
            borderRadius: '0.5rem',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}