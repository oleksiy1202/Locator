@echo off
echo ========================================
echo   Оновлення Location App на Vercel
echo ========================================
echo.

echo [1/4] Додаємо зміни до Git...
git add .

echo [2/4] Створюємо коміт...
set /p commit_msg="Введіть опис змін (або натисніть Enter для автоматичного): "
if "%commit_msg%"=="" set commit_msg=Update: PWA improvements

git commit -m "%commit_msg%"

echo [3/4] Відправляємо на GitHub...
git push

echo [4/4] Готово!
echo.
echo ========================================
echo   Деплой запущено!
echo ========================================
echo.
echo Vercel/Netlify автоматично задеплоять вашу app
echo Перевірте статус на dashboard.
echo.
echo Сайт буде оновлено за 1-3 хвилини.
echo.
pause

