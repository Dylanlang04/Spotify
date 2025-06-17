function likedPl() {
    console.log("test")
    page.innerHTML = ""
    page.innerHTML += `<div id="liked_playlist">
        <div class="liked-scroll">
            <div id="liked_topbar">
                <button id="liked_top_playbtn">PLA</button>
                <div id="liked_top_title">Liked Songs</div>
            </div>
            <div id="liked_pl_banner">
                <div id="banner_wrap">
                    <div id="banner_img">IMAGE</div>
                    <div id="banner_info">
                        <div id="banner_pl">Playlist</div>
                        <div id="banner_liked">Liked Songs</div>
                        <div id="banner_user">USER - # songs</div>
                    </div>
                </div>
            </div>
            <div id="liked_playlist_wrapper">
                <div id="liked_playlist_top">
                    <div>
                        <button id="liked_playbtn">PLAY</button>
                        <button id="liked_shuffle">Shuf</button>
                        <button id="liked_download">down</button>
                    </div>
                    <div>
                        <button id="liked_search">search</button>
                        <button id="liked_filter">filter</button>
                    </div>
                </div>
                <div id="liked_filters">PLACEHOLDER </div>
                <div id="liked_playlist_table">awr</div>
                <div id="liked_songs">awd</div>
            </div>

        </div>

    </div>
    
    `
}