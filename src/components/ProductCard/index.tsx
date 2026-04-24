import React from 'react'
import { MdNavigateNext } from 'react-icons/md'
import { useRouter } from 'next/navigation'

const ProductCard: React.FC = () => {
  const router = useRouter()
  const id = 2

  const handleNavigate = () => {
    router.push('/vehicle/' + id)
  }

  return (
    <div className=" flex items-center justify-center  dark:bg-gray-800">
      {/* product card */}
      <div className="max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-700">
        <div>
          <img
            className="object-cover h-64 w-full"
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw1fHxzbmVha2Vyc3xlbnwwfDB8fHwxNzEyMjIzNDAyfDA&ixlib=rb-4.0.3&q=80&w=1080"
            alt="Converse sneakers"
          />
        </div>

        <div className="flex flex-col gap-1 mt-4 px-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-50">
            Converse Sneakers
          </h2>
          <span className="font-normal text-gray-600 dark:text-gray-300">
            High Top (Lemon Yellow)
          </span>
          <span className="font-semibold text-gray-800 dark:text-gray-50">
            $60
          </span>
        </div>

        <div className="flex gap-4 mt-4 px-4">
          <span className="sr-only">Colors available</span>

          <button
            aria-label="Yellow"
            className="p-1 border border-gray-200 dark:border-gray-500 rounded-full cursor-pointer bg-yellow-500 dark:bg-yellow-400"
          ></button>

          <button
            aria-label="Red"
            className="p-1 border border-gray-200 dark:border-gray-500 rounded-full cursor-pointer bg-red-500 dark:bg-red-400"
          ></button>

          <button
            aria-label="Blue"
            className="p-1 border border-gray-200 dark:border-gray-500 rounded-full cursor-pointer bg-blue-500 dark:bg-blue-400"
          ></button>

          <button
            aria-label="Black"
            className="p-1 border border-gray-200 dark:border-gray-500 rounded-full cursor-pointer bg-gray-800 dark:bg-gray-600"
          ></button>
        </div>

        <div className="mt-4 p-4 border-t border-blue-200 dark:border-gray-500">
          <button
            className="w-full flex justify-between items-center font-bold cursor-pointer hover:text-blue-600 text-gray-800 dark:text-gray-50"
            onClick={handleNavigate}
          >
            <span className="text-base text-blue-400">Reservez</span>
            <MdNavigateNext className="text-2xl text-blue-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
