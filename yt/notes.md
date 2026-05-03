# YT title, url from user 

- Pass YT user name, fetch title and url for all videos of that user
- filter all the line containing the string to another file 
- reverse the file
- convert to ids

```sh 
~/all/code/bin/yt-dlp_macos --flat-playlist \
  --print "%(title)s~%(url)s" \
  "https://www.youtube.com/@khanacademy/videos" \
  > KhanAcademyUrl.txt

awk '/Middle school Earth and space science/' KhanAcademyUrl.txt > khan/middle_sch_earth.txt
tail -r khan/middle_sch_earth.txt > tmp.txt; mv tmp.txt khan/middle_sch_earth.txt
cat khan/middle_sch_earth.txt | sed -E 's/.*v=([^&]+).*/\1/' | paste -sd "," - | pbcopy
https://www.youtube.com/watch_videos?video_ids=
https://www.youtube.com/playlist?list=TLGGE43ZTD8S23AwMzA1MjAyNg

```


# YT title from user 

below working on 2 may 2026
```sh
yt-dlp --flat-playlist --print title "https://www.youtube.com/@USERNAME/videos" > titles.txt
yt-dlp --flat-playlist --print title "https://www.youtube.com/@KhanAcademyIndiaEnglish/videos" > KhanAcademyIndiaEnglish.txt
awk '!/Class 11|Class 12|Class12|Math|Algebra|trigonometry|Class 10/' KhanAcademyIndiaEnglish.txt > KhanAcademyIndiaEnglish_sc1.txt

```

# YT Playlist and Quiz

```
cd ~/all/code/github/react-native/yt-quiz/utils
node yt_extract_playlist.js
```
- edit yt_extract_playlist.js to enter playlist name

```
 {
    "videoId": "hCloCHwrJdQ",
    "title": "Pollination (self & cross) | How do organisms reproduce | Biology | Khan Academy",
    "thumbnail": "https://i.ytimg.com/vi/hCloCHwrJdQ/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLCPQuLPeEg8nkLOs-hBMWh_Ojz-KQ"
  }
```
## file structure 

- manually generate the json file per playlist 
- playlist.json 

## index.html 

- topic title and link with playlist id 

## yt.html?playlist=PLXYZ 

- load the json file 
- show the list with thumbnail image 


## AI prompt

- html, css and javascript
- mobile first, simple and responsive design
- yt.html?playlist=PLJ6Y8JfXAV-_5YKNnskXGjBZodAOQosNY
- extract the playlist id 
- load the PLJ6Y8JfXAV-_5YKNnskXGjBZodAOQosNY.json
- show list of youtube video (thumbnail, title, link with videoid)
- on clicking the thumbnail, youtube video displayed in an iframe
