import { CSSProperties } from 'react'

interface SpinnerLoaderStyles {
  container: CSSProperties
  logo: CSSProperties
  loadingText: CSSProperties
}

const spinnerLoaderStyles: SpinnerLoaderStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '75vh',
    backgroundColor: 'transparent',
  },
  logo: {
    width: '1181px',
    height: '815px',
    marginBottom: '1.5rem',
  },
  loadingText: {
    fontSize: '1.5rem',
    color: '#d4af37',
  },
}

export default spinnerLoaderStyles
