fetchData().done((data) => {
  const updateElement = document.getElementById('update');
  if (updateElement) {
    updateElement.innerHTML = data.last_update;
  }
});
