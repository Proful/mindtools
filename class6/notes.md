# jpg to mp4

```sh
ffmpeg -pattern_type glob -framerate 1/10 -i "*.jpg" \
-vf "scale=-2:720" \
-c:v libx264 -preset veryfast -pix_fmt yuv420p \
-movflags +faststart output.mp4
```

# folder jpg file downloaded

```sh
cd ~/all/learning/sanvi/science/

```

# reduce quality

```sh
mkdir -p compressed

for f in *.jpg *.JPG *.jpeg *.JPEG
    magick "$f" -strip -interlace Plane -quality 50 "compressed/$f"
end
```

# combine md and convert to mobi

```
# Combine all .md files (alphabetical order)
cat *.md > combined.md

# Convert to MOBI
ebook-convert biology.md biology.mobi \
    --title "Class 6 Biology" \
    --language en
```
