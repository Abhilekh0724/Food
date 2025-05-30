export const appendFormData = (
  formData: FormData,
  data: any,
  parentKey = ""
) => {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof File) &&
    !(data instanceof FileList)
  ) {
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        appendFormData(formData, item, `${parentKey}[${index}]`);
      });
    } else {
      Object.keys(data).forEach((key) => {
        appendFormData(
          formData,
          data[key],
          parentKey ? `${parentKey}.${key}` : key
        );
      });
    }
  } else if (data instanceof FileList) {
    Array.from(data).forEach((file) => {
      formData.append(parentKey, file);
    });
  } else if (data !== undefined && data !== null) {
    formData.append(parentKey, data);
  }
};
