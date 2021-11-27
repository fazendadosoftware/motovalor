import { useCallback } from 'react'
import { Make } from '../types'
import { useModelYearContext, ModelYearFilterAction } from '../contexts/_ModelYearFilterContext'

const useModelYearFilter = () => {
  const { modelYearFilter, dispatch } = useModelYearContext()

  const setMakeIndex = useCallback((payload: Record<number, Make> | null) => dispatch?.({ type: ModelYearFilterAction.SetMakeIndex, payload }), [])
  const setFtsQuery = useCallback((query: string) => dispatch?.({ type: ModelYearFilterAction.SetFtsQuery, payload: query }), [])
  const setVehicleTypeId = useCallback((vehicleTypeCode: 1 | 2 | 3) => dispatch?.({ type: ModelYearFilterAction.SetVehicleTypeId, payload: vehicleTypeCode }), [])
  const setZeroKm = useCallback((zeroKm: boolean) => dispatch?.({ type: ModelYearFilterAction.SetZeroKm, payload: zeroKm }), [])
  const resetFilter = useCallback(() => dispatch?.({ type: ModelYearFilterAction.Reset, payload: null }), [])

  return {
    modelYearFilter,
    resetFilter,
    setFtsQuery,
    setMakeIndex,
    setVehicleTypeId,
    setZeroKm
  }
}

export default useModelYearFilter
