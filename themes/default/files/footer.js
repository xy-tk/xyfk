/* themes/default/files/footer.js - 渲染页面底部 */

// 1. 改为骨架挂载函数
function insertFooterSkeleton() {
    const currentYear = new Date().getFullYear();
    // 防重复插入检查
    if ($('footer.footer').length > 0) return;   

    const footerHtml = `
        <style>
            .footer a:hover{color:#0d6efd !important;}  
            .footer a{color:#212529bf !important;}
            .footer{
                width:100%;
                text-align:center;
                padding:25px 0 30px;
                color:#939393;
                line-height: 1.8;
            }   
            .footer .container{
                max-width:1200px;
                font-size: 13px;
                margin:0 auto;
            }
            
            @media (max-width:767px){       
                .footer{
                    padding:15px 0;
                    margin-top:-20px;
                }
                .footer .container{
                    font-size:12px;
                }
            }
        </style>

        <footer class="footer">
            <div class="container" id="custom-footer-container">
            </div>
            <div id="back-to-top" class="back-to-top"><i class="far fa-chevron-up"></i></div>
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
            <p>Copyright @ 2026 <a href="/" target="_blank">XYFK </a> - 基于 Cloudflare 构建</p>
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
