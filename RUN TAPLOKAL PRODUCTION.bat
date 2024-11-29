@echo off
REM Get local IP address
for /f "tokens=2 delims=:" %%I in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    set IP_ADDRESS=%%I
)

REM Remove leading spaces
set IP_ADDRESS=%IP_ADDRESS: =%

REM Display the IP address
echo Your local IP address is: %IP_ADDRESS%:3000

REM Start the Next.js server
npm run start -- -H 0.0.0.0
