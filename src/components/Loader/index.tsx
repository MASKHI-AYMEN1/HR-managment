import React from 'react'
import spinnerLoaderStyles from './styles'
import {Spinner} from "@heroui/spinner";
import Image from 'next/image'
import { LOGO_ICON } from '@/assets/images'
import { useIntl } from 'react-intl';


const SpinnerLoader = () => {
    const intl = useIntl()

  return (
    <div style={spinnerLoaderStyles.container}>
      <Image
        alt="Logo"
        loading="lazy"
        width="1181"
        height="815"
        decoding="async"
        className="h-auto w-1/4"
        src={LOGO_ICON}
        style={{ color: 'transparent' }}
      ></Image>
      <div className="mt-6 flex items-center">
        <Spinner
          color="warning"
          size="lg"
          className="m-2"
          classNames={{
            base: 'inline-flex w-full  bg-transparent items-center justify-start cursor-pointer rounded-lg gap-2 p-3 ',
            circle1: 'w-full',
          }}
        />
        <span style={spinnerLoaderStyles.loadingText}>{intl.formatMessage({ id: 'loading', defaultMessage: 'Chargement...' })}</span>
      </div>
    </div>
  )
}

export default SpinnerLoader
