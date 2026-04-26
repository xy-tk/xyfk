-- 1. 文章分类表
CREATE TABLE IF NOT EXISTS article_categories (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort INTEGER DEFAULT 0
);
INSERT OR IGNORE INTO article_categories (id, name, sort) VALUES (1, '默认分类', 0);

-- 2. 文章表
CREATE TABLE IF NOT EXISTS articles (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER DEFAULT 1,
    title       TEXT NOT NULL,
    content     TEXT,
    is_notice   INTEGER DEFAULT 0,
    view_count  INTEGER DEFAULT 0,
    created_at  INTEGER,
    updated_at  INTEGER,
    cover_image TEXT,
    active      INTEGER DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES article_categories(id) ON DELETE SET DEFAULT
);

-- 3. 商品分类表
CREATE TABLE IF NOT EXISTS categories (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL,
    sort      INTEGER DEFAULT 0,
    image_url TEXT
);
INSERT OR IGNORE INTO categories (id, name, sort) VALUES (1, '默认分类', 0);

-- 4. 商品表
CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER DEFAULT 1,
    name        TEXT NOT NULL,
    description TEXT,
    sort        INTEGER DEFAULT 0,
    active      INTEGER DEFAULT 1,
    created_at  INTEGER,
    image_url   TEXT,
    tags        TEXT
);

-- 5. 商品规格表
CREATE TABLE IF NOT EXISTS variants (
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
    selection_label  TEXT,
    sort             INTEGER DEFAULT 0,
    active           INTEGER DEFAULT 1,
    random_mode_text TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. 卡密表
CREATE TABLE IF NOT EXISTS cards (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    variant_id INTEGER NOT NULL,
    content    TEXT NOT NULL,
    status     INTEGER DEFAULT 0,
    order_id   TEXT,
    created_at INTEGER,
    FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE CASCADE
);

-- 7. 图片分类表
CREATE TABLE IF NOT EXISTS image_categories (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort INTEGER DEFAULT 0
);
INSERT OR IGNORE INTO image_categories (id, name, sort) VALUES (1, '默认分类', 0);

-- 8. 图片表
CREATE TABLE IF NOT EXISTS images (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER DEFAULT 1,
    url         TEXT NOT NULL,
    name        TEXT,
    created_at  INTEGER,
    FOREIGN KEY (category_id) REFERENCES image_categories(id) ON DELETE SET DEFAULT
);

-- 9. 订单表
CREATE TABLE IF NOT EXISTS orders (
    id             TEXT PRIMARY KEY,
    trade_no       TEXT,
    variant_id     INTEGER NOT NULL,
    product_name   TEXT,
    variant_name   TEXT,
    price          REAL,
    quantity       INTEGER DEFAULT 1,
    total_amount   REAL,
    contact        TEXT,
    payment_method TEXT,
    status         INTEGER DEFAULT 0,
    cards_sent     TEXT,
    created_at     INTEGER,
    paid_at        INTEGER,
    query_password TEXT
);

-- 10. 自定义页面表 (并插入3个不可删除的默认页)
CREATE TABLE IF NOT EXISTS pages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    alias      TEXT UNIQUE NOT NULL,
    content    TEXT,
    created_at INTEGER,
    updated_at INTEGER
);
INSERT OR IGNORE INTO pages (title, alias, content, created_at, updated_at) VALUES 
('关于我们', 'about-us', '<p>这是关于我们的说明页面内容，请在后台编辑修改。</p>', strftime('%s','now'), strftime('%s','now')),
('服务条款', 'terms', '<p>这是服务条款的说明页面内容，请在后台编辑修改。</p>', strftime('%s','now'), strftime('%s','now')),
('隐私政策', 'privacy', '<p>这是隐私政策的说明页面内容，请在后台编辑修改。</p>', strftime('%s','now'), strftime('%s','now'));

-- 11. 支付网关表
CREATE TABLE IF NOT EXISTS pay_gateways (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    name   TEXT NOT NULL,
    type   TEXT NOT NULL,
    config TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    remark TEXT
);

-- 12. 系统配置表 (并初始化必填项)
CREATE TABLE IF NOT EXISTS site_config (
    key   TEXT PRIMARY KEY,
    value TEXT
);
INSERT OR IGNORE INTO site_config (key, value) VALUES 
('site_name', '系统'), 
('theme', 'default'),
('default_upload_provider', 'custom');
