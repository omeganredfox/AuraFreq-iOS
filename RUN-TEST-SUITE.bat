@echo off
title AuraFreq iOS - Quality Gates Test Suite
color 0e
echo ========================================================
echo   AURAFREQ iOS - ZERO-REGRESSION QUALITY GATES RUNNER
echo ========================================================
echo Gate 1: Frekans Hassasiyeti Toleransi
echo Gate 2: Stereo Binaural Izolasyonu
echo Gate 3: Anti-Pop Yumusak Rampa
echo Gate 4: Apple HIG Dokunmatik Standartlari
echo.
cd /d "%~dp0"
npm test
echo.
echo Tip Kontrolu (TypeScript):
npm run typecheck
echo ========================================================
pause