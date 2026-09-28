@echo off
echo Saving and pushing code to GitHub...
git add .
git commit -m "auto-update code"
git push origin main --force
echo Code successfully pushed!
pause