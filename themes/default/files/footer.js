/* themes/default/files/footer.js - 渲染页面底部 */

// 1. 改为骨架挂载函数
function insertFooterSkeleton() {
    const currentYear = new Date().getFullYear();
    // 防重复插入检查
    if ($('footer.footer').length > 0) return;   

    const footerHtml = `
        <style>
            .footer a:hover{color:#0d6efd !important;}  
            .footer a{color:#212529bf !important; margin: 0 10px;}
            .footer{
                width:100%;
                text-align:center;
                padding:25px 0 30px;
                color:#939393;
                line-height: 1.8;
            }   
            .footer .container{
                max-width:1200px;
                font-size: 14px;
                margin:0 auto;
            }
            
            @media (max-width:767px){       
                .footer{
                    padding:15px 0;
                    margin-top:-5px;
                }
                .footer a{ margin: 0 5px;}
                .footer .container{
                    font-size:12px;
                }
            }
        </style>

        <footer class="footer">
            <div class="container" id="custom-footer-container">
            </div>
            <div id="back-to-top" class="back-to-top"><i class="fal fa-chevron-up"></i></div>
        </footer>
        <nav class="mobile-bottom-nav d-lg-none" id="global-mobile-nav">
            <a href="/" class="mbn-item"><i class="fas fa-home"></i>商城</a>
            <a href="javascript:void(0);" class="mbn-item" id="mobile-bottom-category-btn"><i class="fas fa-list-ul"></i>分类</a>
            <a href="/orders" class="mbn-item"><i class="fas fa-search"></i>查单</a>
            <a href="/cart" class="mbn-item position-relative">
                <i class="far fa-shopping-cart" style="font-weight: 500;"></i>购物车
                <span class="common-cart-badge footer-cart-badge" id="footer-cart-badge">0</span>
            </a>
            <a href="/articles" class="mbn-item"><i class="fas fa-book-open"></i>文章</a>
        </nav>
    `;
    
    // 插入页面
    $('body').append(footerHtml);
    // 1. 设置移动端底部导航高亮
    const currentPath = window.location.pathname.replace(/\/$/, "");
    $('.mobile-bottom-nav a').each(function() {
        const href = $(this).attr('href').replace(/\/$/, "");
        if (href === currentPath || (currentPath === '' && href === '/')) {
            $(this).addClass('active');
        }
    });

    // 2. 绑定底部“分类”按钮，点击触发侧边栏向左滑出（完全复用页头汉堡图标逻辑）
    $('#mobile-bottom-category-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('body').addClass('nav-open');
    });

    // 3. 同步更新底部导航的购物车角标
    if (typeof window.updateCartBadge === 'function') {
        const originalUpdateCartBadge = window.updateCartBadge;
        window.updateCartBadge = function() {
            originalUpdateCartBadge();
            try {
                const cartStr = localStorage.getItem('tbShopCart');
                const cart = cartStr ? JSON.parse(cartStr) : [];
                const count = cart.length;
                $('#footer-cart-badge').text(count > 99 ? '99+' : count).css('display', count > 0 ? 'block' : 'none');
            } catch(e) {}
        };
        setTimeout(window.updateCartBadge, 100);
    }

    // --- 返回顶部逻辑绑定 ---
    $(window).scroll(function() {
        if ($(window).scrollTop() > $(window).height() * 0.5) {
            $('#back-to-top').addClass('show');
        } else {
            $('#back-to-top').removeClass('show');
        }
    });

    $('#back-to-top').click(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 2. DOM 解析完毕瞬间无延迟插入页尾骨架
$(document).ready(function() {
    insertFooterSkeleton();
});

// 3. 异步数据到达后调用的数据填充函数
window.renderFooter = function() {
    insertFooterSkeleton(); // 兜底检查
    const defaultFooterHtml = `
        <div class="footer-meta">
            <div class="footer-links">
                <a href="" target="_blank"><i class="fab fa-qq"></i> 137222445</a><span class="split" style="margin: 0 3px;">|</span><a href="" target="_blank"><i class="fab fa-telegram-plane"></i> @gv1688</a><span class="split" style="margin: 0 3px;">|</span><a href="/admin" target="_blank">登陆 </a> 
            </div>
            <p>Copyright @ 2026 <a href="/" target="_blank">XYFK </a>基于 Cloudflare 构建</p>
        </div>
    `;

    $.ajax({
        url: '/api/shop/config',
        method: 'GET',
        success: function(res) {
            // 如果后台有自定义代码，就显示自定义的
            if (res && res.footer_html && res.footer_html.trim() !== '') {
                $('#custom-footer-container').html(res.footer_html);
            } else {
                // 否则显示默认的
                $('#custom-footer-container').html(defaultFooterHtml);
            }
            // --- 新增：全局执行自定义页脚代码 (支持 JS/HTML) ---
            if (res && res.custom_js) {
                const div = document.createElement('div');
                div.innerHTML = res.custom_js;
                Array.from(div.querySelectorAll('script')).forEach(oldScript => {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    document.body.appendChild(newScript);
                });
            }
        },
        error: function() {
            // 接口请求失败时也兜底显示默认的
            $('#custom-footer-container').html(defaultFooterHtml);
        }
    });
};
// === 纯原生 JS 幻灯片放大组件 (兼容所有主题，无依赖) ===
document.addEventListener('DOMContentLoaded', function() {
    // 1. 动态注入 CSS
    const style = document.createElement('style');
    style.innerHTML = `
    #xy-lightbox { display: none; position: fixed; z-index: 999999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.85); user-select: none; }
    #xy-lightbox.show { display: block; }
    #xy-lightbox-img { max-width: 90%; max-height: 90%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0 4px 15px rgba(0,0,0,0.5); border-radius: 4px; transition: opacity 0.2s; }
    #xy-lightbox-close { position: absolute; top: 15px; right: 25px; color: #fff; font-size: 40px; cursor: pointer; z-index: 1000000; font-weight: bold; line-height: 1; }
    .xy-lb-nav { position: absolute; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.6); font-size: 50px; cursor: pointer; padding: 20px; z-index: 1000000; transition: color 0.3s; user-select: none; }
    .xy-lb-nav:hover { color: #fff; }
    #xy-lb-prev { left: 10px; }
    #xy-lb-next { right: 10px; }
    #article-content img, #detail-left-content img, #detail-right-content img, #product-content img { cursor: zoom-in; transition: transform 0.2s; }
    #article-content img:hover, #detail-left-content img:hover, #detail-right-content img:hover, #product-content img:hover { transform: scale(1.02); }
    `;
    document.head.appendChild(style);

    // 2. 动态注入 HTML 框架
    const lb = document.createElement('div');
    lb.id = 'xy-lightbox';
    lb.innerHTML = `
        <span id="xy-lightbox-close">&times;</span>
        <div id="xy-lb-prev" class="xy-lb-nav">&#10094;</div>
        <img id="xy-lightbox-img" src="">
        <div id="xy-lb-next" class="xy-lb-nav">&#10095;</div>
    `;
    document.body.appendChild(lb);

    // 3. 事件委托绑定与核心逻辑
    let xyImages = [];
    let xyCurrentIdx = 0;
    const lbImg = document.getElementById('xy-lightbox-img');
    const lbWrap = document.getElementById('xy-lightbox');

    // 监听全局点击事件
    document.body.addEventListener('click', function(e) {
        const target = e.target;
        // 如果点击的是图片
        if (target.tagName === 'IMG') {
            // 检查图片是否在我们需要放大的容器内
            const container = target.closest('#article-content, #detail-left-content, #detail-right-content, #product-content');
            if (container) {
                xyImages = [];
                const imgs = container.querySelectorAll('img');
                imgs.forEach(img => xyImages.push(img.src));
                
                xyCurrentIdx = xyImages.indexOf(target.src);
                if (xyCurrentIdx !== -1) {
                    lbImg.src = xyImages[xyCurrentIdx];
                    lbWrap.classList.add('show');
                }
            }
        }
    });

    // 切换图片过渡效果
    function showXyImage() {
        lbImg.style.opacity = 0;
        setTimeout(() => {
            lbImg.src = xyImages[xyCurrentIdx];
            lbImg.style.opacity = 1;
        }, 150);
    }

    // 上一张
    document.getElementById('xy-lb-prev').addEventListener('click', function(e) {
        e.stopPropagation();
        if(xyImages.length === 0) return;
        xyCurrentIdx = (xyCurrentIdx > 0) ? xyCurrentIdx - 1 : xyImages.length - 1;
        showXyImage();
    });

    // 下一张
    document.getElementById('xy-lb-next').addEventListener('click', function(e) {
        e.stopPropagation();
        if(xyImages.length === 0) return;
        xyCurrentIdx = (xyCurrentIdx < xyImages.length - 1) ? xyCurrentIdx + 1 : 0;
        showXyImage();
    });

    // 点击空白处或关闭按钮关闭幻灯片
    lbWrap.addEventListener('click', function(e) {
        if (e.target.id !== 'xy-lightbox-img' && e.target.id !== 'xy-lb-prev' && e.target.id !== 'xy-lb-next') {
            lbWrap.classList.remove('show');
        }
    });
});
