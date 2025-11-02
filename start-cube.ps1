Write-Host "🚀 Iniciando Cube.js Server..." -ForegroundColor Cyan
Write-Host ""

Set-Location cube-server

Write-Host "📍 Diretório: $PWD" -ForegroundColor Yellow
Write-Host "🔗 Cube.js estará disponível em: http://localhost:4000" -ForegroundColor Green
Write-Host "🎮 Playground: http://localhost:4000" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Mantenha esta janela aberta!" -ForegroundColor Yellow
Write-Host ""

npm run dev
