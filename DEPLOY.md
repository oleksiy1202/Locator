# 🚀 Інструкція з деплою Location App

## Варіант 1: Vercel (рекомендовано)

### 1. Підготовка Git репозиторію

Відкрийте термінал у папці проєкту і виконайте:

```bash
# Ініціалізуйте Git
git init

# Додайте всі файли
git add .

# Зробіть перший коміт
git commit -m "Initial commit: Location app ready for deployment"
```

### 2. Створіть репозиторій на GitHub

1. Перейдіть на https://github.com/new
2. Назвіть репозиторій (наприклад: `location-app`)
3. НЕ додавайте README, .gitignore або LICENSE (вони вже є)
4. Натисніть "Create repository"

### 3. Підключіть локальний репозиторій до GitHub

```bash
# Замініть YOUR_USERNAME на ваш GitHub username
git remote add origin https://github.com/YOUR_USERNAME/location-app.git
git branch -M main
git push -u origin main
```

### 4. Деплой на Vercel

#### Спосіб A: Через веб-інтерфейс
1. Перейдіть на https://vercel.com/
2. Натисніть "Sign Up" і увійдіть через GitHub
3. Натисніть "Add New..." → "Project"
4. Виберіть ваш `location-app` репозиторій
5. Vercel автоматично виявить Vite та налаштує збірку
6. Натисніть "Deploy"
7. Готово! ✅ Ваш застосунок буде доступний на `your-app.vercel.app`

#### Спосіб B: Через CLI
```bash
# Встановіть Vercel CLI
npm i -g vercel

# Увійдіть в акаунт
vercel login

# Задеплойте проєкт
vercel

# Для продакшн деплою
vercel --prod
```

---

## Варіант 2: Netlify

### 1-3. Виконайте кроки 1-3 з Варіанту 1 (Git + GitHub)

### 4. Деплой на Netlify

#### Спосіб A: Через веб-інтерфейс
1. Перейдіть на https://app.netlify.com/
2. Натисніть "Sign Up" і увійдіть через GitHub
3. Натисніть "Add new site" → "Import an existing project"
4. Виберіть "Deploy with GitHub"
5. Знайдіть і виберіть ваш `location-app` репозиторій
6. Налаштування збірки (Netlify виявить автоматично):
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Натисніть "Deploy site"
8. Готово! ✅ Ваш застосунок буде доступний на `your-app.netlify.app`

#### Спосіб B: Через CLI
```bash
# Встановіть Netlify CLI
npm install -g netlify-cli

# Увійдіть в акаунт
netlify login

# Ініціалізуйте проєкт
netlify init

# Задеплойте проєкт
netlify deploy --prod
```

---

## Варіант 3: GitHub Pages (безплатно, але статичний)

### 1. Додайте base в vite.config.ts

```typescript
export default defineConfig({
  base: '/location-app/', // назва вашого репозиторію
  // ...
})
```

### 2. Встановіть gh-pages

```bash
npm install --save-dev gh-pages
```

### 3. Додайте скрипти в package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 4. Задеплойте

```bash
npm run deploy
```

### 5. Увімкніть GitHub Pages
1. Перейдіть у Settings репозиторію → Pages
2. Source: виберіть `gh-pages` branch
3. Ваш сайт буде доступний на `https://YOUR_USERNAME.github.io/location-app/`

---

## 🔄 Автоматичне оновлення

### Vercel/Netlify
Після налаштування, кожен `git push` автоматично запускає новий деплой:

```bash
git add .
git commit -m "Update: new features"
git push
```

### GitHub Pages
Виконайте `npm run deploy` після змін.

---

## 📝 Корисні поради

1. **Змінні оточення**: Якщо у вас є API ключі, додайте їх у налаштуваннях Vercel/Netlify
2. **Кастомний домен**: Можна підключити безплатно у налаштуваннях
3. **HTTPS**: Автоматично працює на всіх платформах
4. **PWA**: Ваш застосунок працює як PWA, тому користувачі можуть встановити його

---

## ❓ Проблеми?

- **404 при перезавантаженні**: Переконайтеся, що `vercel.json` або `netlify.toml` налаштовані правильно
- **Build fails**: Перевірте, що всі залежності встановлені в `package.json`
- **Біла сторінка**: Перевірте console в DevTools браузера

---

**Успіхів з деплоєм! 🎉**

