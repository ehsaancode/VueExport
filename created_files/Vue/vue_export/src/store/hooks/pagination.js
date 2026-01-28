import { computed } from 'vue';
import { getPaginationValues } from '../index';

export function usePagination() {
  const pagination = computed(() => getPaginationValues());

  return {
    totalItemsValue: computed(() => pagination.value.totalItemsValue),
    itemsPerPageValue: computed(() => pagination.value.itemsPerPageValue),
    currentPageValue: computed(() => pagination.value.currentPageValue),
  };
}
