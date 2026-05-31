@echo off
chcp 65001 >nul 2>&1
title FoundationLearn 啟動器
cd /d "%~dp0"

echo.
echo  ========================================
echo    FoundationLearn  補底計劃  啟動中
echo  ========================================
echo.

:: ── 找 Python ──────────────────────────────────────────────────────
set PY=
where python  >nul 2>&1 && set PY=python
if not defined PY (
  where python3 >nul 2>&1 && set PY=python3
)
if not defined PY (
  echo.
  echo  [錯誤] 找不到 Python 3，學習網站需要 Python 才能執行。
  echo.
  echo  請前往  https://www.python.org/downloads/  下載安裝，
  echo  安裝時勾選「Add Python to PATH」，再雙擊本檔案重試。
  echo.
  pause
  exit /b 1
)
echo  [OK] 找到 Python：%PY%

:: ── 若 8080 已被佔用，先清掉 ──────────────────────────────────────
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":8080 " ^| findstr LISTENING') do (
  taskkill /PID %%a /F >nul 2>&1
)

:: ── 背景啟動 HTTP 伺服器 ───────────────────────────────────────────
echo  [伺服器] 啟動 http://localhost:8080 ...
start /min "FL-Server-8080" %PY% -m http.server 8080

:: 等伺服器就緒（最多 4 秒）
set /a try=0
:wait
timeout /t 1 /nobreak >nul
set /a try+=1
netstat -aon 2>nul | findstr ":8080 " | findstr LISTENING >nul && goto ready
if %try% LSS 4 goto wait
echo  [警告] 伺服器可能尚未完全啟動，嘗試開啟瀏覽器...

:ready
:: ── 開啟瀏覽器到工具頁 ────────────────────────────────────────────
echo  [瀏覽器] 開啟工具頁面 ...
start "" "http://localhost:8080/tool.html"

echo.
echo  ----------------------------------------
echo  網站已在背景執行，關閉此視窗也沒關係。
echo  若要停止伺服器：工作管理員 ^> 結束 python
echo  ----------------------------------------
echo.
timeout /t 4 /nobreak >nul
exit /b 0
