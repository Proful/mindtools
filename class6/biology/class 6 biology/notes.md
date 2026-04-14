ffmpeg -pattern_type glob -framerate 1/10 -i "*.jpg" \
-vf "scale=-2:720" \
-c:v libx264 -preset veryfast -pix_fmt yuv420p \
-movflags +faststart output.mp4
