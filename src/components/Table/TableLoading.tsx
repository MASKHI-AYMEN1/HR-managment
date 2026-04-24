import React from 'react'

const TableLoader = () => {
  return (
    <div className="loader-container mt-5">
      <div className='loader'></div>
      <div className="mt-6 flex items-center">
        <span className="loader-loadingText">chargement des données</span>
      </div>
    </div>
  )
}

export default TableLoader
