'use client'

import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '400px',
        width: '100%',
        background: '#f0f0f0',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p>Chargement de la carte...</p>
    </div>
  ),
})

export default function Index() {
  return <MapComponent />
}

