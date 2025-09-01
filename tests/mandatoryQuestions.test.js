const path = require('path');
const fs = require('fs');
const vm = require('vm');

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

test('test overview includes mandatory categories when preferences exclude them', async () => {
  localStorage.setItem('preferences', JSON.stringify(['verkehrszeichen']));
  localStorage.setItem('userCode', '123');

  document.body.innerHTML = '<div class="test-overview"></div>';

  global.fetch = jest.fn((url) => {
    if (url.endsWith('/api/test/123')) {
      return Promise.resolve({
        json: () => Promise.resolve({ correctly_answered: '{}', currently_incorrectly_answered: '{}' })
      });
    }
    if (url.endsWith('/api/users/123/unlocked-categories')) {
      return Promise.resolve({
        json: () => Promise.resolve({ unlockedCategories: [] })
      });
    }
    return Promise.reject(new Error('unknown url'));
  });

  global.PerfectScrollbar = function() { return {}; };

  vm.runInThisContext(fs.readFileSync(path.join(__dirname, '..', 'assistedDriving/public/assets/js/categoryQuestions.js'), 'utf8'));
  vm.runInThisContext(fs.readFileSync(path.join(__dirname, '..', 'assistedDriving/public/assets/js/test.js'), 'utf8'));

  await showTestOverview();

  const ids = Array.from(document.querySelectorAll('.test-progress-circle-item')).map(el => el.dataset.category);
  expect(ids).toEqual(expect.arrayContaining(['aktivierung', 'deaktivierung', 'risiken']));
});