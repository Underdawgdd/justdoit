/* ==========================================================================
   이민재 개인 웹사이트 — 공통 인터랙션 스크립트
   모든 페이지(index.html / portfolio.html / blog.html)에서 공통으로 로드됩니다.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNavScroll();
  initRevealAnimations();
  initLatestPostsPreview(); // index.html에서만 동작
  initBlogPage(); // blog.html에서만 동작
});

/* --------------------------------------------------------------------------
   1. 스크롤 시 네비게이션 바에 배경/구분선 추가
   -------------------------------------------------------------------------- */
function initNavScroll() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const toggle = () => {
    if (window.scrollY > 8) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

/* --------------------------------------------------------------------------
   2. 스크롤 리빌 애니메이션 (.reveal 클래스가 붙은 요소가 뷰포트에 들어오면 표시)
   -------------------------------------------------------------------------- */
function initRevealAnimations() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   3. 데이터 로딩 공통 함수
   -------------------------------------------------------------------------- */
async function loadPosts() {
  try {
    const res = await fetch("data/posts.json");
    if (!res.ok) throw new Error("posts.json을 불러오지 못했습니다.");
    const posts = await res.json();
    // 최신 글이 먼저 오도록 날짜 내림차순 정렬
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    console.warn(err);
    return [];
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* --------------------------------------------------------------------------
   4. index.html — 최신 글 2개 미리보기
   -------------------------------------------------------------------------- */
async function initLatestPostsPreview() {
  const container = document.getElementById("latest-posts");
  if (!container) return;

  const posts = await loadPosts();
  const latest = posts.slice(0, 2);

  if (!latest.length) {
    container.innerHTML =
      '<p class="empty-state">아직 작성된 글이 없습니다.</p>';
    return;
  }

  container.innerHTML = latest
    .map(
      (post) => `
      <a class="post-row" href="blog.html?post=${encodeURIComponent(post.id)}">
        <div>
          <div class="post-row__title">${escapeHtml(post.title)}</div>
          <div class="post-row__excerpt">${escapeHtml(post.excerpt)}</div>
        </div>
        <div class="post-row__date">${formatDate(post.date)}</div>
      </a>
    `
    )
    .join("");
}

/* --------------------------------------------------------------------------
   5. blog.html — 목록 화면 / 상세 화면 전환
   -------------------------------------------------------------------------- */
async function initBlogPage() {
  const listView = document.getElementById("post-list-view");
  const detailView = document.getElementById("post-detail-view");
  if (!listView || !detailView) return; // blog.html이 아니면 종료

  const posts = await loadPosts();
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("post");

  if (postId) {
    renderPostDetail(posts, postId, listView, detailView);
  } else {
    renderPostList(posts, listView, detailView);
  }
}

function renderPostList(posts, listView, detailView) {
  listView.hidden = false;
  detailView.hidden = true;

  const listEl = document.getElementById("post-list");
  const emptyEl = document.getElementById("post-list-empty");

  if (!posts.length) {
    listEl.innerHTML = "";
    emptyEl.hidden = false;
    return;
  }

  emptyEl.hidden = true;
  listEl.innerHTML = posts
    .map(
      (post) => `
      <a class="post-row" href="blog.html?post=${encodeURIComponent(post.id)}">
        <div>
          <div class="post-row__title">${escapeHtml(post.title)}</div>
          <div class="post-row__excerpt">${escapeHtml(post.excerpt)}</div>
        </div>
        <div class="post-row__date">${formatDate(post.date)}</div>
      </a>
    `
    )
    .join("");
}

function renderPostDetail(posts, postId, listView, detailView) {
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    // 존재하지 않는 글 id면 목록 화면으로 대체
    renderPostList(posts, listView, detailView);
    return;
  }

  listView.hidden = true;
  detailView.hidden = false;

  document.getElementById("post-date").textContent = formatDate(post.date);
  document.getElementById("post-title").textContent = post.title;
  // content는 posts.json 작성자(나 자신)가 직접 넣는 신뢰된 HTML이므로 그대로 렌더링합니다.
  document.getElementById("post-body").innerHTML = post.content;

  document.title = `${post.title} — 이민재`;
}

/* --------------------------------------------------------------------------
   유틸: 사용자 입력이 아닌 값이라도 안전하게 표시하기 위한 최소한의 escape
   -------------------------------------------------------------------------- */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
