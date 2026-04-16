/* themes/default/files/footer.js - 渲染页面底部 */

// 函数现在接受 siteName 作为参数
// 1. 改为骨架挂载函数
function insertFooterSkeleton() {
    const currentYear = new Date().getFullYear();
    if ($('footer').length > 0) return;
    
    // 将原先的 ${siteName} 替换为带 ID 的空 span 占位符
    const footerHtml = `
        <footer class="text-center text-muted py-4">
            <div class="container" style="font-size: 12px;color: rgb(112 118 124 / 88%);">
                <p class="mb-0">&copy; ${currentYear} <span id="global-footer-name"></span>. All rights reserved.</p>
                <p class="mb-0">Powered by Luna. | <a href="admin/" class="text-muted">后台管理</a></p>
            </div>
        </footer>
    `;
    
    $('body').append(footerHtml);
}

// 2. DOM 解析完毕瞬间无延迟插入页尾骨架
$(document).ready(function() {
    insertFooterSkeleton();
});

// 3. 异步数据到达后调用的数据填充函数
window.renderFooter = function(siteName = '我的商店') {
    insertFooterSkeleton(); // 兜底检查
    $('#global-footer-name').text(siteName);
};
// 移除自动执行逻辑，等待 main-default-bs.js 调用
// $(document).ready(function() {
//     if ($('footer').length === 0) {
//         renderFooter();
//     }
// });
