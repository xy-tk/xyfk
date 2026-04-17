CREATE TABLE article_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort INTEGER DEFAULT 0
);

CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER DEFAULT 1,
    title TEXT NOT NULL,
    content TEXT,
    is_notice INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER,
    cover_image TEXT,
    active INTEGER DEFAULT 1,
    FOREIGN KEY (category_id)
    REFERENCES article_categories(id)
    ON DELETE SET DEFAULT
);

CREATE TABLE cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    variant_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    status INTEGER DEFAULT 0,
    order_id TEXT,
    created_at INTEGER,
    FOREIGN KEY (variant_id)
    REFERENCES variants(id)
    ON DELETE CASCADE
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort INTEGER DEFAULT 0,
    image_url TEXT
);

CREATE TABLE image_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort INTEGER DEFAULT 0
);

CREATE TABLE images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER DEFAULT 1,
    url TEXT NOT NULL,
    name TEXT,
    created_at INTEGER,
    FOREIGN KEY (category_id)
    REFERENCES image_categories(id)
    ON DELETE SET DEFAULT
);

CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    trade_no TEXT,
    variant_id INTEGER NOT NULL,
    product_name TEXT,
    variant_name TEXT,
    price REAL,
    quantity INTEGER DEFAULT 1,
    total_amount REAL,
    contact TEXT,
    payment_method TEXT,
    status INTEGER DEFAULT 0,
    cards_sent TEXT,
    created_at INTEGER,
    paid_at INTEGER,
    query_password TEXT
);

CREATE TABLE pay_gateways (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    config TEXT NOT NULL,
    active INTEGER DEFAULT 1
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER DEFAULT 1,
    name TEXT NOT NULL,
    description TEXT,
    sort INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at INTEGER,
    image_url TEXT,
    tags TEXT
);

CREATE TABLE site_config (
    key   TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE variants (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id       INTEGER NOT NULL,
    name             TEXT NOT NULL,
    price            REAL NOT NULL,
    stock            INTEGER DEFAULT 0,
    color            TEXT,
    image_url        TEXT,
    wholesale_config TEXT,
    custom_markup    REAL DEFAULT 0,
    sales_count      INTEGER DEFAULT 0,
    auto_delivery    INTEGER DEFAULT 1,
    created_at       INTEGER,
    random_mode_text TEXT,
    selection_label  TEXT,
    sort             INTEGER DEFAULT 0,
    active           INTEGER DEFAULT 1,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    alias TEXT UNIQUE NOT NULL,
    content TEXT,
    created_at INTEGER,
    updated_at INTEGER
);

这个和


-- 1. 系统配置表 (site_config)
CREATE TABLE IF NOT EXISTS site_config (
    key  TEXT PRIMARY KEY,
    value TEXT
);
-- 仅在没有数据时插入默认配置
INSERT OR IGNORE INTO site_config (key, value) VALUES 
('site_name', '夏雨 Faka Demo'), 
('announce', '<p>欢迎光临</p>'), 
('theme', 'default');

-- 2. 支付网关表 (pay_gateways)
CREATE TABLE IF NOT EXISTS pay_gateways (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    config TEXT NOT NULL,
    active INTEGER DEFAULT 1
);

-- 3. 商品分类表 (categories)
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort INTEGER DEFAULT 0,
    image_url TEXT
);
INSERT OR IGNORE INTO categories (id, name, sort) VALUES (1, '默认分类', 0);

-- 4. 商品表 (products)
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER DEFAULT 1,
    name TEXT NOT NULL,
    description TEXT,
    sort INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at INTEGER,
    image_url TEXT,
    tags TEXT
);

-- 5. 商品规格表 (variants)
CREATE TABLE IF NOT EXISTS variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    color TEXT,
    image_url TEXT,
    wholesale_config TEXT,
    custom_markup REAL DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    auto_delivery INTEGER DEFAULT 1,
    created_at INTEGER,
    selection_label TEXT,
    sort INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. 卡密表 (cards)
CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    variant_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    status INTEGER DEFAULT 0,
    order_id TEXT,
    created_at INTEGER,
    FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE CASCADE
);

-- 7. 订单表 (orders)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    trade_no TEXT,
    variant_id INTEGER NOT NULL,
    product_name TEXT,
    variant_name TEXT,
    price REAL,
    quantity INTEGER DEFAULT 1,
    total_amount REAL,
    contact TEXT,
    payment_method TEXT,
    status INTEGER DEFAULT 0,
    cards_sent TEXT,
    created_at INTEGER,
    paid_at INTEGER,
    query_password TEXT
);

-- 8. 文章分类表 (article_categories)
CREATE TABLE IF NOT EXISTS article_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort INTEGER DEFAULT 0
);
INSERT OR IGNORE INTO article_categories (id, name, sort) VALUES (1, '默认分类', 0);

-- 9. 文章表 (articles)
CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER DEFAULT 1,
    title TEXT NOT NULL,
    content TEXT,
    is_notice INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER,
    cover_image TEXT,
    active INTEGER DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES article_categories(id) ON DELETE SET DEFAULT
);

-- 10. 图片分类表 (image_categories)
CREATE TABLE IF NOT EXISTS image_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort INTEGER DEFAULT 0
);
INSERT OR IGNORE INTO image_categories (id, name, sort) VALUES (1, '默认分类', 0);

-- 11. 图片库表 (images)
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER DEFAULT 1,
    url TEXT NOT NULL,
    name TEXT,
    created_at INTEGER,
    FOREIGN KEY (category_id) REFERENCES image_categories(id) ON DELETE SET DEFAULT
);

--------------------------------------------
这个是一样的吗?

这些关键关系 完全相同。

所以：从“数据库结构设计”角度看，是同一套表结构。

二、真正的区别在这 3 个点（重点）⚠️
1️⃣ 第二份用了 IF NOT EXISTS（更安全）

第二份几乎所有 CREATE TABLE 都是：

CREATE TABLE IF NOT EXISTS xxx (...)


而第一份是：

CREATE TABLE xxx (...)


区别：

第一份：
👉 如果表已存在，会直接报错

第二份：
👉 表存在就跳过，适合重复执行 / 安装脚本

✅ 第二份更适合生产 / 自动部署

2️⃣ 第二份有「默认数据初始化」，第一份没有 ❗

这是最关键差异。

第二份多了很多：

INSERT OR IGNORE INTO ...


比如：

site_config 默认值
('site_name', '夏雨 Faka Demo'),
('announce', '<p>欢迎光临</p>'),
('theme', 'default');

默认分类（非常重要）
INSERT OR IGNORE INTO categories (id, name) VALUES (1, '默认分类');
INSERT OR IGNORE INTO article_categories (id, name) VALUES (1, '默认分类');
INSERT OR IGNORE INTO image_categories (id, name) VALUES (1, '默认分类');


⚠️ 而你的表里大量字段是：

category_id INTEGER DEFAULT 1


👉 如果你 不用第二份的初始化 SQL：

category_id = 1

但 id = 1 的分类 根本不存在

外键一启用就会出问题

✅ 第二份是**“结构 + 可用状态”**
❌ 第一份只是**“空结构”**

3️⃣ 第二份是「完整安装脚本」，第一份是「纯表定义」
维度	第一份	第二份
是否可重复执行	❌	✅
是否包含默认数据	❌	✅
是否适合首次部署	⚠️	✅
是否适合升级对照	✅	⚠️
三、结论总结（直接用这个判断）✅

结构一样吗？
✔️ 是的，字段级别一致

数据库状态一样吗？
❌ 不一样，第二份多了初始化数据

实际项目能不能互换？
⚠️ 不能直接当成完全相同

四、实战建议（很重要）🔥
✅ 如果你是「新项目 / 首次安装」

👉 用第二份

✅ 如果你已经有数据库，只想确认结构

👉 第一份够用

✅ 最佳方案（我强烈建议）

合并成一个“标准安装 SQL”：

CREATE TABLE IF NOT EXISTS

INSERT OR IGNORE 默认数据

开启 PRAGMA foreign_keys = ON;

如果你愿意，我可以直接帮你：

🔧 合并成 一份标准 install.sql

🔄 或写一份 升级对比 SQL（diff 版）

-----------------------------------------------
你可以修改你的 schema.sql，在 CREATE TABLE image_categories ...; 这段代码的后面，紧接着加上这句：

SQL
-- 1. 先创建表
CREATE TABLE IF NOT EXISTS image_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort INTEGER DEFAULT 0
);

-- 2. 【关键】紧接着插入默认分类（这就是你要的“设置为1”）
INSERT OR IGNORE INTO image_categories (id, name, sort) VALUES (1, '默认分类', 0);






