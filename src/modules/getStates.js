const setState = (tasks, checkbox, index) => {
  if (checkbox.checked === true) {
    tasks[index].checked = true;
  } else {
    tasks[index].checked = false;
  }
};

export default setState;
