import React from 'react'
import { Input } from '@heroui/react'

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    onClear?: () => void
    placeholder?: string
    startContent?: React.ReactNode
    className?: string
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    onClear,
    placeholder = '',
    startContent,
    className = '',
}) => {
    return (
        <Input
            isClearable
            className={className && "w-full sm:max-w-[44%] ring-blue-300 ring-1 rounded-lg"}
            placeholder={placeholder}
            startContent={startContent}
            value={value}
            onClear={onClear}
            onValueChange={onChange}
        />
    )
}

export default SearchInput
