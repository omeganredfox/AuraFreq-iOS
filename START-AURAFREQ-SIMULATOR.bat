@echo off
title AuraFreq iOS - Windows 11 Simulator
color 0b
echo ========================================================
echo        AURAFREQ iOS - IPHONE 16 PRO LIVE SIMULATOR
echo ========================================================
echo [1/2] Node.js Ortami Hazirlaniyor...
cd /d "%~dp0"
echo [2/2] Web Simulat?r Baslatiliyor (http://localhost:8081)...
npm run web
pause