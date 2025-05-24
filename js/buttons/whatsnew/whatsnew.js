function newsView() {
    fullscreen.innerHTML = ""
    fullscreen.innerHTML = `
    <div id="news_wrapper">
    <div id="static">
    <div id="news_title">Whats New</div>
    <div id="news_text">The latest releases from artists, podcats, and shows you follow</div>
    </div>
    <div id="news_btns">
    <button id="news_music">Music</button>
    <button id="pod_show">Podcast & Shows</button>
    
    </div>

    <div id="news_feed">
    <div id="center_tit">
    <div id="placeholder_title">We don't have any updates for you yet</div>
    
    </div>
    <div id="placeholder_txt">When there's news, we'll post it here. Follow your favourite artists and podcasts to stay updated on them too.</div> 
    </div>
    
    </div>
    `
}