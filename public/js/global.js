
function toggleModalClasses(event) {
    var modalId = event.currentTarget.dataset.modalId;
    var modal = $(modalId);
    modal.toggleClass('is-active');
    $('html').toggleClass('is-clipped');
  };

$('.open-modal').click(toggleModalClasses);

$('.close-modal').click(toggleModalClasses);

const menu = document.querySelector('[data-menu]');
const column = document.getElementById('main-column');
const body = document.getElementById('body');
const fader = document.getElementById('fader');
const trigger = document.querySelectorAll('[data-trigger]');

let menuOpen = false;

function openMenu() {
  menu.classList.add('menu--active');
    column.classList.add('faded');
    body.classList.add('faded');
    fader.classList.add('active');

    menuOpen = !menuOpen;
}

function closeMenu() {
  menu.classList.remove('menu--active');
    column.classList.remove('faded');
    body.classList.remove('faded');
    fader.classList.remove('active');
    menuOpen = !menuOpen;
}

$.each([].slice.call(trigger), function(i, t) {
  t.addEventListener('click', function(){
    if(!menuOpen){
      openMenu()
      fader.addEventListener('click', closeMenu)
    } else {
      closeMenu()
      fader.removeEventListener('click', closeMenu)
    }
  });
})
