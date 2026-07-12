"use client"
import { useEffect, useState } from "react";

export default function useDebounce<T>(value : T , delay : number) {

    const [debounceValue,   setDeounceValue] = useState<T>()

    console.log('use debounce get called', value);
    

    useEffect(() => {
        const timer = setTimeout(() => {

            setDeounceValue(value)

        }, delay)


        return () => clearTimeout(timer)
    }, [value, delay])

    return debounceValue

}