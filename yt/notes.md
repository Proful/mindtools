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
