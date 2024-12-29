// const toggler = document.getElementById('theme-toggle');

// toggler.addEventListener('change', function () {
//     if (this.checked) {
//         document.body.classList.add('dark');
//     } else {
//         document.body.classList.remove('dark');
//     }
// });

const toggler = document.getElementById('theme-toggle');

// 判斷儲存方式 (可以設定為 'localStorage' 或 'cookie')
let storageMethod = "localStorage";  // 可設定為 "localStorage" 或 "cookie"

// 儲存主題
function saveTheme(isDarkMode) {
    if (storageMethod === "localStorage") {
        localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
    } else if (storageMethod === "cookie") {
        document.cookie = `darkMode=${isDarkMode}; path=/; max-age=31536000`; // 一年有效期
    }
}

// 讀取主題
function getSavedTheme() {
    let isDarkMode = null;

    // 根據設定的儲存方式讀取資料
    if (storageMethod === "localStorage") {
        const localStorageTheme = localStorage.getItem('darkMode');
        if (localStorageTheme !== null) {
            isDarkMode = localStorageTheme === 'true';
        }
    } else if (storageMethod === "cookie") {
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});
        if (cookies.darkMode !== undefined) {
            isDarkMode = cookies.darkMode === 'true';
        }
    }

    // 如果沒有儲存的資料，檢查使用者裝置偏好
    if (isDarkMode === null) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkMode = prefersDark;
        // 儲存選擇並更新儲存方法
        saveTheme(isDarkMode);
    }
    
    return isDarkMode;
}

// 初始化主題
function initializeTheme() {
    const isDarkMode = getSavedTheme();
    if (isDarkMode) {
        document.body.classList.add('dark');
        toggler.checked = true;
    } else {
        document.body.classList.remove('dark');
        toggler.checked = false;
    }
}

// 切換主題事件
toggler.addEventListener('change', function () {
    const isDarkMode = this.checked;
    if (isDarkMode) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    saveTheme(isDarkMode); // 儲存主題狀態
});

// 初始化主題
initializeTheme();
