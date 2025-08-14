const path = require('path');

// Helper to reset environment before each test
beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
  jest.resetModules();
});

test('overview includes mandatory categories when preferences empty', () => {
  localStorage.setItem('preferences', '[]');

  // Set up DOM elements expected by overview script
  document.body.innerHTML = '<div class="content-container"></div><div id="paginationDots"></div>';
  Object.defineProperty(window, 'location', { value: { pathname: '/views/overview' }, configurable: true });

  // Stubs
  global.unlockCategory = () => {};
  global.initializeBookmark = () => {};
  global.PerfectScrollbar = function() { return { update: () => {}, destroy: () => {} }; };

  require(path.join('..', 'assistedDriving/public/assets/js/tutorialContent.js'));
  require(path.join('..', 'assistedDriving/public/assets/js/overview.js'));

  document.dispatchEvent(new Event('DOMContentLoaded'));

  const ids = Array.from(document.querySelectorAll('.page')).map(el => el.id);
  expect(ids).toEqual(expect.arrayContaining(['aktivierung', 'deaktivierung', 'risiken']));
});

test('tutorial includes mandatory categories when preferences empty', () => {
  localStorage.setItem('preferences', '[]');

  document.body.innerHTML = '<div class="sidebar-content"></div><div class="main-content"></div><input class="search">';
  Object.defineProperty(window, 'location', { value: { pathname: '/views/tutorial' }, configurable: true });

  global.closeResultsOnOutsideClick = () => {};
  global.updateUnlockedCategoryCheckmarks = () => {};
  global.initializeBookmark = () => {};
  global.PerfectScrollbar = function() { return { container: { addEventListener: () => {} }, update: () => {} }; };

  require(path.join('..', 'assistedDriving/public/assets/js/tutorialContent.js'));
  require(path.join('..', 'assistedDriving/public/assets/js/categoryQuestions.js'));
  require(path.join('..', 'assistedDriving/public/assets/js/tutorial.js'));

  document.dispatchEvent(new Event('DOMContentLoaded'));

  const ids = Array.from(document.querySelectorAll('.content')).map(el => el.id);
  expect(ids).toEqual(expect.arrayContaining(['aktivierung', 'deaktivierung', 'risiken']));
});