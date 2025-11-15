@echo off
chcp 65001 >nul
title Деплой на Netlify
color 0A

echo.
echo ╔════════════════════════════════════════╗
echo ║   Оновлення застосунку на Netlify     ║
echo ╚════════════════════════════════════════╝
echo.

REM Перехід в папку проєкту
cd /d "%~dp0"
echo [✓] Папка проєкту: %CD%
echo.

REM Перевірка Git
if not exist ".git" (
    echo [!] Git репозиторій не ініціалізований
    echo [→] Ініціалізую Git...
    git init
    echo [✓] Git ініціалізовано
    echo.
)

REM Додавання файлів
echo [1/4] Додаю файли до Git...
git add .
echo [✓] Файли додано
echo.

REM Створення коміту
echo [2/4] Створюю коміт...
git commit -m "Fix: PWA install for mobile devices - manifest and SW improvements"
if %errorlevel% equ 0 (
    echo [✓] Коміт створено
) else (
    echo [!] Немає змін для коміту або коміт вже існує
)
echo.

REM Перевірка remote
git remote -v | findstr /C:"origin" >nul
if %errorlevel% neq 0 (
    echo [!] GitHub репозиторій не підключено
    echo.
    echo Виконайте ці команди вручну:
    echo 1. Створіть репозиторій на GitHub: https://github.com/new
    echo 2. Виконайте:
    echo    git remote add origin https://github.com/ВАШ_USERNAME/location-app.git
    echo    git branch -M main
    echo    git push -u origin main
    echo.
    pause
    exit /b
)

REM Push на GitHub
echo [3/4] Відправляю на GitHub...
git push
if %errorlevel% equ 0 (
    echo [✓] Код відправлено на GitHub
) else (
    echo [!] Помилка при push
    echo.
    echo Можливо потрібно виконати:
    echo git branch -M main
    echo git push -u origin main
    echo.
    pause
    exit /b
)
echo.

echo [4/4] Netlify автоматично деплоїть...
echo.
echo ╔════════════════════════════════════════╗
echo ║          Деплой запущено! ✓            ║
echo ╚════════════════════════════════════════╝
echo.
echo Що далі:
echo 1. Перейдіть на https://app.netlify.com/
echo 2. Відкрийте ваш сайт
echo 3. Чекайте "Site is live" (1-2 хвилини)
echo 4. Перевірте на телефоні
echo.
echo Діагностика PWA:
echo https://ваш-сайт.netlify.app/pwa-check.html
echo.

pause

