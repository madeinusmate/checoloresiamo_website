fetchData().done((data) => {
  const region = getRegionData(data);
  if (!region) {
    return;
  }

  document.getElementById('body').style.backgroundColor = region.background_color;
});
