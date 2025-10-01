// ===== 年号の自動更新 =====
document.getElementById('y').textContent = new Date().getFullYear();

// ===== Swiper初期化（タッチ操作は無効：スクロール連動で制御） =====
const swiper = new Swiper('#heroSwiper', {
  allowTouchMove: false,
  effect: 'fade',
  fadeEffect: { crossFade: true },
  speed: 800
});

// ===== 背景適用処理 =====
const stageBg = document.getElementById('stageBg');
const slides = document.querySelectorAll('#heroSwiper .swiper-slide');

/**
 * スライドインデックスに基づいて背景を適用
 * @param {number} i - スライドのインデックス
 */
function applyBgBySlide(i) {
  const conf = JSON.parse(slides[i].dataset.bg || '{}');
  
  if (conf.type === 'image' && conf.url) {
    stageBg.style.background = 
      `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,${conf.overlay ?? .18}) 100%), url('${conf.url}') center/cover no-repeat`;
    document.documentElement.style.setProperty('--stage-overlay', conf.overlay ?? .18);
  } else if (conf.type === 'color' && conf.css) {
    stageBg.style.background = conf.css;
    document.documentElement.style.setProperty('--stage-overlay', conf.overlay ?? .18);
  }
}

// 初期背景を適用
applyBgBySlide(0);

// ===== ScrollTrigger：スクロール進捗→スライドindex変換（背景も同期） =====
gsap.registerPlugin(ScrollTrigger);

const slideCount = slides.length;

ScrollTrigger.create({
  trigger: '#stage',
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: self => {
    const idx = Math.min(slideCount - 1, Math.max(0, Math.round(self.progress * (slideCount - 1))));
    if (idx !== swiper.activeIndex) {
      swiper.slideTo(idx);
      applyBgBySlide(idx);
    }
  }
});

// ===== スライド画像の軽いズーム（視差効果） =====
slides.forEach(slide => {
  const img = slide.querySelector('.kv-img img');
  if (!img) return;
  
  gsap.to(img, {
    scale: 1.06,
    ease: 'none',
    scrollTrigger: {
      trigger: '#stage',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  });
});

// ===== こだわりセクション：左右段組みのフェードイン =====
document.querySelectorAll('.split').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: .8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });
});

// ===== 特徴カードのフェードイン =====
document.querySelectorAll('.card').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: .6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  });
});