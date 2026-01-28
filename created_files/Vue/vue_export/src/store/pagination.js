import { defineStore } from 'pinia';

export const usePaginationStore = defineStore('pagination', {
  state: () => ({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    data: [],
    perPageCurrentData: [],
    globalSearch: "",
    columnSearch: "No",
    filterSearch: "No"
  }),
  actions: {
    setCurrentPage(page) {
      this.currentPage = page;
    },
    setItemsPerPage(count) {
      this.itemsPerPage = count;
      this.currentPage = 1;
    },
    setData({ items, total }) {
      this.data = items;
      this.totalItems = total;
    },
    setGlobalSearch(search) {
      this.globalSearch = search;
    },
    setPerPageCurrentData(data) {
      this.perPageCurrentData = data;
    },
    setColumnSearch(value) {
      this.columnSearch = value;
    },
    setFilterSearch(value) {
      this.filterSearch = value;
    }
  }
});
