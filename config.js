// 前端全局配置文件
window.SITE_CONFIG = {
    // 网站名称（通常会由后端 /api/shop/config 覆盖，这里作为默认值）
    siteName: "Cloudflare Faka Demo",
    
    // API 基础路径。如果前后端在同一域名下，保持为 '' 或 '/api' 均可。
    // 如果后端在不同域名，需要填写完整 URL，如 'https://api.example.com'
    apiBase: "", 

    // 当前使用的主题名称（目前主要由 Worker 路由控制，此处仅作记录）
    theme: "default",

    // 版本号
    version: "1.0.0"
};
// 全局图片压缩、缩略图生成及上传函数
window.smartUpload = function(file, successCallback, errorCallback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width; 
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            // --- [新增] 生成最大宽度为 250px 的缩略图 ---
            const thumbCanvas = document.createElement('canvas');
            const thumbCtx = thumbCanvas.getContext('2d');
            let thumbWidth = img.width;
            let thumbHeight = img.height;
            if (thumbWidth > 250) {
                thumbHeight = Math.floor(thumbHeight * (250 / thumbWidth));
                thumbWidth = 250;
            }
            thumbCanvas.width = thumbWidth;
            thumbCanvas.height = thumbHeight;
            thumbCtx.drawImage(img, 0, 0, thumbWidth, thumbHeight);
            const thumbnailBase64 = thumbCanvas.toDataURL('image/jpeg', 0.6); 
            // ------------------------------------------

            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                const newName = file.name.replace(/\.[^/.]+$/, ".webp"); 
                formData.append('file', blob, newName);
                formData.append('thumbnail', thumbnailBase64);
                formData.append('dim', `${img.width}x${img.height}`);
                
                try {
                    const res = await fetch('/api/admin/image/upload', { 
                        method: 'POST', 
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('ADMIN_TOKEN')}` }, 
                        body: formData 
                    }).then(r => r.json());
                    if (res.location) successCallback(res.location);
                    else errorCallback ? errorCallback(res.error) : alert(res.error || '上传失败');
                } catch (err) { errorCallback ? errorCallback(err) : alert('上传错误'); }
            }, 'image/webp', 0.85);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};
// --- 公共图片转换 WebP 函数 ---
window.utils = {
    convertToWebp: (file, quality = 0.8) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        // 强制修改后缀为 .webp
                        const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                        resolve(new File([blob], newName, { type: "image/webp" }));
                    }, 'image/webp', quality);
                };
            };
        });
    }
};
