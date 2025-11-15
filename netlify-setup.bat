@echo off
chcp 65001 >nul
title Налаштування Netlify
color 0B

echo.
echo ╔════════════════════════════════════════╗
echo ║   Перше налаштування для Netlify      ║
echo ╚════════════════════════════════════════╝
echo.

REM Перехід в папку проєкту
cd /d "%~dp0"
echo Папка проєкту: %CD%
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo КРОК 1: Ініціалізація Git
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

if exist ".git" (
    echo [✓] Git вже ініціалізовано
) else (
    echo [→] Ініціалізую Git...
    git init
    echo [✓] Git ініціалізовано
)
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo КРОК 2: Додавання файлів
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
git add .
echo [✓] Всі файли додано
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo КРОК 3: Перший коміт
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
git commit -m "Initial commit: Location app with PWA support"
echo [✓] Коміт створено
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo КРОК 4: Створення GitHub репозиторію
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo [!] ВАЖЛИВО: Зараз потрібно створити репозиторій на GitHub
echo.
echo 1. Відкрийте: https://github.com/new
echo 2. Назва репозиторію: location-app
echo 3. Тип: Public
echo 4. НЕ додавайте README, .gitignore, LICENSE
echo 5. Натисніть "Create repository"
echo.
pause
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo КРОК 5: Підключення до GitHub
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
set /p username="Введіть ваш GitHub username: "
echo.
echo [→] Підключаю до GitHub...
git remote add origin https://github.com/%username%/location-app.git
git branch -M main
echo [✓] Репозиторій підключено
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo КРОК 6: Відправка коду на GitHub
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo [→] Відправляю код...
git push -u origin main
if %errorlevel% equ 0 (
    echo [✓] Код відправлено на GitHub!
) else (
    echo [!] Помилка при відправці
    echo.
    echo Можливо потрібно налаштувати Git credentials:
    echo git config --global user.name "Ваше Ім'я"
    echo git config --global user.email "email@example.com"
    echo.
    pause
    exit /b
)
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo КРОК 7: Налаштування Netlify
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Тепер налаштуйте Netlify:
echo.
echo 1. Відкрийте: https://app.netlify.com/
echo 2. Натисніть "Sign up" і увійдіть через GitHub
echo 3. Натисніть "Add new site" → "Import an existing project"
echo 4. Виберіть "Deploy with GitHub"
echo 5. Знайдіть репозиторій "location-app"
echo 6. Налаштування (Netlify виявить автоматично):
echo    - Build command: npm run build
echo    - Publish directory: dist
echo 7. Натисніть "Deploy site"
echo.
echo Готово! Ваш сайт буде доступний через 2-3 хвилини
echo.
echo ╔════════════════════════════════════════╗
echo ║      Налаштування завершено! ✓         ║
echo ╚════════════════════════════════════════╝
echo.
echo Для подальших оновлень використовуйте:
echo netlify-deploy.bat
echo.

pause

