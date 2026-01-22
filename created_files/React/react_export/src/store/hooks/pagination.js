// hooks/usePagination.js
import { useSyncExternalStore, useMemo } from "react";
import { subscribe, get } from "../index";

let lastSnapshot = null;

function getSnapshot() {
  const current = get("pagination") || {};

  // ✅ if it's deeply equal to the last one, return the old reference
  if (
    lastSnapshot &&
    JSON.stringify(lastSnapshot) === JSON.stringify(current)
  ) {
    return lastSnapshot;
  }

  lastSnapshot = current;
  return current;
}

export function usePagination() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return useMemo(() => {
    const totalItemsValue =
      snapshot.globalSearch ||
      snapshot.columnSearch === "Yes" ||
      snapshot.filterSearch === "Yes"
        ? snapshot.perPageCurrentData?.length || 0
        : snapshot.totalItems || 0;

    return {
      totalItemsValue,
      itemsPerPageValue: snapshot.itemsPerPage ?? 5,
      currentPageValue: snapshot.currentPage ?? 1,
    };
  }, [snapshot]);
}
