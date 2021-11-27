import { useEffect, useCallback } from 'react'
import useRealm from './useRealm'
import useModelYearFilter from './useModelYearFilter'

const useFipe = () => {
  const { getInstance } = useRealm()
  const { modelYearFilter } = useModelYearFilter()

  useEffect(() => {
    console.log('MODEL FILTER CHANGED', modelYearFilter)
  }, [modelYearFilter])

  return {
  }
}

export default useFipe
