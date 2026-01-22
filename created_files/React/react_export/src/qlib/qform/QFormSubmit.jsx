// import axios from "axios";
// import { get, setFormErrorSet } from "../../store/index";
// import { ApiUtils, UIUtils, NavigationUtils } from "../../utils/actionUtils";


// // ✅ Validation Logic
// const validateFields = (selectedErrorSetObj = {}, data = {}) => {
//   const updatedFields = {};
//   Object.entries(selectedErrorSetObj).forEach(([inputId, field]) => {
//     if (!field?.cms_form_Id) return;

//     const {
//       cms_form_input_Required,
//       cms_form_input_Regex,
//       cms_form_input_Min,
//       cms_form_input_Max,
//       cms_form_input_Name,
//       cms_form_Id,
//     } = field;

//     const key = `${cms_form_input_Name}`.replace(/\s+/g, "_");
//     const value = data?.[key] ?? "";
//     const isEmpty = Array.isArray(value)
//       ? value.length === 0
//       : value.toString().trim() === "";

//     let updatedField = { ...field };

//     if (cms_form_input_Required === "1" && isEmpty) {
//       updatedField.cms_form_input_Required_validation = "Yes";
//       updatedField.cms_form_input_Regex_validation = "No";
//       updatedField.cms_form_input_Min_validation = "No";
//       updatedField.cms_form_input_Max_validation = "No";

//     } else if (cms_form_input_Regex && !Array.isArray(value)) {
//       const regex = new RegExp(cms_form_input_Regex);
//       updatedField.cms_form_input_Regex_validation = regex.test(value)
//         ? "No"
//         : "Yes";

//       updatedField.cms_form_input_Required_validation = "No";
//       updatedField.cms_form_input_Min_validation = "No";
//       updatedField.cms_form_input_Max_validation = "No";

//     } else if (
//       cms_form_input_Min &&
//       value.length < parseInt(cms_form_input_Min, 10)
//     ) {
//       updatedField.cms_form_input_Min_validation = "Yes";
//       updatedField.cms_form_input_Required_validation = "No";
//       updatedField.cms_form_input_Regex_validation = "No";
//       updatedField.cms_form_input_Max_validation = "No";

//     } else if (
//       cms_form_input_Max &&
//       value.length > parseInt(cms_form_input_Max, 10)
//     ) {
//       updatedField.cms_form_input_Max_validation = "Yes";
//       updatedField.cms_form_input_Min_validation = "No";
//       updatedField.cms_form_input_Required_validation = "No";
//       updatedField.cms_form_input_Regex_validation = "No";
//     } else {
//       updatedField.cms_form_input_Required_validation = "No";
//       updatedField.cms_form_input_Regex_validation = "No";
//       updatedField.cms_form_input_Min_validation = "No";
//       updatedField.cms_form_input_Max_validation = "No";
//     }

//     updatedFields[inputId] = updatedField;
//     setFormErrorSet({
//       cms_form_Id,
//       cmsFormInputLabel: inputId,
//       errorSet: updatedField,
//     });
//   });

//   return updatedFields;
// };

// // ✅ Reset Fields After Submit
// const resetFields = (updatedFields) => {
//   Object.entries(updatedFields).forEach(([inputId, field]) => {
//     const resetField = {
//       ...field,
//       ...(field.cms_form_dropdown_value !== undefined && {
//         cms_form_dropdown_value: "",
//       }),
//       ...(field.cms_form_radio_value !== undefined && {
//         cms_form_radio_value: "",
//       }),
//       ...(field.cms_form_text_area_value !== undefined && {
//         cms_form_text_area_value: "",
//       }),
//       ...(field.cms_form_check_value !== undefined && {
//         cms_form_check_value: [],
//       }),
//       ...(field.cms_form_text_value !== undefined && {
//         cms_form_text_value: "",
//       }),
//     };
//     setFormErrorSet({
//       cms_form_Id: resetField.cms_form_Id,
//       cmsFormInputLabel: inputId,
//       errorSet: resetField,
//     });
//   });
// };

// // ✅ Main Submit Function
// export const QFormSubmit = async ({ cms_form_Id, apiInfo }) => {
//   console.log(apiInfo)

//   try {
//     // 1️⃣ Find the form
//     const form = document.getElementById(`form_${cms_form_Id}`);
//     if (!form) {
//       console.error(`Form with id form_${cms_form_Id} not found`);
//       return { formsubmitValidation: false, formValue: {}, apiResponse: [] }; // 🆕 Added formValue
//     }

//     // 2️⃣ Collect data
//     const formData = new FormData(form);
//     const data = {};
//     formData.forEach((value, key) => {
//       if (data[key] !== undefined) {
//         data[key] = Array.isArray(data[key])
//           ? [...data[key], value]
//           : [data[key], value];
//       } else {
//         data[key] = value;
//       }
//     });

//     // 🆕 2.1️⃣ Create clean key:value object (formValue)
//     const formValue = {};
//     for (let [key, value] of Object.entries(data)) {
//       formValue[key] = value;
//     }

//     // 3️⃣ Validate
//     const formErrorSet = get("formErrorSet");
//     const selectedErrorSet = formErrorSet?.[cms_form_Id] || {};
//     const updatedFields = validateFields(selectedErrorSet, data);

//     const allValid = Object.values(updatedFields).every(
//       (field) =>
//         field.cms_form_input_Required_validation === "No" &&
//         field.cms_form_input_Regex_validation === "No" &&
//         field.cms_form_input_Min_validation === "No" &&
//         field.cms_form_input_Max_validation === "No"
//     );

//     if (!allValid) {
//       console.log("❌ Validation failed, API not called");
//       return { formsubmitValidation: false, formValue, apiResponse: [] }; // 🆕 Added formValue
//     }
//     // 4️⃣ Call API only if apiUrl exists
//     if (!apiInfo?.url) {
//       console.warn("⚠️ No apiUrl provided — skipping API call", apiInfo?.url);
//       resetFields(updatedFields);
//       form.reset();
//       return { formsubmitValidation: true, formValue, apiResponse: [] }; // 🆕 Added formValue
//     }

//     const response =
//     //  await axios.post(apiInfo?.url, data, {
//     //   headers: {
//     //     Authorization: "",
//     //     "Content-Type": "application/json",
//     //   },
//     // });

//      await ApiUtils.request(
//         {
//           url: apiInfo?.url,
//           method: apiInfo?.method,
//           body: data,
//           headers: apiInfo?.headers
//         }
//       );


//     if (response) {
//       form.reset();
//       resetFields(updatedFields);
//       console.log("✅ API success:", response.data);
//       return {
//         formsubmitValidation: true,
//         formValue, // 🆕 Added
//         apiResponse: response,
//       };
//     }

//     return { formsubmitValidation: false, formValue, apiResponse: [] }; // 🆕 Added formValue
//   } catch (err) {
//     console.error("❌ API call failed:", err);
//     return { formsubmitValidation: false, formValue: {}, apiResponse: [] }; // 🆕 Added formValue
//   }
// };

















import axios from "axios";
import { get, setFormErrorSet } from "../../store/index";
import { ApiUtils, UIUtils, NavigationUtils } from "../../utils/actionUtils";


// ✅ Validation Logic
const validateFields = (selectedErrorSetObj = {}, data = {}) => {
  const updatedFields = {};
  Object.entries(selectedErrorSetObj).forEach(([inputId, field]) => {
    if (!field?.cms_form_Id) return;

    const {
      cms_form_input_Required,
      cms_form_input_Regex,
      cms_form_input_Min,
      cms_form_input_Max,
      cms_form_input_Name,
      cms_form_Id,
    } = field;

    const key = `${cms_form_input_Name}`.replace(/\s+/g, "_");
    const value = data?.[key] ?? "";
    const isEmpty = Array.isArray(value)
      ? value.length === 0
      : value.toString().trim() === "";

    let updatedField = { ...field };

    if (cms_form_input_Required === "1" && isEmpty) {
      updatedField.cms_form_input_Required_validation = "Yes";
      updatedField.cms_form_input_Regex_validation = "No";
      updatedField.cms_form_input_Min_validation = "No";
      updatedField.cms_form_input_Max_validation = "No";

    } else if (cms_form_input_Regex && !Array.isArray(value)) {
      const regex = new RegExp(cms_form_input_Regex);
      updatedField.cms_form_input_Regex_validation = regex.test(value)
        ? "No"
        : "Yes";

      updatedField.cms_form_input_Required_validation = "No";
      updatedField.cms_form_input_Min_validation = "No";
      updatedField.cms_form_input_Max_validation = "No";

    } else if (
      cms_form_input_Min &&
      value.length < parseInt(cms_form_input_Min, 10)
    ) {
      updatedField.cms_form_input_Min_validation = "Yes";
      updatedField.cms_form_input_Required_validation = "No";
      updatedField.cms_form_input_Regex_validation = "No";
      updatedField.cms_form_input_Max_validation = "No";

    } else if (
      cms_form_input_Max &&
      value.length > parseInt(cms_form_input_Max, 10)
    ) {
      updatedField.cms_form_input_Max_validation = "Yes";
      updatedField.cms_form_input_Min_validation = "No";
      updatedField.cms_form_input_Required_validation = "No";
      updatedField.cms_form_input_Regex_validation = "No";
    } else {
      updatedField.cms_form_input_Required_validation = "No";
      updatedField.cms_form_input_Regex_validation = "No";
      updatedField.cms_form_input_Min_validation = "No";
      updatedField.cms_form_input_Max_validation = "No";
    }

    updatedFields[inputId] = updatedField;
    setFormErrorSet({
      cms_form_Id,
      cmsFormInputLabel: inputId,
      errorSet: updatedField,
    });
  });

  return updatedFields;
};

// ✅ Reset Fields After Submit
const resetFields = (updatedFields) => {
  Object.entries(updatedFields).forEach(([inputId, field]) => {
    const resetField = {
      ...field,
      ...(field.cms_form_dropdown_value !== undefined && {
        cms_form_dropdown_value: "",
      }),
      ...(field.cms_form_radio_value !== undefined && {
        cms_form_radio_value: "",
      }),
      ...(field.cms_form_text_area_value !== undefined && {
        cms_form_text_area_value: "",
      }),
      ...(field.cms_form_check_value !== undefined && {
        cms_form_check_value: [],
      }),
      ...(field.cms_form_text_value !== undefined && {
        cms_form_text_value: "",
      }),
    };
    setFormErrorSet({
      cms_form_Id: resetField.cms_form_Id,
      cmsFormInputLabel: inputId,
      errorSet: resetField,
    });
  });
};

// ✅ Main Submit Function
export const QFormSubmit = async ({ cms_form_Id }) => {
  try {
    // 1️⃣ Find the form
    const form = document.getElementById(`form_${cms_form_Id}`);
    if (!form) {
      console.error(`Form with id form_${cms_form_Id} not found`);
      return { formsubmitValidation: false, formValue: {}, apiResponse: [] }; // 🆕 Added formValue
    }

    // 2️⃣ Collect data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      if (data[key] !== undefined) {
        data[key] = Array.isArray(data[key])
          ? [...data[key], value]
          : [data[key], value];
      } else {
        data[key] = value;
      }
    });


    

    // 🆕 2.1️⃣ Create clean key:value object (formValue)
    const formValue = {};
    for (let [key, value] of Object.entries(data)) {
      formValue[key] = value;
    }

    // 3️⃣ Validate
    const formErrorSet = get("formErrorSet");
    const selectedErrorSet = formErrorSet?.[cms_form_Id] || {};
    const updatedFields = validateFields(selectedErrorSet, data);

    const allValid = Object.values(updatedFields).every(
      (field) =>
        field.cms_form_input_Required_validation === "No" &&
        field.cms_form_input_Regex_validation === "No" &&
        field.cms_form_input_Min_validation === "No" &&
        field.cms_form_input_Max_validation === "No"
    );

    if (!allValid) {
      console.log("❌ Validation failed, API not called");
      return { formsubmitValidation: false, formValue }; // 🆕 Added formValue
    }else{
          return { formsubmitValidation: true, formValue, updatedFields }; // 🆕 Added formValue
    }

  } catch (err) {
    console.error("❌ API call failed:", err);
    return { formsubmitValidation: false, formValue: {} }; // 🆕 Added formValue
  }
};


export const QFormSubmitApiCall = async ({ cms_form_Id, apiInfo, updatedFields }) => {
      try {
      const form = document.getElementById(`form_${cms_form_Id}`);

      const response =
      await ApiUtils.request(
          {
            url: apiInfo?.url,
            method: apiInfo?.method,
            body: apiInfo?.body,
            headers: apiInfo?.headers
          }
        );


    if (response) {
      form.reset();
      resetFields(updatedFields);
      console.log("✅ API success:", response.data);
      return {
        apiResponse: response,
      };
    }
    return { apiResponse: [] }; // 🆕 Added formValue
     } catch (err) {
    console.error("❌ API call failed:", err);
    return {  apiResponse: [] }; // 🆕 Added formValue
  }
}