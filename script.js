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
    
// 背景のズームアウトアニメーション
gsap.fromTo(stageBg,
  { scale: 1.80 }, // 開始状態：1.15倍に拡大（ズームイン状態）
  { 
    scale: 1,        // 終了状態：等倍（通常サイズ）
    duration: 1.2,   // アニメーション時間：1.2秒
    ease: 'power2.out' // イージング：最初は速く、徐々に減速
  }
);
  } else if (conf.type === 'color' && conf.css) {
    stageBg.style.background = conf.css;
    document.documentElement.style.setProperty('--stage-overlay', conf.overlay ?? .18);
  }
}

/**
 * スライド内要素のフェードインアニメーション
 * @param {number} slideIndex - スライドのインデックス
 */
function animateSlideElements(slideIndex) {
  const slide = slides[slideIndex];
  const title = slide.querySelector('.slide-title');
  const lead = slide.querySelector('.slide-lead');
  const kvImg = slide.querySelector('.kv-img');
  
  // タイトル：左からフェードイン
  if (title) {
    gsap.fromTo(title, 
      { opacity: 0, x: -60 },  // 移動距離を短く（100→60）
      { 
        opacity: 1, 
        x: 0, 
        duration: 1.2,           // 時間を長く（0.8→1.2秒）
        ease: 'power1.out'       // より緩やかなイージング（power2→power1）
      }
    );
  }
  
  // リードテキスト：左からフェードイン（遅延付き）
  if (lead) {
    gsap.fromTo(lead, 
      { opacity: 0, x: -30 },   // 移動距離を短く（50→30）
      { 
        opacity: 1, 
        x: 0, 
        duration: 1.2,           // 時間を長く（0.8→1.2秒）
        delay: 0.3,              // 遅延を少し長く（0.2→0.3秒）
        ease: 'power1.out'       // より緩やかなイージング
      }
    );
  }
  
  // 画像：右からフェードイン
  if (kvImg) {
    gsap.fromTo(kvImg, 
      { opacity: 0, x: 40 },    // 移動距離を短く（50→40）
      { 
        opacity: 1, 
        x: 0, 
        duration: 1.2,           // 時間を長く（0.8→1.2秒）
        ease: 'power1.out'       // より緩やかなイージング
      }
    );
  }
}
// 初期背景を適用
applyBgBySlide(0);

// 初回表示のアニメーション
animateSlideElements(0);

// Swiperのスライド変更イベントでアニメーション実行
swiper.on('slideChange', function() {
  animateSlideElements(swiper.activeIndex);
});

// ===== ScrollTrigger：スクロール進捗→スライドindex変換（背景も同期） =====
gsap.registerPlugin(ScrollTrigger);

const slideCount = slides.length;
let currentIndex = 0;

ScrollTrigger.create({
  trigger: '#stage',
  start: 'top top',
  end: 'bottom bottom',
  scrub: 0.5,
  onUpdate: self => {
    const idx = Math.min(slideCount - 1, Math.max(0, Math.round(self.progress * (slideCount - 1))));
    if (idx !== currentIndex) {
      currentIndex = idx;
      swiper.slideTo(idx, 0); // 瞬時に切り替え（アニメーションはイベントで発火）
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