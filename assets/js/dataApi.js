const getDataPath = () => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'index.html')) {
    return 'data/regions.json';
  }
  return '../data/regions.json';
};

const getRegionSlug = () => {
  const segments = window.location.pathname.split('/').filter((part) => part && part !== 'index.html');
  if (segments.length === 0) {
    return null;
  }

  const slug = segments[0];
  const ignored = ['support', 'assets', 'data'];
  return ignored.includes(slug) ? null : slug;
};

let dataCache = null;

const fetchData = () => {
  if (dataCache) {
    return $.Deferred().resolve(dataCache).promise();
  }

  return $.ajax({ url: getDataPath(), dataType: 'json' }).done((data) => {
    dataCache = data;
  });
};

const getRegionData = (data) => {
  const slug = getRegionSlug();
  if (!slug) {
    return null;
  }
  return data.regions.find((region) => region.slug === slug) || null;
};

const applyColorRestrictions = (colore) => {
  switch (colore) {
    case 'GIALLO':
      document.getElementById('restrictions_yellow').style.display = 'inline';
      break;
    case 'ARANCIO':
      document.getElementById('restrictions_orange').style.display = 'inline';
      break;
    case 'ARANCIO RAFFORZATO':
      document.getElementById('restrictions_orangeStrong').style.display = 'inline';
      break;
    case 'ROSSO':
      document.getElementById('restrictions_red').style.display = 'inline';
      break;
    case 'BIANCO':
      document.getElementById('restrictions_white').style.display = 'inline';
      document.getElementById('colore').classList.add('text-black');
      document.getElementById('regione').classList.add('text-black');
      document.getElementById('restrizioni-header').classList.add('text-black');
      document.getElementById('logo').src = '../assets/img/brand/logo_black.png';
      document.getElementById('navbar-main').classList.remove('navbar-transparent');
      document.getElementById('navbar-main').classList.add('.bg-white');
      document.getElementById('navbar-dropdown').style.color = 'black';
      break;
    default:
      console.log('error, no color defined, restrictions not displayed');
  }
};

const applyMapColor = (slug, colore) => {
  const element = document.getElementById(slug);
  if (!element) {
    return;
  }

  if (colore === 'ARANCIO RAFFORZATO') {
    element.classList.add('ARANCIO-RAFFORZATO');
    return;
  }

  element.classList.add(colore);
};

const initLastUpdate = () => {
  fetchData().done((data) => {
    const updateElement = document.getElementById('update');
    if (updateElement) {
      updateElement.innerHTML = data.last_update;
    }
  });
};

const initRegionPage = () => {
  fetchData().done((data) => {
    const region = getRegionData(data);
    if (!region) {
      return;
    }

    document.getElementById('regione').innerHTML = region.regione;
    document.getElementById('colore').innerHTML = region.colore;
    document.getElementById('body').style.backgroundColor = region.background;
    applyColorRestrictions(region.colore);
  });
};

const initHomePage = () => {
  fetchData().done((data) => {
    data.regions.forEach((region) => {
      applyMapColor(region.slug, region.colore);
    });

    document.getElementById('countGiallo').innerHTML = data.counts.giallo;
    document.getElementById('countArancio').innerHTML = data.counts.arancio;
    document.getElementById('countRosso').innerHTML = data.counts.rosso;
    document.getElementById('countBianco').innerHTML = data.counts.bianco;

    initLastUpdate();
  });
};
