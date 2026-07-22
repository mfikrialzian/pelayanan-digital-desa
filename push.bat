@echo off
echo Memproses pembaruan ke GitHub...
git add .
git commit -m "Update web"
git push
echo.
echo =======================================================
echo Selesai! Web Anda akan segera diperbarui oleh Vercel.
echo =======================================================
