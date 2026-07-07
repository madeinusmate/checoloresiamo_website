fetchData().done((data) => {
  const region = getRegionData(data);
  if (!region) {
    return;
  }

  document.getElementById('regione').innerHTML = region.name;
});
