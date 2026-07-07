fetchData().done((data) => {
  const region = getRegionData(data);
  if (!region) {
    return;
  }

  document.getElementById('colore').innerHTML = region.color;
  applyColorRestrictions(region.color);
});
