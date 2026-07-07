const getMap = () => {
  fetchData().done((data) => {
    data.regions.forEach((region) => {
      applyMapColor(region.slug, region.color);
    });
  });
};
