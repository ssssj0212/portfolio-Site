// work.js
document.addEventListener('DOMContentLoaded', () => {
  // 갤러리 이미지 노드 목록
  const galleryImgs = Array.from(document.querySelectorAll('.gallery img'));
  // 라이트박스/컨트롤 요소
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  let currentIndex = -1;

  // 유틸: 라이트박스 연다
  function openAt(index) {
    if (!galleryImgs.length) return;
    if (index < 0 || index >= galleryImgs.length) return;

    currentIndex = index;
    const src = galleryImgs[index].getAttribute('src');
    const alt = galleryImgs[index].getAttribute('alt') || '';
    const caption = galleryImgs[index].dataset.caption || alt || '';

    // 이미지 소스와 캡션 설정
    lbImg.src = src;
    lbImg.alt = alt;
    lbCaption.textContent = caption;

    // aria 및 노출 처리
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.style.display = 'flex';
    // 화면 스크롤 잠그기
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  // 라이트박스 닫기
  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.style.display = 'none';
    // src 제거(메모리 해제)
    lbImg.src = '';
    // 스크롤 복구
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    currentIndex = -1;
  }

  // 다음/이전 이미지 표시 (delta: +1 or -1)
  function showNext(delta = 1) {
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + delta + galleryImgs.length) % galleryImgs.length;
    openAt(nextIndex);
  }

  // 1) 갤러리 이미지에 클릭 이벤트 바인딩
  galleryImgs.forEach((imgEl, idx) => {
    imgEl.style.cursor = 'zoom-in'; // 시각적 피드백
    imgEl.addEventListener('click', () => openAt(idx));
  });

  // 2) 버튼 이벤트
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showNext(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => showNext(1));

  // 3) 오버레이(배경) 클릭 시 닫기 (lightbox-content 제외)
  lightbox.addEventListener('click', (e) => {
    // lightbox 내부에서 클릭한 대상이 오버레이(=lightbox)일 때만 닫음
    if (e.target === lightbox) closeLightbox();
  });

  // 4) 키보드 제어: Esc, ArrowLeft, ArrowRight
  document.addEventListener('keydown', (e) => {
    const isOpen = lightbox.getAttribute('aria-hidden') === 'false';
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showNext(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showNext(1);
    }
  });

  // 5) 이미지 로드 실패 대비 (optional)
  lbImg.addEventListener('error', () => {
    lbCaption.textContent = '이미지를 불러올 수 없습니다.';
  });
});
