import { ref, unref, Ref, watch, computed } from 'vue'
import useFipe, { VModel, ModelSort, ModelSortingKey, ModelId } from '@/composables/useFipe'
import { Index } from 'flexsearch'

const { getModels } = useFipe()

const useModels = () => {
  let ftsIndex = new Index()
  const models: Ref<VModel[]> = ref([])
  const searchQuery = ref('')
  const loading = ref(0)
  const pageSize = 100
  const sort: Ref<ModelSort> = ref([{ key: 'make' as ModelSortingKey }, { key: 'model' as ModelSortingKey }])
  const filteringIds: Ref<ModelId[] | undefined> = ref()

  const buildFtsIndex = async () => {
    loading.value++
    ftsIndex = new Index()
    try {
      const models = await getModels({
        fields: ['modelId', 'model', 'make', 'fuelTypeCode', 'modelYears'],
        sort: [{ key: 'make' }, { key: 'model' }]
      })
      models
        .forEach(model => {
          const { modelId = -1, make, model: name, fuelTypeCode, modelYears = [] } = model
          modelYears
            .forEach(modelYear => {
              const id = VModel.getId(modelId, modelYear)
              const item = `${make} ${name} ${fuelTypeCode} ${modelYear}`
              ftsIndex.add(id, item)
            })
        })
    } finally {
      loading.value--
    }
  }

  const fetchNextModelPage = async () => {
    loading.value++
    try {
      const offset = unref(models).length
      let modelPage = await getModels({
        fields: ['id', 'model', 'make', 'fuelTypeCode', 'modelYear', 'price', 'deltaPrice12M'],
        id: unref(filteringIds),
        offset,
        limit: pageSize,
        sort: unref(sort)
      })
      if (Array.isArray(unref(filteringIds))) {
        const modelPageIndex = modelPage
          .reduce((accumulator: Record<ModelId, VModel>, model) => ({ ...accumulator, [model?.id || -1]: model }), {})
        modelPage = (unref(filteringIds) ?? [])
          .reduce((accumulator: VModel[], id) => {
            const model = modelPageIndex[id]
            if (model) accumulator.push(model)
            return accumulator
          }, [])
      }
      unref(models).push(...modelPage)
      return models
    } finally {
      loading.value--
    }
  }

  // reset model list whenever sorting changes...
  watch([sort, filteringIds], () => { models.value = [];  fetchNextModelPage() })

  // compute filtered modelYears on every searchQuery change
  watch(searchQuery, async query => { filteringIds.value = !query ? undefined : ftsIndex.search({ query, limit: 30 }) as ModelId[] })

  const rows = computed(() => {
    return unref(models)
  })

  buildFtsIndex()
  fetchNextModelPage()

  return {
    loading,
    rows,
    searchQuery,
    sort
  }
}

export default useModels