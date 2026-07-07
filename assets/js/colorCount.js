const colorCount = () => {
  fetchData().done((data) => {
    document.getElementById('countGiallo').innerHTML = data.counts.giallo;
    document.getElementById('countArancio').innerHTML = data.counts.arancio;
    document.getElementById('countRosso').innerHTML = data.counts.rosso;
    document.getElementById('countBianco').innerHTML = data.counts.bianco;
  });
};
