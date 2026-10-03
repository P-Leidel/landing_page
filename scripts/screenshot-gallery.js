import { nextScreenshotIndex, swipeDirection } from './gallery-navigation.js';

// Add further screenshot paths and translated alt-text keys to a project's list.
const galleries = {
  'instruction-builder': {
    title: 'Visual Instruction Builder',
    images: [
      { src: 'assets/projects/instruction-builder.jpg', altKey: 'project.one.alt' },
      { src: 'assets/projects/instruction-builder-preview.jpg', altKey: 'project.one.previewAlt' },
    ],
  },
  inkforge: {
    title: 'Inkforge',
    images: [
      { src: 'assets/projects/inkforge.jpg', altKey: 'project.two.alt' },
      { src: 'assets/projects/inkforge-sandbox.jpg', altKey: 'project.two.sandboxAlt' },
    ],
  },
};

export function initScreenshotGallery(getDictionary) {
  const dialog = document.getElementById('screenshot-gallery');
  const image = document.getElementById('gallery-image');
  const title = document.getElementById('gallery-title');
  const caption = document.getElementById('gallery-caption');
  const counter = document.getElementById('gallery-counter');
  const stage = dialog.querySelector('.gallery-stage');
  const previous = document.getElementById('gallery-previous');
  const next = document.getElementById('gallery-next');
  const close = document.getElementById('gallery-close');
  let activeGallery = null;
  let index = 0;
  let opener = null;
  let gesture = null;

  function refresh() {
    if (!activeGallery) return;
    const dictionary = getDictionary();
    const screenshot = activeGallery.images[index];
    title.textContent = activeGallery.title;
    image.src = screenshot.src;
    image.alt = dictionary[screenshot.altKey];
    caption.textContent = image.alt;
    counter.textContent = dictionary['gallery.counter']
      .replace('{current}', String(index + 1)).replace('{total}', String(activeGallery.images.length));
    previous.disabled = next.disabled = activeGallery.images.length < 2;
  }

  function navigate(direction) {
    index = nextScreenshotIndex(index, direction, activeGallery.images.length);
    refresh();
  }

  for (const link of document.querySelectorAll('[data-gallery]')) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      event.preventDefault();
      activeGallery = galleries[link.dataset.gallery];
      index = 0;
      opener = link;
      refresh();
      dialog.showModal();
      document.documentElement.classList.add('gallery-open');
      close.focus();
    });
  }

  previous.addEventListener('click', () => navigate(-1));
  next.addEventListener('click', () => navigate(1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll('button:not([disabled])')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('gallery-open');
    activeGallery = null;
    gesture = null;
    opener?.focus({ preventScroll: true });
  });

  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    gesture = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointerup', event => {
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const direction = swipeDirection(event.clientX - gesture.x, event.clientY - gesture.y);
    gesture = null;
    if (direction) navigate(direction);
  });
  stage.addEventListener('pointercancel', () => { gesture = null; });

  return { refresh };
}
