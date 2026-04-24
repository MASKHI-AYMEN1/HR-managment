import React, { FC } from 'react'
import Image from 'next/image'
import { NO_INFORMATION_IMAGE } from '@/assets/images'

type NoInformationType = {
  label: string
}
const Index: FC<NoInformationType> = ({ label }) => {
  return (
    <section className="flex items-center h-96 p-2 dark:bg-transparent ">
      <div className="container flex flex-col items-center ">
        <div className="flex flex-col max-w-md text-center justify-center">
          <div className="flex justify-center">
            <Image
              src={NO_INFORMATION_IMAGE}
              alt="no_information"
              className="flex justify-center"
              height={500}
              width={200}
            ></Image>
          </div>
          <div>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 flex justify-start">
              {label}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Index
