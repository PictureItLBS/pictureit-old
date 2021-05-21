export default function initQuickies() {
    document.querySelector('.quickie-button#liked-posts').addEventListener('click', ev => window.location.pathname = "/app/profile/likedPosts")
}