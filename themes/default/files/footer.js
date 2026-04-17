/* themes/default/files/footer.js - 渲染页面底部 */

// 函数现在接受 siteName 作为参数
// 1. 改为骨架挂载函数
function insertFooterSkeleton() {
    const currentYear = new Date().getFullYear();
    if ($('footer').length > 0) return;   

    const footerHtml = `
		<style>
			.footer a:hover{
			    color:#0d6efd !important;
			}
			
			.footer{
			    width:100%;
			    text-align:center;
			    padding:25px 0 30px;
			    color:#868689;
			}
			
			.footer .container{
			    max-width:1200px;
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
		<div class="container">
			<div class="footer-meta">
				<div class="footer-links">
					<a href="" target="_blank"><i class="fab fa-qq"></i> 137222445</a><span class="split" style="margin: 0 3px;">|</span><a href="" target="_blank"><i class="fab fa-telegram-plane"></i> @gv1688</a><span class="split" style="margin: 0 3px;">|</span><a href="" target="_blank"><i class="fas fa-rss"></i> </a>
				</div>
				<p></p><p>Copyright @ 2026 <a href="/" target="_blank">XYFK </a> - 基于 Cloudflare 构建</p>
<p></p>
			</div>
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
