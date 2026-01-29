<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, computed, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import componentsMap from '../../../qlib/componentsMap.vue';
// import { get, set } from '../../store/index';
import { get, set } from '../../../store/index';




const {
  QFullWidth, QRow, QDiv, QParagraph, QTextH6, QTextH5, QTextH4, QTextH3, QTextH2, QTextH1, QImage, QButton,
  QParallax, QMarquee, QStack, QIncrementCounter, QSlider, QAccordion, QAccordionItem, QAccordionBody, QWrap,
  QHorizontalParallax, QTabBar, QTab, QTabBody, QTabHeader, QFloatingButton, QDrawer, QDrawerBody, QStickyHeader,
  QHeaderBar, QForm, QFormInputElement, QInputText, QTextArea, QNSection, QMenuBar, QHMenuItem, QMenu, QSubMenu,
  QInputEmail, QInputNumber, QRadio, QCheckBox, QDropDown, QTableData, QTableWrapper, QRepeat, QTableSearch,
  QInputSearch, QIcon, QTablePagination, QTablePaginationButton, QPageIndicator, QTablePaginationInfo,
  QTablePaginationRPP, QTableSort, QTableFilter, QMap, QBottomMenu, QFlex, QVideo, QSection, QNavbar,
  QCustom, QGallery, QMasonary, QProgressbarWithPercentage, QProgressbarWithStepper, QDashedProgressbar,
  QProgressbarWithSlider, QBackDrop, QCarousel, QErrorMessage, QDatePicker, QTimePicker, QDateRangePicker,
  QTable, QColumnHeaders, QColumnHeader, QTableRows, QTableRow, QTableCell, QMultiSelectDropdown, QActionFlow,
  QModalContainer, QColumnChart, QAreaChart, QLineChart, QBarChart, QPieChart
} = componentsMap;

const props = defineProps(['setupSceneCalling', 'sceneValuePassToPage', 'receivedValueFromPage']);

const loading = ref(false);
const router = useRouter();
const route = useRoute();

const openMenus = ref({});
const hoverTimeouts = ref({});

// Force component to re-render on store change manually
const componentKey = ref(0);
const forceUpdate = () => componentKey.value++;

// const defaultLineChartState4343 = ref({"series":[{"name":"Product A","color":"#6D98C4","strokeWidth":3,"showMarkers":true,"markerSize":4,"markerShape":"circle","data":[{"x":1,"y":2},{"x":2,"y":5},{"x":3,"y":9},{"x":4,"y":2},{"x":5,"y":4},{"x":6,"y":9},{"x":7,"y":3},{"x":8,"y":6},{"x":9,"y":1},{"x":10,"y":2}]}],"showLegend":true,"enableTooltip":true,"animationDuration":2000,"animationCurve":"easeInOut","title":"Line Chart - Sales Data","backgroundColor":"#04F05E","xAxis":{"showGridLines":true,"showLabels":true,"gridLineColor":"#E0E0E0","minimum":0,"maximum":10},"yAxis":{"showGridLines":true,"showLabels":true,"gridLineColor":"#E0E0E0","minimum":0,"maximum":100}});
const setDefaultLineChartState4343 = (val) => { defaultLineChartState4343.value = val; };
const formInputData4361 = ref({});
const setFormInputData4361 = (val) => { formInputData4361.value = val; };
const formHeaderData4362 = ref({});
const setFormHeaderData4362 = (val) => { formHeaderData4362.value = val; };
const formModel4363 = ref({"model":{"fields":{},"order":[]},"state":{"isDirty":false,"isValid":false,"touched":{},"errors":{}}});
const setFormModel4363 = (val) => { formModel4363.value = val; };
const formMetaData4364 = ref({"formData":{"id":"1769598920279973","name":"QForm","state":{"isDirty":false,"isValid":false,"touched":{},"errors":{}}}});
const setFormMetaData4364 = (val) => { formMetaData4364.value = val; };
const formInputData4365 = ref({});
const setFormInputData4365 = (val) => { formInputData4365.value = val; };
const formHeaderData4366 = ref({});
const setFormHeaderData4366 = (val) => { formHeaderData4366.value = val; };
const formMetaData4367 = ref({"formData":{"id":"1769599069615338","name":"QForm","state":{"isDirty":false,"isValid":false,"touched":{},"errors":{}}}});
const setFormMetaData4367 = (val) => { formMetaData4367.value = val; };
const formModel4368 = ref({"model":{"fields":{},"order":[]},"state":{"isDirty":false,"isValid":false,"touched":{},"errors":{}}});
const setFormModel4368 = (val) => { formModel4368.value = val; };
const formInputData4369 = ref({"frvr":""});
const setFormInputData4369 = (val) => { formInputData4369.value = val; };
const formMetaData4370 = ref({"formData":{"id":"1769599536730828","name":"QForm","state":{"isDirty":false,"isValid":false,"touched":{},"errors":{}},"formId":"927"}});
const setFormMetaData4370 = (val) => { formMetaData4370.value = val; };
const formModel4371 = ref({"model":{"fields":{"1769599572011037":{"config":{"id":"frvr","type":"checkbox","inputProps":{"autocomplete":false,"spellcheck":false,"autocorrect":false,"autoFocus":false,"readOnly":false,"disabled":false,"keyboardType":"text"}},"validation":{"autoValidation":false,"isValid":false,"errors":[],"rules":[]},"value":{"default":"","initial":"","current":""}}},"order":[]},"state":{"isDirty":false,"isValid":false,"touched":{},"errors":{}}});
const setFormModel4371 = (val) => { formModel4371.value = val; };
const formHeaderData4372 = ref({});
const setFormHeaderData4372 = (val) => { formHeaderData4372.value = val; };
const formMetaData4378 = ref({"formData":{"id":"1769599536730828","name":"QForm","state":{"isDirty":false,"isValid":false,"touched":{},"errors":{}}}});
const setFormMetaData4378 = (val) => { formMetaData4378.value = val; };
const formInputData4379 = ref({});
const setFormInputData4379 = (val) => { formInputData4379.value = val; };
const formModel4380 = ref({"model":{"fields":{"1769599572011037":{"config":{"inputProps":{"autocomplete":false,"spellcheck":false,"autocorrect":false,"autoFocus":false,"readOnly":false}}}},"order":[]},"state":{"isDirty":false,"isValid":false,"touched":{},"errors":{}}});
const setFormModel4380 = (val) => { formModel4380.value = val; };
const formHeaderData4381 = ref({});
const setFormHeaderData4381 = (val) => { formHeaderData4381.value = val; };
const defaultCheckboxState4373 = ref([{"value":"1","key":"Option 1"},{"value":"2","key":"Option 2"}]);
const setDefaultCheckboxState4373 = (val) => { defaultCheckboxState4373.value = val; };
const formInputData4382 = ref({"vueform":"","vuetestradio":""});
const setFormInputData4382 = (val) => { formInputData4382.value = val; };
const formHeaderData4383 = ref({});
const setFormHeaderData4383 = (val) => { formHeaderData4383.value = val; };
const formMetaData4384 = ref({"formData":{"id":"1769604185383761","name":"QForm","state":{"isDirty":false,"isValid":false,"touched":{},"errors":{}},"formId":"929"}});
const setFormMetaData4384 = (val) => { formMetaData4384.value = val; };
const formModel4385 = ref({"model":{"fields":{"1769604203268732":{"config":{"id":"vueform","type":"text","inputProps":{"autocomplete":false,"spellcheck":false,"autocorrect":false,"autoFocus":false,"readOnly":false,"disabled":false,"keyboardType":"text"}},"validation":{"autoValidation":false,"isValid":false,"errors":[],"rules":[]},"value":{"default":"","initial":"","current":""}},"1769604210234545":{"config":{"id":"vuetestradio","type":"radio","inputProps":{"autocomplete":false,"spellcheck":false,"autocorrect":false,"autoFocus":false,"readOnly":false,"disabled":false,"keyboardType":"text"}},"validation":{"autoValidation":false,"isValid":false,"errors":[],"rules":[]},"value":{"default":"","initial":"","current":""}}},"order":[]},"state":{"isDirty":false,"isValid":false,"touched":{},"errors":{}}});
const setFormModel4385 = (val) => { formModel4385.value = val; };
const defaultRadioState4386 = ref([{"value":"1","key":"Option 1"},{"value":"2","key":"Option 2"}]);
const setDefaultRadioState4386 = (val) => { defaultRadioState4386.value = val; };
const defaultGalleryState4412 = ref({"galleryData":{"id":"1769673769702736","column":"4","vSpace":{"v":"10","u":"px","c":"0"},"hSpace":{"v":"10","u":"px","c":"0"}}});
const setDefaultGalleryState4412 = (val) => { defaultGalleryState4412.value = val; };
const defaultGalleryState4434 = ref({"galleryData":{"id":"1769679369379474","column":"4","vSpace":{"v":"10","u":"px","c":"0"},"hSpace":{"v":"10","u":"px","c":"0"}}});
const setDefaultGalleryState4434 = (val) => { defaultGalleryState4434.value = val; };


onMounted(() => {
  // Cleanup timeouts
  return () => {
    Object.values(hoverTimeouts.value).forEach(clearTimeout);
  };
});

// Watch for route changes to clear menus
watch(() => route.path, () => {
  openMenus.value = {};
});

const handleMouseEnter = (menuId, parentIds = []) => {
  let newMenus = { ...openMenus.value, [menuId]: true };
  
  // Ensure all parent menus remain open
  parentIds.forEach((parent) => {
    newMenus[parent] = true;
  });

  // Logic to close siblings after delay
  const timeout = setTimeout(() => {
    const freshMenus = { ...openMenus.value };
    // Close menus that are not the current one or its parents
    Object.keys(freshMenus).forEach((key) => {
      if (key !== menuId && !parentIds.includes(key)) {
         delete freshMenus[key];
      }
    });
    openMenus.value = freshMenus;
  }, 1500);
  
  openMenus.value = newMenus;
};

const handleMouseLeave = (menuId) => {
  const timeout = setTimeout(() => {
    const updatedMenus = { ...openMenus.value };
    delete updatedMenus[menuId];
    openMenus.value = updatedMenus;
  }, 1500);
  
  hoverTimeouts.value = {
    ...hoverTimeouts.value,
    [menuId]: timeout
  };
};

const handleTopMenuEnter = (menuId) => {
  openMenus.value = {};
  if (hoverTimeouts.value[menuId]) {
    clearTimeout(hoverTimeouts.value[menuId]);
  }
};



// Provide menu state/functions to descendants
provide('menuState', {
  openMenus,
  handleMouseEnter,
  handleMouseLeave,
  handleTopMenuEnter
});

// 

// 
const actions = {
  };


</script>

<template>
  <div :key="componentKey">  <QDiv
 >
      <QDiv
       widgetId="MainCanvasID"
       bgColor="rgba(255, 255, 255, 1.00)"
       tailwaindClasses="w-full min-h-[100%vh] h-auto relative"
     >
         <QSection
          widgetId="1769678488215173"
          tailwaindClasses="w-full min-h-[400px] h-auto relative block"
        >
            <QGallery
             column="4"
             vSpace="10px"
             hSpace="10px"
             widgetId="1769679369379474"
             tailwaindClasses="w-full min-h-[100px] h-auto static"
           >
               <QFlex
                widgetId="1769679369467028"
                tailwaindClasses="w-full h-auto static flex flex-col"
              >
                  <QImage
                   widgetId="1769679369458770"
                   bgUrl="https://media.istockphoto.com/id/1534999679/photo/japanese-city-at-night.jpg?s=1024x1024&w=is&k=20&c=4eZAXsWyIqSo3jnd_GzylVE5Bz8HKRo41XNTDkFvn8A="
                   backgroundSize="cover"
                   tailwaindClasses="w-full h-[300px] static object-cover"
                 />

               </QFlex>
               <QFlex
                widgetId="1769679369461354"
                bgUrl="https://media.istockphoto.com/id/1178099100/photo/crowded-osaka-dotonbori-entertainment-district.jpg?s=1024x1024&w=is&k=20&c=I-qd0oq6hULRrI4mZ-Ae3eWwLV0hMVR178CtJqIh94g="
                backgroundSize="cover"
                tailwaindClasses="w-full h-auto static object-cover flex flex-col"
              >
                  <QImage
                   widgetId="1769679369460816"
                   tailwaindClasses="w-full h-[300px] static"
                 />

               </QFlex>
               <QFlex
                widgetId="1769679369459217"
                bgUrl="https://media.istockphoto.com/id/636859562/photo/shinjuku-kabuki-cho-at-night.jpg?s=1024x1024&w=is&k=20&c=wqhFuVkcn_laNw7gZ8cZFh1PqHbXmnuVZdvY33tiYqo="
                tailwaindClasses="w-full h-auto static flex flex-col"
              >
                  <QImage
                   widgetId="1769679369463308"
                   tailwaindClasses="w-full h-[300px] static"
                 />

               </QFlex>
               <QFlex
                widgetId="1769679369464826"
                tailwaindClasses="w-full h-auto static flex flex-col"
              >
                  <QImage
                   widgetId="1769679369467399"
                   tailwaindClasses="w-full h-[300px] static"
                 />

               </QFlex>
               <QFlex
                widgetId="1769679369463917"
                tailwaindClasses="w-full h-auto static flex flex-col"
              >
                  <QImage
                   widgetId="1769679369464288"
                   tailwaindClasses="w-full h-[300px] static"
                 />

               </QFlex>
               <QFlex
                widgetId="1769679369461404"
                tailwaindClasses="w-full h-auto static flex flex-col"
              >
                  <QImage
                   widgetId="1769679369462442"
                   tailwaindClasses="w-full h-[300px] static"
                 />

               </QFlex>
               <QFlex
                widgetId="1769679369465533"
                tailwaindClasses="w-full h-auto static flex flex-col"
              >
                  <QImage
                   widgetId="1769679369460368"
                   tailwaindClasses="w-full h-[300px] static"
                 />

               </QFlex>
               <QFlex
                widgetId="1769679369465948"
                tailwaindClasses="w-full h-auto static flex flex-col"
              >
                  <QImage
                   widgetId="1769679369467416"
                   tailwaindClasses="w-full h-[300px] static"
                 />

               </QFlex>
               <QBackDrop
                widgetId="1769679369574052"
                tailwaindClasses="w-[1920px] static"
              >
                  <QCarousel
                   widgetId="1769679369576650"
                   tailwaindClasses="w-full static"
                 >
                     <QFlex
                      widgetId="1769679369467028"
                      tailwaindClasses="w-full h-auto static flex flex-col"
                    >
                        <QImage
                         widgetId="1769679369458770"
                         bgUrl="https://www.istockphoto.com/photo/bright-lights-of-kabukich%C5%8D-gm1187089210-335182734"
                         backgroundSize="cover"
                         tailwaindClasses="w-full h-[300px] static object-cover"
                       />

                     </QFlex>
                     <QFlex
                      widgetId="1769679369461354"
                      bgUrl="https://media.istockphoto.com/id/1178099100/photo/crowded-osaka-dotonbori-entertainment-district.jpg?s=1024x1024&w=is&k=20&c=I-qd0oq6hULRrI4mZ-Ae3eWwLV0hMVR178CtJqIh94g="
                      backgroundSize="cover"
                      tailwaindClasses="w-full h-auto static object-cover flex flex-col"
                    >
                        <QImage
                         widgetId="1769679369460816"
                         tailwaindClasses="w-full h-[300px] static"
                       />

                     </QFlex>
                     <QFlex
                      widgetId="1769679369459217"
                      bgUrl="https://media.istockphoto.com/id/636859562/photo/shinjuku-kabuki-cho-at-night.jpg?s=1024x1024&w=is&k=20&c=wqhFuVkcn_laNw7gZ8cZFh1PqHbXmnuVZdvY33tiYqo="
                      tailwaindClasses="w-full h-auto static flex flex-col"
                    >
                        <QImage
                         widgetId="1769679369463308"
                         tailwaindClasses="w-full h-[300px] static"
                       />

                     </QFlex>
                     <QFlex
                      widgetId="1769679369464826"
                      tailwaindClasses="w-full h-auto static flex flex-col"
                    >
                        <QImage
                         widgetId="1769679369467399"
                         tailwaindClasses="w-full h-[300px] static"
                       />

                     </QFlex>
                     <QFlex
                      widgetId="1769679369463917"
                      tailwaindClasses="w-full h-auto static flex flex-col"
                    >
                        <QImage
                         widgetId="1769679369464288"
                         tailwaindClasses="w-full h-[300px] static"
                       />

                     </QFlex>
                     <QFlex
                      widgetId="1769679369461404"
                      tailwaindClasses="w-full h-auto static flex flex-col"
                    >
                        <QImage
                         widgetId="1769679369462442"
                         tailwaindClasses="w-full h-[300px] static"
                       />

                     </QFlex>
                     <QFlex
                      widgetId="1769679369465533"
                      tailwaindClasses="w-full h-auto static flex flex-col"
                    >
                        <QImage
                         widgetId="1769679369460368"
                         tailwaindClasses="w-full h-[300px] static"
                       />

                     </QFlex>
                     <QFlex
                      widgetId="1769679369465948"
                      tailwaindClasses="w-full h-auto static flex flex-col"
                    >
                        <QImage
                         widgetId="1769679369467416"
                         tailwaindClasses="w-full h-[300px] static"
                       />

                     </QFlex>

                  </QCarousel>
                  <QIcon
                   cms_form_Id="0"
                   clickableWidget="close_icon"
                   iconLink="https://imgcdn.kuick.com/cms/icon/quick-studio-icon-library/interface/solid/remove.svg"
                   widgetId="1769679698394070"
                   tailwaindClasses="min-w-[50px] w-[50px] min-h-[50px] static"
                 />
                  <QIcon
                   cms_form_Id="0"
                   clickableWidget="right_icon"
                   iconLink="https://imgcdn.kuick.com/cms-designer/cms_icon_set/kuick_studio_icon/dark/gallery/right-white-arrow.svg"
                   widgetId="1769679698395147"
                   tailwaindClasses="min-w-[50px] w-[50px] min-h-[50px] static"
                 />
                  <QIcon
                   cms_form_Id="0"
                   clickableWidget="left_icon"
                   iconLink="https://imgcdn.kuick.com/cms-designer/cms_icon_set/kuick_studio_icon/dark/gallery/left-white-arrow.svg"
                   widgetId="1769679698392798"
                   tailwaindClasses="min-w-[50px] w-[50px] min-h-[50px] static"
                 />

               </QBackDrop>

            </QGallery>

         </QSection>
         

      </QDiv>
      
</QDiv>
  </div>
</template>