// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item affix "><a href="弁言.html">弁言</a></li><li class="chapter-item affix "><li class="part-title">國人</li><li class="chapter-item "><a href="孙中山文集选摘.html"><strong aria-hidden="true">1.</strong> 孫中山先生</a></li><li class="chapter-item "><a href="钱穆先生文集选摘.html"><strong aria-hidden="true">2.</strong> 錢穆先生</a></li><li class="chapter-item "><a href="余英时作品选摘.html"><strong aria-hidden="true">3.</strong> 余英時</a></li><li class="chapter-item "><a href="风龙云虎先生作品选摘.html"><strong aria-hidden="true">4.</strong> 風龍雲虎</a></li><li class="chapter-item "><a href="任锋.html"><strong aria-hidden="true">5.</strong> 任鋒</a></li><li class="chapter-item "><a href="汉之声专用号.html"><strong aria-hidden="true">6.</strong> 漢之聲專用號</a></li><li class="chapter-item "><a href="杂论.html"><strong aria-hidden="true">7.</strong> 雜論</a></li><li class="chapter-item "><a href="姚中秋.html"><strong aria-hidden="true">8.</strong> 姚中秋（秋風）</a></li><li class="chapter-item "><a href="秦晖.html"><strong aria-hidden="true">9.</strong> 秦暉</a></li><li class="chapter-item "><a href="李竞恒.html"><strong aria-hidden="true">10.</strong> 李競恆</a></li><li class="chapter-item "><a href="远古善良自由党.html"><strong aria-hidden="true">11.</strong> 遠古善良自由黨</a></li><li class="chapter-item "><a href="伊头鬼作.html"><strong aria-hidden="true">12.</strong> 伊頭鬼作</a></li><li class="chapter-item "><a href="编程随想.html"><strong aria-hidden="true">13.</strong> 編程隨想（阮晓寰)</a></li><li class="chapter-item "><a href="罗翔.html"><strong aria-hidden="true">14.</strong> 羅翔</a></li><li class="chapter-item affix "><li class="part-title">洋人</li><li class="chapter-item "><a href="查理芒格.html"><strong aria-hidden="true">15.</strong> Charlie Munger</a></li><li class="chapter-item "><a href="托马斯索维尔.html"><strong aria-hidden="true">16.</strong> Thomas Sowell</a></li><li class="chapter-item "><a href="斯考特杨.html"><strong aria-hidden="true">17.</strong> Scott Young</a></li><li class="chapter-item "><a href="毛泽东.html"><strong aria-hidden="true">18.</strong> Mao Zedong</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
