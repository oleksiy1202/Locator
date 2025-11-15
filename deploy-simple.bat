@echo off
chcp 65001 >nul
title Деплой на Netlify
color 0A

echo.
echo ╔══════════════════════════════════════╗
echo ║      Деплой на Netlify               ║
echo ╚══════════════════════════════════════╝
echo.

REM Перехід в папку проєкту
cd /d "%~dp0"

REM Ініціалізація Git якщо потрібно
if not exist ".git" (
    echo [→] Ініціалізую Git...
    git init
    echo [✓] Git ініціалізовано
)

REM Додавання файлів
echo [1/3] Додаю файли...
git add .

REM Коміт
echo [2/3] Роблю коміт...
git commit -m "Update: PWA banner styles"

REM Push
echo [3/3] Відправляю на GitHub...
git push

echo.
echo [✓] Готово! Netlify почне деплой за ~1хв
echo.
pause

