// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;

type PageProps = { data?: any; config?: any };

export default function Page({ data, config }: PageProps) {
  // Placeholder image URL - you can replace this with your own image later
  const imageUrl = config?.imageUrl || 'https://bewebstudio.digitalauto.tech/data/projects/zf4QKxLfziBI/wizard.png';
  
  return (
    <div style={{
      minHeight: '500px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{
        width: '100%',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          <img 
            src={imageUrl} 
            alt="Wizard" 
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
    </div>
  );
}
