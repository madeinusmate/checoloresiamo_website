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

const renderRestrictionCard = (item, isWhiteZone) => {
  const textClass = isWhiteZone ? 'text-black' : 'text-white';
  const iconShapeClass = isWhiteZone ? 'icon-shape-black' : 'icon-shape-white';

  return `
    <div class="col-md-4">
      <div class="info">
        <div class="icon icon-lg icon-shape ${iconShapeClass} shadow rounded-circle">
          <i class="material-icons">${item.icon}</i>
        </div>
        <h6 class="info-title text-uppercase ${textClass}">${item.title}</h6>
        <p class="description opacity-8 ${textClass}">${item.text}</p>
      </div>
    </div>
  `;
};

const renderRestrictions = (colore, restrictionsByColor) => {
  const items = restrictionsByColor[colore];
  const restrictionsElement = document.getElementById('restrictions');

  if (!restrictionsElement || !items) {
    return;
  }

  const isWhiteZone = colore === 'BIANCO';
  const cards = items.map((item) => renderRestrictionCard(item, isWhiteZone)).join('');

  restrictionsElement.innerHTML = `
    <div class="container">
      <div class="row">
        ${cards}
      </div>
    </div>
  `;
};

const applyWhiteZoneTheme = () => {
  document.getElementById('colore').classList.add('text-black');
  document.getElementById('regione').classList.add('text-black');
  document.getElementById('restrizioni-header').classList.add('text-black');
  document.getElementById('logo').src = '../assets/img/brand/logo_black.png';
  document.getElementById('navbar-main').classList.remove('navbar-transparent');
  document.getElementById('navbar-main').classList.add('.bg-white');
  document.getElementById('navbar-dropdown').style.color = 'black';
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
    renderRestrictions(region.colore, data.restrictions);

    if (region.colore === 'BIANCO') {
      applyWhiteZoneTheme();
    }
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

const bootRegionPage = () => {
  initRegionPage();
  $('#footer').load('../footer_region.html', () => {
    initLastUpdate();
  });
  $('#assistant').load('../assistant.html');
  $('.landing-page').each(function() {
    $(this).delay(800).fadeIn(500);
  });
};
