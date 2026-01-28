import { reactive, watch } from 'vue';

const state = reactive({
    totalItemsValue: 0,
    itemsPerPageValue: 10,
    currentPageValue: 1,
    formErrorSet: {}
});

export const get = (key) => state[key];
export const set = (key, value) => { state[key] = value; };

export const getPaginationValues = () => {
    return {
        totalItemsValue: state.totalItemsValue,
        itemsPerPageValue: state.itemsPerPageValue,
        currentPageValue: state.currentPageValue
    };
};

export const setPaginationCurrentPage = (page) => {
    state.currentPageValue = page;
};

export const setFormErrorSet = ({ cms_form_Id, cmsFormInputLabel, errorSet }) => {
    if (!state.formErrorSet) {
        state.formErrorSet = {};
    }
    if (!state.formErrorSet[cms_form_Id]) {
        state.formErrorSet[cms_form_Id] = {};
    }
    state.formErrorSet[cms_form_Id][cmsFormInputLabel] = errorSet;
};

// Simple subscribe implementation that triggers on any state change
export const subscribe = (listener) => {
    const stopWatch = watch(state, () => {
        listener(state);
    }, { deep: true });
    
    // Return unsubscribe function
    return stopWatch;
};

export default state;
