@echo off

setlocal

set js_file=ForeverJueves.js
set exe_file=FelizCheck.exe

if exist %exe_file% (
  %exe_file%
) else (
  node %js_file%
)
