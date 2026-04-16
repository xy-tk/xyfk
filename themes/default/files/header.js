/* themes/default/files/header.js - 渲染页面头部（导航栏） */

/**
 * 渲染页头
 * @param {string} siteName - 网站名称
 * @param {string} siteLogo - 网站Logo地址 (可选)
 * @param {boolean|string} showSiteName - 是否显示网站名称 (true/'1' 显示, false/'0' 隐藏)
 */
function renderHeader(siteName = '我的商店', siteLogo = '', showSiteName = true) {
    // 检查是否已渲染，防止重复
    if ($('header').length > 0) return;
    
    // 1. 构建 Logo 的 HTML
    // 要求：Logo高度47px
    const logoHtml = siteLogo 
        ? `<img src="${siteLogo}" alt="Logo" class="site-logo">` 
        : '';

    // 2. 构建店铺名称 HTML
    // 逻辑：默认显示，只有当明确设置为 '0' 或 false 时才隐藏
    const shouldShowName = (showSiteName !== '0' && showSiteName !== 0 && showSiteName !== false && showSiteName !== 'false');
    
    let nameHtml = '';
    if (shouldShowName) {
        nameHtml = `<span>${siteName}</span>`;
    }

    // 注入自定义 CSS 样式
    const styleHtml = `
        <style>
            /* 1. 页头容器样式 */
            header.custom-header {
                height: 60px; /* 要求：页头高度60px */
                background-color: #ffffff; /* 要求：页头颜色白色 */
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                position: sticky;
                top: 0;
                z-index: 1030;
            }

            /* 2. Navbar 调整 */
            header.custom-header .navbar {
                height: 100%;
            }
            
            /* 3. 店铺名称样式 */
            header.custom-header .navbar-brand {
                font-size: 19px !important; /* 要求：字体 19px */
                font-weight: 600 !important; /* 要求：字重 600 */
                color: #333 !important;
                display: flex;
                align-items: center;
                margin-right: 30px;
            }
            header.custom-header .site-logo {
                height: 47px; /* 要求：Logo高度 47px */
                width: auto;
                margin-right: 10px;
                object-fit: contain;
            }

            /* 4. 菜单项样式 */
            header.custom-header .nav-link {
                font-size: 14px !important; /* 要求：其他字体 14px */
                color: #555 !important;
                display: flex;
                align-items: center;
                padding-left: 12px !important;
                padding-right: 12px !important;
                height: 60px; /* 垂直居中 */
                transition: color 0.2s;
                position: relative;
            }
            header.custom-header .nav-link:hover,
            header.custom-header .nav-link.active {
                color: var(--bs-primary) !important;
                background-color: rgba(0,0,0,0.02);
            }
            
            /* 5. 图标样式 */
            header.custom-header .nav-link i {
                margin-right: 6px;
                font-size: 14px;
                width: 16px;
                text-align: center;
            }

            /* 6. 搜索框样式 */
            .header-search-form {
                position: relative;
                margin-left: 15px;
            }
            .header-search-input {
                border-radius: 20px;
                font-size: 13px;
                padding: 5px 15px 5px 15px;
                border: 1px solid #eee;
                background-color: #f8f9fa;
                width: 200px;
                transition: all 0.3s;
                height: 34px;
            }
            .header-search-input:focus {
                background-color: #fff;
                border: 1px solid #555; /* 强制 1px 边框 */
                box-shadow: none;  /* 去掉浅蓝色光晕/外边框 */
                width: 240px;
                outline: none; /* 去掉浏览器默认的高亮轮廓 */
            }
            .header-search-icon {
                position: absolute;
                right: 11px;
                top: 50%;
                transform: translateY(-50%);
                color: #aaa;
                font-size: 14px;
                pointer-events: none;
            }

            /* 7. 下拉菜单样式 (鼠标移入向下滑出) */
            header.custom-header .dropdown-menu {
                display: none; /* 默认隐藏 */
                margin-top: 0;
                border: none;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                border-radius: 4px;
                padding: 5px 0;
                min-width: 160px;
            }
            /* 关键：Hover 时显示并执行 slideDown 动画 */
            header.custom-header .nav-item.dropdown:hover .dropdown-menu {
                display: block;
                animation: slideDown 0.2s ease forwards;
            }
            /* --- 商品分类折叠样式 (仿 xybk 逻辑) --- */
            .category-toggle-wrap { display: flex; align-items: center; justify-content: space-between; width: 100%; }
            .category-arrow { 
                padding: 10px 20px; 
                cursor: pointer; 
                transition: transform 0.3s ease; 
                color: #999;
            }
            /* PC端 Hover 或 移动端点击展开时，箭头向下(顺时针转90度) */
            .nav-item.dropdown:hover .category-arrow,
            .nav-item.dropdown.menu-expanded .category-arrow { transform: rotate(90deg); }
            /* 移动端侧滑状态下，带有 .menu-expanded 类的菜单强制显示 */
            @media (max-width: 991px) {
                header.custom-header .nav-item.dropdown.menu-expanded .dropdown-menu { 
                    display: block !important; 
                }
            }
            
            header.custom-header .dropdown-item {
                font-size: 14px !important; /* 要求：下拉菜单字体 14px */
                padding: 8px 15px;
                color: #555;
                display: flex;
                align-items: center;
            }
            header.custom-header .dropdown-item:hover {
                background-color: #f8f9fa;
                color: var(--bs-primary);
            }
            header.custom-header .category-icon-sm {
                width: 14px;  /* 要求：图标大小 14px */
                height: 14px; /* 要求：图标大小 14px */
                object-fit: cover;
                margin-right: 8px;
                border-radius: 2px;
            }

            /* === 新增：购物车图标与角标样式 === */
            .header-cart-wrap {
                position: relative;
                margin-left: 15px;
                color: #6c757d; /* 灰色图标 */
                font-size: 18px;
                text-decoration: none;
                display: flex;
                align-items: center;
                cursor: pointer;
                transition: color 0.2s;
            }
            .header-cart-wrap:hover { color: #333; }
            
            .common-cart-badge {
                position: absolute;
                top: -8px;
                right: -10px;
                background-color: #dc3545; /* 红色背景 */
                color: #fff;               /* 白字 */
                border-radius: 50%;        /* 圆形 */
                font-size: 10px;
                min-width: 16px;
                height: 16px;
                line-height: 16px;
                text-align: center;
                padding: 1px 3px;
                display: none;             /* 默认隐藏 */
                box-shadow: 0 1px 2px rgba(0,0,0,0.2);
            }

            /* 移动端适配 */
            @media (max-width: 991px) {
                header.custom-header { height: auto; min-height: 52px; }
                header.custom-header .site-logo { height: 43px; } 
                header.custom-header .navbar-toggler { border: none; box-shadow: none; outline: none; }
                header.custom-header .navbar-toggler-icon { width: 1em; height: 1em; }
                /* --- 侧滑菜单样式 --- */
                header.custom-header .navbar-collapse {
                    position: fixed; top: 0; right: -280px; /* 默认隐藏在屏幕右侧外 */
                    width: 280px; height: 100vh; background-color: #fff;
                    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                    transition: right 0.3s ease; z-index: 1050;
                    padding: 0; display: block !important; /* 强制覆盖原本的隐藏属性 */
                    overflow-y: auto;
                }
                body.nav-open header.custom-header .navbar-collapse {
                    right: 0; /* JS触发时滑出 */
                }
                /* 侧边栏遮罩层 */
                #mobile-menu-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                    background: rgba(0,0,0,0.5); z-index: 1040;
                    opacity: 0; visibility: hidden; transition: all 0.3s ease;
                }
                body.nav-open #mobile-menu-overlay {
                    opacity: 1; visibility: visible;
                }
                /* 菜单项样式重置 */
                header.custom-header .nav-link { height: 45px; border-bottom: 1px solid #f5f5f5; padding-left: 20px !important; }
                header.custom-header .dropdown-menu {
                    position: static; box-shadow: none; border: none; padding-left: 20px; display: none; background: #fafafa;
                }
            }
        </style>
    `;

    // 导航栏 HTML
    const headerHtml = `
        ${styleHtml}
        <header class="custom-header">
            <nav class="navbar navbar-expand-lg navbar-light">
                <div class="container d-flex justify-content-between align-items-center position-relative">
                    
                    <div class="header-search-form d-lg-none m-0" style="width: auto;">
                        <i class="far fa-search header-search-icon" style="left: 0; pointer-events: auto; cursor: pointer; color: #555; z-index: 2;" onclick="$(this).next('input').focus()"></i>
                        <input type="text" class="header-search-input bg-transparent border-0 shadow-none" placeholder="搜索商品..." style="padding-left: 25px; width: 30px; color: transparent; transition: all 0.3s; position: relative; z-index: 1;" onfocus="this.style.width='160px'; this.style.color='#333'; this.style.backgroundColor='#f8f9fa'; this.style.borderRadius='20px';" onblur="if(!this.value){this.style.width='30px'; this.style.color='transparent'; this.style.backgroundColor='transparent';}">
                    </div>

                    <a class="navbar-brand d-none d-lg-flex" href="/">
                        ${logoHtml}
                        ${nameHtml}
                    </a>
                    <a class="navbar-brand d-lg-none position-absolute start-50 translate-middle-x m-0" href="/">
                        ${logoHtml}
                        ${nameHtml}
                    </a>

                    <div class="d-flex align-items-center d-lg-none ms-auto">
                        <a href="/cart" class="header-cart-wrap me-2" title="购物车" style="margin-left: 0;">
                            <i class="far fa-shopping-cart"></i>
                            <span class="common-cart-badge" id="cart-badge-mobile">0</span>
                        </a>
                        <button class="navbar-toggler" type="button" id="mobile-menu-btn">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    <button class="navbar-toggler d-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarNav">
                        <div class="d-lg-none text-end p-3" id="close-menu-btn" style="cursor: pointer; font-size: 28px; color: #999; line-height: 1;">
                            &times;
                        </div>
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link" href="/">
                                    <i class="fas fa-home"></i>商城首页
                                </a>
                            </li>
                           <li class="nav-item dropdown">
                                <div class="nav-link category-toggle-wrap">
                                    <a href="/#category-list" style="color: inherit; text-decoration: none; flex: 1;">
                                        <i class="fas fa-list-ul"></i>商品分类
                                    </a>
                                    <span class="category-arrow" id="mobile-category-arrow">
                                        <i class="fal fa-angle-right"></i>
                                    </span>
                                </div>
                                <ul class="dropdown-menu" aria-labelledby="categoryDropdown" id="header-category-menu">
                                    <li><span class="dropdown-item text-muted">加载中...</span></li>
                                </ul>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="orders">
                                    <i class="fas fa-search"></i>订单查询
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="articles">
                                    <i class="fas fa-book-open"></i>文章中心
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="javascript:void(0);" onclick="alert('关于我们页面正在建设中...')">
                                    <i class="fas fa-info-circle"></i>关于我们
                                </a>
                            </li>
                        </ul>

                        <div class="header-search-form d-none d-lg-block">
                            <i class="far fa-search header-search-icon"></i>
                            <input type="text" class="header-search-input" id="top-search-input" placeholder="搜索商品...">
                        </div>

                        <a href="/cart" class="header-cart-wrap d-none d-lg-block" title="购物车">
                            <i class="far fa-shopping-cart"></i>
                            <span class="common-cart-badge" id="header-cart-badge">0</span>
                        </a>

                    </div>
                </div>
            </nav>
            <div id="mobile-menu-overlay"></div>
        </header>
    `;
    
    $('body').prepend(headerHtml);
    
    const currentPath = window.location.pathname.split('/').pop() || '/';
    $('.nav-link').removeClass('active');
    
    if (currentPath === '' || currentPath === '/') {
        $('a[href="/"]').first().addClass('active');
    } else {
        $(`a[href="${currentPath}"]`).addClass('active');
    }

    loadHeaderCategories();
    
    // 初始化购物车角标
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }

    $('.header-search-input').on('keypress', function(e) {
        if (e.which == 13) {
            const kw = $(this).val().trim().toLowerCase();
            if (!kw) return;

            if (window.location.pathname.endsWith('/') || window.location.pathname === '/') {
                let found = 0;
                $('.product-card-item').each(function() {
                    const text = $(this).text().toLowerCase();
                    if (text.includes(kw)) {
                        $(this).show();
                        $(this).closest('.col-12').show(); // 确保显示商品所在列
                        found++;
                    } else {
                        $(this).hide();
                        $(this).closest('.col-12').hide(); // 隐藏商品所在列
                    }
                });

                // 新增：遍历所有分类大框，如果没有可见商品则隐藏整个框
                $('#goods-container .main-box').each(function() {
                    const hasVisible = $(this).find('.product-card-item:visible').length > 0;
                    if (hasVisible) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
                if (found === 0) {
                    alert('未找到包含 "' + kw + '" 的商品');
                    $('.product-card-item').show();
                } else {
                    $('html, body').animate({
                        scrollTop: $("#product-list").offset().top - 80
                    }, 500);
                }
            } else {
                window.location.href = '/?search=' + encodeURIComponent(kw);
            }
        }
    });
    // 新增：移动端侧滑菜单交互逻辑
    const menuBtn = $('#mobile-menu-btn');
    const closeBtn = $('#close-menu-btn');
    const overlay = $('#mobile-menu-overlay');
    const body = $('body');

    menuBtn.on('click', function(e) {
        e.stopPropagation();
        body.addClass('nav-open');
    });

    closeBtn.add(overlay).on('click', function() {
        body.removeClass('nav-open');
    });

    $('#navbarNav').on('click', function(e) {
        e.stopPropagation(); // 防止点击菜单内部导致面板关闭
    });
    // 新增：移动端商品分类箭头点击折叠/展开
    $('#mobile-category-arrow').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const parentLi = $(this).closest('.nav-item.dropdown');
        const menu = $('#header-category-menu');
        
        if (parentLi.hasClass('menu-expanded')) {
            menu.slideUp(300, function() {
                parentLi.removeClass('menu-expanded');
            });
        } else {
            parentLi.addClass('menu-expanded');
            menu.hide().slideDown(300);
        }
    });
}

/**
 * 加载分类并渲染到下拉菜单
 */
function loadHeaderCategories() {
    $.ajax({
        url: '/api/shop/categories',
        method: 'GET',
        success: function(response) {
            let categories = [];
            if (response && response.code === 0 && response.data && Array.isArray(response.data.categories)) {
                categories = response.data.categories;
            } else if (response && (Array.isArray(response) || Array.isArray(response.categories))) {
                categories = Array.isArray(response) ? response : response.categories;
            } else if (response && response.results && Array.isArray(response.results)) {
                 categories = response.results;
            }

            const menuContainer = $('#header-category-menu');
            menuContainer.empty();

            if (categories.length === 0) {
                menuContainer.append('<li><span class="dropdown-item text-muted">暂无分类</span></li>');
                return;
            }

            categories.forEach(cat => {
                const imgHtml = (cat.image_url && cat.image_url !== '') 
                    ? `<img src="${cat.image_url}" class="category-icon-sm" alt="icon">` 
                    : '';
                
                const itemHtml = `
                    <li>
                        <a class="dropdown-item" href="javascript:void(0);" onclick="handleCategoryClick(${cat.id})">
                            ${imgHtml}${cat.name}
                        </a>
                    </li>
                `;
                menuContainer.append(itemHtml);
            });
        },
        error: function() {
            $('#header-category-menu').html('<li><span class="dropdown-item text-danger">加载失败</span></li>');
        }
    });
}

// 全局分类点击处理
window.handleCategoryClick = function(catId) {
    if (typeof loadProducts === 'function' && $('#goods-container').length > 0) {
        loadProducts(catId);
        if ($('#category-list').length > 0) {
             $('#category-list button').removeClass('btn-primary').addClass('btn-outline-primary');
             $(`#category-list button[data-id="${catId}"]`).removeClass('btn-outline-primary').addClass('btn-primary');
        }
        $('html, body').animate({ scrollTop: $("#product-list").offset().top - 100 }, 300);
    } else {
        window.location.href = '/?category_id=' + catId;
    }
};

/**
 * 全局函数：更新购物车角标
 * 读取 localStorage 中的 tbShopCart
 */
window.updateCartBadge = function() {
    try {
        const cartStr = localStorage.getItem('tbShopCart');
        const cart = cartStr ? JSON.parse(cartStr) : [];
        const count = cart.length; // 根据需求，显示商品种数（或者 quantity 之和）

        const badgeDisplay = count > 0 ? 'block' : 'none';
        const badgeText = count > 99 ? '99+' : count;

        // 更新页头角标
        const headerBadge = $('#header-cart-badge');
        if(headerBadge.length) {
            headerBadge.text(badgeText).css('display', badgeDisplay);
        }
        
        // 更新详情页角标（如果在详情页）
        const prodBadge = $('#product-page-cart-badge');
        if(prodBadge.length) {
            prodBadge.text(badgeText).css('display', badgeDisplay);
        }

        // 更新移动端底部导航角标（如果有）
        const mobileBadge = $('#cart-badge-mobile');
        if(mobileBadge.length) {
             mobileBadge.text(badgeText).css('display', badgeDisplay);
        }
    } catch(e) {
        console.error('Update cart badge failed:', e);
    }
}
