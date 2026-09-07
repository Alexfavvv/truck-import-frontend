#!/bin/bash

# ============================================
# Скрипт автоматического деплоя Next.js приложения
# ============================================

# Настройки
APP_NAME="truck-import"
APP_DIR="/var/www/truck-import"
LOG_DIR="/var/log/deploy"
LOG_FILE="$LOG_DIR/${APP_NAME}-deploy.log"
BRANCH="main"
GIT_REPO="git@github.com:zdanovichd/truck-import.git"
# Создаем директорию для логов если нет
mkdir -p $LOG_DIR

# Функция логирования
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $1" | tee -a $LOG_FILE
}

# Функция проверки ошибок
check_error() {
    if [ $? -ne 0 ]; then
        log "ERROR: $1"
        exit 1
    fi
}

# Начало деплоя
log "🚀 Starting deployment of $APP_NAME"
log "📁 Working directory: $APP_DIR"

# Переходим в директорию приложения
cd $APP_DIR
check_error "Cannot change directory to $APP_DIR"

# Получаем последние изменения
log "🔄 Pulling changes from GitHub ($BRANCH branch)..."
git fetch origin
git checkout $BRANCH 2>&1 | tee -a $LOG_FILE

# Проверяем, были ли изменения
LOCAL_HASH=$(git rev-parse HEAD)
REMOTE_HASH=$(git rev-parse origin/$BRANCH)

if [ "$LOCAL_HASH" = "$REMOTE_HASH" ]; then
    log "✅ No new changes. Deployment not required."
    exit 0
fi

log "📥 New changes detected. Pulling..."
git pull origin $BRANCH 2>&1 | tee -a $LOG_FILE
check_error "Git pull failed"

# Устанавливаем зависимости
log "📦 Installing dependencies..."
npm ci --only=production 2>&1 | tee -a $LOG_FILE
check_error "npm install failed"

# Собираем приложение
log "🔨 Building Next.js application..."
npm run build 2>&1 | tee -a $LOG_FILE
check_error "npm run build failed"

# Перезапускаем приложение через PM2
log "🔄 Restarting application with PM2..."
pm2 restart $APP_NAME 2>&1 | tee -a $LOG_FILE
check_error "PM2 restart failed"

# Очистка старых логов PM2
pm2 flush $APP_NAME 2>&1 | tee -a $LOG_FILE

# Проверяем статус
log "📊 Checking application status..."
pm2 status $APP_NAME | tee -a $LOG_FILE

# Очистка кэша Next.js (опционально)
rm -rf $APP_DIR/.next/cache 2>/dev/null || true

log "✅ Deployment completed successfully!"
log "🕐 Deployment time: $(date)"
log "========================================"

# Отправка уведомления (опционально)
# Можно добавить отправку в Telegram/Slack
# curl -s -X POST "https://api.telegram.org/botTOKEN/sendMessage" \
#     -d chat_id=CHAT_ID \
#     -d text="✅ $APP_NAME успешно обновлен!"

exit 0