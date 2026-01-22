import * as reduxToolkitConfig from "./config/redux-toolkit.config";

const impl = reduxToolkitConfig;
export const store = impl.store; // <-- Add this line
export const get = (key) => impl.get(key);
export const set = (key, value) => impl.set(key, value);
export const subscribe = (listener) => impl.subscribe(listener);
export const customReduce = (fn) => impl.customReduce(fn);
export const remove = (key) => impl.remove(key);



export const setFormErrorSet = ({
  cms_form_Id,
  cmsFormInputLabel,
  errorSet,
}) => {
  const current = get("formErrorSet") || {};
  const formErrors = current[cms_form_Id] || {};

  set("formErrorSet", {
    ...current,
    [cms_form_Id]: {
      ...formErrors,
      [cmsFormInputLabel]: errorSet,
    },
  });
};

// --- PAGINATION: setters (same approach as setFormErrorSet) ---
export const setPaginationCurrentPage = (page) => {
  const current = get("pagination") || {};
  set("pagination", { ...current, currentPage: page });
};

export const setPaginationItemsPerPage = (count) => {
  const current = get("pagination") || {};
  set("pagination", { ...current, itemsPerPage: count, currentPage: 1 });
};

export const setPaginationData = ({ items, total }) => {
  const current = get("pagination") || {};
  set("pagination", { ...current, data: items, totalItems: total });
};

export const setPaginationGlobalSearch = (value) => {
  const current = get("pagination") || {};
  set("pagination", { ...current, globalSearch: value });
};

export const setPaginationColumnSearch = (value) => {
  const current = get("pagination") || {};
  set("pagination", { ...current, columnSearch: value });
};

export const setPaginationFilterSearch = (value) => {
  const current = get("pagination") || {};
  set("pagination", { ...current, filterSearch: value });
};

export const setPaginationPerPageCurrentData = (data) => {
  const current = get("pagination") || {};
  set("pagination", { ...current, perPageCurrentData: data });
};

// --- PAGINATION: selector (single place for the logic you used in useSelector) ---
export const getPaginationValues = () => {
  const p = get("pagination") || {};
  const totalItemsValue =
    p.globalSearch || p.columnSearch === "Yes" || p.filterSearch === "Yes"
      ? p.perPageCurrentData?.length || 0
      : p.totalItems || 0;

  return {
    totalItemsValue,
    itemsPerPageValue: p.itemsPerPage ?? 5,
    currentPageValue: p.currentPage ?? 1,
  };
};
