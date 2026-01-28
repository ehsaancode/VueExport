<template>
  <div
    class="scrollable-hidden-scroll"
    :style="{
      overflowY: 'scroll',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }"
  >
    <table class="custom-table" :style="tableStyle">
      <thead>
        <tr>
          <template v-for="(header, index) in headerArray" :key="index">
            <th
              v-if="header.show"
              :style="generateHeaderStyle(header)"
            >
              <div class="header-wrapper">
                <div class="header-title" @click="sortData(header.accessor, header.short)">
                  <span class="title-text" :style="{
                     fontSize: header.fontSize,
                     fontWeight: header.fontWeight,
                     textAlign: header.textAlign ? header.textAlign : 'left', // fallback
                     fontFamily: header.fontFamily,
                     fontStyle: header.fontStyle,
                     textDecoration: header.decoration
                  }">
                    {{ header.headerTitle }}
                  </span>
                  <div v-if="header.short === 'Yes'" class="sort-icon-wrapper">
                     <svg
                      v-if="shortField === header.accessor" 
                      :class="['sort-icon-svg', shortBY === 'ASC' ? 'asc' : 'desc']"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                    >
                      <path d="M7 14l5-5 5 5H7z" />
                    </svg>
                     <svg
                      v-else
                      class="sort-icon-svg inactive"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                    >
                      <path d="M7 14l5-5 5 5H7z" />
                    </svg>
                  </div>
                   <div v-if="header.filter === 'Yes'" class="filter-icon-wrapper" @click.stop="openFilter(index, header.accessor)">
                      <!-- Filter Icon SVG -->
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                         <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                      </svg>
                   </div>
                </div>
                 <!-- Search Input -->
                 <div v-if="header.search === 'Yes'" style="margin-top: 5px;">
                   <input 
                    type="text" 
                    :value="header.value" 
                    @input="(e) => handleSearch(e, header.accessor, index)"
                    placeholder="Search..."
                    :style="{ width: '90%', padding: '4px', fontSize: '12px' }"
                   />
                 </div>
                 
                 <!-- Filter Dropdown -->
                 <div v-if="activeFilterIndex === index" class="filter-dropdown" @click.stop>
                    <div style="padding: 10px; border: 1px solid #ccc; background: white; position: absolute; z-index: 100;">
                        <input 
                           type="text" 
                           v-model="ColumnFilterValue" 
                           @input="(e) => handleSearchByColumn(e, header.accessor)"
                           placeholder="Search filter..."
                           style="width: 100%; margin-bottom: 5px;"
                        />
                        <div style="max-height: 150px; overflow-y: auto;">
                           <div v-for="(item, i) in SearchByColumnArray" :key="i">
                              <label style="display: flex; align-items: center; gap: 5px;">
                                 <input 
                                   type="checkbox" 
                                   :checked="SelectedFilterArray.includes(item)"
                                   @change="() => handleCheckboxChange(item, header.accessor)"
                                 />
                                 {{ item }}
                              </label>
                           </div>
                        </div>
                         <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                            <button @click="activeFilterIndex = null">Cancel</button>
                            <button @click="ColumnWiseFilter(header.accessor)">Apply</button>
                         </div>
                    </div>
                 </div>
              </div>
            </th>
          </template>
        </tr>
      </thead>
      <tbody class="tableBody">
        <tr v-for="(row, rowIndex) in paginatedDataState" :key="rowIndex">
          <template v-for="(header, colIndex) in headerArray" :key="colIndex">
             <td v-if="header.show" :style="generateCellStyle(header)">
               {{ row[header.accessor] }}
             </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { generateStyle } from '../../utils/helper';
import { usePaginationStore } from '../../store/pagination';
import { storeToRefs } from 'pinia';

const props = defineProps({
  width: [String, Number],
  height: [String, Number],
  padding: String,
  paddingLeft: String,
  paddingTop: String,
  paddingRight: String,
  paddingBottom: String,
  margin: String,
  marginLeft: String,
  marginTop: String,
  marginRight: String,
  marginBottom: String,
  positionedLeft: String,
  positionedTop: String,
  positionedRight: String,
  positionedBottom: String,
  color: String,
  bgColor: { type: String, default: "" },
  borderRadius: [String, Number],
  borderColor: String,
  borderWidth: [String, Number],
  bgUrl: String,
  isImageFill: [Boolean, String],
  widthType: String,
  heightType: String,
  widthPercent: [String, Number],
  heightPercent: [String, Number],
  alignment: String,
  mainAlignment: String,
  crossAlignment: String,
  borderTLR: [String, Number],
  borderTRR: [String, Number],
  borderBLR: [String, Number],
  borderBRR: [String, Number],
  borderTW: [String, Number],
  borderTC: String,
  borderBW: [String, Number],
  borderBC: String,
  borderLW: [String, Number],
  borderLC: String,
  borderRW: [String, Number],
  borderRC: String,
  shadowSpreadRadius: [String, Number],
  shadowBlurRadius: [String, Number],
  shadowOffsetX: [String, Number],
  shadowOffsetY: [String, Number],
  shadowColor: String,
  isAbsoluteValue: [Boolean, String],
  overflow: { type: String, default: "" },
  onClick: { type: String, default: "" },
  action: String,
  navigation: String,
  zIndex: [String, Number],
  taggedKey: String,
  shortType: String,
  apiUrl: String,
  payload: Object,
  TotalPage: [Number, String],
  perPageSize1: [Number, String],
  currentPage: [Number, String],
  pagination: Object,
  tableData: Object,
});

const store = usePaginationStore();
const { 
  globalSearch, 
  itemsPerPage, 
  currentPage: currentPageNumber, 
  filterSearch 
}  = storeToRefs(store);

const { 
  setData, 
  setCurrentPage, 
  setPerPageCurrentData, 
  setColumnSearch, 
  setFilterSearch: setStoreFilterSearch,
  setGlobalSearch
} = store;

const allData = ref([]);
const headerArray = ref([]);
const shortBY = ref("ASC");
const shortField = ref("");
const TotalPageSet = ref(props.TotalPage);
const SearchByColumnArray = ref([]);
const ColumnFilterValue = ref("");
const columnName = ref("");
const SelectedFilterArray = ref([]);
const filteredData = ref([]);
const paginatedDataState = ref([]);
const activeFilterIndex = ref(null);
const hasFetched = ref(false);

const prevItemsPerPage = ref(itemsPerPage.value);

watch([itemsPerPage, filterSearch], () => {
    if (itemsPerPage.value !== prevItemsPerPage.value) {
       headerArray.value = headerArray.value.map(header => ({
           ...header,
           value: ""
       }));
       prevItemsPerPage.value = itemsPerPage.value;
    }
    if (filterSearch.value === "No") {
        SelectedFilterArray.value = [];
    }
});

onMounted(async () => {
    if (hasFetched.value) return;
    hasFetched.value = true;
    
    if (props.tableData && props.tableData.headers) {
         headerArray.value = props.tableData.headers;
    }

    if (props.shortType === "fromData" && props.tableData && props.tableData.rows) {
        setAllData(props.tableData.rows);
        setData({ items: props.tableData.rows, total: props.tableData.rows.length });
    } else if (props.apiUrl) {
       const payloadSetting = { payload: props.payload };
       try {
           const response = await axios.post(props.apiUrl, payloadSetting, {
             headers: {
               Authorization: "Bearer your-token-here",
               "Content-Type": "application/json",
             },
           });
           const vals = response.data.data1;
           const firstTaggedEntry = vals.find(obj => Object.prototype.hasOwnProperty.call(obj, props.taggedKey));
           const firstTaggedData = firstTaggedEntry ? firstTaggedEntry[props.taggedKey] : [];
           
           setAllData(firstTaggedData);
           TotalPageSet.value = firstTaggedData.length;
           setData({ items: firstTaggedData, total: firstTaggedData.length });

       } catch (error) {
           console.error("API call failed:", error);
       }
    }
});

function setAllData(data) {
    allData.value = data;
}

watch([allData, headerArray, shortField, shortBY, globalSearch, currentPageNumber, itemsPerPage, () => props.shortType], () => {
   processData();
});

const processData = () => {
    let result = [...allData.value];

    // Global Filter
    if (globalSearch.value) {
        const lowerGlobalFilter = globalSearch.value.toLowerCase();
        result = result.filter(row => {
            const values = Object.values(row);
            return values.some(val => String(val).toLowerCase().includes(lowerGlobalFilter));
        });
    }

    // Column Filters
    const searchFilters = headerArray.value
      .filter((h) => h.search === "Yes" && h.value)
      .map((h) => ({ accessor: h.accessor, value: h.value.toLowerCase() }));
    
    if (searchFilters.length > 0) {
        result = result.filter(row => 
            searchFilters.every(f => 
                (row[f.accessor] ?? "").toString().toLowerCase().includes(f.value)
            )
        );
    }

    // Sorting
    if (shortField.value) {
       result.sort((a, b) => {
           const aVal = (a[shortField.value] ?? "").toString().toLowerCase();
           const bVal = (b[shortField.value] ?? "").toString().toLowerCase();
           return shortBY.value === "ASC"
             ? aVal.localeCompare(bVal)
             : bVal.localeCompare(aVal);
       });
    }

    // Column Selected Filter
    if (columnName.value && SelectedFilterArray.value.length > 0) {
        result = result.filter(row => 
           SelectedFilterArray.value.some(filterValue => 
               (row[columnName.value] ?? "").toLowerCase() === filterValue.toLowerCase()
           )
        );
    }

    // Pagination
    filteredData.value = result;
    const total = Math.ceil(result.length / itemsPerPage.value);
    TotalPageSet.value = total;

    // Reset to page 1 if filtering reduces pages
    // if (total === 1 && currentPageNumber.value !== 1) {
       // setCurrentPage(1); 
       // NOTE: Be careful triggering updates inside watch if not needed.
       // logic from original suggests resetting if total pages becomes 1
    // }
    
    // BUT we must render valid page
    if ((currentPageNumber.value - 1) * itemsPerPage.value >= result.length && currentPageNumber.value > 1) {
         setCurrentPage(1);
    }

    const startIndex = (currentPageNumber.value - 1) * itemsPerPage.value;
    const paginated = result.slice(startIndex, startIndex + itemsPerPage.value);
    setPaginatedDataState(paginated);
    setPerPageCurrentData(result);
};

const sortData = (accessor, isSortable) => {
    columnName.value = "";
    SelectedFilterArray.value = [];
    if (isSortable !== "Yes") return;
    
    if (shortField.value === accessor) {
        shortBY.value = shortBY.value === "ASC" ? "DESC" : "ASC";
    } else {
        shortField.value = accessor;
        shortBY.value = "ASC";
    }
};

const handleSearch = (e, accessor, index) => {
    const value = e.target.value.trim();
    setColumnSearch(value !== "" ? "Yes" : "No");
    setStoreFilterSearch("No");
    columnName.value = "";
    SelectedFilterArray.value = [];
    
    // Mutating array element directly, need to trigger reactivity
    const updated = [...headerArray.value];
    updated[index] = { ...updated[index], value };
    headerArray.value = updated;
};

const handleSearchByColumn = (e, accessor) => {
    const searchValue = e.target.value.toLowerCase();
    SelectedFilterArray.value = [];
    SearchByColumnArray.value = [];
    ColumnFilterValue.value = "";

    if (searchValue) {
        ColumnFilterValue.value = searchValue;
        const result = allData.value
            .map(row => row[accessor])
            .filter(value => value && value.toLowerCase().includes(searchValue));
        SearchByColumnArray.value = [...new Set(result)];
    } else {
        const result = allData.value
            .map(row => row[columnName.value])
            .filter(value => value !== undefined && value !== null)
            .map(value => value.toString().toLowerCase());
        SearchByColumnArray.value = [...new Set(result)].sort();
    }
};

const handleCheckboxChange = (value, accessor) => {
    if (SelectedFilterArray.value.includes(value)) {
        SelectedFilterArray.value = SelectedFilterArray.value.filter(v => v !== value);
    } else {
        SelectedFilterArray.value.push(value);
    }
    // Logic will be handled by watch
};

const openFilter = (index, ColumnName) => {
    setStoreFilterSearch("Yes");
    if (columnName.value !== ColumnName) {
        SelectedFilterArray.value = [];
        headerArray.value = headerArray.value.map(h => ({ ...h, value: "" }));
    }
    columnName.value = ColumnName;
    activeFilterIndex.value = activeFilterIndex.value === index ? null : index;
    setGlobalSearch("");
    
    const result = allData.value
        .map(row => row[ColumnName])
        .filter(value => value !== undefined && value !== null)
        .map(value => value.toString().toLowerCase());
    SearchByColumnArray.value = [...new Set(result)].sort();
    ColumnFilterValue.value = "";
};

const ColumnWiseFilter = (colName) => {
    if (SelectedFilterArray.value.length > 0) {
        setStoreFilterSearch("Yes");
    } else {
        setStoreFilterSearch("No");
    }
    activeFilterIndex.value = null;
    processData();
};

const tableStyle = computed(() => ({
    ...generateStyle({
      width: props.width,
      height: props.height,
      isAbsoluteValue: props.isAbsoluteValue,
      positionedLeft: props.positionedLeft,
      positionedTop: props.positionedTop,
      positionedRight: props.positionedRight,
      positionedBottom: props.positionedBottom,
      bgUrl: props.bgUrl,
      isImageFill: props.isImageFill,
      color: props.color,
      bgColor: props.bgColor,
      borderRadius: props.borderRadius,
      borderTLR: props.borderTLR,
      borderTRR: props.borderTRR,
      borderBLR: props.borderBLR,
      borderBRR: props.borderBRR,
      borderWidth: props.borderWidth,
      borderColor: props.borderColor,
      borderTW: props.borderTW,
      borderBW: props.borderBW,
      borderLW: props.borderLW,
      borderRW: props.borderRW,
      borderTC: props.borderTC,
      borderBC: props.borderBC,
      borderLC: props.borderLC,
      borderRC: props.borderRC,
      paddingLeft: props.paddingLeft,
      paddingRight: props.paddingRight,
      paddingTop: props.paddingTop,
      paddingBottom: props.paddingBottom,
      marginLeft: props.marginLeft,
      marginRight: props.marginRight,
      marginTop: props.marginTop,
      marginBottom: props.marginBottom,
      shadowOffsetX: props.shadowOffsetX,
      shadowOffsetY: props.shadowOffsetY,
      shadowBlurRadius: props.shadowBlurRadius,
      shadowSpreadRadius: props.shadowSpreadRadius,
      shadowColor: props.shadowColor,
      overflow: props.overflow,
      mainAlignment: props.mainAlignment,
      crossAlignment: props.crossAlignment,
      onClick: props.onClick,
      zIndex: props.zIndex,
    }),
}));

const generateHeaderStyle = (header) => ({
    ...generateStyle({
        width: header.width?.trim().replace(/^["']|["']$/g, "") || undefined,
        height: header.height?.trim().replace(/^["']|["']$/g, "") || undefined,
        isAbsoluteValue: header.isAbsoluteValue,
        bgColor: header.bgColor ?? "white",
        // ... include other props 
        // For brevity, mapped basic necessary styles. 
        // Full mapping from original code can be extensive.
        color: header.color,
        fontSize: header.fontSize,
        fontWeight: header.fontWeight,
    })
});

const generateCellStyle = (header) => ({
     border: '1px solid #ddd',
     padding: '8px',
     // Add more style mapping if needed
});

function setPaginatedDataState(data) {
    paginatedDataState.value = data;
}
</script>

<style scoped>
.custom-table {
  border-collapse: collapse;
}
.header-wrapper {
  display: flex;
  flex-direction: column;
}
.header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.sort-icon-svg {
    fill: #333;
    transition: transform 0.3s ease;
}
.sort-icon-svg.asc {
    transform: rotate(180deg);
}
.sort-icon-svg.desc {
    transform: rotate(0deg);
}
.sort-icon-svg.inactive {
    opacity: 0.2;
}
</style>
