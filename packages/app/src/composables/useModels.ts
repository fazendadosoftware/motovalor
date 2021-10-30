import { ref, unref, Ref, ComputedRef, watch, computed } from 'vue'
import useFipe, { VModel, ModelSort, ModelSortingKey, ModelId } from '@/composables/useFipe'
import { Index } from 'flexsearch'
import useLogger from '@/composables/useLogger'

const { logger } = useLogger()
const { getModels, getModelCount } = useFipe()

export interface IUseModels {
  isIndexing: ComputedRef<boolean>
  isLoading: ComputedRef<boolean>
  fetchNextModelPage: () => Promise<VModel[]>
  models: ComputedRef<VModel[]>
  totalCount: ComputedRef<number | null>
  hasNextPage: ComputedRef<boolean>
  searchQuery: Ref<string>
  sort: Ref<ModelSort>
  init: () => Promise<void>
}

let ftsIndex = new Index()
const isIndexing = ref(false)

const buildFtsIndex = async (): Promise<void> => {
  logger.debug('starting to index...')
  isIndexing.value = true
  ftsIndex = new Index()
  try {
    const models = await getModels({
      fields: ['modelId', 'model', 'make', 'fuelTypeCode', 'modelYears'],
      sort: [{ key: 'make' }, { key: 'model' }]
    })
    models
      .forEach(model => {
        const { modelId = -1, make = '', model: name = '', fuelTypeCode = '', modelYears = [] } = model
        modelYears
          .forEach(modelYear => {
            const id = VModel.getId(modelId, modelYear)
            const item = `${make} ${name} ${fuelTypeCode} ${modelYear}`
            void ftsIndex.add(id, item)
          })
      })
    logger.debug('done indexing...')
  } finally {
    isIndexing.value = false
  }
}

const useModels = (): IUseModels => {
  const models: Ref<VModel[]> = ref([])
  const searchQuery = ref('')
  const loading = ref(0)
  const pageSize = 100
  const sort: Ref<ModelSort> = ref([{ key: 'make' as ModelSortingKey }, { key: 'model' as ModelSortingKey }])
  const filteringIds: Ref<ModelId[] | undefined> = ref()
  const totalCount: Ref<number | null> = ref(null)

  const fetchNextModelPage = async (): Promise<VModel[]> => {
    loading.value++
    try {
      const offset = unref(models).length
      let modelPage = await getModels({
        fields: ['id', 'model', 'make', 'fuelTypeCode', 'vehicleTypeCode', 'modelYear', 'price', 'deltaPrice12M'],
        id: unref(filteringIds),
        offset,
        limit: pageSize,
        sort: unref(sort)
      })
      if (Array.isArray(unref(filteringIds))) {
        const modelPageIndex = modelPage
          .reduce((accumulator: Record<ModelId, VModel>, model) => ({ ...accumulator, [model?.id ?? -1]: model }), {})
        modelPage = (unref(filteringIds) ?? [])
          .reduce((accumulator: VModel[], id) => {
            const model = modelPageIndex[id]
            if (model !== undefined) accumulator.push(model)
            return accumulator
          }, [])
      }
      unref(models).push(...modelPage)
      return unref(models)
    } finally {
      loading.value--
    }
  }

  // reset model list whenever sorting changes...
  watch([sort, filteringIds], async () => {
    models.value = []
    totalCount.value = await getModelCount({})
    void fetchNextModelPage()
  }, { immediate: true })

  // compute filtered modelYears on every searchQuery change
  watch(searchQuery, async query => { filteringIds.value = query === '' ? undefined : await ftsIndex.search({ query, limit: 30 }) as ModelId[] })

  const init = async (): Promise<void> => {
    await buildFtsIndex()
  }

  return {
    isIndexing: computed(() => unref(isIndexing)),
    isLoading: computed(() => unref(loading) > 0),
    fetchNextModelPage,
    models: computed(() => unref(models)),
    totalCount: computed(() => unref(totalCount)),
    hasNextPage: computed(() => unref(totalCount) === null || ((unref(totalCount) ?? -1) > unref(models).length)),
    searchQuery,
    sort,
    init
  }
}

export default useModels
