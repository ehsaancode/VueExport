export function formSubmit({ target, action, formId }) {
  try {
    if (target !== "QForm" || action !== "submit") return;

    const form = document.getElementById(`form_${formId}`);
    if (!form) {
      console.error(`Form with ID ${formId} not found`);
      return;
    }

    form.requestSubmit(); // triggers QForm’s handleSubmit()
  } catch (error) {
    console.error("formSubmit error:", error);
  }
}
