Write-Host "🚀 Iniciando Next.js Server..." -ForegroundColor Cyan
Write-Host ""

Set-Location nola-analytics

Write-Host "📍 Diretório: $PWD" -ForegroundColor Yellow
Write-Host "🌐 Aplicação estará disponível em: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Certifique-se de que o Cube.js está rodando!" -ForegroundColor Yellow
Write-Host ""

npm run dev
